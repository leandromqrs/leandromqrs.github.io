---
title: "Migrating a health platform to Java 21: the playbook"
company: DATASUS / Fiocruz (FIOTEC)
publishDate: 2026-10-07 00:00:00
img: /assets/work/migrating-health-platform-to-java-21-card.png
img_alt: Diagram of the migration from Java 8/11 and Spring Boot 2.x to Java 21, with the mechanical recipe and the rollout order by environment
description: |
  The repeatable recipe I used to move Spring Boot services from Java 8/11 and Boot 2.x to Java 21 and Boot 3.5, in the order I did it.
tags:
  - Java
  - Spring Boot
  - Migration
  - Maven
---

I worked on the backend of Brazil's national health data network (RNDS) as a contractor for the public health IT agency, and this post only describes components and flows, nothing about the environments they run in.

The platform is a set of Spring Boot services around FHIR documents: an API that receives them, a validator, a data service that owns persistence, a gateway, a PDF generator, some Kafka and RabbitMQ consumers and an authentication service. When I started on the Java side there were about 20 repositories in the pipeline. Most were on Java 11 with Spring Boot 2.4, a few were on Java 8 with Boot 2.1, and some had already moved to Java 17 or 21. Boot 2.x was out of support, and the goal was Java 21 with Boot 3.5.

This is the recipe I applied to the services I worked on. The central FHIR service was not part of my migration, so I will not say anything about it.

## Taking inventory first

Before touching code I built a spreadsheet with one row per repository: stack, last update, notes and a migration status per environment. It looked boring and it paid for itself. It showed that the oldest pieces were not the business services. Java 8 with Boot 2.1.6 was the shared logging library and the configuration server. The business core, including the data service, the batch consumers and the validator, was Java 11 with Boot 2.4.4, and the gateway was on Boot 2.6.

## The order

The shared library went first. It captures requests and responses, publishes events to Kafka and adds trace ids, and every service inherits its version. Nothing downstream could move until it shipped a Java 21 release.

After that I picked one service as the pilot, the data service, and applied the same changes to the others one after another. Production order was a different question: lowest impact first, with the authentication service at the front and the data service last, each with a longer observation window.

```mermaid
flowchart LR
    L["Shared library (Java 21, Boot 3.4)"] --> P["Pilot: data service"]
    P --> S["Remaining services, same recipe"]
    S --> D["Dev"]
    D --> H["Staging"]
    H --> O1["Observe"]
    O1 --> PR["Production"]
    PR --> O2["Observe"]
```

## The mechanical changes

Most of the work was repetitive, which is what made it manageable. The list was the same in every repository:

- Gradle to Maven, so every service shares one pipeline template and one internal repository profile, and nobody has to remember which Gradle version a repo needs.
- `javax.*` to `jakarta.*` imports.
- Springfox to springdoc, which moves the API docs to OpenAPI 3.
- `ListenableFuture` to `CompletableFuture`.
- Hibernate 6 custom types for JSON and array columns replaced by `@JdbcTypeCode`.
- The `javax.persistence` timeout hint renamed to its jakarta equivalent.
- FHIRPath expressions using `as` rewritten with `ofType`.
- The Spring Security config rewritten as `SecurityFilterChain` beans, since `WebSecurityConfigurerAdapter` is gone.

Two of those are worth showing. The JSON columns:

```java
@JdbcTypeCode(SqlTypes.JSON)
private Map<String, Object> payload;
```

And the FHIRPath change, which fails at runtime and not at compile time, so tests are the only thing that catches a missed one:

```diff
-Bundle.entry.resource.as(Patient)
+Bundle.entry.resource.ofType(Patient)
```

For configuration I first added the `spring-cloud-starter-bootstrap` shim to keep the old behavior, then switched to `spring.config.import` as the services were touched again.

## Pipeline and images

The CI jobs moved to a JDK 21 build image. I also built and published a small runtime base image (a Temurin JRE 21 on Alpine) to the internal registry, shared by the services.

Operational settings were the quiet part of the migration. Health probe paths had to include the base context prefix before `/actuator/health`, and initial delays and timeouts were adjusted per service. I used G1 for most services and tried ZGC on the gateway. Memory limits and heap sizes were tuned service by service, and some of them more than once.

## Rollout

Every service went through the same stages: dev, staging deploy, staging observation, production deploy, production observation. A stage passed when there were no incidents and no alerts on the dashboards during the window, and rollback was immediate otherwise.

Before touching master I started using environment branches and tags per environment. That came from a mistake: the data service migration was merged, reverted the same day, and only applied again much later. A migration that lands on master before every environment has seen it leaves you with nothing to roll back to except a revert, and reverts are noisy. With an environment branch, staging can carry the change for as long as it needs.

## Where it hurt

The revert above was the most expensive lesson. Memory tuning was the second, because the heap, the GC choice and the container limit have to agree with each other and the right values only show up under real traffic. Probe paths and delays were the cheapest problem, once I knew to check them first.

## What I would do differently

I would start the environment branches and tags from the first service, not after the first revert. I would also keep behavior changes out of migration pull requests. When a migration commit also changes a query or a timeout, a failure in staging has too many suspects.

I have no number that isolates the Java 21 effect, because the move came together with the build tool, base image and tuning changes. What I can say is that the services run on a supported stack and that the next upgrade, Java 25 with Boot 4, started from a shared library and a pipeline that already knew how to carry a version bump across every repository.
