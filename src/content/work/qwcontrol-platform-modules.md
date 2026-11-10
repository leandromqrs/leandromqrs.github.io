---
title: QWControl Platform Modules
publishDate: 2024-07-30 00:00:00
img: /assets/work/qwcontrol-modules-card.png
img_alt: Map of the qwcontrolapp modules grouped by experience, operations, platform and infrastructure
description: |
  The calendar, license, interactive node editor, node monitor, UI enhancements and in-app documentation modules that I extracted or built for QWControl.
tags:
  - Grails
  - Vue
  - Groovy
  - Modules
  - Licensing
---

Besides the plugins and the big dashboards, QWControl has a set of smaller modules that make it behave like one product. Each one is a folder under `qwcontrolapp/` with its own build, as described in the [modular platform](/work/qwcontrol-modular-platform/) page. The diagram above groups them by what they do for the platform.

## Calendar

Defines the days on which jobs may run. It supports a date picker calendar and an advanced calendar, adds calendar triggers to jobs, and exports and imports calendars together with a project. The module began as its own pull request in October 2023 and was one of the first modules in the new layout.

## License

Handles the license of an installation. It can load a license from a file, ties it to the UUID of the server, lists which modules and plugins are licensed, and checks modules and features when the system starts. It also produces a billing report that shows usage against what the license allows. Most of the work happened in the first half of 2024.

## Interactive Node

An editor for the nodes of a project inside the interface. I moved its interface into `spa-ui` in 2024 and reworked the editor to use the YAML format for nodes.

## Node Monitor

Tracks the last known status of each node. It started as a network nodes module in January 2024, and I renamed and reworked it as the node monitor.

## UI Enhancements

Adds project cards, a richer job list, job favorites and a job graph to the interface.

## SPA UI

The shared package that holds the Vue interfaces for the other modules: monitoring, the VMware dashboard, the rule flow editor, the node editor and the project dashboard. 175 of my commits touch it.

## Documentation

The product documentation runs inside the application. The `docs` module serves the pages built from the separate documentation repository, so the manual ships with the product.
