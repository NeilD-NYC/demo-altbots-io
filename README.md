# AltBots Portfolio Intelligence Dashboard

> **Interactive portfolio monitoring and manager intelligence platform for alternative investment allocators — built with React, TypeScript, and 3D network visualization.**

[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-demo.altbots.io-brightgreen)](https://demo.altbots.io)

---

## Live Demo

**[demo.altbots.io](https://demo.altbots.io)**

---

## What Is This?

A full-featured portfolio intelligence dashboard designed for institutional allocators managing multi-manager alternative investment portfolios — hedge funds, private equity, venture capital, and family office mandates.

Built by a former Managing Director with 15+ years of buy-side experience, this dashboard encodes the actual monitoring and oversight framework used at a $24B multi-family office into a real-time, interactive interface.

---

## Features

### 3D Fund Interconnection Graph
- Interactive force-directed 3D network visualization of manager relationships
- Node clustering by strategy, geography, and risk profile
- Real-time rotation, zoom, and node selection
- Built with `react-force-graph-3d` and Three.js

### Portfolio Performance Tab
- AUM and allocation tracking across strategies
- Performance attribution by fund and asset class
- Drawdown monitoring and risk-adjusted return metrics
- Liquidity profile visualization

### Intelligence Signals Tab
13 proprietary signal categories for ongoing manager monitoring:
- Personnel changes and key-man risk
- Regulatory and sanctions flags
- Redemption risk indicators
- Operational due diligence signals
- Strategy drift detection
- Prime broker and administrator changes
- News and social sentiment

### Manager Profiles
- Structured fund profiles with strategy, terms, and service provider data
- Direct integration with the AltBots tearsheet pipeline

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| 3D Visualization | react-force-graph-3d + Three.js |
| Build | Vite |
| Deployment | Lovable / Vercel |

---

## Quickstart

```bash
git clone https://github.com/NeilD-NYC/demo-altbots-io.git
cd demo-altbots-io
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Related Projects

| Project | Description |
|---------|-------------|
| [altbots-tearsheet](https://github.com/NeilD-NYC/altbots-tearsheet) | AI pipeline that generates the underlying manager intelligence briefs |
| [AltBots Platform](https://altbots.io) | Full institutional research platform |

---

## Background

**Neil Datta** — Founder, AltBots / NKD Advisory LLC

Former MD & Global Head of Risk & Diligence at Optima/Forbes Family Trust ($24B MFO). 2,000+ manager reviews. 500+ investments closed. $9B+ deployed across alternative asset classes.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-in%2Fneildatta-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/neildatta)

---

## License

MIT — see [LICENSE](./LICENSE)
