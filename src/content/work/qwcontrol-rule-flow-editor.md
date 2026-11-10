---
title: Rule Flow Strategy and Visual Editor
publishDate: 2023-12-20 00:00:00
img: /assets/work/ruleflow-editor-card.jpg
img_alt: Rule Flow editor in QWControl showing a workflow as connected step nodes, with a palette of unplaced steps on the right
description: |
  A workflow strategy for QWControl jobs that runs steps by rules and conditions instead of a fixed order, with a drag and drop editor that keeps the rules in sync with the job definition.
tags:
  - Vue
  - TypeScript
  - Groovy
  - Workflow
  - Plugin
---

A normal job workflow runs its steps from top to bottom. Batch processes often need more: a file transfer that waits for a row count, or a retry that only runs when the check fails.

The Rule Flow strategy plugin lets a job describe those relations as rules. I worked on the plugin and wrote the visual editor that sits on top of it.

## Rules behind the graph

Each step in the workflow gets an instruction: `run-at-start`, `run-in-sequence` or `run-after-step`, the last one naming the steps it waits for. Any instruction can also carry conditions, written as `if` and `unless` expressions over the job context. The strategy plugin parses and validates those instructions and applies them while the job runs.

## The editor

Writing that as JSON works, but nobody enjoys it. The editor draws the workflow as a graph. Steps that are not placed yet wait in a palette on the right, you drag them onto the canvas and connect them, and the editor writes the instructions for you. Loading a job reads the instructions back and rebuilds the graph, including node positions. The screenshot above is the real editor, running on fake steps: five are connected and two still wait in the palette.

The editor is a Vue component built on Vue Flow. It lives inside the job editing page, reads the steps from the page itself and keeps the instructions field of the job in sync.

## Conditions

Selecting a step shows a settings button that opens its configuration: the start mode and a list of conditions. A step can have several conditions, and each one is either `if` or `unless`.

![Step configuration dialog with a single if condition on a data value](/assets/work/ruleflow-conditions.jpg)

## Where it fits

Any step type can sit in the graph: a SQL script, a file transfer, an SAP job or a sleep. Rule Flow belongs with the [integration plugins](/work/qwcontrol-integration-plugins/), and it was one of the first pieces extracted in the [modular platform](/work/qwcontrol-modular-platform/) work.
