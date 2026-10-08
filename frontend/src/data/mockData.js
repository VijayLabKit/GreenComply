// Demo dataset for "Himalayan Steel Works Pvt. Ltd." — Siliguri, West Bengal
// Used as a labelled fallback if the FastAPI backend is unreachable, so the UI
// always renders a fully populated demo (with a visible "demo data" banner).
// Mirrors backend/app/mock_data.py — keep both in sync.

export const company = {
  name: 'Himalayan Steel Works Pvt. Ltd.',
  gstin: '19AABCH1234Q1ZP',
  sector: 'Steel & Cement Manufacturing',
  location: 'Siliguri, West Bengal, India',
  exportStatus: true,
  plan: 'Export-Ready',
  employees: 412,
  turnoverCr: 186.4,
}

export const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export const emissionsTrend = [
  { month: 'Oct', scope1: 208, scope2: 336, scope3: 176 },
  { month: 'Nov', scope1: 224, scope2: 352, scope3: 191 },
  { month: 'Dec', scope1: 262, scope2: 412, scope3: 206 },
  { month: 'Jan', scope1: 243, scope2: 391, scope3: 199 },
  { month: 'Feb', scope1: 212, scope2: 361, scope3: 184 },
  { month: 'Mar', scope1: 233, scope2: 378, scope3: 197 },
  { month: 'Apr', scope1: 249, scope2: 403, scope3: 212 },
  { month: 'May', scope1: 276, scope2: 431, scope3: 226 },
  { month: 'Jun', scope1: 292, scope2: 457, scope3: 238 },
  { month: 'Jul', scope1: 271, scope2: 419, scope3: 221 },
  { month: 'Aug', scope1: 253, scope2: 402, scope3: 214 },
  { month: 'Sep', scope1: 245, scope2: 395, scope3: 208 },
]

export const kpis = {
  complianceScore: 74,
  totalEmissions: 3520,
  emissionsTrendPct: 4.2,
  reportsDue: 3,
  nextDeadline: 'CBAM Q3 declaration — overdue',
  riskFlags: 6,
}

export const brsrCategoryScores = [
  { category: 'Environment', score: 82 },
  { category: 'Social', score: 64 },
  { category: 'Governance', score: 79 },
]

export const deadlines = [
  { label: 'CBAM Quarterly Declaration (EU)', date: '2026-09-30', daysLeft: -8 },
  { label: 'Scope 3 Supplier Data Refresh', date: '2026-10-15', daysLeft: 7 },
  { label: 'BRSR Annual Filing (SEBI)', date: '2026-10-26', daysLeft: 18 },
  { label: 'ISO 14001 Surveillance Audit', date: '2026-11-12', daysLeft: 35 },
]

export const activityFeed = [
  { id: 1, text: 'Q3 electricity data uploaded for all 4 facilities', time: '2 hours ago' },
  { id: 2, text: 'CBAM declaration exported for Shipment #CB-1042', time: 'Yesterday' },
  { id: 3, text: 'Supplier "Sikkim Graphite Works" flagged — no emissions data received since onboarding', time: 'Yesterday' },
  { id: 4, text: 'BRSR Section C, Principle 6 auto-populated from utility data', time: '2 days ago' },
  { id: 5, text: 'Fuel consumption log updated for September', time: '3 days ago' },
  { id: 6, text: 'Water usage reading for August missing at Cooch Behar Depot — reminder sent', time: '4 days ago' },
  { id: 7, text: 'ISO 14001 surveillance audit scheduled for 12 Nov', time: '5 days ago' },
  { id: 8, text: 'New supplier "Meghalaya Lime Exports" added and auto-flagged (score 33)', time: '6 days ago' },
  { id: 9, text: 'BRSR report regenerated — completeness dropped to 76% after Section G edits', time: '7 days ago' },
  { id: 10, text: 'Waste manifest uploaded for Plant B (hazardous, Aug)', time: '8 days ago' },
  { id: 11, text: 'Supplier audit completed for Terai Alloys Pvt Ltd', time: '10 days ago' },
  { id: 12, text: 'July CBAM declaration submitted to EU portal', time: '12 days ago' },
]

