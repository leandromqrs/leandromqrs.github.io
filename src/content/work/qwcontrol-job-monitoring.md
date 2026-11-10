---
title: Daily Job Monitoring
publishDate: 2025-04-22 00:00:00
img: /assets/work/monitoring-dashboard-card.jpg
img_alt: QWControl monitoring page with success, failed, running and pending counters above a filterable table of the day's jobs
description: |
  The daily plan engine and the monitoring board of QWControl: how a day of jobs is built, how conditions release them, and how operators watch and act on them.
tags:
  - Vue
  - Groovy
  - Grails
  - Monitoring
  - Performance
---

Batch operations teams start the day with one question: did last night's jobs finish, and what is still waiting. Two modules answer it. The daily job module is the engine that builds the plan and releases each job when its conditions are met. The monitoring module is the board that shows the plan and lets an operator act on it. I wrote a large part of the board and moved its interface into the shared `spa-ui` package, so it follows the look of the rest of QWControl.

The screenshot above is the real interface running against fake jobs.

## Two modules, one plan

The monitoring module owns no tables. It reads what the daily job module stores, and it reaches that module by class name, not by import, so each can be built alone.

```mermaid
flowchart LR
    subgraph Engine[daily-job]
        Build[Daily plan builder]
        Engine2[Daily engine service]
        Queue[Event queue and consumer thread]
        Tables[(Daily, DailyDetail, JobCondition, EventAction, ConditionHistory)]
    end
    subgraph Board[monitoring]
        Ctrl[MonitoringController]
        Svc[MonitoringService]
        Page[monitoring-page Vue bundle]
    end
    Quartz[Quartz scheduler] --> Engine2
    Build --> Tables
    Engine2 --> Tables
    Engine2 --> Queue
    Svc -->|reads by class name| Tables
    Ctrl --> Svc
    Ctrl -->|force, cancel, condition changes| Engine2
    Page -->|HTTP| Ctrl
    Exec[(Rundeck executions)] --> Svc
```

## How a day is built

The daily module replaces the scheduling manager of the core. A job no longer runs because its cron time arrived. A job is part of a daily plan, a business day that starts at a configured hour, and it runs when the plan says it can.

Two Quartz triggers drive the plan. One fires at the start hour and builds the day. The other fires three minutes earlier and prepares the jobs that belong before the start.

```mermaid
flowchart TB
    T[Daily trigger at the start hour] --> Skip{Plan for this day exists?}
    Skip -->|yes| Stop[Stop]
    Skip -->|no| Lock[Take the new daily lock]
    Lock --> Old[Find yesterday jobs that did not end well]
    Old -->|project loads pending jobs| Copy[Copy them into today as pending and late]
    Lock --> Scan[Scan Quartz jobs and read fire times for the next 24 hours]
    Scan --> Buckets[Sort into before, normal and after buckets]
    Buckets --> Roots[Take the jobs that wait for nothing]
    Roots --> Chain[Follow condition edges to add dependent jobs]
    Chain --> Save[Save Daily and DailyDetail rows]
    Copy --> Save
    Save --> Sched[Schedule the Quartz triggers]
```

A job with a before or after calendar from the [calendar module](/work/qwcontrol-platform-modules/) shifts its order date by one day, which is how the three buckets come to exist.

## Conditions release jobs

Dependencies between jobs are stored as conditions. An edge from job A to job B means that A publishes a condition when it succeeds and B waits for it. A condition is satisfied when it is in an in-memory set. A plus sign adds a condition to the set and a minus sign removes it.

```mermaid
sequenceDiagram
    participant Q as Quartz job
    participant E as Daily engine
    participant Qu as Event queue
    participant C as Consumer thread
    participant H as ConditionHistory
    participant X as Rundeck execution
    Q->>E: before execution
    E->>Qu: RUNNING event
    Q->>X: run the job
    X-->>E: result
    E->>Qu: SUCCESS or FAIL event
    Qu->>C: next event
    C->>H: save the satisfied condition
    C->>C: update the condition set
    C->>E: start every job whose waits are now satisfied
    C->>C: if the project is complete, start pending dates
```

A single consumer thread processes the events, so condition changes never race. The history table makes the state replayable: when the engine starts, it rebuilds the condition set from it. Jobs that were running with no end time when the server stopped are marked as failed by the recovery step.

Rules can also react to events, such as running another job on failure or setting a variable. The status of a day entry is one of scheduled, pending, running, succeeded, failed, aborted, timed out, rescheduled, cancelled or waiting for a resource.

## What the board shows

Four counters sit at the top: succeeded, failed, running and pending, each with a total and a percentage of the day. Below them a table lists the jobs with status, duration, tendency compared with the average run time, scheduled time and order. Columns can be filtered and sorted, and pagination keeps long days manageable.

The tendency comes from the last ten runs of the job. The backend compares the latest duration with their average and reports it as increasing, decreasing or steady.

## Loading the board

A busy day can have many entries, so the page loads them in batches of one hundred.

```mermaid
sequenceDiagram
    participant UI as monitoring-page
    participant API as MonitoringController
    participant S as MonitoringService
    UI->>API: GET jobs/count
    API-->>UI: number of jobs in today's plan
    loop pages of 100
        UI->>API: GET apiListJobs with max and offset
        API->>S: one query joining plan, job, latest detail and execution
        S->>S: add conditions, resources, average of last 10 runs, trend
        S-->>UI: page of jobs
        UI->>UI: append rows and update the chart
    end
```

The query joins the plan, the job, the latest detail of each entry and its execution in one statement. The extras, such as conditions and resources, are still fetched for each row, which is the cost of showing so much per line. The table component loads asynchronously, and the bundles were trimmed so the page opens quickly. Refresh is manual, through the refresh button.

## Acting on a job

Each row has buttons to run a job now, open the log of its execution, reschedule it and cancel it. The expand button opens the dependencies of a job. It lists the conditions a pending job is waiting for and the resources it needs, and lets someone mark a condition as satisfied or force a resource by hand when the outside world has already done the work.

```mermaid
flowchart LR
    Run[Run now] --> Check{On hold or running?}
    Check -->|yes| Reject[Reject]
    Check -->|no| Prev{Project loads pending jobs and the previous day is incomplete?}
    Prev -->|yes| Reject
    Prev -->|no| Detail[New detail if the current one is finished]
    Detail --> Now[Unschedule and trigger now with a forced flag]
    Cancel[Cancel] --> State{State}
    State -->|scheduled, pending, failed| Cancelled[Set cancelled]
    State -->|running| Abort[Abort the execution and cancel the resource wait]
    Cancelled --> Evt[Queue a CANCELLED event]
    Abort --> Evt
    Cond[Toggle a condition] --> Hist[Write a forced condition to history]
    Hist --> Set[Update the condition set]
    Set --> Start[Start jobs that are now satisfied]
```

Forcing a condition leaves a record with a forced flag, so the history shows what a person did by hand and what the engine did itself.

## Related

Monitoring is one of the modules extracted in the [modular platform](/work/qwcontrol-modular-platform/) work. The [calendar and licensing modules](/work/qwcontrol-platform-modules/) sit next to it.
