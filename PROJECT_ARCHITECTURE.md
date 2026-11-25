# Campuspreneur Project Architecture

> Repository inventory generated from the working tree. `dist/` is generated build output. `.env.local` values are never read or reproduced.

## Visual folder tree

```text
campuspreneur-marketplace/
├── _docx_render/
├── backend/
│   ├── docs/
│   │   └── DATABASE_AND_RLS.md
│   ├── services/
│   │   ├── chat.ts
│   │   ├── productImages.ts
│   │   ├── products.ts
│   │   └── sellerOrders.ts
│   ├── sql/
│   │   └── README.md
│   └── supabase/
│       ├── client.ts
│       └── README.md
├── deployment/
│   ├── .env.example
│   ├── DEPLOY_GUIDE.md
│   └── generate_architecture.py
├── design-system/
│   └── campuspreneur/
│       ├── pages/
│       └── MASTER.md
├── dist/
│   ├── assets/
│   │   ├── index-CuWuXUBN.css
│   │   ├── index-N6pLGqk4.js
│   │   └── index-N6pLGqk4.js.map
│   ├── favicon.ico
│   ├── index.html
│   ├── logo-full.png
│   ├── logo-horizontal.png
│   ├── logo-icon.png
│   └── logo.png
├── docs/
│   ├── CAMPUSPRENEUR_DEVELOPMENT_TEAM_HANDOVER.pdf
│   └── generate_handover.py
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo-full.png
│   │   ├── logo-horizontal.png
│   │   ├── logo-icon.png
│   │   └── logo.png
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   │   └── AdminTools.tsx
│       │   ├── auth/
│       │   │   └── AccountRedirect.tsx
│       │   ├── chat/
│       │   │   └── ChatWindow.tsx
│       │   ├── common/
│       │   │   ├── Badges.tsx
│       │   │   ├── ImageUploader.tsx
│       │   │   ├── MaiduguriAreaField.tsx
│       │   │   ├── SplashScreen.tsx
│       │   │   ├── SubscriptionModal.tsx
│       │   │   └── UserAvatar.tsx
│       │   ├── dashboard/
│       │   │   ├── entrepreneur/
│       │   │   │   ├── AddProduct.tsx
│       │   │   │   ├── DashboardHome.tsx
│       │   │   │   ├── EditProduct.tsx
│       │   │   │   ├── MyProducts.tsx
│       │   │   │   ├── Orders.tsx
│       │   │   │   ├── ProductDetail.tsx
│       │   │   │   ├── ProductForm.tsx
│       │   │   │   └── VendorStorePanel.tsx
│       │   │   ├── EntrepreneurDashboard.tsx
│       │   │   ├── ListingCard.tsx
│       │   │   ├── ListingForm.tsx
│       │   │   └── ProfileEditor.tsx
│       │   ├── layout/
│       │   │   ├── AppLayout.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── Navbar.tsx
│       │   ├── map/
│       │   │   └── MapPicker.tsx
│       │   ├── marketplace/
│       │   │   └── CategoryFilter.tsx
│       │   ├── theme/
│       │   ├── ui/
│       │   │   ├── accordion.tsx
│       │   │   ├── alert-dialog.tsx
│       │   │   ├── alert.tsx
│       │   │   ├── aspect-ratio.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── breadcrumb.tsx
│       │   │   ├── button.tsx
│       │   │   ├── calendar.tsx
│       │   │   ├── card.tsx
│       │   │   ├── carousel.tsx
│       │   │   ├── chart.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── collapsible.tsx
│       │   │   ├── command.tsx
│       │   │   ├── context-menu.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── drawer.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── form.tsx
│       │   │   ├── hover-card.tsx
│       │   │   ├── input-otp.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── LoadingButton.tsx
│       │   │   ├── menubar.tsx
│       │   │   ├── navigation-menu.tsx
│       │   │   ├── pagination.tsx
│       │   │   ├── popover.tsx
│       │   │   ├── progress.tsx
│       │   │   ├── radio-group.tsx
│       │   │   ├── resizable.tsx
│       │   │   ├── scroll-area.tsx
│       │   │   ├── select.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── sheet.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── skeleton.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── sonner.tsx
│       │   │   ├── switch.tsx
│       │   │   ├── table.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── toast.tsx
│       │   │   ├── toaster.tsx
│       │   │   ├── toggle-group.tsx
│       │   │   ├── toggle.tsx
│       │   │   ├── tooltip.tsx
│       │   │   └── use-toast.ts
│       │   ├── AppLayout.tsx
│       │   ├── Loader.tsx
│       │   ├── Navbar.tsx
│       │   ├── NavLink.tsx
│       │   ├── ProtectedRoute.tsx
│       │   └── RequireAuth.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   └── UnreadMessagesContext.tsx
│       ├── hooks/
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── auth.ts
│       │   ├── authVerification.ts
│       │   ├── cartStorage.ts
│       │   ├── chat.ts
│       │   ├── chatStorage.ts
│       │   ├── cloudinary.ts
│       │   ├── localStorage.ts
│       │   ├── ordersStorage.ts
│       │   ├── productImages.ts
│       │   ├── products.ts
│       │   ├── sellerOrders.ts
│       │   ├── supabase.ts
│       │   └── utils.ts
│       ├── pages/
│       │   ├── AdminLogin.tsx
│       │   ├── AdminPanel.tsx
│       │   ├── Cart.tsx
│       │   ├── CartPage.tsx
│       │   ├── ChatPage.tsx
│       │   ├── ForgotPassword.tsx
│       │   ├── GetStarted.tsx
│       │   ├── InboxPage.tsx
│       │   ├── Index.tsx
│       │   ├── Login.tsx
│       │   ├── LoginHub.tsx
│       │   ├── Marketplace.tsx
│       │   ├── NotFound.tsx
│       │   ├── Orders.tsx
│       │   ├── ProductView.tsx
│       │   ├── ProductViewPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── ResetPassword.tsx
│       │   ├── Settings.tsx
│       │   ├── SignupCustomer.tsx
│       │   ├── SignupEntrepreneur.tsx
│       │   ├── StorefrontPage.tsx
│       │   └── UpdatePassword.tsx
│       ├── test/
│       │   ├── example.test.ts
│       │   ├── local-auth.test.ts
│       │   └── setup.ts
│       ├── types/
│       │   ├── index.ts
│       │   ├── local.ts
│       │   ├── product.ts
│       │   └── vendor.ts
│       ├── utils/
│       │   ├── productStorage.ts
│       │   └── userStorage.ts
│       ├── App.css
│       ├── App.tsx
│       ├── auth.ts
│       ├── index.css
│       ├── main.tsx
│       └── vite-env.d.ts
├── .env.local
├── .gitignore
├── _generate_campuspreneur_docs.py
├── bun.lockb
├── campusprenuer detailed.docx
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── PROJECT_ARCHITECTURE.md
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```

