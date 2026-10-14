---
title: "Quotebook"
seoTitle: "Quotebook: A Quotation and Invoice Tracker"
seoDescription: "Quotebook is a quotation and invoice tracker for small service businesses, built with ASP.NET Core, EF Core and PostgreSQL. Try the live demo."
summary: "A quotation and invoice tracker for small service businesses: quote, invoice, record payments, see who owes what. Live demo."
scope: "Web app"
stack: ["ASP.NET Core", "C#", "Razor Pages", "EF Core", "PostgreSQL", "xUnit", "Docker"]
year: 2026
role: "Design and build"
repo: "https://github.com/AdrielTTE/quotebook"
live: "https://quotebook-oe9t.onrender.com/"
offers: ["webapps", "apis"]
mark: "disc"
icon: "../../assets/work/quotebook/icon.png"
shots:
  - src: "../../assets/work/quotebook/dashboard.png"
    label: "Dashboard"
    alt: "Quotebook dashboard: a dark band showing RM 2,040.00 owed across 3 unpaid invoices, with RM 240.00 overdue, RM 240.00 waiting for a reply and RM 1,100.00 collected this month, then a Needs attention list and recent invoices"
  - src: "../../assets/work/quotebook/invoices.png"
    label: "Invoices"
    alt: "Quotebook invoice list with a search box, status filters and four invoices marked Unpaid, Partial, Paid and Overdue"
  - src: "../../assets/work/quotebook/invoice.png"
    label: "Payments"
    alt: "Quotebook invoice INV-0002 under the business letterhead, partly paid: two line items, a RM 1,000 deposit recorded, a RM 1,450 balance and a form to record the next payment"
  - src: "../../assets/work/quotebook/quotation.png"
    label: "Quotation"
    alt: "Quotebook quotation Q-0006 under the business letterhead, in the Sent state, with Print and buttons to record that the customer accepted or rejected it"
facts:
  - value: "93"
    label: "Automated test methods (xUnit)"
featured: true
order: 0
problem: |-
  A lot of small service businesses quote over WhatsApp, track invoices in a spreadsheet and lose track of who has paid. I wanted to show how I'd build a system for that: the path from quotation to invoice to payment, with money that adds up and each business's data kept apart from everyone else's. It's a demo built for this portfolio, not a product with paying customers.
change: |-
  I'd add email sending next, because a quotation has to reach the customer to matter. Today you print it or save it as a PDF from the browser, and an invited staff member gets a link the owner has to pass on by hand. Real PDF generation would come with email, so the document can be attached. I'd also move the dashboard totals into SQL: today they're added up in memory, which is fine for hundreds of invoices but not thousands. And I'd have run the tests on real PostgreSQL from the start: most of them ran on an in-memory database, which hid a foreign-key bug until I ran the demo seeder on the real thing. They now run on both in CI.
forYou: |-
  If you need a web app with logins, roles and money that has to add up, this is how I'd build it: ASP.NET Core and SQL, with tests around the business rules and every business's data kept separate. The demo shows how it's put together. Yours would be scoped to what your business actually does.
schema:
  - table: Businesses
    fields: ["Id (the business id)", "Name", "Address", "Phone", "Email"]
  - table: Customers
    fields: ["Id", "OwnerId", "Name", "Email", "Phone"]
  - table: Quotes
    fields: ["Id", "OwnerId", "Number (unique per business)", "CustomerId", "Status", "IssuedOn", "ValidUntil", "xmin (version)"]
  - table: Invoices
    fields: ["Id", "OwnerId", "Number (unique per business)", "CustomerId", "QuoteId (unique)", "IssuedOn", "DueOn", "xmin (version)"]
  - table: LineItems
    fields: ["Id", "Description", "Quantity", "UnitPrice", "QuoteId or InvoiceId"]
  - table: Payments
    fields: ["Id", "InvoiceId", "Amount (must be above zero)", "PaidOn", "Note"]