export const dataSources = [
  { id: 'electricity', name: 'Electricity Bills', completeness: 100, lastUpdated: '2026-09-18' },
  { id: 'fuel', name: 'Fuel Consumption', completeness: 92, lastUpdated: '2026-09-17' },
  { id: 'water', name: 'Water Usage', completeness: 84, lastUpdated: '2026-09-14' },
  { id: 'waste', name: 'Waste Generated', completeness: 71, lastUpdated: '2026-09-10' },
  { id: 'raw_material', name: 'Raw Material Sourcing', completeness: 95, lastUpdated: '2026-09-16' },
  { id: 'labor', name: 'Employee / Labor Data', completeness: 100, lastUpdated: '2026-09-01' },
  { id: 'transport', name: 'Transport / Logistics', completeness: 58, lastUpdated: '2026-09-05' },
]

export const brsrPrinciples = [
  { id: 1, title: 'Ethics, Transparency & Accountability', completeness: 95 },
  { id: 2, title: 'Safe & Sustainable Products', completeness: 88 },
  { id: 3, title: 'Employee Wellbeing', completeness: 90 },
  { id: 4, title: 'Stakeholder Responsiveness', completeness: 62 },
  { id: 5, title: 'Human Rights', completeness: 55 },
  { id: 6, title: 'Environment Protection', completeness: 91 },
  { id: 7, title: 'Public & Regulatory Policy', completeness: 84 },
  { id: 8, title: 'Inclusive Growth', completeness: 42 },
  { id: 9, title: 'Consumer Value', completeness: 76 },
]

export const cbamShipments = [
  { id: 'CB-1036', product: 'Cement (Clinker)', tonnes: 480, emissionsPerTonne: 0.86, carbonCost: 8140, status: 'Submitted', declarationDue: '2026-07-31' },
  { id: 'CB-1039', product: 'Steel (Rebar)', tonnes: 210, emissionsPerTonne: 1.85, carbonCost: 6935, status: 'Submitted', declarationDue: '2026-07-31' },
  { id: 'CB-1041', product: 'Aluminum Sheet', tonnes: 95, emissionsPerTonne: 11.5, carbonCost: 19412, status: 'Ready', declarationDue: '2026-10-31' },
  { id: 'CB-1042', product: 'Steel (Coil)', tonnes: 160, emissionsPerTonne: 1.9, carbonCost: 5432, status: 'Draft', declarationDue: '2026-10-31' },
  { id: 'CB-1047', product: 'Cement (Portland)', tonnes: 320, emissionsPerTonne: 0.79, carbonCost: 5875, status: 'Overdue', declarationDue: '2026-09-30' },
  { id: 'CB-1048', product: 'Steel (Billets)', tonnes: 240, emissionsPerTonne: 1.72, carbonCost: 8490, status: 'Draft', declarationDue: '2026-10-31' },
]

export const scopeBreakdown = [
  { name: 'Scope 1 — Direct', value: 245 },
  { name: 'Scope 2 — Purchased Energy', value: 395 },
  { name: 'Scope 3 — Value Chain', value: 208 },
]

export const facilityEmissions = [
  { facility: 'Siliguri Plant A', emissions: 480 },
  { facility: 'Siliguri Plant B', emissions: 210 },
  { facility: 'Logistics Fleet', emissions: 93 },
  { facility: 'Jalpaiguri Warehouse', emissions: 65 },
  { facility: 'Cooch Behar Depot', emissions: 38 },
]

export const emissionFactors = [
  { source: 'Grid Electricity (WBSEDCL)', factor: '0.82 kgCO₂e / kWh' },
  { source: 'Diesel (Generators)', factor: '2.68 kgCO₂e / litre' },
  { source: 'Coal (Furnace)', factor: '2.42 kgCO₂e / kg' },
  { source: 'Natural Gas', factor: '2.02 kgCO₂e / m³' },
  { source: 'Road Freight (Diesel HGV)', factor: '0.12 kgCO₂e / tonne-km' },
]

export const recommendations = [
  'Switching 20% grid load to rooftop solar could cut Scope 2 emissions by ~340 tCO₂e/year.',
  'Upgrading furnace insulation at Plant A could reduce coal use by 8–12%.',
  'Consolidating logistics routes to Cooch Behar could cut Scope 3 transport emissions by ~15%.',
  'Chasing missing fuel logs from the Logistics Fleet would lift data completeness above 95%.',
]