## Architecture overview

- `frontend/` contains the Vite/React application and static assets.
- `backend/` contains the Supabase browser client, query/storage services, and database migration/documentation locations. This repository currently has no separate server process or committed SQL migrations.
- `deployment/` contains the blank environment template, deployment checklist, and this guide's generator. Root tool and Vercel configuration files stay at the repository root and point into these folders.
- Frontend code uses the `@/` alias. Backend modules use `@backend/`. Compatibility re-exports remain under `frontend/src/lib/` for older imports.

## Folder-by-folder and file-by-file reference

### `./`

Repository root: Vite entry/configuration, documentation, and the frontend, backend, and deployment areas.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `.env.local` | Local environment file ignored by Git; values are intentionally not read into this guide. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `.gitignore` | Git exclusions for local values, dependencies, and generated output. | Module-level configuration or no named exports. | No direct module imports detected. |
| `_generate_campuspreneur_docs.py` | Python helper for generating project documentation. | Module-level configuration or no named exports. | No direct module imports detected. |
| `bun.lockb` | Bun dependency lockfile retained from the repository tooling. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `campusprenuer detailed.docx` | Source project brief retained for reference. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `components.json` | shadcn/ui generator paths and component aliases. | Module-level configuration or no named exports. | No direct module imports detected. |
| `eslint.config.js` | ESLint rules for JavaScript, TypeScript, and React. | Module-level configuration or no named exports. | @eslint/js, globals, eslint-plugin-react-hooks, eslint-plugin-react-refresh (and 1 more imports) |
| `index.html` | HTML shell, metadata, and React entry script. | Module-level configuration or no named exports. | No direct module imports detected. |
| `package-lock.json` | Pinned npm dependency graph for repeatable installation. | Module-level configuration or no named exports. | No direct module imports detected. |
| `package.json` | NPM scripts and dependency manifest. | Module-level configuration or no named exports. | No direct module imports detected. |
| `postcss.config.js` | PostCSS processing plugins. | Module-level configuration or no named exports. | No direct module imports detected. |
| `PROJECT_ARCHITECTURE.md` | Complete repository tree and file-by-file guide. | Module-level configuration or no named exports. | @/lib/auth, ./layout/AppLayout, @/components/layout/Navbar, @backend/supabase/client (and 4 more imports) |
| `README.md` | Project introduction and contributor entry point. | Module-level configuration or no named exports. | No direct module imports detected. |
| `tailwind.config.ts` | Tailwind source scanning paths, theme tokens, and plugins. | Module-level configuration or no named exports. | tailwindcss, tailwindcss-animate |
| `tsconfig.app.json` | TypeScript compiler settings, aliases, project references, and source scope. | Module-level configuration or no named exports. | No direct module imports detected. |
| `tsconfig.json` | TypeScript compiler settings, aliases, project references, and source scope. | Module-level configuration or no named exports. | No direct module imports detected. |
| `tsconfig.node.json` | TypeScript compiler settings, aliases, project references, and source scope. | Module-level configuration or no named exports. | No direct module imports detected. |
| `vercel.json` | Vercel SPA route rewrite. | Module-level configuration or no named exports. | No direct module imports detected. |
| `vite.config.ts` | Vite dev server, aliases, static public directory, and build settings. | Module-level configuration or no named exports. | vite, @vitejs/plugin-react-swc, path, lovable-tagger |
| `vitest.config.ts` | Vitest environment, test discovery, aliases, and setup file. | Module-level configuration or no named exports. | vitest/config, @vitejs/plugin-react-swc, path |

