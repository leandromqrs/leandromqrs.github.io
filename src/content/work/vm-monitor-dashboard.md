---
title: VM Dashboard Monitor
publishDate: 2025-05-09 00:00:00
img: /assets/work/vmware-vms.jpg
img_alt: QWControl VMware dashboard with power state counters, a donut chart, CPU, memory and storage gauges, and a filterable list of virtual machines
description: |
  A dashboard inside QWControl that shows the state and resource usage of every VMware host and virtual machine, built for operations teams that run thousands of VMs.
tags:
  - Java
  - Groovy
  - Grails
  - Vue
  - VMware
  - Monitoring
---

QWControl runs jobs against virtual machines, so it helps to see those machines in the same place: what is running, how loaded it is, and whether it is healthy. I built the VM Dashboard Monitor to answer that inside QWControl, next to the jobs that act on them.

The screenshots on this page come from the real interface, running against fake data.

## How the pieces fit

The browser talks only to a QWControl module. That module talks to the hypervisor, so the browser never needs credentials or network access to vSphere.

![Architecture of the VM monitor: the browser polls the virtual-automator module, which uses a cache and a manager per hypervisor to reach VMware and Proxmox, stores hourly metrics and generates reports](/assets/work/vm-monitor-architecture.svg)

The backend lives in the `virtual-automator` module, written in Groovy on Grails. It has one manager per hypervisor, so VMware and Proxmox share the same API and the same screens. A license interceptor checks the feature before any request reaches the manager, so the module only answers when the installation is licensed for it.

The frontend is a Vue package in the `spa-ui` module. It polls the backend on an interval and updates the page in place.

## The host view

The first tab is the physical host: vendor, model, CPU, memory, uptime and health, with restart and shutdown buttons when the connection allows it. Below that, the resource monitor draws CPU, memory, disk and network for the selected interval, from real time up to longer windows.

![Host tab showing host details and the resource usage charts for CPU, memory, disk and network](/assets/work/vmware-server.jpg)

## The virtual machine view

The second tab, shown at the top of this page, is the one operators keep open. Counters show how many VMs are powered on, off or suspended, a donut chart splits the fleet by state and VMware Tools status, and three gauges compare CPU, memory and storage in use against what the host offers.

The filters cover power state, Tools status and tags, plus one that earns its place: machines that have been powered off for more than 30 days, the first candidates to reclaim. Each row has an actions menu for power operations, and a machine with a red alert gets a highlighted row so it stands out in a long list.

## Keeping the hypervisor calm

Pulling the full inventory from vSphere on every refresh does not scale. Two things keep the load down:

- A cache sits in front of the hypervisor, so repeated polls from many open browsers cost one upstream call.
- A scheduled job samples each resource every hour and stores the result, so charts and reports read from QWControl instead of asking vSphere for history.

This is what let the dashboard stay responsive on environments with more than 3,000 virtual machines.

## Reports

The same stored metrics feed report generation. You pick a host or a VM and a date range, and the module builds a PDF with Jasper.

## What I took from it

Most of the work went into deciding what the hypervisor should never be asked, then building the cache and the hourly sampling around that rule. The interface got simpler once the backend stopped answering questions it did not need to answer.
