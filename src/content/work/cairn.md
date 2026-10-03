---
title: "Cairn"
seoTitle: "Cairn: A Local-First Planner App"
seoDescription: "Cairn is a local-first planner for tasks, projects and notes, built with Flutter, Drift and Riverpod, with Google Calendar and Drive links planned."
summary: "A local-first planner that keeps tasks, projects and notes together, with Google Calendar and Drive links on the way."
scope: "Mobile app"
stack: ["Flutter", "Dart", "Drift", "SQLite", "Riverpod"]
year: 2026
role: "Design and build"
repo: "https://github.com/AdrielTTE/cairn"
offers: ["mobile"]
mark: "cards"
shots:
  - src: "../../assets/work/cairn/today.png"
    label: "Today"
    alt: "Cairn Today screen: schedule from the calendar and starred mail"
  - src: "../../assets/work/cairn/inbox.png"
    label: "Inbox"
    alt: "Cairn Inbox screen: task capture field and starred mail with an Add task action"
featured: true
order: 2
problem: |-
  Tasks, project plans and notes usually live in three different apps, and none of them know about the calendar. Cairn puts tasks, projects and notes in one local database so a day's agenda can show them side by side.
change: |-
  It's early. The core (tasks, projects, notes and the app shell) is in place, while the Google Calendar and Drive integrations are still to come. I'd get one real integration working end to end before adding more screens.
forYou: |-
  Cairn is a personal project in progress, not a client job. It shows how I'd approach an app that has to work offline now and sync later: a local database first, with the data model shaped for sync from day one.
diagram:
  nodes:
    - id: screens
      label: Today, Inbox, Projects, Notes
      note: "The app's main screens, built on a shared shell (features/)."
    - id: daos
      label: Data access
      note: "One DAO per area: tasks, projects, notes, tags, calendar and links (data/daos)."
    - id: database
      label: Drift / SQLite
      note: "Local source of truth; synced tables share id, timestamps and soft delete (data/tables.dart)."
    - id: google
      label: Google Calendar and Drive
      note: "Planned: read-only calendar cache for the Today agenda, and Drive/Gmail links on tasks and notes."
  edges:
    - [screens, daos]
    - [daos, database]
    - [database, google]
---

Cairn is a local-first planner built with Flutter. It holds tasks, projects and notes in one place, with a Today view for the day's agenda. It's a work in progress: the local core is done, and calendar and Drive links come next.

### Who it's for

Someone who wants one quiet place for what to do, what it's for and what they've written down, that keeps working offline.