### `_docx_render/`

Temporary document-rendering workspace.

No files are present directly in this folder.

### `backend/`

Supabase client, browser data services, migration location, and database guidance.

No files are present directly in this folder.

### `deployment/`

Safe environment template, deployment instructions, and architecture guide generator.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `.env.example` | Blank public Vite environment variable template with no credentials. | Module-level configuration or no named exports. | No direct module imports detected. |
| `DEPLOY_GUIDE.md` | Vercel and Supabase production checklist. | Module-level configuration or no named exports. | No direct module imports detected. |
| `generate_architecture.py` | Python helper for generating project documentation. | Module-level configuration or no named exports. | No direct module imports detected. |

### `design-system/`

Design system reference material.

No files are present directly in this folder.

### `dist/`

Generated Vite production output; recreate with npm run build.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `favicon.ico` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `index.html` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-full.png` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-horizontal.png` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-icon.png` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo.png` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |

### `docs/`

Project handover and supporting documentation.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `CAMPUSPRENEUR_DEVELOPMENT_TEAM_HANDOVER.pdf` | Project handover material. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `generate_handover.py` | Python helper for generating project documentation. | Module-level configuration or no named exports. | No direct module imports detected. |

### `frontend/`

Vite/React application and static assets.

No files are present directly in this folder.

### `backend/docs/`

Database schema and RLS implementation notes.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `DATABASE_AND_RLS.md` | Database source-of-truth, access ownership, and RLS guidance. | Module-level configuration or no named exports. | No direct module imports detected. |

### `backend/services/`

