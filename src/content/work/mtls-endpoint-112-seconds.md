---
title: Why my mTLS endpoint took 112 seconds
company: DATASUS / Fiocruz (FIOTEC)
publishDate: 2026-10-28 00:00:00
img: /assets/work/mtls-endpoint-112-seconds-card.png
img_alt: Diagram of mutual TLS certificate validation steps and the time budget changes that fixed a slow token endpoint
description: |
  A slow token endpoint, a blocking DNS lookup inside a CRL download, and why virtual threads did not fix it but a wall-clock deadline did.
tags:
  - Java
  - mTLS
  - Virtual threads
  - Networking
---

I worked on the backend of Brazil's national health data network (RNDS) as a contractor for the public health IT agency, and this post describes one component and its flow, with nothing about the environments around it.

The component is the authentication service. Health information systems connect to it with a client certificate over mutual TLS, and it answers with a signed JWT that the other services trust. In one real test, the token endpoint took between 85 and 112 seconds to respond.

## What the service does per request

After the handshake, the service checks the certificate's validity period and builds the chain. Then it checks revocation, which means CRLs: lists published by the certificate authority at one or more distribution points named inside the certificate. The service downloads one list per distribution point and caches it until its `nextUpdate` time. When everything passes, it signs the JWT.

With a warm cache this is cheap. The expensive path is a download, so that is where I looked.

```mermaid
flowchart LR
    C["Client certificate"] --> V["Validate chain"]
    V --> R["Revocation check"]
    R -->|"per distribution point"| F["CRL fetch, cached until nextUpdate"]
    F -->|"DNS can block"| T["Wall-clock timeout and circuit breaker"]
    T --> J["Issue JWT"]
```

## First attempt: parallelize

The first fix I tried was to parallelize the downloads, per certificate and per distribution point. It could not help the slow case. If one lookup is stuck, running the others beside it only means the request waits for the stuck one.

## Why virtual threads did not help

I had already enabled virtual threads on the service earlier, for a different problem. Under pressure, in a single test, the number of successful responses went from 6 to 66, which is what virtual threads are good at: many requests waiting on I/O without holding a platform thread each.

A virtual thread runs on a small pool of carrier threads, roughly one per CPU core, and the JVM parks the virtual thread whenever the code blocks in a way it understands. That is what makes thousands of waiting requests cheap.

So I assumed the CRL downloads were covered. They were not, and the reason was in the name resolution. A DNS lookup in Java goes through a blocking native call. A virtual thread inside it pins its carrier thread, and the carrier cannot serve anything else until the OS returns. The second part of the surprise was in the timeouts. The connect and read timeouts I had configured on the HTTP client only start counting after the name is resolved. When resolution hangs, none of them fire.

## The fixes, in order

I did not get this right in one pass. The sequence was:

1. Parallelize the work per certificate and per distribution point.
2. Move the CRL fetching off virtual threads and onto cached platform threads, so a pinned lookup does not hold a carrier shared with request handling.
3. Add an explicit wall-clock timeout around each fetch with `Future.get(timeout)`.
4. Run the fetches in a shared daemon pool that nobody waits for. My first version used try-with-resources on the executor, and its `close()` waits for running tasks, so the stuck lookup blocked the request again at the end of the block.
5. Give each certificate one overall deadline.
6. Make the health check use the same helper, with a 3 second limit.

The core of step 3 looks like this:

```java
Future<byte[]> task = sharedPool.submit(() -> download(distributionPoint));
try {
    return task.get(budget.toMillis(), TimeUnit.MILLISECONDS);
} catch (TimeoutException e) {
    task.cancel(true);
    throw new RevocationUnavailable(distributionPoint);
}
```

`cancel(true)` interrupts the thread, but an interrupt does not wake a thread blocked in a native lookup. The thread stays stuck until the OS gives up. That is the reason for the shared daemon pool: the request stops waiting, and the stuck thread is somebody else's problem until it returns.

## The rewrite

After step 6 the code worked but it was a pile of patches on top of patches. I rewrote the whole validation as one small `certificate` package. The time budget lives inside a circuit breaker per host, so a distribution point that keeps timing out stops costing a full budget on every request. The new package comes with tests.

What to do when the budget runs out is a policy decision about trust, and I leave it out here.

## What I took from it

Configured timeouts cover what the library knows about. The HTTP client knew about connecting and reading, and it did not know about name resolution. A wall-clock deadline around the whole operation is the only timeout that does not depend on which phase is stuck.

Virtual threads remove the cost of waiting in code that the JDK can park. They do nothing for a blocking native call, and I only found that by looking at what the stuck thread was doing.

In this design, caching and a breaker per host are required. Without them, every request pays for the slowest dependency again.

The endpoint is not fast yet by the goal I had for it. In a later comparison under mTLS load, p95 was 2.51 s on the older stack and 1.83 s on the newer one, in a single run with different environments and several changes at once. The target was 1 s, and neither stack met it.