diagram:
  nodes:
    - id: web
      label: Razor Pages
      note: "Pages and handlers for customers, quotations, invoices and the dashboard (Quotebook.Web)."
    - id: identity
      label: Sign-in and roles
      note: "ASP.NET Identity with Owner and Staff roles, and staff invites by one-time link. The business id travels in the sign-in cookie."
    - id: core
      label: Domain rules
      note: "Quote and invoice rules, payment totals and statuses, with no framework or database code (Quotebook.Core)."
    - id: data
      label: EF Core
      note: "The DbContext, mappings, migrations and the filters that scope every query to one business (Quotebook.Data)."
    - id: postgres
      label: PostgreSQL
      note: "The single source of truth, hosted on Neon. Unique indexes and a check constraint back up the rules."
    - id: tests
      label: xUnit tests
      note: "Over 90 tests: the domain rules, one business never seeing another's data, and real page flows."
  edges:
    - [web, identity]
    - [web, core]
    - [web, data]
    - [identity, data]
    - [data, postgres]
    - [tests, core]
    - [tests, web]
---

Quotebook is a quotation and invoice tracker for small service businesses like aircon servicers, renovators and photographers. You write a quotation, send it, and record whether the customer accepted. An accepted quotation becomes an invoice with one click, and you record payments against it. The dashboard shows what you're owed, what's overdue and what's waiting for a reply.

### Try it

Open the live demo and press **Try the demo**. There's no sign-up. The demo business is full of sample data, and it resets itself every 6 hours. It runs on free hosting, so the first load after a quiet spell can take up to a minute while the server wakes up.

### What's in it

- **Quotations** with line items, numbered per business (Q-0001, Q-0002), moving through Draft, Sent, Accepted or Rejected. An expired quotation can't be accepted.
- **Invoices** created from an accepted quotation, once only, with the lines copied across.
- **Payments** recorded as their own rows, so deposits and instalments are kept. An invoice shows Unpaid, Partial, Paid or Overdue. That status is worked out from the due date and the payments each time, never stored, so it can't go stale overnight.
- **Print-ready documents.** Quotations and invoices print cleanly, or save as a PDF from the browser, under a letterhead with the business's name, address and contact details. The owner sets those in Settings.
- **Search.** Customers by name, email or phone; quotations and invoices by number or customer name.
- **Roles and staff invites.** Owners manage everything. Staff can record payments but only owners can remove one, and that's enforced on the server, not just by hiding the button. An owner invites staff from a Team page and gets a one-time link to pass on. The person sets their own password, so no one else ever knows it. The link works once and expires after a day.
- **Separate businesses.** Every query is scoped to the signed-in business, and saving a row for another business is refused. Tests check both.

### Decisions worth explaining

- **Two people paying at once.** A payment is a new row, so the invoice row itself wouldn't change and a second payment could slip past the "not more than owed" check. I force an update on the invoice so the database rejects the second one. I tested it on real PostgreSQL by sending two full payments at the same moment: exactly one was recorded.
- **Stale edits.** Editing a quotation replaces its lines, which has the same problem. Two browser tabs editing the same draft now give the second one a clear message instead of silently overwriting the first.
- **Rules live in one place.** The quote and invoice rules sit in a plain C# project with no framework code, so they're tested directly and the pages can't quietly disagree with them.
- **A design language, not a template.** I designed it as "Ledger": a calm, finance-tool look with money in tabular monospace so the columns line up, status shown as a dot and a word (never colour alone), and a dark band on the dashboard that holds the one number an owner cares about. On a phone the navigation becomes a bottom tab bar and every table turns into a card per row. It uses no CSS framework, and the fonts are served from the site itself.
- **A bug the tests couldn't see.** An in-memory test database doesn't enforce foreign keys, so a customer-link bug in the quote-to-invoice step only showed up when the demo seeder ran on real PostgreSQL. It now has its own unit test, and the whole suite runs a second time in CI against a throwaway PostgreSQL container, so unique indexes, foreign keys and row versions are enforced.
- **A test setup that must not touch real data.** My first attempt at those PostgreSQL runs used my hosted database with a separate schema per test. The host ignored the schema setting and the tests wrote into the real tables. I caught it, cleaned up, and changed the test setup to check that it is in its own schema before it writes anything. It now refuses to run otherwise, and the PostgreSQL runs happen only in CI.
- **Print without a PDF library.** A print stylesheet hides the navigation and side panels and leaves just the document. It avoids a second layout in C# to maintain and a heavier server, and the cost is that the output depends on the browser. I'd add real PDFs once email needs an attachment.
- **A bug in my own access rules.** Requiring sign-in everywhere also blocked the stylesheets for signed-out visitors, so the public pages loaded unstyled. I found it by testing as a visitor, fixed it, and added a test.

### Status

Live as a portfolio demo, with the code on GitHub under the MIT license. The build and tests run in GitHub Actions on every push.