Supabase-backed query and storage service operations imported by the frontend.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `chat.ts` | Supabase data or storage service used by frontend features. | export interface ChatParticipant {; export interface ChatConversation {; export interface ChatMessage { | @backend/supabase/client |
| `productImages.ts` | Supabase data or storage service used by frontend features. | export const PRODUCT_IMAGE_BUCKET = "product-images";; export async function uploadProductImage(userId: string, file: File) {; export async function removeProductImage(path: string) { | @backend/supabase/client |
| `products.ts` | Supabase data or storage service used by frontend features. | export const productSelect = "id, vendor_id, title, slug, category_id, description, price_; export function normalizeProduct(row: Record<string, unknown>, seller?: ProductRecord["sel; export async function fetchPublishedProductRecords(): Promise<ProductRecord[]> { | @backend/supabase/client, @/types/local, @/types/product |
| `sellerOrders.ts` | Supabase data or storage service used by frontend features. | export type SellerOrderStatus = "pending" \| "confirmed" \| "processing" \| "out_for_delivery; export type SellerOrderItem = { id: string; order_id: string; product_id: string; quantity; export type SellerOrder = { id: string; buyer_id: string; status: SellerOrderStatus; total | @backend/supabase/client |

### `backend/sql/`

Location for ordered SQL migrations and reviewed database scripts.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `README.md` | Purpose and conventions for the surrounding project area. | Module-level configuration or no named exports. | No direct module imports detected. |

### `backend/supabase/`

Supabase client and reserved location for CLI config or Edge Functions.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `client.ts` | Creates the browser Supabase client from public Vite environment values. | export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);; export const supabase = createClient(clientUrl, clientKey); | @supabase/supabase-js |
| `README.md` | Purpose and conventions for the surrounding project area. | Module-level configuration or no named exports. | No direct module imports detected. |

### `design-system/campuspreneur/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `MASTER.md` | Repository support file. | Module-level configuration or no named exports. | No direct module imports detected. |

### `dist/assets/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `index-CuWuXUBN.css` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `index-N6pLGqk4.js` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `index-N6pLGqk4.js.map` | Generated production build artifact; recreate with npm run build. | Generated, binary, or local-only file; no source exports. | Not applicable. |

### `frontend/public/`

Static assets served from the site root.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `favicon.ico` | Static asset served from the site root without module processing. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-full.png` | Static asset served from the site root without module processing. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-horizontal.png` | Static asset served from the site root without module processing. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo-icon.png` | Static asset served from the site root without module processing. | Generated, binary, or local-only file; no source exports. | Not applicable. |
| `logo.png` | Static asset served from the site root without module processing. | Generated, binary, or local-only file; no source exports. | Not applicable. |

### `frontend/src/`

React routes, components, context, hooks, frontend helpers, and types.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `App.css` | Application or generated stylesheet. | Module-level configuration or no named exports. | No direct module imports detected. |
| `App.tsx` | Application route tree and page composition. | export default function App() { | react-router-dom, @/components/layout/AppLayout, @/components/ProtectedRoute, @/pages/Index (and 26 more imports) |
| `auth.ts` | Application or tooling module; see exports and imports below. | export { getCurrentUser, loginUser, logoutUser, signUpUser } from "@/lib/auth"; | @/lib/auth |
| `index.css` | Global styles, Tailwind layers, and design tokens. | Module-level configuration or no named exports. | No direct module imports detected. |
| `main.tsx` | Bootstraps React, global styling, and the application root. | Module-level configuration or no named exports. | react-dom/client, react-router-dom, sonner, ./App (and 3 more imports) |
| `vite-env.d.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | No direct module imports detected. |

### `design-system/campuspreneur/pages/`

Supporting project folder; see its file entries below.

No files are present directly in this folder.

### `frontend/src/components/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AppLayout.tsx` | Reusable or feature-specific React component. | export { default } from "./layout/AppLayout"; | ./layout/AppLayout |
| `Loader.tsx` | Reusable or feature-specific React component. | export default function Loader() { | No direct module imports detected. |
| `Navbar.tsx` | Reusable or feature-specific React component. | export { default } from "@/components/layout/Navbar"; | @/components/layout/Navbar |
| `NavLink.tsx` | Reusable or feature-specific React component. | export { NavLink }; | react-router-dom, react, @/lib/utils |
| `ProtectedRoute.tsx` | Reusable or feature-specific React component. | export default function ProtectedRoute({ | react-router-dom, react, @/contexts/AuthContext |
| `RequireAuth.tsx` | Reusable or feature-specific React component. | export default function RequireAuth({ allow }: { allow?: Role[] }) { | react-router-dom, @/contexts/AuthContext |

### `frontend/src/context/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AuthContext.tsx` | React context/provider for shared application state. | export type Role = "entrepreneur" \| "customer" \| "admin";; export interface UserProfile {; export interface VendorStore { | react, @supabase/supabase-js, @backend/supabase/client, @/lib/authVerification |

### `frontend/src/contexts/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AuthContext.tsx` | React context/provider for shared application state. | Module-level configuration or no named exports. | @/context/AuthContext |
| `UnreadMessagesContext.tsx` | React context/provider for shared application state. | export function UnreadMessagesProvider({ children }: { children: ReactNode }) {; export function useUnreadMessages() { | react, react-router-dom, sonner, @/contexts/AuthContext (and 2 more imports) |

### `frontend/src/hooks/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `use-mobile.tsx` | Reusable React hook. | export function useIsMobile() { | react |
| `use-toast.ts` | Reusable React hook or hook support. | export const reducer = (state: State, action: Action): State => {; export { useToast, toast }; | react, @/components/ui/toast |

### `frontend/src/lib/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `auth.ts` | Application or tooling module; see exports and imports below. | export type SignupData = Omit<UserRecord, "id" \| "createdAt">;; export async function signUpUser(data: SignupData) {; export async function loginUser(email: string, password: string) { | @/utils/userStorage |
| `authVerification.ts` | Application or tooling module; see exports and imports below. | export const PENDING_EMAIL_VERIFICATION_KEY = "campuspreneur_pending_email_verification";; export function markEmailVerificationPending() {; export function isEmailVerificationPending() { | No direct module imports detected. |
| `cartStorage.ts` | Application or tooling module; see exports and imports below. | export type CartItem = { productId: string; qty: number };; export function readCart() {; export function clearCart() { | @backend/services/products |
| `chat.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | @backend/services/chat |
| `chatStorage.ts` | Application or tooling module; see exports and imports below. | export type ChatMessage = { id: string; conversationId: string; senderId: string; senderNa; export type Conversation = { id: string; user1Id: string; user2Id: string; createdAt: numb; export type ConversationSummary = { id: string; otherUserId: string; name: string; avatar? | @/utils/userStorage, @/lib/localStorage |
| `cloudinary.ts` | Application or tooling module; see exports and imports below. | export interface CloudinaryUploadResponse {; export async function uploadProductImageToCloudinary(file: File): Promise<CloudinaryUpload | No direct module imports detected. |
| `localStorage.ts` | Application or tooling module; see exports and imports below. | export function makeId() {; export function readJson<T>(key: string, fallback: T): T {; export function writeJson<T>(key: string, value: T) { | No direct module imports detected. |
| `ordersStorage.ts` | Application or tooling module; see exports and imports below. | export type OrderItem = {; export type Order = {; export const readOrders = () => readJson<Order[]>(KEY, []); | @/lib/auth, @/lib/cartStorage, @backend/services/products, @/lib/localStorage |
| `productImages.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | @backend/services/productImages |
| `products.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | @backend/services/products |
| `sellerOrders.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | @backend/services/sellerOrders |
| `supabase.ts` | Application or tooling module; see exports and imports below. | export { isSupabaseConfigured, supabase } from "@backend/supabase/client"; | @backend/supabase/client |
| `utils.ts` | Application or tooling module; see exports and imports below. | export function cn(...inputs: ClassValue[]) { | clsx, tailwind-merge |

### `frontend/src/pages/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AdminLogin.tsx` | Route-level React page component. | export default function AdminLogin() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 2 more imports) |
| `AdminPanel.tsx` | Route-level React page component. | export default function AdminPanel() { | react, lucide-react, @/components/ui/button, @/components/ui/input (and 3 more imports) |
| `Cart.tsx` | Route-level React page component. | export { default } from "@/pages/CartPage"; | @/pages/CartPage |
| `CartPage.tsx` | Route-level React page component. | export default function CartPage() { | react, react-router-dom, lucide-react, @/components/ui/button (and 6 more imports) |
| `ChatPage.tsx` | Route-level React page component. | export default function ChatPage() { | react, react-router-dom, lucide-react, sonner (and 7 more imports) |
| `ForgotPassword.tsx` | Route-level React page component. | export default function ForgotPassword() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 1 more imports) |
| `GetStarted.tsx` | Route-level React page component. | export default function GetStarted() { | react-router-dom, lucide-react, @/components/ui/button |
| `InboxPage.tsx` | Route-level React page component. | export default function InboxPage() { | react, react-router-dom, lucide-react, @/components/common/UserAvatar (and 6 more imports) |
| `Index.tsx` | Route-level React page component. | export default function Index() { | react-router-dom, lucide-react, framer-motion, @/components/ui/button (and 1 more imports) |
| `Login.tsx` | Route-level React page component. | export default function Login() { | react, react-router-dom, lucide-react, sonner (and 3 more imports) |
| `LoginHub.tsx` | Route-level React page component. | export default function LoginHub() { | react-router-dom, @/components/ui/button |
| `Marketplace.tsx` | Route-level React page component. | export default function Marketplace() { | react, lucide-react, react-router-dom, @backend/services/products (and 6 more imports) |
| `NotFound.tsx` | Route-level React page component. | Module-level configuration or no named exports. | react-router-dom, react |
| `Orders.tsx` | Route-level React page component. | export default function Orders() { | react, @/contexts/AuthContext, @/lib/ordersStorage |
| `ProductView.tsx` | Route-level React page component. | export { default } from "@/pages/ProductViewPage"; | @/pages/ProductViewPage |
| `ProductViewPage.tsx` | Route-level React page component. | export default function ProductViewPage() { | react, lucide-react, react-router-dom, @/components/ui/button (and 7 more imports) |
| `ProfilePage.tsx` | Route-level React page component. | export default function ProfilePage() { | react, lucide-react, @/components/ui/input, @/components/common/MaiduguriAreaField (and 5 more imports) |
| `ResetPassword.tsx` | Route-level React page component. | export { default } from "@/pages/UpdatePassword"; | @/pages/UpdatePassword |
| `Settings.tsx` | Route-level React page component. | export default function Settings() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 2 more imports) |
| `SignupCustomer.tsx` | Route-level React page component. | export default function SignupCustomer() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 4 more imports) |
| `SignupEntrepreneur.tsx` | Route-level React page component. | export default function SignupEntrepreneur() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 4 more imports) |
| `StorefrontPage.tsx` | Route-level React page component. | export default function StorefrontPage() { | react, react-router-dom, lucide-react, @/components/common/UserAvatar (and 2 more imports) |
| `UpdatePassword.tsx` | Route-level React page component. | export default function UpdatePassword() { | react, react-router-dom, @/components/ui/button, @/components/ui/input (and 2 more imports) |

### `frontend/src/test/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `example.test.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | vitest |
| `local-auth.test.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | vitest, @/lib/auth |
| `setup.ts` | Application or tooling module; see exports and imports below. | Module-level configuration or no named exports. | @testing-library/jest-dom |

### `frontend/src/types/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `index.ts` | Shared TypeScript data and application types. | export type UserRole = "entrepreneur" \| "customer" \| "admin";; export interface User {; export interface BusinessProfile { | No direct module imports detected. |
| `local.ts` | Shared TypeScript data and application types. | export type LocalProduct = { | No direct module imports detected. |
| `product.ts` | Shared TypeScript data and application types. | export type ProductStatus = "draft" \| "published" \| "archived";; export interface ProductCategory {; export interface ProductMedia { | No direct module imports detected. |
| `vendor.ts` | Shared TypeScript data and application types. | export type VendorStoreStatus = "pending" \| "approved" \| "rejected" \| "suspended"; | No direct module imports detected. |

### `frontend/src/utils/`

Supporting project folder; see its file entries below.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `productStorage.ts` | Reusable application utility. | export { getProductById } from "@backend/services/products"; | @backend/services/products |
| `userStorage.ts` | Reusable application utility. | export type Role = "entrepreneur" \| "customer" \| "admin";; export type VerificationStatus = "unverified" \| "pending" \| "verified";; export type UserRecord = { | No direct module imports detected. |

### `frontend/src/components/admin/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AdminTools.tsx` | Reusable or feature-specific React component. | export default function AdminTools() { const [users, setUsers] = useState<UserRecord[]>([] | react, @/components/ui/button, @/utils/userStorage, @backend/services/products (and 1 more imports) |

### `frontend/src/components/auth/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AccountRedirect.tsx` | Reusable or feature-specific React component. | export default function AccountRedirect() { | react, react-router-dom, @/contexts/AuthContext |

### `frontend/src/components/chat/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `ChatWindow.tsx` | Reusable or feature-specific React component. | export default function Index() { | react, react-router-dom, framer-motion, lucide-react (and 4 more imports) |

### `frontend/src/components/common/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `Badges.tsx` | Reusable or feature-specific React component. | export const FeaturedBadge = () => (; export const PremiumBadge = () => ( | lucide-react |
| `ImageUploader.tsx` | Reusable or feature-specific React component. | export async function fileToResizedDataUrl(file: File, maxSize = 900, quality = 0.75): Pro; export default function ImageUploader({ | react, lucide-react |
| `MaiduguriAreaField.tsx` | Reusable or feature-specific React component. | export const MAIDUGURI_AREAS = ["UNIMAID (University of Maiduguri)", "KIU (Kashim Ibrahim ; export function MaiduguriAreaField({ id, value, onChange, label = "Area / Jurisdiction" }: | @/components/ui/input |
| `SplashScreen.tsx` | Reusable or feature-specific React component. | export default function SplashScreen({ onDone }: { onDone: () => void }) { | react, framer-motion |
| `SubscriptionModal.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | @/components/ui/dialog, @/components/ui/button, lucide-react |
| `UserAvatar.tsx` | Reusable or feature-specific React component. | export type AvatarUser = { full_name?: string \| null; avatar_url?: string \| null };; export default function UserAvatar({ user, size = "md", className = "" }: { user: AvatarUs | @/components/ui/avatar |

### `frontend/src/components/dashboard/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `EntrepreneurDashboard.tsx` | Reusable or feature-specific React component. | export default function EntrepreneurDashboard() { | react-router-dom, react, lucide-react, @/components/ui/button (and 4 more imports) |
| `ListingCard.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | @/types, @/components/common/Badges, @/components/ui/switch, @/components/ui/button (and 1 more imports) |
| `ListingForm.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | react, @/components/ui/button, @/components/ui/input, @/components/ui/textarea (and 5 more imports) |
| `ProfileEditor.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | react, @/components/ui/button, @/components/ui/input, @/components/ui/textarea (and 4 more imports) |

### `frontend/src/components/layout/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AppLayout.tsx` | Reusable or feature-specific React component. | export default function AppLayout() { | react, react-router-dom, @/components/layout/Navbar, @/components/common/SplashScreen (and 1 more imports) |
| `Footer.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | react-router-dom |
| `Navbar.tsx` | Reusable or feature-specific React component. | export default function Navbar() { | react, react-router-dom, lucide-react, framer-motion (and 4 more imports) |

### `frontend/src/components/map/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `MapPicker.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | @/components/ui/dialog, @/components/ui/button, lucide-react, react |

### `frontend/src/components/marketplace/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `CategoryFilter.tsx` | Reusable or feature-specific React component. | Module-level configuration or no named exports. | @/types, @/components/ui/button, @/components/ui/slider, react |

### `frontend/src/components/theme/`

Shared or feature-specific React components.

No files are present directly in this folder.

### `frontend/src/components/ui/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `accordion.tsx` | Reusable UI primitive component. | export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }; | react, @radix-ui/react-accordion, lucide-react, @/lib/utils |
| `alert-dialog.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-alert-dialog, @/lib/utils, @/components/ui/button |
| `alert.tsx` | Reusable UI primitive component. | export { Alert, AlertTitle, AlertDescription }; | react, class-variance-authority, @/lib/utils |
| `aspect-ratio.tsx` | Reusable UI primitive component. | export { AspectRatio }; | @radix-ui/react-aspect-ratio |
| `avatar.tsx` | Reusable UI primitive component. | export { Avatar, AvatarImage, AvatarFallback }; | react, @radix-ui/react-avatar, @/lib/utils |
| `badge.tsx` | Reusable UI primitive component. | export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typ; export { Badge, badgeVariants }; | react, class-variance-authority, @/lib/utils |
| `breadcrumb.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-slot, lucide-react, @/lib/utils |
| `button.tsx` | Reusable UI primitive component. | export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Varian; export { Button, buttonVariants }; | react, @radix-ui/react-slot, class-variance-authority, @/lib/utils |
| `calendar.tsx` | Reusable UI primitive component. | export type CalendarProps = React.ComponentProps<typeof DayPicker>;; export { Calendar }; | react, lucide-react, react-day-picker, @/lib/utils (and 1 more imports) |
| `card.tsx` | Reusable UI primitive component. | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; | react, @/lib/utils |
| `carousel.tsx` | Reusable UI primitive component. | export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, Caro | react, embla-carousel-react, lucide-react, @/lib/utils (and 1 more imports) |
| `chart.tsx` | Reusable UI primitive component. | export type ChartConfig = {; export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendConten | react, recharts, @/lib/utils |
| `checkbox.tsx` | Reusable UI primitive component. | export { Checkbox }; | react, @radix-ui/react-checkbox, lucide-react, @/lib/utils |
| `collapsible.tsx` | Reusable UI primitive component. | export { Collapsible, CollapsibleTrigger, CollapsibleContent }; | @radix-ui/react-collapsible |
| `command.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-dialog, cmdk, lucide-react (and 2 more imports) |
| `context-menu.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-context-menu, lucide-react, @/lib/utils |
| `dialog.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-dialog, lucide-react, @/lib/utils |
| `drawer.tsx` | Reusable UI primitive component. | export { | react, vaul, @/lib/utils |
| `dropdown-menu.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-dropdown-menu, lucide-react, @/lib/utils |
| `form.tsx` | Reusable UI primitive component. | export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessag | react, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form (and 2 more imports) |
| `hover-card.tsx` | Reusable UI primitive component. | export { HoverCard, HoverCardTrigger, HoverCardContent }; | react, @radix-ui/react-hover-card, @/lib/utils |
| `input-otp.tsx` | Reusable UI primitive component. | export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }; | react, input-otp, lucide-react, @/lib/utils |
| `input.tsx` | Reusable UI primitive component. | export { Input }; | react, @/lib/utils |
| `label.tsx` | Reusable UI primitive component. | export { Label }; | react, @radix-ui/react-label, class-variance-authority, @/lib/utils |
| `LoadingButton.tsx` | Reusable UI primitive component. | export function LoadingButton({ | react, lucide-react, @/components/ui/button |
| `menubar.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-menubar, lucide-react, @/lib/utils |
| `navigation-menu.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-navigation-menu, class-variance-authority, lucide-react (and 1 more imports) |
| `pagination.tsx` | Reusable UI primitive component. | export { | react, lucide-react, @/lib/utils, @/components/ui/button |
| `popover.tsx` | Reusable UI primitive component. | export { Popover, PopoverTrigger, PopoverContent }; | react, @radix-ui/react-popover, @/lib/utils |
| `progress.tsx` | Reusable UI primitive component. | export { Progress }; | react, @radix-ui/react-progress, @/lib/utils |
| `radio-group.tsx` | Reusable UI primitive component. | export { RadioGroup, RadioGroupItem }; | react, @radix-ui/react-radio-group, lucide-react, @/lib/utils |
| `resizable.tsx` | Reusable UI primitive component. | export { ResizablePanelGroup, ResizablePanel, ResizableHandle }; | lucide-react, react-resizable-panels, @/lib/utils |
| `scroll-area.tsx` | Reusable UI primitive component. | export { ScrollArea, ScrollBar }; | react, @radix-ui/react-scroll-area, @/lib/utils |
| `select.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-select, lucide-react, @/lib/utils |
| `separator.tsx` | Reusable UI primitive component. | export { Separator }; | react, @radix-ui/react-separator, @/lib/utils |
| `sheet.tsx` | Reusable UI primitive component. | export { | @radix-ui/react-dialog, class-variance-authority, lucide-react, react (and 1 more imports) |
| `sidebar.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-slot, class-variance-authority, lucide-react (and 8 more imports) |
| `skeleton.tsx` | Reusable UI primitive component. | export { Skeleton }; | @/lib/utils |
| `slider.tsx` | Reusable UI primitive component. | export { Slider }; | react, @radix-ui/react-slider, @/lib/utils |
| `sonner.tsx` | Reusable UI primitive component. | export { Toaster, toast }; | next-themes, sonner |
| `switch.tsx` | Reusable UI primitive component. | export { Switch }; | react, @radix-ui/react-switch, @/lib/utils |
| `table.tsx` | Reusable UI primitive component. | export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, Table | react, @/lib/utils |
| `tabs.tsx` | Reusable UI primitive component. | export { Tabs, TabsList, TabsTrigger, TabsContent }; | react, @radix-ui/react-tabs, @/lib/utils |
| `textarea.tsx` | Reusable UI primitive component. | export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;; export { Textarea }; | react, @/lib/utils |
| `toast.tsx` | Reusable UI primitive component. | export { | react, @radix-ui/react-toast, class-variance-authority, lucide-react (and 1 more imports) |
| `toaster.tsx` | Reusable UI primitive component. | export function Toaster() { | @/hooks/use-toast, @/components/ui/toast |
| `toggle-group.tsx` | Reusable UI primitive component. | export { ToggleGroup, ToggleGroupItem }; | react, @radix-ui/react-toggle-group, class-variance-authority, @/lib/utils (and 1 more imports) |
| `toggle.tsx` | Reusable UI primitive component. | export { Toggle, toggleVariants }; | react, @radix-ui/react-toggle, class-variance-authority, @/lib/utils |
| `tooltip.tsx` | Reusable UI primitive component. | export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }; | react, @radix-ui/react-tooltip, @/lib/utils |
| `use-toast.ts` | Application or tooling module; see exports and imports below. | export { useToast, toast }; | @/hooks/use-toast |

### `frontend/src/components/dashboard/entrepreneur/`

Shared or feature-specific React components.

| File | Purpose | Key exports / logic | Connections |
|---|---|---|---|
| `AddProduct.tsx` | Reusable or feature-specific React component. | export default function AddProduct() { | @/components/dashboard/entrepreneur/ProductForm |
| `DashboardHome.tsx` | Reusable or feature-specific React component. | export default function DashboardHome() { | react, react-router-dom, lucide-react, @/components/ui/button (and 2 more imports) |
| `EditProduct.tsx` | Reusable or feature-specific React component. | export default function EditProduct() { | @/components/dashboard/entrepreneur/ProductForm |
| `MyProducts.tsx` | Reusable or feature-specific React component. | export default function MyProducts() { | react, lucide-react, react-router-dom, @/components/ui/button (and 5 more imports) |
| `Orders.tsx` | Reusable or feature-specific React component. | export default function EntrepreneurOrders() { | react, lucide-react, @/components/ui/button, @/components/common/UserAvatar (and 4 more imports) |
| `ProductDetail.tsx` | Reusable or feature-specific React component. | export default function ProductDetail() { | @/pages/ProductViewPage |
| `ProductForm.tsx` | Reusable or feature-specific React component. | export default function ProductForm() { | react, lucide-react, react-router-dom, @/components/ui/button (and 6 more imports) |
| `VendorStorePanel.tsx` | Reusable or feature-specific React component. | export default function VendorStorePanel() { | react, lucide-react, @/components/ui/button, @/components/ui/input (and 5 more imports) |

## Everyday workflow cheatsheet

- **Add a page:** create a component in `frontend/src/pages/`, connect its route in `frontend/src/App.tsx`, and compose shared UI from `frontend/src/components/`.
- **Change a Supabase query:** update its module in `backend/services/`, verify the live schema and RLS, or add an ordered migration under `backend/sql/`. Frontend compatibility re-exports are in `frontend/src/lib/`.
- **Change Supabase setup:** update `backend/supabase/client.ts`; configure public values locally and in Vercel using `deployment/.env.example` as the key list.
- **Change static assets:** place files in `frontend/public/` and reference them from the site root, such as `/logo-icon.png`.
- **Deploy:** keep Vercel's project root at the repository root, run `npm ci` and `npm run build`, then follow `deployment/DEPLOY_GUIDE.md`.
- **Check types:** run `npx tsc --noEmit -p tsconfig.app.json`.

## Maintenance notes

- `backend/services/` is bundled into the browser because it uses the Supabase JavaScript client. Use publishable/anon credentials only and rely on RLS.
- `.env.local` is ignored by Git. Never copy its values into docs or source, and never expose a service-role key through a `VITE_` variable.
- Rebuild `dist/` with Vite; do not edit generated files by hand.
