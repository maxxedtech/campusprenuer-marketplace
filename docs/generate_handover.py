from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.colors import HexColor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "CAMPUSPRENEUR_DEVELOPMENT_TEAM_HANDOVER.pdf"
NAVY = HexColor("#1F2D4D")
ORANGE = HexColor("#F5A623")
INK = HexColor("#172033")
MUTED = HexColor("#5E6B7E")
PALE = HexColor("#F4F7FA")
LINE = HexColor("#D9E0E8")
GREEN = HexColor("#138A5B")
RED = HexColor("#B42318")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverKicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=ORANGE, tracking=1.2, spaceAfter=12))
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=29, leading=34, textColor=NAVY, alignment=TA_LEFT, spaceAfter=14))
styles.add(ParagraphStyle(name="CoverSubtitle", parent=styles["Normal"], fontName="Helvetica", fontSize=13, leading=19, textColor=MUTED, spaceAfter=28))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=18, leading=23, textColor=NAVY, spaceBefore=12, spaceAfter=9, keepWithNext=True))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=NAVY, spaceBefore=10, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2, leading=14, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="Callout", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9.3, leading=14, textColor=NAVY, backColor=PALE, borderColor=LINE, borderWidth=.5, borderPadding=9, spaceBefore=5, spaceAfter=10))
styles.add(ParagraphStyle(name="TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.2, leading=9, textColor=colors.white))
styles.add(ParagraphStyle(name="TableCell", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.2, leading=9.5, textColor=INK))
styles.add(ParagraphStyle(name="TaskId", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=ORANGE))
styles.add(ParagraphStyle(name="Toc", parent=styles["BodyText"], fontName="Helvetica", fontSize=10, leading=16, textColor=INK))

def P(text, style="Bodyx"):
    return Paragraph(text, styles[style])

def bullet(text):
    return P(f"- {text}", "Bodyx")

def status(text, tone="partial"):
    color = GREEN if tone == "verified" else RED if tone == "not" else ORANGE
    return Paragraph(f'<font color="{color.hexval()}"><b>{text}</b></font>', styles["TableCell"])

def table(data, widths, header=True):
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    cmds = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6), ("GRID", (0, 0), (-1, -1), .35, LINE)]
    if header:
        cmds += [("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white)]
    for r in range(1 if header else 0, len(data)):
        if r % 2 == 0: cmds += [("BACKGROUND", (0, r), (-1, r), PALE)]
    t.setStyle(TableStyle(cmds))
    return t

def task(task_id, category, title, current, required, approach, reason, priority, deps, acceptance):
    return [P(task_id, "TaskId"), P(category, "TableCell"), P(title, "TableCell"), P(current, "TableCell"), P(required, "TableCell"), P(approach, "TableCell"), P(reason, "TableCell"), P(priority, "TableCell"), P(deps, "TableCell"), P(acceptance, "TableCell")]

class HandoverDoc(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=A4, leftMargin=17*mm, rightMargin=17*mm, topMargin=20*mm, bottomMargin=17*mm, **kwargs)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([PageTemplate(id="main", frames=frame, onPage=self._header_footer)])
    def _header_footer(self, canvas, doc):
        canvas.saveState()
        if doc.page > 1:
            canvas.setStrokeColor(LINE); canvas.setLineWidth(.5); canvas.line(self.leftMargin, A4[1]-13*mm, A4[0]-self.rightMargin, A4[1]-13*mm)
            canvas.setFont("Helvetica-Bold", 8); canvas.setFillColor(NAVY); canvas.drawString(self.leftMargin, A4[1]-10*mm, "CAMPUSPRENEUR")
            canvas.setFont("Helvetica", 7.5); canvas.setFillColor(MUTED); canvas.drawRightString(A4[0]-self.rightMargin, A4[1]-10*mm, "Internal development handover")
        canvas.setStrokeColor(LINE); canvas.setLineWidth(.5); canvas.line(self.leftMargin, 11*mm, A4[0]-self.rightMargin, 11*mm)
        canvas.setFont("Helvetica", 7.5); canvas.setFillColor(MUTED); canvas.drawString(self.leftMargin, 7*mm, "Prepared by MaxxedTech | CampusPreneur Marketplace")
        canvas.drawRightString(A4[0]-self.rightMargin, 7*mm, f"Page {doc.page}")
        canvas.restoreState()

story = []
story += [Spacer(1, 26*mm), P("CAMPUSPRENEUR", "CoverKicker"), P("Development Team Technical Handover &amp; Outstanding Implementation Requirements", "CoverTitle"), P("Frontend Upgrade Review, Backend Requirements, Integration Tasks and Platform Development Roadmap.", "CoverSubtitle")]
story += [Table([[P("Prepared by", "Smallx"), P("MaxxedTech", "Bodyx")], [P("Project", "Smallx"), P("CampusPreneur Marketplace", "Bodyx")], [P("Classification", "Smallx"), P("Internal Development Handover", "Bodyx")], [P("Generation date", "Smallx"), P("16 November 2026", "Bodyx")]], colWidths=[40*mm, 95*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), PALE), ("BOX", (0,0), (-1,-1), .5, LINE), ("INNERGRID", (0,0), (-1,-1), .25, LINE), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9), ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 4)])), Spacer(1, 30*mm), P("This document records the frontend work completed in the repository, the verified state of the current implementation, and the remaining product, backend, security and operational work required before production readiness.", "Callout"), PageBreak()]

