---
title: "Crest"
seoTitle: "Crest: An Offline-First Gym Tracker"
seoDescription: "Crest is an offline-first Android gym workout tracker built with Flutter, Drift and Riverpod, with a live workout notification and Drive backup."
summary: "An offline-first gym workout tracker: log sets, run rest timers, and see progress without a connection."
scope: "Mobile app"
stack: ["Flutter", "Dart", "Drift", "SQLite", "Riverpod"]
year: 2026
role: "Design and build"
download: "https://github.com/AdrielTTE/crest/releases/latest"
offers: ["mobile"]
mark: "bars"
shots:
  - src: "../../assets/work/crest/workout.png"
    label: "Workout"
    alt: "Crest active workout: the Push session timer, a finished exercise folded away, a new PR on the next lift, and the rest timer at the bottom"
  - src: "../../assets/work/crest/notification.png"
    label: "Notification"
    alt: "Crest's ongoing workout notification during rest: the next set, a progress bar, and +15s and Skip buttons"
  - src: "../../assets/work/crest/exercise.png"
    label: "Exercise"
    alt: "Crest exercise detail for Back Squat: estimated one-rep max trend chart and personal records"
  - src: "../../assets/work/crest/stats.png"
    label: "Stats"
    alt: "Crest Stats screen: weekly volume chart and sets per muscle, in the dark theme"
  - src: "../../assets/work/crest/history.png"
    label: "History"
    alt: "Crest History screen: monthly totals and a list of past workouts with personal records"
featured: true
order: 1
problem: |-
  Gyms have bad signal and sweaty hands. A workout tracker has to log a set in a couple of taps, keep a rest timer running with the screen off, and never lose data because the network dropped. Crest keeps everything in a local SQLite database and treats the network as optional.
change: |-
  I'd add automated tests around the set-logging and session-summary logic earlier. The visual and motion work moved quickly, and that logic is where a silent bug would cost a user their numbers.
forYou: |-
  This is a personal project, not a client job, but it covers what most mobile apps need: a real local database, background behaviour (an ongoing notification and rest timers), backup and restore, and charts. A mobile app for your business would be built the same way, with the offline case designed in from the start.
diagram:
  nodes:
    - id: session
      label: Active session
      note: "Logs sets against the current workout and drives the rest timer (features/session)."
    - id: database
      label: Drift / SQLite
      note: "Local source of truth for exercises, templates, sessions and set logs (data/tables.dart)."
    - id: history
      label: History and PRs
      note: "Reads finished sessions and works out personal records (features/history)."
    - id: analytics
      label: Analytics
      note: "Aggregates volume and progress over time into charts (features/analytics)."
    - id: notifications
      label: Live notification
      note: "Shows the running session and rest countdown outside the app (services/live_workout_notifications.dart)."
    - id: backup
      label: Backup
      note: "Optional export to Google Drive or a local folder, and restore (services/drive_backup.dart)."
  edges:
    - [session, database]
    - [session, notifications]
    - [database, history]
    - [database, analytics]
    - [database, backup]
---

Crest is an offline-first gym workout tracker for Android, built with Flutter and released as v1.0. You pick a template or start an empty session, log each set, and a rest timer runs between them. Afterwards you get history, personal records and charts of your progress.

### Who it's for

Someone who lifts and wants a fast, quiet logbook that works with no signal and doesn't ask for an account.

### Release

Crest is being prepared for Google Play, where I publish my own apps under the name Applied Theory.
