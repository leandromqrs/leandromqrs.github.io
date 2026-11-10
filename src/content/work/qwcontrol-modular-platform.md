---
title: QWControl Modular Platform
publishDate: 2025-05-12 00:00:00
img: /assets/work/qwcontrol-modularization-card.png
img_alt: Diagram comparing QWControl before, with every feature inside one Rundeck-based codebase, and after, with a core application that loads modules from qwcontrolapp and plugins
description: |
  The architecture change that moved QWControl features out of the Rundeck code and into independent Grails modules and plugins, so each feature can be built, tested and licensed on its own.
tags:
  - Architecture
  - Grails
  - Gradle
  - Groovy
  - Refactoring
---

QWControl is a job orchestrator built on top of Rundeck. In the beginning, every feature the product added lived inside the Rundeck code. I led the work that pulled those features out into their own modules, and `qwcontrolapp` is the folder where they live now.

There is a longer write-up on the [blog](/blog/modularizing-qwcontrol/). This page is the short version.

## The problem

With everything in one tree, features shared the same build and the same release. A change to the calendar sat next to a change to the VMware screens, and neither could be built or tested without the rest.

## What changed

The core application stays a Rundeck-based app. Anything QWControl adds is now a Grails plugin with its own folder, build file and tests, and the core loads them as bundled plugins. The diagram above shows the layout before and after.

Two kinds of pieces came out of it:

- Modules under `qwcontrolapp/`, which add platform features such as the UI, calendar, licensing, monitoring and the VMware integration.
- Plugins under `plugins/`, which add job steps and strategies such as SAP, NetBackup, SQL scripts and file transfer.

## How it happened

I did it in steps over a few weeks in late 2023. Calendar, monitoring, interactive node, resource manager, license, UI enhancements and rule flow were extracted first, each into its own module. On 24 November the module builds moved into the main bundled plugins configuration, and on 27 November a single commit moved the remaining files into `qwcontrolapp/`. New modules, like the VMware one in 2024, started life already in that shape.

## Result

A feature now has an owner folder. The license module can decide which of them an installation may use, and a new integration is a new plugin instead of a change to the core.

## Related

- [VM Dashboard Monitor](/work/vm-monitor-dashboard/)
- [Integration plugins](/work/qwcontrol-integration-plugins/)
- [Platform modules](/work/qwcontrol-platform-modules/)