story += [P("Table of contents", "H1x")]
for line in ["1. Executive summary", "2. Project overview", "3. Work completed by Codex", "4. Development team responsibilities", "5. Detailed task breakdown", "6. Priority classification", "7. Recommended implementation roadmap", "8. Acceptance and completion checklist", "9. Risks and technical considerations", "10. Final recommendations"]:
    story.append(P(line, "Toc"))
story += [Spacer(1, 8), P("Status vocabulary", "H2x"), P("Verified means observed in code and/or exercised successfully. Partial means the frontend surface exists but depends on local-only behavior, incomplete integration, or missing operational guarantees. Not implemented means no production-grade capability was found. Unable to verify means the repository or environment did not expose enough evidence to make a safe claim.", "Bodyx"), PageBreak()]

story += [P("1. Executive summary", "H1x"), P("CampusPreneur is a student-focused marketplace for discovering campus products and services, connecting customers with entrepreneurs, and providing role-specific administration. The frontend upgrade was completed against the existing Vite, React, TypeScript, Tailwind and Radix-based architecture. The highest priority was the marketplace experience, followed by the public entry points, authentication surface, shared visual language and admin workspace presentation.", "Bodyx"), P("The repository also contained a serious integrity issue introduced in the latest tracked commit: six files had been content-swapped across unrelated paths. That broke the CSS entry point, button primitive, landing page, login page, admin page and chat component. The upgrade repaired the affected frontend entry points while preserving the existing local-storage contracts and routes.", "Bodyx"), P("The development team still needs to harden the local prototype into a production marketplace. The current authentication, product storage, orders, cart and messaging behavior are local-browser implementations. Payments, durable backend persistence, image storage, notifications, auditability, deployment controls and end-to-end integration remain the core delivery responsibilities.", "Callout")]

story += [P("2. Project overview", "H1x"), P("Verified capabilities in the repository include public landing and onboarding routes; customer and entrepreneur signup routes; login, password reset and local session handling; a protected marketplace route; product detail views; cart and order creation; entrepreneur product management and metrics; local buyer-seller messaging; profile editing; and a restricted admin route for user and listing review.", "Bodyx"), P("The three user groups are customers who browse and buy, entrepreneurs who publish and manage listings, and administrators who review users, products and platform records. The implementation is currently optimized for a local or prototype environment and should not be treated as a production backend or payment-ready marketplace without the tasks below.", "Bodyx")]

