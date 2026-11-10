---
title: Daily Job Monitoring
publishDate: 2025-04-22 00:00:00
img: /assets/work/monitoring-dashboard-card.jpg
img_alt: QWControl monitoring page with success, failed, running and pending counters above a filterable table of the day's jobs
description: |
  A live board of every job scheduled for the day in QWControl, with status counters, per job actions and the conditions each job is waiting for.
tags:
  - Vue
  - Groovy
  - Grails
  - Monitoring
  - Performance
---

Batch operations teams start the day with one question: did last night's jobs finish, and what is still waiting. The Monitoring module answers it on one page. It lists every job in the current daily plan with its status, and it refreshes on a configurable interval.

I wrote a large part of this module and moved its interface into the shared `spa-ui` package, so it follows the same look as the rest of QWControl.

## What the page shows

Four counters sit at the top: succeeded, failed, running and pending, each with a total and a percentage of the day. Below them a table lists the jobs with status, duration, tendency compared with the average run time, scheduled time and order. Columns can be filtered and sorted, and pagination keeps long days manageable.

The screenshot above is the real interface running against fake jobs.

## Acting on a job

Each row has buttons to run a job now, open the log of its execution, put it on hold or release it, reschedule it and cancel it. The expand button opens the dependencies of a job. It lists the conditions a pending job is waiting for and the resources it needs, and lets someone mark a condition as satisfied or force a resource by hand when the outside world has already done the work.

## Keeping it fast

A busy day can have many entries, so the page loads them in batches of one hundred instead of one large request. The table component loads asynchronously, the count of the current daily jobs became a criteria query that does not load rows, and the CSS and JavaScript bundles were trimmed so the page opens quickly.

## Related

Monitoring is one of the modules extracted in the [modular platform](/work/qwcontrol-modular-platform/) work. The [calendar and licensing modules](/work/qwcontrol-platform-modules/) sit next to it.
