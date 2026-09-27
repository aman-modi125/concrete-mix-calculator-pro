# Concrete Mix Design Calculator Pro (IS 10262:2019 & IS 456:2000)

A deterministic, high-performance civil engineering web application for concrete mix proportioning conforming strictly to the latest **Indian Standard IS 10262:2019** ("Concrete Mix Proportioning — Guidelines") and **IS 456:2000** ("Code of Practice for Plain and Reinforced Concrete").

---

## 🌟 Key Features

- **⚡ Zero-Latency Calculation**: Sub-50ms deterministic matrix solving directly in the browser runtime (zero server dependency).
- **🛡️ Durability Limits Guard (IS 456 Table 5 & 6)**:
  - Enforces minimum grade requirements (Mild: M20, Moderate: M25, Severe: M30, Very Severe: M35, Extreme: M40 for RCC).
  - Maximum water-cement ratio ceiling limits.
  - Minimum cementitious material requirements with MSA adjustments (10mm: +40 kg/m³, 40mm: -30 kg/m³).
  - Strict OPC cap check (IS 456 Clause 8.2.5 = 450 kg/m³).
- **📊 5 Specialized Views**:
  1. **Mix Proportioning Workspace**: Live parameters with instant SSD & Field batching side-by-side.
  2. **Step-by-Step Mathematical Audit**: Comprehensive breakdown showing BIS formulas ($f'_{ck}$, Table 1 X, Table 2 S, Table 3 Air, Table 4 Base Water, Table 5 Coarse Aggregates).
  3. **Verification Suite**: IS 456 Table 5 compliance verification matrix.
  4. **Lab Batching**: Scalable mixer batch quantities and trial mix adjustments (Clause 6).
  5. **Formal Lab Assignment Report**: Clean printable PDF-ready report with academic signature blocks.
- **🏗️ Interactive Real-World Case Studies**:
  - Marine Bridge Pier Substructure (M40 Extreme Exposure with Fly Ash).
  - High-Rise Shear Core Walls (M50 Pumped Mix).
  - Heavy Duty Warehouse Raft (M30 with 40mm MSA).
- **📱 Mobile-First UI**: Touch targets &ge; 44px, sticky mobile action bar, no horizontal scroll.
- **🔍 SEO & Technical Excellence**:
  - OpenGraph & Twitter social share cards.
  - JSON-LD LocalBusiness and WebApplication Schema.
  - Custom 404 page (`404.html`), Thank You confirmation (`thank-you.html`), and Privacy Policy (`privacy-policy.html`).
  - Google Analytics 4 (GA4) telemetry.

---

## 🚀 Running Locally

You can run the application with any static web server or Python:

```bash
# Navigate to the project directory
cd concrete-mix-calculator-pro

# Launch the local HTTP server
python server.py
```

Then navigate to: **[http://localhost:8000](http://localhost:8000)**

---

## 📚 Standards Implemented

- **IS 10262:2019**: Concrete Mix Proportioning — Guidelines (Second Revision)
- **IS 456:2000**: Plain and Reinforced Concrete — Code of Practice (Fourth Revision)
- **IS 383:2016**: Coarse and Fine Aggregate for Concrete — Specification
- **IS 3812 (Part 1): 2013**: Pulverized Fuel Ash for Use as Pozzolana in Cement Concrete
- **IS 9103:1999**: Concrete Admixtures — Specification

---

## 📄 License

Academic and Professional Civil Engineering Open Access Utility.