story += [P("3. Work completed by Codex", "H1x")]
completed = [[P("Area", "TableHead"), P("Previous condition", "TableHead"), P("Changes implemented", "TableHead"), P("Expected benefit", "TableHead")],
[P("Design system", "TableCell"), P("Mixed spacing, typography and surface treatment; broken global CSS entry point.", "TableCell"), P("Restored the CSS entry point and established semantic tokens, Rubik/Nunito Sans type pairing, spacing rhythm, focus rings, reduced-motion handling, surface utilities and brand colors.", "TableCell"), P("Consistent visual language and maintainable styling primitives.", "TableCell")],
[P("Marketplace", "TableCell"), P("Minimal search-only grid with no category or sort controls and weak empty/loading presentation.", "TableCell"), P("Added responsive discovery header, search across title/description/seller/category, category filter, sort filter, clear action, skeleton loading, no-results state and honest no-listings state.", "TableCell"), P("Faster product discovery and clearer recovery when data is empty.", "TableCell")],
[P("Product presentation", "TableCell"), P("Cards had inconsistent hierarchy and limited feedback.", "TableCell"), P("Introduced consistent 4:3 media framing, category badges, price emphasis, seller context, lazy images, hover lift and keyboard-accessible card controls.", "TableCell"), P("Improved scanability, trust and mobile usability.", "TableCell")],
[P("Landing and login", "TableCell"), P("Latest commit had swapped content: the root route rendered login and the login path rendered a button primitive.", "TableCell"), P("Restored both pages and added role-aware signed-in hub, clearer value proposition, accessible labels, password visibility toggle and real submit feedback.", "TableCell"), P("Reliable entry experience and fewer broken route surprises.", "TableCell")],
[P("Admin interface", "TableCell"), P("Admin route contained chat UI because of the same content swap.", "TableCell"), P("Restored an admin workspace with user/product tabs, summary metrics, search, verification actions and listing approval actions backed by existing local utilities.", "TableCell"), P("Clearer moderation workflow while preserving role restriction.", "TableCell")],
[P("Responsive and accessibility", "TableCell"), P("Mobile navigation and filter behavior were difficult to inspect and several controls lacked robust labeling.", "TableCell"), P("Added mobile-first layouts, visible focus treatment, semantic labels, 44px-scale controls, reduced-motion CSS and a mobile filter disclosure.", "TableCell"), P("Better keyboard, touch and small-screen operation.", "TableCell")],
[P("Quality verification", "TableCell"), P("Build was blocked by the swapped CSS file; local auth tests failed because localStorage was unavailable in the runner.", "TableCell"), P("Production build passes. Added a deterministic localStorage test shim; all 3 Vitest tests pass. Browser smoke checks covered landing, login, admin sign-in, marketplace and mobile filters.", "TableCell"), P("Known-good baseline for the next team iteration.", "TableCell")]]
story.append(table(completed, [30*mm, 47*mm, 73*mm, 30*mm]))

story += [P("4. Development team responsibilities", "H1x"), P("The following matrix distinguishes verified frontend work from platform work that is partial, not implemented or unable to be verified from this repository.", "Bodyx")]
responsibilities = [[P("Category", "TableHead"), P("Verified state", "TableHead"), P("Team responsibility", "TableHead")],
[P("A. Backend and database", "TableCell"), status("Not implemented", "not"), P("Replace localStorage contracts with durable APIs and database models for users, businesses, products, media, carts, orders, messages, notifications and audit events. Define ownership, status transitions, validation and pagination.", "TableCell")],
[P("B. Authentication and security", "TableCell"), status("Partial", "partial"), P("Current local auth stores plaintext passwords in browser storage and includes a local admin seed. Implement server-side hashing, sessions or rotating tokens, server authorization, rate limits, password reset, CSRF/CORS policy, secret management and admin MFA or equivalent controls.", "TableCell")],
[P("C. Payments and transactions", "TableCell"), status("Not implemented", "not"), P("Select and integrate an approved payment provider, create server-side payment intents, verify webhooks, make order creation idempotent, persist transaction records and define failure/refund/reconciliation states.", "TableCell")],
[P("D. Product and image storage", "TableCell"), status("Partial", "partial"), P("Frontend image upload exists as a local/data flow. Add object storage, signed uploads, MIME and size validation, resizing, moderation, deletion policy, CDN delivery and durable product media relationships.", "TableCell")],
[P("E. Real-time messaging", "TableCell"), status("Partial", "partial"), P("A local conversation/message model exists. Add authenticated persistence, real-time transport, unread/read receipts, delivery failure handling, moderation and notification integration.", "TableCell")],
[P("F. Orders and inventory", "TableCell"), status("Partial", "partial"), P("Local cart/order creation exists. Add server stock checks, concurrency-safe reservation, seller/customer status events, cancellation rules, fulfillment tracking and transaction consistency.", "TableCell")],
[P("G. Notifications", "TableCell"), status("Not implemented", "not"), P("Define email and in-app notification events for signup, verification, order, payment, message and admin actions. Add preferences, retries and observability.", "TableCell")],
[P("H. Administration", "TableCell"), status("Partial", "partial"), P("Frontend moderation view exists. Add server-enforced admin actions, audit logs, user suspension, product moderation evidence, reporting, platform settings and least-privilege roles.", "TableCell")],
[P("I. Deployment and infrastructure", "TableCell"), status("Unable to verify", "partial"), P("Document and configure environments, variables, hosting, storage, domain, HTTPS, backups, monitoring, alerts, log retention, incident response and rollback. Do not expose local seed credentials in production.", "TableCell")],
[P("J. Integration and final testing", "TableCell"), status("Partial", "partial"), P("Add API contract tests, end-to-end customer/entrepreneur/admin flows, cross-browser and responsive checks, security testing, performance budgets and production acceptance evidence.", "TableCell")]]
story.append(table(responsibilities, [34*mm, 28*mm, 118*mm]))

