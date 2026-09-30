---
title: "Habitect"
seoTitle: "Habitect: A Flutter Habit-Tracking App"
seoDescription: "Habitect is a habit-tracking mobile app built with Flutter and Dart by a team of four at TAR UMT. See the stack and the code on GitHub."
summary: "A habit-tracking mobile app for setting habits and checking them off day by day."
scope: "Mobile app"
stack: ["Flutter", "Dart"]
year: 2025
role: "Habit tracking features"
team: "Group of 4, coursework"
repo: "https://github.com/AdrielTTE/Habitect"
offers: ["mobile", "apis"]
featured: true
order: 1
problem: |-
  Habitect needed a way for users to create recurring goals/habits, log daily task activity against them, and see progress broken down by category and time of day. I built the goal-creation flow, the Firestore task/notes/log data layer, and the stats dashboard that turns that raw activity data into pie charts and a scatter plot.
decision: |-
  I split the aggregation logic from the rendering: `streakTracking.dart` fetches Firestore data and counts it by frequency/category/hour, while a separate static-widget class turns those counts into pie charts and a scatter plot.
change: |-
  I'd store dates as Firestore `Timestamp` fields instead of separate date/time strings, since the app currently splits strings like "5/13/2025" by `/` to get month/year, and falls back to `DateTime.now()` (silently wrong) when parsing fails.
forYou: |-
  This is Flutter used for a real interface: lists, daily progress, and streaks, not a demo screen. It's TAR UMT coursework, not a client job, but the same Flutter skills carry over directly. A mobile app for your business, built once and shipped to iOS and Android, would follow the same approach.
diagram:
  nodes:
    - id: auth
      label: Firebase Auth
      note: "Reads the signed-in user's uid to scope every Firestore read and write (firestor.dart)."
    - id: goal-creation
      label: Goal/habit creation
      note: "Writes a new task doc with category, dates, and a frequency map (goal_creation_page.dart)."
    - id: firestore
      label: Cloud Firestore
      note: "Wraps all reads and writes under the user's document (firestor.dart)."
    - id: task-list
      label: Task list and logging
      note: "Lists and deletes tasks, and logs each tap to task logs (TaskScreen.dart)."
    - id: calendar
      label: Calendar view
      note: "Renders tasks on a calendar from parsed start date and time strings (calendar_page.dart)."
    - id: streak-dashboard
      label: Stats dashboard
      note: "Aggregates task counts by frequency, category, and hour (streakTracking.dart)."
    - id: charts
      label: Chart rendering
      note: "Turns the dashboard's aggregated counts into pie charts and a scatter plot (GraphWidgets.dart)."
  edges:
    - [auth, firestore]
    - [goal-creation, firestore]
    - [task-list, firestore]
    - [firestore, calendar]
    - [firestore, streak-dashboard]
    - [streak-dashboard, charts]
schema:
  - table: users
    fields: [id, email]
  - table: users/{uid}/tasks
    fields: [category, title, startDate, startTime, endDate, endTime, frequency, createdAt]
  - table: users/{uid}/notes
    fields: [id, subtitle, title, time, image, isDon]
  - table: users/{uid}/taskLogs
    fields: [taskName, clickedAt, category, startTime]
  - table: users/{uid}/profile/profileData
    fields: [name, email]
---

Habitect is a habit-tracking mobile app built with Flutter and Dart. It lets someone set habits and mark them off day by day, with the aim of making a routine easy to see and stick to. It was a 2025 TAR UMT team project with four of us; I built the habit tracking part.

### Who it's for

Anyone who wants a plain way to track daily habits without extra social or gamification features attached.
