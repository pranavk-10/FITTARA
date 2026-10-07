# FITTARA

> **"See the fit. Before you wear it."**  
> *Your body. Your clothes. Your fit. In 3D.*  
> *Virtual fitting, reimagined.*

FITTARA is a privacy-first, true-3D virtual fitting room powered by parametric body reconstruction, garment template reconstruction, and physics-based cloth collision simulation.
Unlike 2D generative image try-on solutions, FITTARA constructs a real 3D human body representation, tailors a simulation-ready 3D garment, executes cloth collision physics, and renders the result in a WebGPU/WebGL2 browser viewport for complete 360° inspection.

---

## 1. Project Identity & Metadata

- **Product Name:** FITTARA
- **Description:** FITTARA — A privacy-first 3D virtual fitting room powered by body reconstruction, garment reconstruction, and physics-based cloth simulation.
- **Topics:** `3d`, `virtual-try-on`, `virtual-fitting`, `computer-vision`, `threejs`, `react-three-fiber`, `webgpu`, `cloth-simulation`, `fashion-tech`, `computer-graphics`, `typescript`, `privacy-first`

---

## 2. Non-Negotiable Product Principles

- **True 3D Interactive Viewport:** Never a sequence of 2D images. Full 360° rotation, orbit, zoom, and fit inspection from any angle.
- **Private by Design:** No persistent consumer account required. No biometric profiles stored. All uploaded photos, measurements, and generated meshes exist solely for the active temporary session.
- **Truthful Guarantees:** Never claim "data never exists anywhere." The accurate guarantee is: *"Your fitting data is temporary and is automatically destroyed when your session ends or expires."*
- **Authoritative Server-Side TTL:** Browser unload (`pagehide`/`beforeunload`) attempts best-effort deletion, but an automated server-side TTL cleaner (default 15 minutes) is the authoritative backstop.
- **Strict Data Minimization:** Sensitive fitting data (body images, face images, measurements, raw meshes) is blocked from application logs, metrics, CDN caches, and persistent databases.

---

## 3. Monorepo Architecture

```
fittara/
├── apps/
│   └── web/                   # Vite + React 19 + Tailwind CSS + Watermelon UI + R3F + Three.js
├── services/
│   └── api/                   # Express REST service + Ephemeral Session Store + TTL Garbage Collector
├── packages/
│   ├── types/                 # Shared TypeScript domain types and schemas
│   └── validation/            # Zod input validation schemas for all endpoints
├── docs/                      # Founding PRD & Architecture specifications
├── .env.example               # Environment configuration template
└── tsconfig.base.json         # Base TypeScript configuration
```

---

## 4. Quick Start & Development Setup

### Prerequisites
- **Node.js**: `>= 20.0.0` (Tested on Node v24.20.0)
- **npm**: `>= 10.0.0` (Tested on npm 11.19.0)

### 1. Installation
Clone the repository and install all workspace dependencies from root:

```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Running Services Locally

#### Run all services concurrently:
```bash
npm run dev
```

#### Or run independently:

- **FITTARA API Service** (Port 3001):
  ```bash
  npm run dev:api
  ```
- **FITTARA Web Studio** (Port 3000):
  ```bash
  npm run dev:web
  ```

Visit **http://localhost:3000** in your browser.

---

## 5. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/health` | Operational health check (`product: FITTARA Engine`) |
| `POST` | `/v1/sessions` | Initialize new temporary session with 15m TTL |
| `POST` | `/v1/sessions/:id/body-input` | Submit validated body measurements & optional calibration image |
| `POST` | `/v1/sessions/:id/face` | Submit optional face likeness with explicit consent |
| `POST` | `/v1/sessions/:id/garment` | Submit garment image & category (`tshirt` \| `jacket`) |
| `POST` | `/v1/sessions/:id/generate-avatar`| Trigger parametric body reconstruction job |
| `POST` | `/v1/sessions/:id/generate-garment`| Trigger 3D garment template matching |
| `POST` | `/v1/sessions/:id/simulate` | Trigger cloth physics simulation against avatar collision mesh |
| `GET` | `/v1/sessions/:id/status` | Query asynchronous job status and progress percent |
| `GET` | `/v1/sessions/:id/scene` | Fetch 3D scene parameters and truthful fit inspection signals |
| `DELETE` | `/v1/sessions/:id` | Immediately wipe session and zero out in-memory buffers |

---

## 6. Testing & Verification

Run the test suite across workspaces:

```bash
npm run test
```

To run API integration tests directly:
```bash
npm --workspace=@fit3d/api run test
```

To build production bundles:
```bash
npm run build
```

---

## 7. License & Privacy Compliance

MIT License. Designed with privacy-by-design principles compliant with GDPR Article 17 (Right to Erasure) and CCPA biometric minimization principles.