story += [P("5. Detailed task breakdown", "H1x"), P("Each task below is actionable and includes the current evidence, an implementation direction and a completion signal. IDs should be used in planning tickets and release notes.", "Bodyx")]
headers = [P(x, "TableHead") for x in ["Task ID", "Category", "Task title", "Current situation", "Required work", "Recommended approach", "Reason", "Priority", "Dependencies", "Acceptance criteria"]]
tasks = [
task("BE-001", "Backend", "Define durable marketplace data model", "Products, users, carts and orders are local browser records.", "Model users, roles, businesses, products, media, carts, orders, order items, statuses and audit events with ownership constraints.", "Versioned relational schema with foreign keys, timestamps, soft-delete policy and migration checks.", "Prevents data loss and inconsistent relationships.", "Critical", "None", "Schema reviewed; migrations run cleanly; ownership and status constraints covered by tests."),
task("SEC-001", "Security", "Replace plaintext local authentication", "Passwords and the seeded admin account are stored client-side.", "Implement server-side password hashing, session/token lifecycle, reset flow, rate limiting and secret handling.", "Use a vetted auth provider or server auth module; rotate credentials and remove production seed credentials.", "Current approach is unsafe for production.", "Critical", "BE-001", "No plaintext passwords in storage; unauthorized role routes return 401/403; reset and logout are tested."),
task("SEC-002", "Security", "Enforce role authorization on the server", "Role restrictions are primarily frontend route guards.", "Authorize every read/write action by user role and resource ownership.", "Central policy middleware plus tests for customer, entrepreneur and admin paths.", "Frontend guards can be bypassed.", "Critical", "BE-001, SEC-001", "Direct API calls from the wrong role are rejected and logged."),
task("PAY-001", "Payments", "Integrate verified payment flow", "Cart creates a local pending order; no payment provider is wired.", "Create payment intent, redirect/inline checkout, webhook verification, idempotency and transaction record.", "Choose one approved provider; keep secrets server-side and make webhook the source of truth.", "Marketplace revenue and order integrity depend on it.", "Critical", "BE-001, SEC-001", "Successful, failed, duplicate and abandoned payments produce correct order and transaction states."),
task("IMG-001", "Media", "Move product media to object storage", "Image uploader and product image URLs are local/prototype-oriented.", "Add storage bucket, signed upload, validation, transforms, limits and cleanup.", "Use provider-managed object storage and responsive derivatives; persist media metadata.", "Improves reliability, performance and moderation control.", "High", "BE-001, SEC-001", "Valid images upload and render through stable URLs; invalid files are rejected; deleted products do not orphan media."),
task("ORD-001", "Orders", "Add inventory-safe order processing", "Sales counters and order records are updated locally.", "Reserve stock, validate availability, handle concurrent checkout, status transitions, cancellation and fulfillment.", "Server transaction with row-level or equivalent concurrency control and explicit state machine.", "Prevents overselling and mismatched customer/seller states.", "High", "BE-001, PAY-001", "Stock cannot go negative; every state transition is authorized and auditable."),
task("MSG-001", "Messaging", "Persist and stream conversations", "Messages are stored locally and polled in the browser.", "Persist conversations, messages, unread/read state, delivery failures and moderation hooks.", "Authenticated WebSocket or managed realtime channel with REST fallback.", "Trust and buyer conversion depend on dependable seller communication.", "High", "SEC-001, BE-001", "Two authenticated users can send, receive, read and recover messages across sessions/devices."),
task("NOT-001", "Notifications", "Implement notification event service", "No verified email or in-app event service was found.", "Define events, templates, preferences, delivery retries and admin/system alerts.", "Event-driven notification worker with provider abstraction and an in-app notification table.", "Reduces missed orders, messages and verification actions.", "Medium", "BE-001, MSG-001, ORD-001", "Events create durable notifications and failed deliveries retry without duplicates."),
task("ADM-001", "Administration", "Harden moderation and audit controls", "Admin UI can approve local records but backend enforcement and audit history are absent.", "Add server admin policy, moderation queue, suspension, reason capture and immutable audit records.", "Least-privilege admin roles, confirmation dialogs and append-only audit events.", "Protects platform trust and accountability.", "High", "SEC-002, BE-001", "Every destructive/moderation action requires authorization, reason and audit entry."),
task("OPS-001", "Infrastructure", "Prepare production environments", "Deployment, variables, storage, monitoring and backups were not verifiable from the frontend repository.", "Define staging/production environments, CI checks, secrets, HTTPS, backups, alerts and rollback.", "Documented runbook plus environment validation at deploy time.", "Makes releases repeatable and recoverable.", "High", "SEC-001, IMG-001", "Staging deploy passes smoke checks; secrets are externalized; backup restore is demonstrated."),
task("QA-001", "Testing", "Create integration and acceptance suite", "Unit tests cover only local auth and a sample test; browser smoke was manual.", "Add API, route, role, checkout, messaging, responsive, accessibility, security and performance tests.", "Use deterministic fixtures, Playwright/Cypress flows and CI artifact retention.", "Prevents regressions across role-specific flows.", "High", "BE-001, SEC-002, PAY-001", "Critical user journeys pass in CI on supported browsers and viewport sizes."),
]
field_names = ["Task ID", "Category", "Task title", "Current situation", "Required work", "Recommended approach", "Reason", "Priority", "Dependencies", "Acceptance criteria"]
for row in tasks:
    task_title = row[2]
    task_rows = [[P(field_names[index], "TableHead"), value] for index, value in enumerate(row)]
    block = Table(task_rows, colWidths=[34*mm, 143*mm], repeatRows=0, hAlign="LEFT")
    block.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (0, -1), NAVY), ("TEXTCOLOR", (0, 0), (0, -1), colors.white), ("GRID", (0, 0), (-1, -1), .35, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    story.append(KeepTogether([P(f"{row[0].text} - {task_title.text}", "H2x"), block, Spacer(1, 6)]))

story += [P("6. Priority classification", "H1x"), P("Critical tasks protect credentials, authorization, payment integrity or core data safety and should block production release. High tasks are necessary for a credible marketplace operation. Medium tasks improve reliability and communication after the core platform is safe. Low tasks are optional future enhancements that should not displace security, data or transaction work.", "Bodyx"), table([[P("Priority", "TableHead"), P("Why it matters", "TableHead"), P("Tasks", "TableHead")], [P("CRITICAL", "TableCell"), P("Required for safe production use and data integrity.", "TableCell"), P("BE-001, SEC-001, SEC-002, PAY-001", "TableCell")], [P("HIGH", "TableCell"), P("Required for the intended connected marketplace experience.", "TableCell"), P("IMG-001, ORD-001, MSG-001, ADM-001, OPS-001, QA-001", "TableCell")], [P("MEDIUM", "TableCell"), P("Important operational polish after core flows are reliable.", "TableCell"), P("NOT-001 and future reporting/preferences work", "TableCell")], [P("LOW", "TableCell"), P("Optional enhancements after production readiness.", "TableCell"), P("Advanced recommendations, richer analytics, PWA/offline support", "TableCell")]], [28*mm, 82*mm, 65*mm])]

story += [P("7. Recommended implementation roadmap", "H1x"), P("Stage 1 - Foundation, security and backend readiness: BE-001, SEC-001, SEC-002 and OPS-001. These tasks can begin together with API contract design, but release must wait for server authorization and secrets management.", "Bodyx"), P("Stage 2 - Marketplace data integration: connect the existing marketplace, product detail, profile and entrepreneur listing surfaces to durable APIs. IMG-001 can proceed in parallel once the product/media contract is agreed.", "Bodyx"), P("Stage 3 - Product, inventory and media: complete IMG-001 and ORD-001. Keep stock and product availability authoritative on the server.", "Bodyx"), P("Stage 4 - Orders, checkout and payments: implement PAY-001, then complete order reconciliation and customer/seller status surfaces. PAY-001 and UI contract work can run in parallel after BE-001.", "Bodyx"), P("Stage 5 - Messaging and notifications: implement MSG-001 and NOT-001. Messaging persistence can proceed alongside payment work if SEC-001 is complete.", "Bodyx"), P("Stage 6 - Administration: complete ADM-001 with moderation evidence, audit history and least privilege.", "Bodyx"), P("Stage 7 - Integration testing and production release: complete QA-001, run performance/security checks, deploy staging, restore a backup, complete acceptance checklist and then promote production.", "Bodyx"), P("Parallel work: schema/API contracts, UI integration adapters, image pipeline design and test-fixture planning can proceed in parallel. Dependent work: payments requires durable orders and auth; admin actions require server authorization; end-to-end acceptance requires all critical flows.", "Callout")]

story += [P("8. Acceptance and completion checklist", "H1x")]
check_items = ["Backend APIs and database migrations are deployed to staging.", "Authentication uses hashed passwords, secure sessions/tokens, reset and rate limiting.", "Role authorization is enforced server-side for customer, entrepreneur and admin actions.", "Product management supports durable CRUD, validation, media, ownership and moderation status.", "Marketplace search, filters, product details and seller actions use real API data.", "Cart and checkout prevent stale or unavailable product purchases.", "Payment verification is webhook-driven, idempotent and reconciled.", "Orders expose authorized status transitions, stock effects and customer tracking.", "Messaging persists across sessions and has unread/read and delivery handling.", "Notifications are durable, retryable and preference-aware.", "Administration includes moderation, user management, audit logs and confirmation flows.", "Responsive behavior is verified at 375px, 768px, 1024px and 1440px.", "Security review covers secrets, access control, input validation, abuse limits and logging.", "Performance budgets cover images, bundle size, loading, CLS and interaction latency.", "Automated unit, API, end-to-end, accessibility, cross-browser and regression suites pass.", "Production deployment, monitoring, backups, restore and rollback are documented and exercised."]
for item in check_items: story.append(bullet(item))

story += [P("9. Risks and technical considerations", "H1x"), P("Local storage is not a shared source of truth and can be cleared, modified or diverge between devices. Treat every local implementation as prototype behavior until a server contract exists.", "Bodyx"), P("The content-swapped commit demonstrates a repository integrity risk. Protect against recurrence with CI type/build checks, a changed-file review, and a smoke test that imports the CSS entry point and primary route components.", "Bodyx"), P("Payments, inventory and orders must be designed as one consistency boundary. Avoid creating an order solely from a client success screen; verify provider events server-side and make retries safe.", "Bodyx"), P("Image uploads and chat introduce abuse, privacy and operational costs. Set limits, validate content, retain only necessary metadata, add moderation hooks and define deletion/retention policies.", "Bodyx"), P("The current frontend bundle includes a broad UI dependency set and an older browserslist dataset. Measure before optimization, then split routes or remove unused dependencies if real performance data justifies it.", "Bodyx")]

story += [P("10. Final recommendations", "H1x"), P("The team should first secure the platform and establish durable data contracts. Next connect the marketplace and product flows to those contracts, then implement media, inventory, orders and verified payments. Messaging, notifications and admin auditability follow as operational layers. Only after the critical path is secure and integrated should the team invest in richer analytics, advanced personalization or offline capability.", "Bodyx"), P("The frontend work delivered in this handover is a stronger presentation and interaction layer for that roadmap. It should now be treated as the UI contract: preserve the route structure and user intent, then replace local adapters with authenticated services behind the same clear states, loading patterns and recovery paths.", "Callout"), P("Recommended release gate: do not promote the marketplace to production until SEC-001, SEC-002, BE-001, PAY-001 and QA-001 are accepted with evidence, and OPS-001 has a tested rollback and restore path.", "Bodyx")]

HandoverDoc(str(OUT)).build(story)
print(OUT)
