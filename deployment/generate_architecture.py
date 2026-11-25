"""Refresh PROJECT_ARCHITECTURE.md from the checked-out repository tree."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "node_modules"}


def included(path: Path) -> bool:
    return not any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts)


def tree_lines(folder: Path, prefix: str = "") -> list[str]:
    children = sorted(
        (item for item in folder.iterdir() if item.name not in SKIP_DIRS),
        key=lambda item: (not item.is_dir(), item.name.casefold()),
    )
    result: list[str] = []
    for index, item in enumerate(children):
        last = index == len(children) - 1
        result.append(prefix + ("└── " if last else "├── ") + item.name + ("/" if item.is_dir() else ""))
        if item.is_dir():
            result.extend(tree_lines(item, prefix + ("    " if last else "│   ")))
    return result


def folder_purpose(path: str) -> str:
    known = {
        ".": "Repository root: Vite entry/configuration, documentation, and the frontend, backend, and deployment areas.",
        "frontend": "Vite/React application and static assets.",
        "frontend/src": "React routes, components, context, hooks, frontend helpers, and types.",
        "frontend/public": "Static assets served from the site root.",
        "backend": "Supabase client, browser data services, migration location, and database guidance.",
        "backend/services": "Supabase-backed query and storage service operations imported by the frontend.",
        "backend/supabase": "Supabase client and reserved location for CLI config or Edge Functions.",
        "backend/sql": "Location for ordered SQL migrations and reviewed database scripts.",
        "backend/docs": "Database schema and RLS implementation notes.",
        "deployment": "Safe environment template, deployment instructions, and architecture guide generator.",
        "docs": "Project handover and supporting documentation.",
        "design-system": "Design system reference material.",
        "dist": "Generated Vite production output; recreate with npm run build.",
        "_docx_render": "Temporary document-rendering workspace.",
    }
    if path in known:
        return known[path]
    if path.startswith("frontend/src/pages/"):
        return "Route-level React page components."
    if "/components/ui/" in path:
        return "Reusable accessible UI primitives."
    if "/components/" in path:
        return "Shared or feature-specific React components."
    if "/contexts/" in path or "/context/" in path:
        return "React providers for shared application state."
    if "/hooks/" in path:
        return "Reusable React hooks."
    if "/types/" in path:
        return "Shared TypeScript record and application types."
    if "/utils/" in path:
        return "Frontend formatting, storage, or compatibility utilities."
    if "/lib/" in path:
        return "Frontend helper and compatibility entry points."
    if "/test/" in path:
        return "Automated test and test setup support."
    return "Supporting project folder; see its file entries below."


def file_purpose(path: str) -> str:
    name = Path(path).name
    if path == "PROJECT_ARCHITECTURE.md":
        return "Complete repository tree and file-by-file guide."
    if path == "README.md":
        return "Project introduction and contributor entry point."
    if path == "package.json":
        return "NPM scripts and dependency manifest."
    if path == "package-lock.json":
        return "Pinned npm dependency graph for repeatable installation."
    if path == "vite.config.ts":
        return "Vite dev server, aliases, static public directory, and build settings."
    if path.startswith("tsconfig"):
        return "TypeScript compiler settings, aliases, project references, and source scope."
    if name.startswith("tailwind.config"):
        return "Tailwind source scanning paths, theme tokens, and plugins."
    if name.startswith("postcss.config"):
        return "PostCSS processing plugins."
    if path == "index.html":
        return "HTML shell, metadata, and React entry script."
    if path == "vercel.json":
        return "Vercel SPA route rewrite."
    if path == "vitest.config.ts":
        return "Vitest environment, test discovery, aliases, and setup file."
    if path == "components.json":
        return "shadcn/ui generator paths and component aliases."
    if path == "eslint.config.js":
        return "ESLint rules for JavaScript, TypeScript, and React."
    if path == ".gitignore":
        return "Git exclusions for local values, dependencies, and generated output."
    if path.endswith(".env.local"):
        return "Local environment file ignored by Git; values are intentionally not read into this guide."
    if path.endswith(".env.example"):
        return "Blank public Vite environment variable template with no credentials."
    if path.endswith("DEPLOY_GUIDE.md"):
        return "Vercel and Supabase production checklist."
    if path.endswith("DATABASE_AND_RLS.md"):
        return "Database source-of-truth, access ownership, and RLS guidance."
    if path.endswith(".pdf"):
        return "Project handover material."
    if path.endswith(".docx"):
        return "Source project brief retained for reference."
    if path.endswith(".py"):
        return "Python helper for generating project documentation."
    if path.startswith("dist/"):
        return "Generated production build artifact; recreate with npm run build."
    if path.startswith("frontend/public/"):
        return "Static asset served from the site root without module processing."
    if path == "frontend/src/main.tsx":
        return "Bootstraps React, global styling, and the application root."
    if path == "frontend/src/App.tsx":
        return "Application route tree and page composition."
    if path == "frontend/src/index.css":
        return "Global styles, Tailwind layers, and design tokens."
    if path == "backend/supabase/client.ts":
        return "Creates the browser Supabase client from public Vite environment values."
    if path.startswith("backend/services/"):
        return "Supabase data or storage service used by frontend features."
    if path.endswith("README.md"):
        return "Purpose and conventions for the surrounding project area."
    if path.endswith(".tsx"):
        if "/pages/" in path:
            return "Route-level React page component."
        if "/components/ui/" in path:
            return "Reusable UI primitive component."
        if "/components/" in path:
            return "Reusable or feature-specific React component."
        if "/context" in path:
            return "React context/provider for shared application state."
        if "/hooks/" in path:
            return "Reusable React hook."
        return "React and TypeScript application module."
    if path.endswith(".ts") or path.endswith(".js"):
        if "/types/" in path:
            return "Shared TypeScript data and application types."
        if "/utils/" in path:
            return "Reusable application utility."
        if "/hooks/" in path:
            return "Reusable React hook or hook support."
        return "Application or tooling module; see exports and imports below."
    if path.endswith(".css"):
        return "Application or generated stylesheet."
    if path.endswith((".png", ".jpg", ".jpeg", ".webp", ".ico", ".svg")):
        return "Image or icon asset."
    if path.endswith(".json"):
        return "Project configuration or generated metadata."
    if path.endswith(".lockb"):
        return "Bun dependency lockfile retained from the repository tooling."
    return "Repository support file."


def module_details(path: Path) -> tuple[str, str]:
    relative = path.relative_to(ROOT).as_posix()
    if relative.startswith("dist/") or relative.endswith((".png", ".jpg", ".jpeg", ".webp", ".ico", ".pdf", ".docx", ".lockb")) or relative.endswith(".env.local"):
        return "Generated, binary, or local-only file; no source exports.", "Not applicable."
    try:
        source = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return "Binary or generated file; no source exports.", "Not applicable."
    exports: list[str] = []
    imports: list[str] = []
    for line in source.splitlines():
        stripped = line.strip()
        if re.match(r"export\s+(default\s+)?(async\s+)?(function|const|class|type|interface|enum)", stripped):
            exports.append(stripped[:90])
        elif stripped.startswith("export {"):
            exports.append(stripped[:90])
        match = re.search(r"\bfrom\s+[\"']([^\"']+)", stripped)
        if match:
            imports.append(match.group(1))
        elif stripped.startswith("import "):
            match = re.search(r"[\"']([^\"']+)[\"']", stripped)
            if match:
                imports.append(match.group(1))
    export_summary = "; ".join(dict.fromkeys(exports[:3])) or "Module-level configuration or no named exports."
    unique_imports = list(dict.fromkeys(imports))
    connection_summary = ", ".join(unique_imports[:4]) or "No direct module imports detected."
    if len(unique_imports) > 4:
        connection_summary += f" (and {len(unique_imports) - 4} more imports)"
    return export_summary, connection_summary


def main() -> None:
    files = sorted((p for p in ROOT.rglob("*") if p.is_file() and included(p)), key=lambda p: p.relative_to(ROOT).as_posix().casefold())
    folders = sorted((p for p in ROOT.rglob("*") if p.is_dir() and included(p)), key=lambda p: (len(p.relative_to(ROOT).parts), p.relative_to(ROOT).as_posix().casefold()))
    lines = [
        "# Campuspreneur Project Architecture", "",
        "> Repository inventory generated from the working tree. `dist/` is generated build output. `.env.local` values are never read or reproduced.", "",
        "## Visual folder tree", "", "```text", "campuspreneur-marketplace/", *tree_lines(ROOT), "```", "",
        "## Architecture overview", "",
        "- `frontend/` contains the Vite/React application and static assets.",
        "- `backend/` contains the Supabase browser client, query/storage services, and database migration/documentation locations. This repository currently has no separate server process or committed SQL migrations.",
        "- `deployment/` contains the blank environment template, deployment checklist, and this guide's generator. Root tool and Vercel configuration files stay at the repository root and point into these folders.",
        "- Frontend code uses the `@/` alias. Backend modules use `@backend/`. Compatibility re-exports remain under `frontend/src/lib/` for older imports.", "",
        "## Folder-by-folder and file-by-file reference", "",
    ]
    for folder in [ROOT, *folders]:
        rel = "." if folder == ROOT else folder.relative_to(ROOT).as_posix()
        lines.extend([f"### `{rel}/`", "", folder_purpose(rel), ""])
        direct_files = sorted((p for p in files if p.parent == folder), key=lambda p: p.name.casefold())
        if not direct_files:
            lines.extend(["No files are present directly in this folder.", ""])
            continue
        lines.extend(["| File | Purpose | Key exports / logic | Connections |", "|---|---|---|---|"])
        for path in direct_files:
            rel_file = path.relative_to(ROOT).as_posix()
            exports, connections = module_details(path)
            values = [path.name, file_purpose(rel_file), exports, connections]
            values = [value.replace("|", "\\|").replace("`", "\\`").replace("\n", " ") for value in values]
            lines.append(f"| `{values[0]}` | {values[1]} | {values[2]} | {values[3]} |")
        lines.append("")
    lines.extend([
        "## Everyday workflow cheatsheet", "",
        "- **Add a page:** create a component in `frontend/src/pages/`, connect its route in `frontend/src/App.tsx`, and compose shared UI from `frontend/src/components/`.",
        "- **Change a Supabase query:** update its module in `backend/services/`, verify the live schema and RLS, or add an ordered migration under `backend/sql/`. Frontend compatibility re-exports are in `frontend/src/lib/`.",
        "- **Change Supabase setup:** update `backend/supabase/client.ts`; configure public values locally and in Vercel using `deployment/.env.example` as the key list.",
        "- **Change static assets:** place files in `frontend/public/` and reference them from the site root, such as `/logo-icon.png`.",
        "- **Deploy:** keep Vercel's project root at the repository root, run `npm ci` and `npm run build`, then follow `deployment/DEPLOY_GUIDE.md`.",
        "- **Check types:** run `npx tsc --noEmit -p tsconfig.app.json`.", "",
        "## Maintenance notes", "",
        "- `backend/services/` is bundled into the browser because it uses the Supabase JavaScript client. Use publishable/anon credentials only and rely on RLS.",
        "- `.env.local` is ignored by Git. Never copy its values into docs or source, and never expose a service-role key through a `VITE_` variable.",
        "- Rebuild `dist/` with Vite; do not edit generated files by hand.", "",
    ])
    (ROOT / "PROJECT_ARCHITECTURE.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"Documented {len(files)} files across {len(folders) + 1} folders.")


if __name__ == "__main__":
    main()
