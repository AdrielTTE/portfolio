---
title: "Cairn"
seoTitle: "Cairn: Local-First Planner in Flutter | Adriel Tang"
seoDescription: "Cairn is a local-first planner for tasks, projects and notes, built with Flutter, Drift and Riverpod, with Google Calendar, Drive and Gmail."
summary: "A local-first planner for tasks, projects and notes, with Google Calendar, Drive and Gmail alongside. Still in development."
scope: "Mobile app"
stack: ["Flutter", "Dart", "Drift", "SQLite", "Riverpod"]
year: 2026
status: "APK on GitHub"
role: "Design and build"
download: "https://github.com/AdrielTTE/cairn/releases/latest"
privacy: "/cairn/privacy/"
offers: ["mobile"]
mark: "cards"
icon: "../../assets/work/cairn/icon.png"
shots:
  - src: "../../assets/work/cairn/today.png"
    label: "Today"
    alt: "Cairn Today screen: overdue banner, all-day events and a timeline of calendar events and tasks"
  - src: "../../assets/work/cairn/inbox.png"
    label: "Inbox"
    alt: "Cairn Inbox screen: task capture field and tasks waiting to be planned"
  - src: "../../assets/work/cairn/mail.png"
    label: "Mail"
    alt: "Cairn Inbox Mail tab: Gmail threads grouped under Primary, with starred messages"
  - src: "../../assets/work/cairn/calendar.png"
    label: "Calendar"
    alt: "Cairn Calendar screen: month grid with calendar filters and the selected day agenda"
facts:
  - value: "180+"
    label: "Automated tests"
  - value: "3"
    label: "Google services linked: Calendar, Drive, Gmail"
sections: [overview, change, problem, built, facts, for-you]
appCategory: "UtilitiesApplication"
stage: "#2a211b"
accent: "#d8c3a5"
featured: true
order: 2
problem: |-
  Tasks, project plans and notes usually live in three different apps, and none of them know about the calendar. Cairn puts tasks, projects and notes in one local database so a day's agenda can show them side by side.
change: |-
  Cairn is still in development. An early Android build works offline for tasks, projects, notes and the Today agenda, and Google Calendar, Drive and Gmail connect on top. Next I'd tighten sync and conflict handling, since that's where a local-first app earns its keep.
forYou: |-
  Cairn is a personal project, not a client job, still in development with an early signed Android build. It shows how I'd approach an app that has to work offline now and sync later: a local database first, with the data model shaped for sync from day one.
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
      note: "Read-only calendar cache for the Today agenda, plus Drive and Gmail links on tasks and notes."
  edges:
    - [screens, daos]
    - [daos, database]
    - [database, google]
---

Cairn is a local-first planner built with Flutter. It holds tasks, projects and notes in one place, with a Today view for the day's agenda. It is still in development, with an early Android build and Google Calendar, Drive and Gmail linked in.

### Who it's for

Anyone who wants tasks, projects and notes in one app that keeps working offline.