export const suppliers = [
  { id: 1,  name: 'Terai Alloys Pvt Ltd',       material: 'Steel Billets',           distanceKm: 42,  sustainabilityScore: 62, flag: false },
  { id: 2,  name: 'Dooars Coal Traders',        material: 'Coal',                    distanceKm: 120, sustainabilityScore: 38, flag: true },
  { id: 3,  name: 'Kanchenjunga Limestone Co.', material: 'Limestone',               distanceKm: 65,  sustainabilityScore: 74, flag: false },
  { id: 4,  name: 'Northline Freight Services', material: 'Logistics',               distanceKm: 0,   sustainabilityScore: 55, flag: false },
  { id: 5,  name: 'Balurghat Packaging Ltd',    material: 'Packaging',               distanceKm: 88,  sustainabilityScore: 80, flag: false },
  { id: 6,  name: 'Bengal Ferro Alloys',        material: 'Ferro Alloys',            distanceKm: 156, sustainabilityScore: 45, flag: true },
  { id: 7,  name: 'Teesta Water Solutions',     material: 'Process Water Treatment', distanceKm: 12,  sustainabilityScore: 91, flag: false },
  { id: 8,  name: 'Himalayan Aluminum Casting', material: 'Aluminum Sheet',          distanceKm: 210, sustainabilityScore: 58, flag: true },
  { id: 9,  name: 'Siliguri Cement Works',      material: 'Clinker',                 distanceKm: 28,  sustainabilityScore: 71, flag: false },
  { id: 10, name: 'Assam Refractory Supplies',  material: 'Refractory Bricks',       distanceKm: 340, sustainabilityScore: 49, flag: true },
  { id: 11, name: 'Meghalaya Lime Exports',     material: 'Quicklime',               distanceKm: 275, sustainabilityScore: 33, flag: true },
  { id: 12, name: 'Ganga Energy Corp',          material: 'Grid Electricity',        distanceKm: 0,   sustainabilityScore: 84, flag: false },
  { id: 13, name: 'Dooars Timber & Pallets',    material: 'Wooden Pallets',          distanceKm: 95,  sustainabilityScore: 68, flag: false },
  { id: 14, name: 'Sikkim Graphite Works',      material: 'Graphite Electrodes',     distanceKm: 410, sustainabilityScore: 0,  flag: true },
]

export const documents = [
  { id: 1,  name: 'BRSR Annual Report FY25-26.pdf',     type: 'Report',      version: 'v3', date: '2026-09-18' },
  { id: 2,  name: 'CBAM Declaration Q3 2026.xml',       type: 'Declaration', version: 'v1', date: '2026-09-17' },
  { id: 3,  name: 'Electricity Bill — August 2026.pdf', type: 'Evidence',    version: 'v1', date: '2026-09-05' },
  { id: 4,  name: 'ISO 14001 Certificate.pdf',          type: 'Certificate', version: 'v2', date: '2026-06-12' },
  { id: 5,  name: 'Supplier Audit — Terai Alloys.pdf',  type: 'Evidence',    version: 'v1', date: '2026-08-22' },
  { id: 6,  name: 'CBAM Declaration Q2 2026.xml',       type: 'Declaration', version: 'v2', date: '2026-06-30' },
  { id: 7,  name: 'Water Audit Report FY25-26.pdf',     type: 'Report',      version: 'v1', date: '2026-08-30' },
  { id: 8,  name: 'Hazardous Waste Manifest — Aug.pdf', type: 'Evidence',    version: 'v1', date: '2026-09-02' },
  { id: 9,  name: 'Grievance Redressal Policy.pdf',     type: 'Certificate', version: 'v4', date: '2026-05-20' },
  { id: 10, name: 'Electricity Bill — July 2026.pdf',   type: 'Evidence',    version: 'v1', date: '2026-08-04' },
  { id: 11, name: 'Supplier Audit — Dooars Coal.pdf',   type: 'Evidence',    version: 'v2', date: '2026-07-15' },
  { id: 12, name: 'CBAM Declaration Q1 2026.xml',       type: 'Declaration', version: 'v1', date: '2026-04-30' },
]

/** Formats an ISO timestamp (or relative label) for display in the activity feed. */
export function formatActivityTime(entry) {
  if (entry?.time) return entry.time
  const iso = entry?.created_at ?? entry?.createdAt
  if (!iso) return ''
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return iso
  const diffMs = Date.now() - then.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return then.toLocaleDateString()
}
