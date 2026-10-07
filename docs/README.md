# Virtual Fitting Product — Founding PM Pack

This pack defines a privacy-first, true-3D virtual fitting product.

Core flow:
User → temporary body profile → 3D human → garment reconstruction → cloth simulation → interactive browser viewer → session destruction.

Frontend:
React + TypeScript + Tailwind + Watermelon UI + React Three Fiber + Three.js WebGPU/WebGL2.

Important privacy architecture:
- No persistent consumer account required for MVP.
- No persistent face/body/garment database.
- Temporary processing only.
- Explicit DELETE endpoint.
- Browser lifecycle cleanup is best-effort, never the guarantee.
- Server-side TTL/garbage collection is the guarantee/backstop.
- Sensitive payloads must never enter application logs, analytics, replay tools, CDN caches, or persistent databases.

Watermelon UI:
https://ui.watermelon.sh/
Components are copy-paste React/Tailwind/shadcn-compatible and MIT licensed.
