---
title: GraalVM native images for Spring Boot services, and what they cost
company: DATASUS / Fiocruz (FIOTEC)
publishDate: 2026-10-14 00:00:00
img: /assets/work/graalvm-native-images-spring-boot-card.png
img_alt: Table-like diagram comparing memory and startup of six services on the JVM and as native images in staging
description: |
  Memory and startup numbers from six Spring Boot services compiled to native images, plus the build time and code changes it took to get there.
tags:
  - GraalVM
  - Spring Boot
  - Kubernetes
  - Performance
---

I worked on the backend of Brazil's national health data network (RNDS) as a contractor for the public health IT agency, and this post describes components and numbers only, with nothing about the environments.

The platform runs many Spring Boot services on Kubernetes, and most of them have several replicas. Two things kept coming up: how much memory each replica holds while it mostly waits for work, and how long a new replica needs before it can take traffic. Both matter when autoscaling reacts to a queue or to load. A native image attacks both at once, so I spent a good part of this work compiling services with GraalVM and measuring what changed.

## How I measured

Each service ran once as a regular JVM build and once as a native image, and I recorded memory use and startup time. These are single measurements per service, taken in development and staging environments, not in production. Startup time especially will move with node load, so treat the table as an order of magnitude.

## Results

| Service | Memory, JVM to native | Startup, JVM to native |
|---|---|---|
| Gateway | 666 to 41 MiB (-93.8%) | 5.11 to 0.63 s |
| Data service | 493 to 69 MiB (-86.0%) | 12.89 to 0.75 s |
| Regulation worker | 779 to 159 MiB (-79.6%) | 35.69 to 1.36 s |
| PDF BFF | 414 to 132 MiB (-68.1%) | 28.49 to 1.64 s |
| Auth service | 316 to 107 MiB (-66.1%) | 17.88 to 0.61 s |
| Data batch consumers | 429 to 151 MiB (-64.8%) | 26.47 to 0.91 s |

Memory dropped between 64% and 94%, and every native service started in under 2 seconds. The gateway is the extreme case because it has almost no business logic. The services with more framework weight and more libraries kept more of their memory.

These numbers say nothing about throughput or latency under sustained load. I would measure that separately before moving a hot service, because a native image gives up the JIT compiler.

```mermaid
flowchart LR
    S["Spring Boot source"] --> M["Maven build on a GraalVM image"]
    M --> A["AOT processing and hints"]
    A --> N["native-image compile"]
    N --> I["Container with one native binary"]
```

## What broke

Gaps in reflection and resource hints compile without complaints and then fail at runtime, so a green build proves little. The ones I hit:

- `@RefreshScope` had to go. Dynamic refresh through a message bus was configured but effectively inert, so removing it cost nothing in behavior.
- A Spring Cloud Bus AMQP starter was on the classpath and unused. It broke AOT processing, with missing hints for the Rabbit binder and a `ClassCastException` coming out of the bootstrap context. Dropping the dependency fixed it.
- Reflection needs to be declared for entities, converters and DTOs that are only reached through serialization. The JDBC driver used by the connection pool needed the same treatment.
- Files read from the classpath at runtime, such as keystores, need resource hints, otherwise they are simply missing in the image.
- A deprecated `ISO8601DateFormat` had to be replaced.
- The data service hit an early blocker, a native initialization conflict with the Reactor library.

For the DTOs, a binding annotation was enough in most places:

```java
@RegisterReflectionForBinding({DocumentDto.class, PatientDto.class})
class NativeHints {}
```

The gateway needed the most code. I replaced Spring Cloud LoadBalancer with a global filter of about 60 lines that does round robin over the configured nodes. It does less than the library, and for a gateway that only routes a whitelist of read endpoints to a fixed set of nodes, that was enough.

The configuration server was the last piece. Spring Cloud Config, with its reactive server on Netty and the bootstrap contexts on the client side, is not friendly to native compilation. It was one more reason to remove it, and I wrote about that in a separate post.

## The cost in CI

Native compilation is slow compared to a normal Maven build, and I did not try to hide that. I added a separate native stage to the pipeline, running on a build image that combines Maven and a GraalVM JDK 21, and kept unit tests and compilation in their own stages so a native failure does not hide a test failure. The extra build time is the main price, and it shows up in every pipeline run of a native service.

Library updates carry some extra risk too. A new version of something reflective can compile without complaints and still fail when it first touches a class that has no hint.

## When I would not go native

The validator has no native work, and it is the first service I would keep on the JVM. It is built on HAPI FHIR, which uses reflection heavily, so I expect the hint list to be long and fragile. The resend service and the admin services have no native work yet either.

I would also skip native for a service that runs a few long-lived replicas and never scales out, where startup time buys nothing. And I would skip it for any service whose dependencies I do not control well enough to write hints for.

Of the six services in the table, I can only vouch for the development and staging measurements. I do not have production numbers for the native builds.
