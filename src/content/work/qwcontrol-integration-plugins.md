---
title: Integration Plugins for QWControl
publishDate: 2024-08-23 00:00:00
img: /assets/work/qwcontrol-plugins-card.png
img_alt: Diagram of QWControl job steps, the plugins that implement them and the external systems they reach, such as SAP, NetBackup, databases and z/OS hosts
description: |
  A set of QWControl plugins that let a job step run SAP jobs, NetBackup policies, SQL scripts, file transfers to Linux and z/OS hosts, and timed waits.
tags:
  - Java
  - Groovy
  - Plugins
  - SAP
  - NetBackup
  - z/OS
---

A scheduler is only as useful as the systems it can reach. QWControl runs on Rundeck's plugin model, so each external system gets a plugin, and each plugin shows up in the job editor as a new step type.

I built these plugins between 2022 and 2024, before and during the move to the [modular platform](/work/qwcontrol-modular-platform/). The diagram above shows how a job step reaches each system.

## SAP

I started the SAP plugin in mid 2022. It has steps to create, write, run and monitor jobs, run batch sessions and manage profiles, and it can expose SAP systems as nodes. The goal was to copy and release pre-defined SAP jobs from a QWControl workflow.

## NetBackup

The NetBackup plugin creates, copies, runs and deletes backup policies, so a backup can be a step in the same workflow as the job that needs it.

## SQL Script

Runs a SQL script on a database over JDBC. The step takes the driver, the URL and the credentials, and I added MySQL to the supported databases during the late 2023 refactor.

## File Transfer

Transfers a file from one node to another, using a URI for each side. It speaks local paths, SFTP, FTP and FTPS, with the TLS options that real servers ask for, and HTTP or HTTPS as a source. Credentials and private keys come from QWControl's key storage.

Over time I switched the SFTP implementation from JSch to SSHJ, added copying from the local server to a node, and in 2024 added support for z/OS over FTP, so a workflow can hand a file from a Linux server to the mainframe.

## Sleep

Waits for a given time before the next step runs. It is the smallest plugin in the set, and it is useful as soon as a workflow has to pause between two systems.

## Rule Flow

The strategy plugin that decides when each step runs has its own page: [Rule Flow Strategy and Visual Editor](/work/qwcontrol-rule-flow-editor/).

## VMware and Proxmox

The VMware plugin manages virtual machines from a job step. Its dashboard grew into a separate module and has its own page: [VM Dashboard Monitor](/work/vm-monitor-dashboard/).
