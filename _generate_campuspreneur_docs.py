from pathlib import Path
from datetime import date
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "campusprenuer detailed.docx"


def set_cell_shading(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tcPr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=100, start=120, bottom=100, end=120):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = tcPr.first_child_found_in("w:tcMar")
    if tcMar is None:
        tcMar = OxmlElement("w:tcMar")
        tcPr.append(tcMar)
    for m, v in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tcMar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tcMar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color="D9D9D9", size="4"):
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = tblPr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tblPr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), color)


def set_repeat_table_header(row):
    trPr = row._tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    tblHeader.set(qn("w:val"), "true")
    trPr.append(tblHeader)


def set_run_font(run, name="Aptos", size=None, color="000000", bold=None, italic=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    if size:
        run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def add_para(doc, text="", style=None, bold_prefix=None):
    p = doc.add_paragraph(style=style)
    if bold_prefix and text.startswith(bold_prefix):
        r = p.add_run(bold_prefix)
        set_run_font(r, bold=True)
        r2 = p.add_run(text[len(bold_prefix):])
        set_run_font(r2)
    else:
        r = p.add_run(text)
        set_run_font(r)
    return p


def add_bullets(doc, items, level=0):
    for item in items:
        p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
        r = p.add_run(item)
        set_run_font(r)


def add_code(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text)
    set_run_font(r, name="Consolas", size=8.5, color="1F2937")
    return p


def add_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    set_table_borders(table)
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        set_cell_shading(cell, "1E2D4E")
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(h)
        set_run_font(r, size=9, color="FFFFFF", bold=True)
    for row_i, row in enumerate(rows):
        cells = table.add_row().cells
        for i, value in enumerate(row):
            cell = cells[i]
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            if row_i % 2 == 1:
                set_cell_shading(cell, "F5F7FA")
            p = cell.paragraphs[0]
            r = p.add_run(str(value))
            set_run_font(r, size=8.5)
    if widths:
        for row in table.rows:
            for i, width in enumerate(widths):
                row.cells[i].width = Inches(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def tree_lines():
    ignore = {"node_modules", ".git", "dist", "build", "coverage", ".agents", ".codex"}
    paths = []
    for p in ROOT.rglob("*"):
        if any(part in ignore for part in p.parts):
            continue
        if p.name == OUT.name or p.name == Path(__file__).name:
            continue
        paths.append(p.relative_to(ROOT))
    paths = sorted(paths, key=lambda x: (len(x.parts), str(x).lower()))
    children = {}
    for rel in paths:
        parent = rel.parent
        children.setdefault(parent, []).append(rel)
    lines = ["."]
    def walk(parent, prefix=""):
        kids = sorted(children.get(parent, []), key=lambda r: (r.is_file() if hasattr(r, 'is_file') else False, str(r).lower()))
        # the rglob objects are not retained; sort directories before files
        kids = sorted(kids, key=lambda r: (r.suffix != "", str(r).lower()))
        for idx, rel in enumerate(kids):
            is_last = idx == len(kids) - 1
            name = rel.name
            full = ROOT / rel
            suffix = "/" if full.is_dir() else ""
            lines.append(prefix + ("`-- " if is_last else "|-- ") + name + suffix)
            if full.is_dir():
                walk(rel, prefix + ("    " if is_last else "|   "))
    walk(Path("."))
    return "\n".join(lines)


def file_purpose(rel):
    s = str(rel).replace("\\", "/")
    name = rel.name
    if s == "package.json": return "Project metadata, runtime dependencies, and npm scripts."
    if s == "README.md": return "Product overview, intended users, objectives, and high-level setup notes."
    if s == "vite.config.ts": return "Vite dev server, React SWC plugin, alias, HMR, and source-map configuration."
    if s == "vercel.json": return "SPA rewrite rule that routes arbitrary paths to the Vite entry document."
    if s == "tailwind.config.ts": return "Tailwind content globs, brand tokens, typography, shadows, and animations."
    if s == "vitest.config.ts": return "Vitest jsdom environment, setup file, include pattern, and alias."
    if s == "eslint.config.js": return "ESLint flat configuration and TypeScript/React rules."
    if s == "postcss.config.js": return "PostCSS/Tailwind processing configuration."
    if s == "index.html": return "Vite HTML shell and root mount element."
    if s.startswith("public/"): return "Static brand assets served without bundling."
    if s == "src/main.tsx": return "Application bootstrap: BrowserRouter, AuthProvider, toaster, and App."
    if s == "src/App.tsx": return "Route registry and role-protected route composition."
    if s == "src/App.css" or s == "src/index.css": return "Global and application-level styling, CSS variables, and Tailwind layers."
    if "/pages/" in s: return "Route-level screen for the user, seller, admin, or authentication flow."
    if "/components/ui/" in s: return "Reusable Radix/shadcn-style presentational primitive."
    if "/components/dashboard/entrepreneur/" in s: return "Entrepreneur dashboard screen for listings, products, and orders."
    if s.startswith("src/components/layout/"): return "Shared application shell, navigation, and footer."
    if s.startswith("src/components/common/"): return "Cross-cutting UI helpers such as image upload, badges, splash, and subscription UI."
    if s.startswith("src/components/chat/"): return "Chat presentation and conversation interaction components."
    if s.startswith("src/components/map/"): return "Map/location picker placeholder and location UI."
    if s.startswith("src/components/marketplace/"): return "Marketplace filtering UI."
    if s.startswith("src/components/"): return "Shared application component or route guard."
    if s.startswith("src/contexts/"): return "React context for cross-cutting application state."
    if s.startswith("src/lib/"): return "Client-side domain services and persistence adapters."
    if s.startswith("src/utils/"): return "Low-level local persistence and user storage utilities."
    if s.startswith("src/types/"): return "Shared domain types and category definitions."
    if s.startswith("src/hooks/"): return "Reusable React hooks."
    if s.startswith("src/test/"): return "Vitest setup and local-auth tests."
    return "Project file; inspect alongside neighboring modules for context."


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.top_margin = Inches(0.65)
    sec.bottom_margin = Inches(0.65)
    sec.left_margin = Inches(0.72)
    sec.right_margin = Inches(0.72)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
    normal.font.size = Pt(9.5)
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.08
    for style_name, size in (("Title", 25), ("Heading 1", 16), ("Heading 2", 12), ("Heading 3", 10.5)):
        st = styles[style_name]
        st.font.name = "Aptos Display"
        st._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
        st._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
        st.font.color.rgb = RGBColor(0, 0, 0)
        st.font.size = Pt(size)
        st.font.bold = True
        st.paragraph_format.space_before = Pt(12 if style_name != "Title" else 0)
        st.paragraph_format.space_after = Pt(5)

    footer = sec.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rr = footer.add_run("Campuspreneur technical documentation | Repository analysis | 19 September 2026")
    set_run_font(rr, size=8, color="6B7280")

    p = doc.add_paragraph(style="Title")
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run("Campuspreneur Technical Documentation")
    set_run_font(r, name="Aptos Display", size=25, bold=True)
    p2 = doc.add_paragraph()
    r = p2.add_run("Codebase analysis, architecture reference, and team action plan")
    set_run_font(r, size=12, color="5B6472")
    p3 = doc.add_paragraph()
    r = p3.add_run("Repository: campusprenuer-marketplace  |  Reviewed: 19 September 2026")
    set_run_font(r, size=9, color="6B7280")

    doc.add_heading("Executive Summary", level=1)
    add_para(doc, "Campuspreneur is currently a frontend-first campus marketplace prototype implemented as a Vite single-page React application. It supports three roles - customer, entrepreneur, and admin - and includes public landing/authentication screens, a protected marketplace, product detail and cart flows, entrepreneur product management, profile and verification screens, chat, and an administrative control panel. The current implementation is intentionally self-contained: users, sessions, listings, carts, orders, and messages are stored in browser localStorage rather than a server-side API or database.")
    add_para(doc, "The immediate engineering priority is to treat the localStorage layer as a development/demo adapter and introduce a real backend boundary before production use. The current client-side role checks and plaintext credentials are not security controls, and the project has no payment, durable media storage, map integration, or cross-device synchronization. This document describes what exists, how it works, what can be trusted, and what should be addressed next.")

    doc.add_heading("Project Overview", level=1)
    add_para(doc, "Campuspreneur is designed as a multi-vendor marketplace for student entrepreneurs. Sellers can present products or services to nearby campus customers; customers can discover listings, add products to a cart, place local orders, and chat with sellers; administrators can review users, listings, orders, and seller verification details. The product vision is to increase visibility for student businesses and make campus commerce easier to discover and coordinate.")
    add_table(doc, ["Area", "Current implementation"], [
        ("Frontend", "React 18, TypeScript, React Router 6, Vite, Tailwind CSS, Radix/shadcn-style UI, Framer Motion, Sonner."),
        ("State", "React state/context for session and screen state; browser events and polling for local cross-component refresh."),
        ("Persistence", "Browser localStorage/sessionStorage adapters under src/lib and src/utils."),
        ("Backend", "No server, API routes, controller layer, database schema, or server-side authentication in the repository."),
        ("Deployment", "Vercel SPA rewrite configuration; Vite production build output is expected to be deployed as static assets."),
        ("Testing", "Vitest + jsdom with local-auth coverage; no broad UI, integration, or end-to-end suite is present."),
    ], widths=[1.3, 5.7])

    doc.add_heading("Project and File Structure", level=1)
    add_para(doc, "The tree below excludes generated/vendor directories such as node_modules, .git, build output, and coverage. The inventory table that follows includes the repository files visible to the analysis and explains their role by area.")
    add_code(doc, tree_lines())

    doc.add_heading("Root Files and Configuration", level=2)
    root_rows = [
        ("package.json", "Dependencies and scripts: dev, build, build:dev, lint, preview, test, test:watch."),
        ("package-lock.json / bun.lockb", "Dependency lockfiles; keep the package manager choice consistent in CI."),
        ("index.html", "Vite document shell containing the root element."),
        ("vite.config.ts", "Vite server on port 8080, React SWC plugin, @ alias, HMR overlay disabled, source maps enabled."),
        ("tailwind.config.ts", "Tailwind scan paths plus Campuspreneur brand colors, Poppins typography, shadows, and animations."),
        ("postcss.config.js", "CSS transformation pipeline used by Tailwind."),
        ("eslint.config.js", "ESLint rules; current lint errors are described in the maintenance section."),
        ("vitest.config.ts", "jsdom test environment, setup file, source alias, and test glob."),
        ("vercel.json", "Catch-all rewrite to / for client-side routing on Vercel."),
        ("components.json", "UI generator metadata for the shadcn-style component setup."),
        ("README.md", "Product description and aspirational stack notes; it still mentions planned/integrated backend options that are not present in code."),
    ]
    add_table(doc, ["File", "Purpose"], root_rows, widths=[2.0, 5.0])

    doc.add_heading("Source Tree by Area", level=2)
    area_rows = [
        ("src/App.tsx and src/main.tsx", "Application composition, providers, route map, and root rendering."),
        ("src/pages", "Route-level screens: landing, onboarding, login/signup, marketplace, product, cart, orders, chat, profile, settings, password reset, and admin."),
        ("src/components/layout", "Persistent AppLayout, Navbar, and Footer shell."),
        ("src/components/dashboard", "Entrepreneur dashboard container, listing form/card, profile editor, and seller product/order screens."),
        ("src/components/common", "Badges, image processing/upload, splash screen, subscription modal, and other shared pieces."),
        ("src/components/ui", "Radix/shadcn-derived primitives: buttons, inputs, dialogs, tables, menus, charts, form controls, and feedback components."),
        ("src/components/map and marketplace", "MapPicker placeholder and CategoryFilter UI."),
        ("src/contexts", "AuthContext exposes the current session and auth operations to the component tree."),
        ("src/lib", "Local persistence and domain services for auth, products, cart, orders, chat, and class-name utilities."),
        ("src/utils", "User record persistence plus product/user storage helpers."),
        ("src/types", "Shared domain models, categories, and local product type."),
        ("src/hooks", "Reusable hooks such as mobile detection and toast access."),
        ("src/test", "Vitest setup and local authentication tests."),
        ("public", "Logo variants and favicon served as static assets."),
    ]
    add_table(doc, ["Folder or entry point", "Responsibility"], area_rows, widths=[2.1, 4.9])

    doc.add_heading("Complete Source File Inventory", level=2)
    files = []
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(ROOT)
        if any(part in {"node_modules", ".git", "dist", "build", "coverage", ".agents", ".codex"} for part in rel.parts):
            continue
        if rel.name in {OUT.name, Path(__file__).name}:
            continue
        files.append((str(rel).replace("\\", "/"), file_purpose(rel)))
    add_table(doc, ["Path", "What it does"], files, widths=[3.0, 4.0])

    doc.add_heading("Frontend Architecture", level=1)
    add_para(doc, "The frontend is a client-rendered React SPA. BrowserRouter owns navigation; AppLayout renders the persistent shell and an Outlet; AuthProvider loads the local session and exposes auth actions; App registers route elements and wraps protected screens with ProtectedRoute. Styling is utility-first Tailwind CSS with CSS variables in index.css/App.css and a shared visual language built around brand navy, brand orange, rounded cards, soft shadows, and responsive layouts.")
    doc.add_heading("Route and Screen Map", level=2)
    route_rows = [
        ("/", "Index", "Public landing page with product discovery and calls to action."),
        ("/get-started", "GetStarted", "Entry point for choosing customer or entrepreneur onboarding."),
        ("/login, /admin-login", "Login, AdminLogin", "Local credential login; admin login additionally checks role."),
        ("/signup/customer, /signup/entrepreneur", "SignupCustomer, SignupEntrepreneur", "Create local user records for the two main roles."),
        ("/forgot-password, /reset-password", "ForgotPassword, ResetPassword", "Local-only password recovery/reset flow."),
        ("/marketplace", "Marketplace", "Protected listing grid with text search."),
        ("/product/:id", "ProductViewPage", "Protected product detail, seller badge, share, add-to-cart, and chat action."),
        ("/cart", "CartPage", "Customer-only cart, quantity controls, and local order placement."),
        ("/chat, /chat-room", "InboxPage, ChatPage", "Protected local conversation list and direct messaging."),
        ("/profile", "ProfilePage", "Personal, campus, seller verification, identity, and payout fields."),
        ("/dashboard/entrepreneur/*", "EntrepreneurDashboard", "Seller home, add, list, edit, detail, and order screens."),
        ("/admin", "AdminPanel", "Admin-only moderation, user/listing/order/verification management."),
        ("*", "NotFound", "Fallback for unknown routes."),
    ]
    add_table(doc, ["Path", "Screen", "Behavior"], route_rows, widths=[2.0, 1.7, 3.3])
    doc.add_heading("State Management and Data Flow", level=2)
    add_bullets(doc, [
        "AuthContext owns the session object and delegates persistence to lib/auth.ts and utils/userStorage.ts. It refreshes on the custom campus-auth-change event and the browser storage event.",
        "Product, cart, order, and chat modules are functional adapters over localStorage. They dispatch domain-specific browser events such as campus-products-change, campus-cart-change, campus-orders-change, and campus-chat-change.",
        "Most pages load data in useEffect and hold it in local component state. InboxPage polls conversations every second because there is no realtime transport.",
        "ImageUploader converts selected files to resized JPEG data URLs in the browser. These base64 strings are stored in localStorage with records, which is convenient for demos but unsuitable for durable media at scale.",
        "The UI component library under src/components/ui is largely generated/reusable infrastructure. Business behavior sits primarily in pages, dashboard screens, and src/lib domain modules.",
    ])

    doc.add_heading("Backend and Data Architecture", level=1)
    add_para(doc, "There is no backend in the repository today. The closest equivalent is a set of client-side service modules that emulate repositories and business operations. No Express server, API route, controller, ORM, migration, database schema, secrets file, or server middleware is present. README.md lists Node.js/Express and Firebase/Supabase/MongoDB as planned or possible technologies, but those integrations are not implemented in this checkout.")
    doc.add_heading("Current Local Domain Services", level=2)
    service_rows = [
        ("utils/userStorage.ts + lib/auth.ts", "Users, roles, sessions, local admin bootstrap, signup/login/logout, profile and verification updates."),
        ("lib/products.ts", "Create, read, update, delete, seller filtering, and view/cart/sales counters for LocalProduct."),
        ("lib/cartStorage.ts", "Per-browser cart items and quantity changes; increments product cart-add counters."),
        ("lib/ordersStorage.ts", "Builds an order from cart items, increments sales, stores status, and lets sellers/admins update status."),
        ("lib/chatStorage.ts + lib/chat.ts", "Creates conversations, writes messages, marks messages read, soft-deletes messages, and summarizes inboxes."),
        ("lib/localStorage.ts", "Generic JSON read/write and ID generation helpers."),
    ]
    add_table(doc, ["Module", "Current responsibility"], service_rows, widths=[2.4, 4.6])
    doc.add_heading("Data Entities", level=2)
    add_bullets(doc, [
        "UserRecord: identity, role, password, campus/contact profile, seller verification fields, ID document data, and payout account fields.",
        "LocalProduct: owner, title, description, price, image data URL, category, and lightweight counters for views, cart additions, and sales.",
        "Order: customer snapshot, line items with seller snapshots, total, status, and creation time. One cart can contain products from multiple sellers, but status is stored for the whole order.",
        "Conversation and ChatMessage: two-party conversation identifiers, message content, sender/receiver, timestamps, read state, and soft deletion.",
        "Shared types/index.ts also defines a more relational-looking User, BusinessProfile, Listing, ChatMessage, Conversation, and Category model set. The active local implementation instead uses the types in types/local.ts and utils/userStorage.ts, so there is some model duplication to resolve during backend design.",
    ])

    doc.add_heading("Code Quality and Maintenance Findings", level=1)
    add_para(doc, "The codebase is a workable prototype with clear feature slices, but it is not production-ready. The most important findings are below, ordered by risk and leverage.")
    risk_rows = [
        ("Critical", "Plaintext credentials and secrets in localStorage", "UserRecord stores password directly; the bootstrap admin is admin@campusprenuer.local / admin123; admin deletion rechecks the plaintext password in the browser. Anyone with browser storage access can read or alter all accounts and role flags.", "Move auth and authorization to a server; hash passwords; rotate demo credentials; remove the local admin from production builds."),
        ("Critical", "Client-side authorization only", "ProtectedRoute, role checks, and admin actions can be bypassed by editing localStorage or calling client modules directly.", "Enforce authorization on API endpoints and treat the browser only as an untrusted client."),
        ("High", "No durable backend or database", "Data is device-local, is lost on browser reset, cannot be shared across users/devices, and has no transactions or concurrency control.", "Introduce API, database schema/migrations, server validation, and repository interfaces behind current lib modules."),
        ("High", "Sensitive identity and payout data stored in browser", "NIN/student ID numbers, ID images, bank name, account number, and account name are captured and serialized to localStorage.", "Do not store regulated/sensitive data in localStorage; encrypt at rest, restrict access, define retention, and use a secure document store."),
        ("High", "Media stored as base64 in localStorage", "Images increase storage pressure and slow reads; browser quotas will be reached quickly and data is not backed up.", "Use object storage with signed upload URLs, server-side validation, size limits, and CDN delivery."),
        ("Medium", "Checkout lacks payment and inventory guarantees", "placeOrderFromCart immediately increments sales before a durable transaction or payment confirmation; products have no stock/availability enforcement.", "Add inventory semantics, idempotent checkout, payment provider integration, order/payment state machines, and server transactions."),
        ("Medium", "Placeholder integrations", "MapPicker and location filtering explicitly require Google Maps/API work; ListingForm and profile map preview mention future storage/API connections.", "Choose and integrate a map/geocoding provider or remove the incomplete controls until ready."),
        ("Medium", "Model duplication and route drift", "types/index.ts contains models that do not match the active LocalProduct/UserRecord storage model; unused/parallel screens such as Orders, Cart, ProductView, and older dashboard components increase maintenance cost.", "Consolidate types and remove or mark legacy paths after confirming route usage."),
        ("Medium", "Quality gates currently fail", "ESLint reports 40 problems: 28 errors and 12 warnings, including many explicit any uses, no-empty-object-type errors, hook dependency warnings, fast-refresh warnings, and a require import in tailwind.config.ts.", "Fix lint errors first, then tighten CI to run lint, build, and tests on every change."),
        ("Medium", "Build/test validation is not currently green in this environment", "Vite/Vitest startup reports access denied while resolving the config directory in the managed sandbox. This is an environment/tooling failure to reproduce outside the sandbox, not proof that application compilation is clean.", "Re-run in normal developer/CI environment; if reproducible, inspect path permissions, symlinks, and toolchain versions."),
        ("Low", "Browserslist data is stale", "The build output warns that caniuse-lite is about 15 months old.", "Update browserslist data as part of dependency maintenance."),
    ]
    add_table(doc, ["Priority", "Finding", "Evidence / impact", "Recommended action"], risk_rows, widths=[0.75, 1.55, 2.6, 2.1])

    doc.add_heading("Security and Performance Guidance", level=1)
    add_bullets(doc, [
        "Authentication: use an established identity provider or a server-side session/JWT design with secure, httpOnly cookies; never compare or persist plaintext passwords in the client.",
        "Authorization: implement server-side role and ownership checks for every user, product, order, verification, and chat operation. Never trust owner_id, role, price, or totals supplied by the browser.",
        "Input and file validation: validate title, price, quantities, category, message length, MIME type, image dimensions, and payload size on the server as well as the client.",
        "Privacy: treat identity documents and bank information as sensitive data. Define who can view them, how long they are kept, and how deletion/export requests work.",
        "Orders: calculate totals from authoritative product data, make checkout idempotent, record payment state separately from fulfillment state, and prevent duplicate submissions.",
        "Performance: replace base64 localStorage images with object storage/CDN URLs; use paginated/searchable product APIs; avoid the one-second inbox poll once realtime or push notifications are available.",
        "Observability: add structured server logs, error tracking, audit events for admin actions and verification decisions, and health checks for deployed services.",
    ])

    doc.add_heading("Team Onboarding and Workflow", level=1)
    doc.add_heading("Local setup", level=2)
    add_bullets(doc, [
        "Use Node.js compatible with the repository toolchain and install from package-lock.json with npm ci. The package also contains bun.lockb; choose one lockfile/package manager for CI and document it.",
        "Run npm run dev to start Vite on port 8080. The @ alias maps to src. Run npm run preview after a production build.",
        "Run npm run lint and npm test during development. Vitest uses jsdom and src/test/setup.ts; local-auth.test.ts exercises signup and the seeded admin account.",
        "The local demo admin is seeded automatically by getCurrentUser/loginUser/signUpUser when no admin exists. This is useful for demos only and must not be treated as deployment configuration.",
        "There is no .env.example in the current tree. Do not add secrets to source; when integrations are introduced, document required VITE_* public variables separately from server-only secrets.",
    ])
    doc.add_heading("Development conventions", level=2)
    add_bullets(doc, [
        "Keep route-level orchestration in pages and domain operations in lib modules. Prefer typed domain models over any and avoid direct localStorage access outside storage adapters.",
        "When replacing local persistence, preserve the service function shapes where practical so pages can migrate incrementally from local adapters to API clients.",
        "Add tests for each new domain transition and permission boundary. For checkout and admin actions, include failure, retry, and unauthorized cases.",
        "Keep user-facing copy and role terminology consistent: customer/buyer, entrepreneur/seller, and admin. Remove stale duplicate screens after confirming navigation and imports.",
    ])
    doc.add_heading("Deployment notes", level=2)
    add_bullets(doc, [
        "Vercel is configured as a static SPA host with a catch-all rewrite. This supports browser refreshes on client routes but does not provide an API or persistent database.",
        "Before production launch, deploy the API/database separately or add them to the hosting architecture; configure CORS, TLS, secure cookies, rate limiting, backups, and monitoring.",
        "The current build enables source maps. Decide whether production source maps should be public or uploaded privately to an error-monitoring service.",
    ])

    doc.add_heading("Recommended Delivery Roadmap", level=1)
    roadmap_rows = [
        ("1. Stabilize the prototype", "Fix the 28 ESLint errors; consolidate duplicate models/screens; make build and tests reproducibly green in CI; add a real .env.example only when needed."),
        ("2. Establish the backend boundary", "Create API contracts for auth, users, businesses, products, orders, chat, and verification. Add database migrations and server-side validation/authorization."),
        ("3. Migrate persistence", "Implement API clients behind the existing lib function shapes; move images to object storage; migrate seeded/demo data deliberately."),
        ("4. Harden commerce", "Add payment provider, inventory/availability, order state machine, idempotency, seller notifications, refunds/cancellations, and audit trails."),
        ("5. Complete campus discovery", "Integrate maps/geocoding, campus-aware search/filtering, delivery/pickup rules, and seller location privacy controls."),
        ("6. Expand verification and operations", "Secure document review workflow, admin audit logs, moderation queues, reporting, analytics, backups, and incident response."),
    ]
    add_table(doc, ["Phase", "Outcome"], roadmap_rows, widths=[2.0, 5.0])

    doc.add_heading("Appendix Testing Evidence", level=1)
    add_para(doc, "The following checks were attempted against the current checkout on 19 September 2026:")
    add_table(doc, ["Check", "Observed result"], [
        ("npm run lint", "Fails: 40 problems (28 errors, 12 warnings). Primary error families are explicit any, empty interfaces, hook dependency issues, fast-refresh export warnings, and require() in tailwind.config.ts."),
        ("npm test", "Startup fails in the managed sandbox while esbuild cannot read a parent directory and cannot resolve vitest.config.ts; exit code 1."),
        ("npm run build", "Startup fails in the managed sandbox with the same access-denied/config-resolution error; exit code 1."),
        ("Repository inspection", "No backend server, API route, database schema, migration, environment template, payment integration, map SDK, or object-storage integration found in the tracked project tree."),
    ], widths=[1.7, 5.3])
    add_para(doc, "This report distinguishes implemented behavior from planned or placeholder behavior so the team can use it as an onboarding reference and a migration checklist.")

    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
