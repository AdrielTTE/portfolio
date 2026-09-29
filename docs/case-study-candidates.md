# Case study candidates (Task 0, Step 2)

Researched from source code (not just README), via full clone of both repos into a scratch
directory and `git log`/`grep` over the actual files. Everything below cites a real path in the
repo as it exists today (default branch, HEAD at research time). Mark each candidate line
`CONFIRMED` or `REJECTED` by editing the checkbox / adding a note. Rejected items are not used
downstream.

---

## 1. Habitect (Flutter/Dart habit tracker)

### How I identified "the habit-tracking part" that Adriel built

Ran `git log --all --author='Adriel' --author='AdrielTTE' --name-only` over the full clone (not
just the current HEAD tree, so it also catches files later renamed/merged away). The files that
recur under Adriel's commits are: `lib/streakTracking.dart`, `lib/GraphWidgets.dart`,
`lib/goal_creation_page.dart`, `lib/HomePage.dart`, `lib/home.dart`, `lib/calendar_page.dart`,
`lib/schedule_page.dart`, `lib/TaskScreen.dart`, `lib/main.dart`, and earlier precursor files
`lib/Goal.dart`, `lib/ToDo.dart`, `lib/BarGraph.dart` (since deleted/merged into
`streakTracking.dart` and `GraphWidgets.dart` per the "Split streakTracking.dart" and "Connected
Frederick's part and Zhi Ren's part" commits). By contrast, `lib/Screens/Login/*`,
`lib/Screens/Signup/*`, `lib/Screens/Welcome/*` and `lib/FirstLogin/*` (onboarding/auth UI) never
appear in Adriel's commits except one commit that only changed input border colors
(`d1d0f5c "Changed Input colors"`). So "the habit-tracking part" below means: goal/task creation,
the Firestore task/notes/log data layer, the calendar, and the stats dashboard + charts —
not the auth/onboarding screens.

- [x] H-IDENT: CONFIRMED — the file-attribution method above correctly scopes "Adriel's part" to streakTracking.dart, GraphWidgets.dart, goal_creation_page.dart, HomePage.dart/home.dart, calendar_page.dart, schedule_page.dart, TaskScreen.dart (and firestor.dart as the shared data layer they all call into).

### H-DIAG: diagram — CONFIRMED (Adriel, 2026-09-29)

```yaml
diagram:
  nodes:
    - id: auth
      label: Firebase Auth
      note: "lib/firestor.dart — Firestore_Datasource reads FirebaseAuth.instance.currentUser.uid to scope every read/write"
    - id: goal-creation
      label: Goal/habit creation
      note: "lib/goal_creation_page.dart (~line 146) — writes a new doc to users/{uid}/tasks with category, dates and a frequency map"
    - id: firestore
      label: Cloud Firestore
      note: "lib/firestor.dart — single Firestore_Datasource class wraps all reads/writes under the users/{uid} document"
    - id: task-list
      label: Task list and logging
      note: "lib/TaskScreen.dart (line 76) — lists users/{uid}/tasks, deletes tasks, and logs taps to users/{uid}/taskLogs"
    - id: calendar
      label: Calendar view
      note: "lib/calendar_page.dart (line 36) — CalendarEvent.fromFirestore() renders tasks from parsed startDate/startTime strings"
    - id: streak-dashboard
      label: Stats dashboard
      note: "lib/streakTracking.dart (line 93 _fetchGoalsData, line 206 _fetchToDoTasks) — aggregates task counts by frequency, category and hour"
    - id: charts
      label: Chart rendering
      note: "lib/GraphWidgets.dart (PieChart at lines 172/314/355, DChartScatterN at line 219) — static widget builders consume the dashboard's aggregated counts"
  edges:
    - [auth, firestore]
    - [goal-creation, firestore]
    - [task-list, firestore]
    - [firestore, calendar]
    - [firestore, streak-dashboard]
    - [streak-dashboard, charts]
```

### H-SCHEMA: schema — CONFIRMED (Adriel, 2026-09-29)

Habitect has no SQL tables — it stores everything in Cloud Firestore under a
`users/{uid}` document (`sqflite` and `shared_preferences` are also dependencies in
`pubspec.yaml`, but `shared_preferences` is only used in `lib/main.dart` for the one-time
`seenOnboard` boolean, and no code path was found that calls `sqflite`'s `openDatabase`).
Collections shown as "tables" for schema-shape purposes:

```yaml
schema:
  - table: users
    fields: [id, email]
    # lib/firestor.dart CreateUser()
  - table: users/{uid}/tasks
    fields: [category, title, startDate, startTime, endDate, endTime, frequency, createdAt]
    # lib/goal_creation_page.dart lines 146-158; frequency is a nested map with a "type" field (Daily/Weekly/Monthly/Custom)
  - table: users/{uid}/notes
    fields: [id, subtitle, title, time, image, isDon]
    # lib/notes_model.dart (Note class), lib/firestor.dart AddNote()
  - table: users/{uid}/taskLogs
    fields: [taskName, clickedAt, category, startTime]
    # lib/TaskScreen.dart lines 76-81, recordTaskClick()
  - table: users/{uid}/profile/profileData
    fields: [name, email]
    # lib/HomePage.dart lines 52-86
```

### Candidate "decision worth explaining" statements

- [ ] H-D1: REJECTED — "I modeled each goal/task as a Firestore document with a nested `frequency` map (`type`: Daily/Weekly/Monthly/Custom, plus a custom interval) instead of separate fixed columns, so the same document shape could support one-off and recurring habits without a second collection." Evidence: `lib/goal_creation_page.dart` (frequency built from `_selectedFrequency`/`_customInterval`/`_intervalUnit` and written at line ~156) and `lib/streakTracking.dart` (branches on `frequency['type']` at lines 158-165).
- [x] H-D2: CONFIRMED — "I split the aggregation logic from the rendering: `streakTracking.dart` fetches Firestore data and counts it by frequency/category/hour, while a separate static-widget class (`GraphWidgets.dart`) turns those counts into pie charts and a scatter plot." Evidence: `lib/streakTracking.dart` (`_fetchGoalsData`, `_fetchToDoTasks`) feeding `lib/GraphWidgets.dart` (`PieChart`/`DChartScatterN` builders).
- [ ] H-D3 (UNCERTAIN — inferred from a commit message, not a code comment): REJECTED — "`streakTracking.dart` became the integration point where my dashboard work met two teammates' modules." Evidence: commit `274e727 "Connected Frederick's part and Zhi Ren's part"` touching `lib/streakTracking.dart` only. I can't tell from the diff alone what "Frederick's part" or "Zhi Ren's part" actually were — flagging as uncertain.

### Candidate "what I'd change" statements

- [x] H-C1: CONFIRMED — "I'd store dates as Firestore `Timestamp` fields instead of separate date/time strings, since the app currently splits strings like `\"5/13/2025\"` by `/` to get month/year, and falls back to `DateTime.now()` (silently wrong) when parsing fails." Evidence: `lib/streakTracking.dart` lines 111-120 (`taskDateString.split('/')`); `lib/calendar_page.dart` `_parseDateTime` catch block (~lines 127-130) returning `DateTime.now()` on failure.
- [ ] H-C2: REJECTED — "I'd stop swallowing Firestore errors with `catch (e) { print(e); return false; }` and surface a real error/loading state to the UI — right now every write in `firestor.dart` and every fetch in `streakTracking.dart` fails silently to the debug console." Evidence: `lib/firestor.dart` (repeated `catch (e) { print(e); return false; }` pattern, e.g. `CreateUser`, `AddNote`), `lib/streakTracking.dart` `_fetchToDoTasks` catch block (~line 244, `print("Error fetching To Do tasks: $e")`).
- [ ] H-C3: REJECTED — "I'd remove the `fl_heatmap` dependency (imported in `GraphWidgets.dart`) since it's never actually used to build a `Heatmap` widget anywhere in the app — the activity view is three `PieChart`s and one scatter plot instead." Evidence: `lib/GraphWidgets.dart` line 4 (`import 'package:fl_heatmap/fl_heatmap.dart'`) with no `Heatmap(` call found anywhere in `lib/`.

### H-PROB: problem statement candidate

- [x] H-PROB: CONFIRMED — "Habitect needed a way for users to create recurring goals/habits, log daily task activity against them, and see progress broken down by category and time of day. I built the goal-creation flow, the Firestore task/notes/log data layer, and the stats dashboard (`streakTracking.dart` + `GraphWidgets.dart`) that turns that raw activity data into pie charts and a scatter plot." Evidence: files cited above.

---

## 2. Integrative Programming Assignment (Laravel/PHP/MySQL package tracker)

`git shortlog -sne --all` shows AdrielTTE as the top committer (80 commits) of 5 contributors
(YeohQY 34, Frederick 29, JQI2001 13, zhire 9), consistent with the "team of 5" framing. I did not
attempt to isolate "Adriel's part" here since the brief only asked for that on Habitect; the
findings below are about the codebase as a whole.

### P-DIAG: diagram — CONFIRMED (Adriel, 2026-09-29)

```yaml
diagram:
  nodes:
    - id: customer-portal
      label: Customer portal
      note: "routes/web.php line 69 (Route::prefix('customer')) + app/Http/Controllers/CustomerControllers/PackageController.php"
    - id: admin-portal
      label: Admin portal
      note: "routes/web.php line 154 (Route::prefix('admin')) + app/Http/Controllers/AdminControllers/AdminPackageController.php"
    - id: driver-portal
      label: Driver portal
      note: "routes/web.php line 247 (Route::prefix('driver')) + app/Http/Controllers/DriverControllers/*"
    - id: package
      label: Package (Eloquent model)
      note: "app/Models/Package.php — central entity holding package_status, priority, shipping_cost"
    - id: package-state
      label: Package state machine
      note: "app/States/Package/PackageState.php + app/Factories/PackageStateFactory.php — State pattern enforces allowed status transitions"
    - id: delivery-assignment
      label: Delivery assignment
      note: "app/Models/DeliveryAssignment.php — links a package to a driver, created from the admin portal"
    - id: notifications
      label: Status notifications
      note: "app/Observers/PackageSubject.php + app/Observers/Observer.php — Observer pattern notifies on package changes"
  edges:
    - [customer-portal, package]
    - [admin-portal, package]
    - [admin-portal, delivery-assignment]
    - [delivery-assignment, driver-portal]
    - [package, package-state]
    - [package, notifications]
```

### P-SCHEMA: schema — CONFIRMED (Adriel, 2026-09-29)

Important caveat (see P-C1 below): the checked-in migrations in `database/migrations/` do
**not** match the tables the Eloquent models actually query — most models override `$table` to a
name/shape the migrations never create. The fields below are taken from the **models**
(`$fillable`), which reflect what the running app actually reads/writes; each entry notes whether
a matching migration exists.

```yaml
schema:
  - table: customer
    fields: [customer_id, first_name, last_name, address, date_of_birth, customer_status]
    # app/Models/Customer.php. NOTE: the only related migration (0001_01_01_000004_create_customer_table.php) creates a DIFFERENT table "customers" with name/email/phone/status instead — no migration for this shape exists.
  - table: package
    fields: [package_id, user_id, tracking_number, package_status, priority, package_weight, shipping_cost, payment_status]
    # app/Models/Package.php. NOTE: the only related migration (0001_01_01_000004_create_packages_table.php) creates a DIFFERENT table "packages" (customer_id/weight/destination/status) — no migration for this shape exists.
  - table: deliveryassignment
    fields: [assignment_id, admin_id, package_id, driver_id, assigned_date, assignment_status]
    # app/Models/DeliveryAssignment.php. NOTE: the only related migration creates table "delivery_assignment" (with underscore) — a different table name than the model uses.
  - table: delivery
    fields: [delivery_id, package_id, driver_id, vehicle_id, route_id, delivery_status, delivery_cost]
    # app/Models/Delivery.php
  - table: payments
    fields: [payment_id, package_id, user_id, amount, payment_method, transaction_id, status]
    # app/Models/Payment.php — no migration found for this table.
  - table: admin_audit_log
    fields: [admin_id, action, target_type, target_id, old_values, new_values, ip_address]
    # database/migrations/2025_09_19_190256_create_admin_audit_log_table.php — one of the few tables where the migration and usage agree.
```

### Candidate "decision worth explaining" statements

- [x] P-D1: CONFIRMED — "We modeled package status as a State pattern (`PackageState` abstract base, 8 concrete states, `PackageStateFactory`) instead of a plain enum column, so each state itself defines which transitions are legal and whether the package can still be edited/cancelled/assigned." Evidence: `app/States/Package/PackageState.php` (abstract `canTransitionTo`/`getAllowedTransitions`), `app/States/Package/PendingState.php` (concrete transitions), `app/Factories/PackageStateFactory.php` (status-string → state-class map).
- [ ] P-D2: REJECTED — "We put a Facade (`PaymentFacade`) in front of three separate gateway classes (card/PayPal/wallet) so callers process a payment or refund without knowing which gateway is behind it." Evidence: `app/Services/Payment/PaymentFacade.php` (comment "Facade Design Pattern(Payment)", `processPayment()` switches on `$method` to pick `cardGateway`/`paypalGateway`/`walletGateway`).
- [ ] P-D3: REJECTED — "Search is role-scoped through the Strategy pattern: the customer's search strategy always injects `user_id => Auth::id()` so a customer can only ever search their own packages, while the admin strategy has no such restriction." Evidence: `app/Services/Strategies/Search/CustomerSearchStrategy.php` (`$params['user_id'] = Auth::id();`) vs `app/Services/Strategies/Search/AdminSearchStrategy.php` (no user-id filter, includes `driver_status`/`package_status`).

### Candidate "what I'd change" statements

- [ ] P-C1: REJECTED — "I'd regenerate the Laravel migrations from the real schema (or write missing ones), because right now most models point at tables the migrations never create or create differently. `git log` shows the `packages`-table migration was touched once (`00a5872`, the initial scaffold) while `app/Models/Package.php` has 13+ commits after that — the model's schema (package_status, tracking_number, priority, shipping_cost, …) outgrew the migration and nobody went back to update it. Same pattern for `customer` (model) vs `customers` (migration), and `deliveryassignment` (model's `$table`) vs `delivery_assignment` (the migration's table name, with an underscore the model doesn't use)." Evidence: `database/migrations/0001_01_01_000004_create_packages_table.php`, `app/Models/Package.php` (`protected $table = 'package'`), `database/migrations/0001_01_01_000004_create_customer_table.php` vs `app/Models/Customer.php` (`protected $table = 'customer'`), `database/migrations/2025_09_10_185638_create_delivery_assignment_table.php` vs `app/Models/DeliveryAssignment.php` (`protected $table = 'deliveryassignment'`).
- [x] P-C2: CONFIRMED — "I'd merge the two `PackageService` classes — `app/Services/PackageService.php` (517 lines, uses `PackageRepository`, `PackageStateFactory`, `Cache`, and an internal `Http` base URL) and `app/Services/Api/PackageService.php` (178 lines, plain Eloquent CRUD) — into one, since right now package business logic can diverge depending on which one a controller happens to call." Evidence: `app/Services/PackageService.php` vs `app/Services/Api/PackageService.php` (both declare `class PackageService` with independent implementations, in different namespaces).
- [ ] P-C3: REJECTED — "I'd normalize `package_status` handling once instead of defensively re-normalizing it in the factory — `PackageStateFactory::create()` lowercases/trims the status and, if that still doesn't match, loops over the whole state map doing a case-insensitive comparison again, which suggests the status values written to the database aren't consistently cased at the point of writing." Evidence: `app/Factories/PackageStateFactory.php` (`strtolower(trim($package->package_status))` followed by a fallback loop over `self::$stateMap`).

### P-PROB: problem statement candidate

- [x] P-PROB: CONFIRMED — "This was a 5-person Laravel/MySQL package-tracking system with separate customer, admin and driver logins (`routes/web.php` prefixes) that needed a shared package lifecycle all three roles could act on safely — I worked on the package state machine, the payment/refund facade, and the role-scoped search strategies that keep customers from seeing each other's packages." Evidence: files cited above.

---

## Notes on method

Both repos were fully cloned (not shallow) into a scratch directory so `git log --author` and
per-file history were available. Storage/auth for each project, confirmed from source:

- **Habitect**: Cloud Firestore (`cloud_firestore`) + Firebase Auth for all task/note/profile
  data; `shared_preferences` is used only for a one-time onboarding flag; `sqflite` is a declared
  dependency in `pubspec.yaml` but no call site (`openDatabase`, etc.) was found in `lib/`.
- **Package Tracker**: MySQL via Eloquent, with `laravel/sanctum` for API tokens and Laravel's
  session-based `auth` middleware (role-gated via `customer`/`admin`/`driver` middleware groups in
  `routes/web.php`) for the three portals.

## Adriel's rulings (2026-09-29)
- Package Tracker role stays unclaimed: `role: "Member of a five-person team"`. P-PROB ships WITHOUT its "I worked on the package state machine, the payment/refund facade, and the role-scoped search strategies…" clause. Keep only the problem sentence.
- P-D1 ships in team voice ("We…"), as written.
- Habitect part confirmed as per H-IDENT.
- Diagrams + schemas for both projects: ship.
