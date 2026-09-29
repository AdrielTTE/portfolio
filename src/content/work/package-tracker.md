---
title: "Package Tracker"
summary: "A Laravel web app for tracking package deliveries across customer, admin, and driver logins."
scope: "Web app"
stack: ["Laravel", "PHP", "MySQL"]
year: 2025
role: "Member of a five-person team"
team: "Group of 5, coursework"
repo: "https://github.com/AdrielTTE/Integrative-Programming-Assignment"
offers: ["webapps"]
device: "browser"
featured: true
order: 2
problem: |-
  This was a 5-person Laravel/MySQL package-tracking system with separate customer, admin and driver logins that needed a shared package lifecycle all three roles could act on safely.
decision: |-
  We modeled package status as a State pattern (`PackageState` abstract base, 8 concrete states, `PackageStateFactory`) instead of a plain enum column, so each state itself defines which transitions are legal and whether the package can still be edited/cancelled/assigned.
change: |-
  I'd merge the two `PackageService` classes — `app/Services/PackageService.php` and `app/Services/Api/PackageService.php` — into one, since right now package business logic can diverge depending on which one a controller happens to call.
forYou: |-
  Package Tracker has three separate logins (customer, admin, driver), the kind of role-based access most business tools need. It's coursework built with a team of five, not a client project, but it's a full Laravel app with a real database behind it. A custom web app for your business would follow the same pattern: real data, defined user roles, and a dashboard for each.
diagram:
  nodes:
    - id: customer-portal
      label: Customer portal
      note: "Customer-facing routes for managing their own packages (PackageController)."
    - id: admin-portal
      label: Admin portal
      note: "Admin routes for managing all packages and driver assignments (AdminPackageController)."
    - id: driver-portal
      label: Driver portal
      note: "Driver-facing routes for handling assigned deliveries (DriverControllers)."
    - id: package
      label: Package (Eloquent model)
      note: "Central entity holding status, priority, and shipping cost (Package.php)."
    - id: package-state
      label: Package state machine
      note: "Enforces which status transitions a package can legally make (PackageState.php)."
    - id: delivery-assignment
      label: Delivery assignment
      note: "Links a package to a driver, created from the admin portal (DeliveryAssignment.php)."
    - id: notifications
      label: Status notifications
      note: "Notifies on package status changes via the Observer pattern (PackageSubject.php)."
  edges:
    - [customer-portal, package]
    - [admin-portal, package]
    - [admin-portal, delivery-assignment]
    - [delivery-assignment, driver-portal]
    - [package, package-state]
    - [package, notifications]
schema:
  - table: customer
    fields: [customer_id, first_name, last_name, address, date_of_birth, customer_status]
  - table: package
    fields: [package_id, user_id, tracking_number, package_status, priority, package_weight, shipping_cost, payment_status]
  - table: deliveryassignment
    fields: [assignment_id, admin_id, package_id, driver_id, assigned_date, assignment_status]
  - table: delivery
    fields: [delivery_id, package_id, driver_id, vehicle_id, route_id, delivery_status, delivery_cost]
  - table: payments
    fields: [payment_id, package_id, user_id, amount, payment_method, transaction_id, status]
  - table: admin_audit_log
    fields: [admin_id, action, target_type, target_id, old_values, new_values, ip_address]
---

## What it is

Package Tracker is a web app for tracking deliveries, built with Laravel, PHP, and MySQL. It has three logins: customer, admin, and delivery driver. It was built in 2025 as TAR UMT coursework, with a team of five including Adriel.
