import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA: India Occupations (sector → jobs, employment in lakhs, median salary, AI exposure 0-10, growth outlook) ───
const SECTORS = [
  {
    name: "Agriculture & Allied",
    color: "#3d6b2e",
    jobs: [
      { title: "Farm Labourer / Cultivator", employment: 2530, medianSalary: 85000, education: "No formal", growth: "Declining", aiExposure: 1.5, aiReason: "Manual physical labour in unpredictable outdoor environments; very limited AI displacement." },
      { title: "Dairy Farmer", employment: 350, medianSalary: 120000, education: "No formal", growth: "Stable", aiExposure: 2.0, aiReason: "Physical animal husbandry; some IoT monitoring but core work is hands-on." },
      { title: "Fisherman", employment: 280, medianSalary: 95000, education: "No formal", growth: "Stable", aiExposure: 1.8, aiReason: "Physically intensive, location-dependent, limited AI integration." },
      { title: "Agricultural Supervisor", employment: 120, medianSalary: 180000, education: "Secondary", growth: "Stable", aiExposure: 3.2, aiReason: "Farm management planning has some AI tools but field supervision is human-led." },
      { title: "Forestry & Logging Worker", employment: 90, medianSalary: 110000, education: "No formal", growth: "Declining", aiExposure: 1.5, aiReason: "Manual outdoor labour; minimal AI exposure." },
    ]
  },
  {
    name: "Construction",
    color: "#8B6914",
    jobs: [
      { title: "Construction Labourer", employment: 650, medianSalary: 130000, education: "No formal", growth: "Growing", aiExposure: 1.5, aiReason: "Manual labour in variable environments; AI has near zero impact currently." },
      { title: "Mason / Bricklayer", employment: 280, medianSalary: 180000, education: "Vocational", growth: "Growing", aiExposure: 2.0, aiReason: "Highly manual skilled trade; robotics emerging but not mainstream in India." },
      { title: "Carpenter / Joiner", employment: 160, medianSalary: 165000, education: "Vocational", growth: "Stable", aiExposure: 2.5, aiReason: "Craft skill with physical material; some AI-assisted design but execution is manual." },
      { title: "Electrician (Construction)", employment: 210, medianSalary: 220000, education: "ITI/Diploma", growth: "Growing", aiExposure: 3.0, aiReason: "Hands-on wiring work; AI can assist with blueprints but field work is irreplaceable." },
      { title: "Plumber", employment: 140, medianSalary: 200000, education: "ITI/Diploma", growth: "Growing", aiExposure: 2.5, aiReason: "Physical installation and repair work in varied environments." },
      { title: "Civil Engineer", employment: 180, medianSalary: 520000, education: "Bachelor's", growth: "Growing", aiExposure: 5.5, aiReason: "Design and analysis heavily aided by AI/BIM tools; project management still needs human judgment." },
      { title: "Architect", employment: 80, medianSalary: 600000, education: "Bachelor's", growth: "Stable", aiExposure: 6.0, aiReason: "Generative AI can produce designs; creativity and client relations still human." },
    ]
  },
  {
    name: "Manufacturing",
    color: "#5a3e85",
    jobs: [
      { title: "Garment / Textile Worker", employment: 450, medianSalary: 120000, education: "No formal", growth: "Stable", aiExposure: 3.5, aiReason: "Repetitive assembly; automation risk is moderate, low-cost labour still competitive." },
      { title: "Factory Machine Operator", employment: 380, medianSalary: 145000, education: "Secondary", growth: "Declining", aiExposure: 4.5, aiReason: "Routine machine operation is prime territory for automation." },
      { title: "Welder / Metal Fabricator", employment: 190, medianSalary: 200000, education: "ITI/Diploma", growth: "Stable", aiExposure: 3.8, aiReason: "Skilled physical work; some robotic welding but complex jobs need humans." },
      { title: "Auto Assembly Worker", employment: 220, medianSalary: 180000, education: "ITI/Diploma", growth: "Declining", aiExposure: 5.0, aiReason: "Automotive assembly is increasingly robotised; AI-driven lines reduce need for manual workers." },
      { title: "Pharmaceutical Technician", employment: 95, medianSalary: 280000, education: "Diploma/B.Sc", growth: "Growing", aiExposure: 4.5, aiReason: "Quality checks and repetitive formulation steps are automatable; regulatory oversight remains human." },
      { title: "Quality Control Inspector", employment: 130, medianSalary: 250000, education: "Diploma", growth: "Declining", aiExposure: 6.5, aiReason: "Visual inspection is one of the strongest current AI applications via computer vision." },
      { title: "Production Supervisor", employment: 90, medianSalary: 400000, education: "Diploma/B.E.", growth: "Stable", aiExposure: 4.8, aiReason: "Scheduling and monitoring automatable; people management and safety less so." },
    ]
  },
  {
    name: "Trade & Commerce",
    color: "#c4401e",
    jobs: [
      { title: "Retail Shop Owner / Vendor", employment: 520, medianSalary: 180000, education: "Secondary", growth: "Declining", aiExposure: 3.2, aiReason: "E-commerce pressure is higher threat than AI directly; in-person service still valued." },
      { title: "Wholesale Trader", employment: 180, medianSalary: 400000, education: "Secondary", growth: "Stable", aiExposure: 4.0, aiReason: "Procurement and pricing analytics aided by AI; negotiations and relationships remain human." },
      { title: "Sales Executive (B2C)", employment: 290, medianSalary: 220000, education: "Bachelor's", growth: "Stable", aiExposure: 5.5, aiReason: "AI chatbots handle tier-1 queries; complex sales and relationship management is human." },
      { title: "E-commerce Operations Staff", employment: 150, medianSalary: 240000, education: "Secondary/Bach.", growth: "Growing", aiExposure: 5.0, aiReason: "Listing, cataloguing, inventory management increasingly AI-assisted." },
      { title: "Street Hawker / Kiosk Seller", employment: 350, medianSalary: 90000, education: "No formal", growth: "Stable", aiExposure: 1.2, aiReason: "Highly informal, physical, location-based sales; minimal AI risk." },
    ]
  },
  {
    name: "Transport & Logistics",
    color: "#1a5276",
    jobs: [
      { title: "Truck / Heavy Vehicle Driver", employment: 530, medianSalary: 200000, education: "Secondary", growth: "Stable", aiExposure: 4.5, aiReason: "Self-driving is a future threat but India's roads and regulations make adoption slow." },
      { title: "Auto-Rickshaw / Cab Driver", employment: 450, medianSalary: 165000, education: "Secondary", growth: "Stable", aiExposure: 4.0, aiReason: "Ride-hailing algorithms manage dispatch; driving still human in Indian urban conditions." },
      { title: "Delivery Executive (Last Mile)", employment: 220, medianSalary: 180000, education: "Secondary", growth: "Growing", aiExposure: 3.5, aiReason: "Route optimised by AI; physical delivery still human; drone delivery nascent." },
      { title: "Logistics / Warehouse Manager", employment: 110, medianSalary: 480000, education: "Bachelor's", growth: "Growing", aiExposure: 6.0, aiReason: "Inventory optimisation and demand forecasting are heavily AI-assisted." },
      { title: "Railway Engine Driver", employment: 55, medianSalary: 520000, education: "Diploma/Bach.", growth: "Stable", aiExposure: 3.5, aiReason: "Semi-automated in premium trains; broad network still needs human operators." },
      { title: "Airline Pilot", employment: 12, medianSalary: 2500000, education: "Bachelor's+", growth: "Growing", aiExposure: 3.0, aiReason: "Autopilot is extensive but regulatory and safety requirements keep pilots essential." },
    ]
  },
  {
    name: "IT & Technology",
    color: "#0d6e8a",
    jobs: [
      { title: "Software Developer / Engineer", employment: 180, medianSalary: 900000, education: "Bachelor's", growth: "Growing", aiExposure: 7.5, aiReason: "Code generation AI (Copilot, Claude) is transforming software development; productivity boost more than replacement currently, but headcount per project is shrinking." },
      { title: "Data Analyst", employment: 80, medianSalary: 750000, education: "Bachelor's", growth: "Growing", aiExposure: 8.0, aiReason: "Many analytical tasks (dashboards, reports, SQL queries) are now AI-generatable; interpretation still needs domain expertise." },
      { title: "Data Scientist / ML Engineer", employment: 50, medianSalary: 1200000, education: "Master's/B.Tech", growth: "Growing", aiExposure: 6.5, aiReason: "AI assists in model building; cutting-edge research and applied ML still needs specialists." },
      { title: "IT Support / Helpdesk", employment: 120, medianSalary: 320000, education: "Diploma/Bach.", growth: "Declining", aiExposure: 7.0, aiReason: "Tier-1 support is heavily automated with AI chatbots; complex escalations remain human." },
      { title: "Cybersecurity Analyst", employment: 30, medianSalary: 1100000, education: "Bachelor's", growth: "Growing", aiExposure: 5.5, aiReason: "AI helps detect threats; human judgment required for novel attack vectors and policy." },
      { title: "Cloud / DevOps Engineer", employment: 40, medianSalary: 1300000, education: "Bachelor's", growth: "Growing", aiExposure: 6.0, aiReason: "Infrastructure-as-code and AI ops tools reduce manual effort; architecture design is human." },
      { title: "UI/UX Designer", employment: 35, medianSalary: 700000, education: "Bachelor's", growth: "Stable", aiExposure: 6.5, aiReason: "Generative AI produces prototypes rapidly; creative direction and user research remain human." },
      { title: "Product Manager (Tech)", employment: 28, medianSalary: 1800000, education: "Bachelor's+", growth: "Growing", aiExposure: 5.5, aiReason: "AI aids market research and roadmap prioritisation; stakeholder coordination is human." },
    ]
  },
  {
    name: "Finance & Banking",
    color: "#1a3a5c",
    jobs: [
      { title: "Bank Clerk / Teller", employment: 250, medianSalary: 350000, education: "Bachelor's", growth: "Declining", aiExposure: 7.5, aiReason: "Digital banking and ATMs have replaced most teller functions; remaining work is AI-assisted." },
      { title: "Loan Officer", employment: 110, medianSalary: 480000, education: "Bachelor's", growth: "Stable", aiExposure: 7.0, aiReason: "AI credit scoring models now do much of the underwriting; officer reviews edge cases." },
      { title: "Financial Analyst", employment: 80, medianSalary: 800000, education: "Bachelor's+", growth: "Growing", aiExposure: 8.5, aiReason: "Financial modelling, report writing, data analysis heavily augmented by AI; deep judgment still human." },
      { title: "Accountant / Bookkeeper", employment: 190, medianSalary: 420000, education: "Bachelor's", growth: "Declining", aiExposure: 8.0, aiReason: "Routine bookkeeping and GST filing largely automated by software; advisory roles more resilient." },
      { title: "Insurance Agent", employment: 200, medianSalary: 280000, education: "Bachelor's", growth: "Stable", aiExposure: 5.5, aiReason: "Policy recommendation AI exists; trust-based selling relationships still need human agents." },
      { title: "Stock Broker / Trader", employment: 40, medianSalary: 900000, education: "Bachelor's+", growth: "Declining", aiExposure: 8.5, aiReason: "Algo trading has already replaced most manual trading; analysis is AI-intensive." },
      { title: "Chartered Accountant (CA)", employment: 85, medianSalary: 1000000, education: "Professional", growth: "Stable", aiExposure: 7.5, aiReason: "Compliance, audit, and tax work highly amenable to AI; advisory judgement remains human." },
    ]
  },
  {
    name: "Healthcare",
    color: "#1e6b4a",
    jobs: [
      { title: "MBBS Doctor (General Physician)", employment: 130, medianSalary: 900000, education: "Professional", growth: "Growing", aiExposure: 5.0, aiReason: "AI diagnostic tools assist doctors but patient examination and complex cases need physicians." },
      { title: "Specialist Physician / Surgeon", employment: 85, medianSalary: 2000000, education: "Professional", growth: "Growing", aiExposure: 4.5, aiReason: "AI aids imaging and diagnosis; surgical skill and patient rapport not replicable yet." },
      { title: "Nurse (GNM/B.Sc)", employment: 290, medianSalary: 320000, education: "Diploma/Bach.", growth: "Growing", aiExposure: 3.5, aiReason: "Care-giving and physical assessment require human presence; documentation increasingly AI-assisted." },
      { title: "ASHA / Community Health Worker", employment: 350, medianSalary: 60000, education: "Secondary", growth: "Stable", aiExposure: 2.5, aiReason: "Community outreach and trust-building are inherently human functions." },
      { title: "Radiologist", employment: 35, medianSalary: 2500000, education: "Professional", growth: "Stable", aiExposure: 7.5, aiReason: "AI radiology models match or exceed human accuracy on many scans; high automation risk." },
      { title: "Pharmacist", employment: 80, medianSalary: 380000, education: "Bachelor's", growth: "Stable", aiExposure: 6.0, aiReason: "Drug dispensing increasingly automated; counselling and compound pharmacies still need humans." },
      { title: "Medical Lab Technician", employment: 150, medianSalary: 280000, education: "Diploma", growth: "Stable", aiExposure: 5.5, aiReason: "Automated analyzers handle most tests; unusual samples and QC still need technicians." },
    ]
  },
  {
    name: "Education",
    color: "#6b3e26",
    jobs: [
      { title: "Primary School Teacher", employment: 380, medianSalary: 280000, education: "Bachelor's+B.Ed", growth: "Stable", aiExposure: 3.5, aiReason: "AI tutors supplement but cannot replace the mentorship and social role of teachers." },
      { title: "Secondary School Teacher", employment: 290, medianSalary: 380000, education: "Bachelor's+B.Ed", growth: "Stable", aiExposure: 4.5, aiReason: "Subject delivery increasingly aided by AI tools; facilitation, guidance is human." },
      { title: "College / University Professor", employment: 150, medianSalary: 700000, education: "Master's/PhD", growth: "Stable", aiExposure: 5.0, aiReason: "Lecture preparation and research aided by AI; original research and mentorship are human." },
      { title: "Private Tutor", employment: 200, medianSalary: 200000, education: "Bachelor's", growth: "Declining", aiExposure: 6.5, aiReason: "AI tutoring apps (Khan Academy, etc.) are strong substitutes for basic tutoring." },
      { title: "EdTech Content Creator", employment: 35, medianSalary: 500000, education: "Bachelor's", growth: "Growing", aiExposure: 6.0, aiReason: "AI generates course content rapidly; quality curation and pedagogy remain human." },
      { title: "Training & Development Specialist", employment: 55, medianSalary: 550000, education: "Bachelor's+", growth: "Growing", aiExposure: 6.5, aiReason: "LMS platforms and AI coaching tools displace generic training content creation." },
    ]
  },
  {
    name: "Government & Public Services",
    color: "#2c3e50",
    jobs: [
      { title: "IAS / IPS / IFS Officer", employment: 10, medianSalary: 1200000, education: "Bachelor's+UPSC", growth: "Stable", aiExposure: 4.5, aiReason: "Policy formulation and governance need human accountability; AI aids analysis." },
      { title: "Government Clerk / Peon", employment: 850, medianSalary: 260000, education: "Secondary/Bach.", growth: "Declining", aiExposure: 7.0, aiReason: "Digitisation of government records and e-Governance portals are reducing clerking needs." },
      { title: "Police Constable / Officer", employment: 180, medianSalary: 320000, education: "Secondary/Bach.", growth: "Stable", aiExposure: 3.5, aiReason: "Law enforcement requires physical presence and judgment; AI assists surveillance." },
      { title: "Defence (Army/Navy/Air Force)", employment: 140, medianSalary: 450000, education: "Secondary/Bach.", growth: "Stable", aiExposure: 3.0, aiReason: "Combat and strategic roles need human decision-making; logistics has AI adoption." },
      { title: "Municipal / Sanitation Worker", employment: 420, medianSalary: 140000, education: "No formal", growth: "Stable", aiExposure: 2.0, aiReason: "Physical outdoor maintenance work; very limited AI displacement near-term." },
      { title: "Postal Worker / Sorter", employment: 95, medianSalary: 240000, education: "Secondary", growth: "Declining", aiExposure: 5.5, aiReason: "Automated sorting machines and digital communications reduce mail volumes." },
    ]
  },
  {
    name: "Media, Legal & Professional",
    color: "#7d3c98",
    jobs: [
      { title: "Journalist / Reporter", employment: 55, medianSalary: 380000, education: "Bachelor's", growth: "Declining", aiExposure: 6.5, aiReason: "AI writes routine news articles; investigative journalism and opinion remain human." },
      { title: "Lawyer / Advocate", employment: 130, medianSalary: 600000, education: "Professional", growth: "Stable", aiExposure: 7.0, aiReason: "Legal research and contract drafting heavily automatable; courtroom advocacy is human." },
      { title: "Graphic Designer", employment: 60, medianSalary: 420000, education: "Diploma/Bach.", growth: "Stable", aiExposure: 7.5, aiReason: "Generative AI (Midjourney, DALL-E, Firefly) can produce most commercial design; original creative direction remains human." },
      { title: "Content Writer / Copywriter", employment: 80, medianSalary: 360000, education: "Bachelor's", growth: "Declining", aiExposure: 8.5, aiReason: "LLMs produce high-quality marketing copy, blogs, and content at scale; human originality and brand voice still valued." },
      { title: "Social Media Manager", employment: 45, medianSalary: 380000, education: "Bachelor's", growth: "Growing", aiExposure: 6.5, aiReason: "AI schedules, writes captions, analyses; strategy and brand personality curation is human." },
      { title: "Chartered Secretary (CS)", employment: 25, medianSalary: 800000, education: "Professional", growth: "Stable", aiExposure: 6.5, aiReason: "Regulatory compliance documentation partially automatable; advisory role is human." },
      { title: "Human Resources Manager", employment: 70, medianSalary: 700000, education: "Bachelor's/MBA", growth: "Stable", aiExposure: 6.0, aiReason: "Recruitment screening, payroll, attendance are AI-assisted; culture and conflict resolution are human." },
    ]
  },
  {
    name: "Hospitality & Tourism",
    color: "#b7770d",
    jobs: [
      { title: "Hotel Staff (Housekeeping/Front Desk)", employment: 280, medianSalary: 160000, education: "Secondary/ITI", growth: "Growing", aiExposure: 3.5, aiReason: "Physical service roles; AI used in booking and customer service but hospitality is human." },
      { title: "Chef / Cook", employment: 350, medianSalary: 200000, education: "Vocational/ITI", growth: "Stable", aiExposure: 2.5, aiReason: "Culinary craft requires creativity and sensory judgment; robot chefs are niche." },
      { title: "Tour Guide / Travel Agent", employment: 90, medianSalary: 220000, education: "Secondary/Bach.", growth: "Stable", aiExposure: 5.5, aiReason: "Online booking AI reduces travel agents; local knowledge and experience still valued." },
      { title: "Restaurant Server / Waiter", employment: 180, medianSalary: 120000, education: "Secondary", growth: "Stable", aiExposure: 3.0, aiReason: "Human hospitality is a feature; self-service kiosks displace some but not all." },
    ]
  },
  {
    name: "Domestic & Personal Services",
    color: "#5d4037",
    jobs: [
      { title: "Domestic Helper / Maid", employment: 450, medianSalary: 72000, education: "No formal", growth: "Stable", aiExposure: 1.5, aiReason: "Physical household tasks in unstructured environments; very limited AI applicability." },
      { title: "Driver (Personal / Chauffeur)", employment: 200, medianSalary: 150000, education: "Secondary", growth: "Stable", aiExposure: 4.0, aiReason: "Self-driving cars are future risk; not imminent on Indian roads." },
      { title: "Beautician / Barber", employment: 280, medianSalary: 150000, education: "Vocational", growth: "Growing", aiExposure: 2.0, aiReason: "Manual personal grooming requiring physical skill and social interaction." },
      { title: "Plumber / Electrician (Services)", employment: 160, medianSalary: 190000, education: "ITI", growth: "Growing", aiExposure: 2.5, aiReason: "Physical repair in varied home environments; AI diagnostic tools emerging but work is manual." },
      { title: "Security Guard", employment: 650, medianSalary: 130000, education: "Secondary", growth: "Stable", aiExposure: 3.5, aiReason: "AI surveillance assists; physical patrol and access control still needs guards." },
    ]
  },
];

const METRIC_KEYS = ["aiExposure", "medianSalary", "growth", "education"];
const METRIC_LABELS = {
  aiExposure: "AI Exposure",
  medianSalary: "Median Salary",
  growth: "Job Outlook",
  education: "Education Level",
};

const GROWTH_ORDER = { "Growing": 3, "Stable": 2, "Declining": 1 };
const EDU_ORDER = { "No formal": 1, "Secondary": 2, "Vocational": 3, "ITI/Diploma": 4, "Diploma": 4, "ITI": 3, "Secondary/ITI": 3, "Diploma/Bach.": 5, "Secondary/Bach.": 3, "Bachelor's": 6, "Bachelor's+B.Ed": 7, "Bachelor's+UPSC": 7, "Bachelor's+": 7, "Bachelor's/MBA": 7, "Diploma/B.Sc": 5, "Diploma/B.E.": 5, "B.Sc": 5, "B.Tech": 6, "Master's": 8, "Master's/PhD": 9, "Master's/B.Tech": 8, "PhD": 9, "Professional": 9 };

function getColorForMetric(job, metric, sectorColor) {
  if (metric === "aiExposure") {
    const v = job.aiExposure / 10;
    if (v < 0.25) return "#22c55e";
    if (v < 0.45) return "#84cc16";
    if (v < 0.60) return "#eab308";
    if (v < 0.75) return "#f97316";
    return "#ef4444";
  }
  if (metric === "medianSalary") {
    const s = job.medianSalary;
    if (s < 150000) return "#93c5fd";
    if (s < 300000) return "#60a5fa";
    if (s < 600000) return "#3b82f6";
    if (s < 1200000) return "#1d4ed8";
    return "#1e3a8a";
  }
  if (metric === "growth") {
    const g = job.growth;
    if (g === "Growing") return "#22c55e";
    if (g === "Stable") return "#facc15";
    return "#f87171";
  }
  if (metric === "education") {
    const e = EDU_ORDER[job.education] || 5;
    if (e <= 2) return "#a8a29e";
    if (e <= 4) return "#f97316";
    if (e <= 6) return "#3b82f6";
    return "#7c3aed";
  }
  return sectorColor;
}

function formatSalary(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

function computeTreemap(items, width, height) {
  const total = items.reduce((s, d) => s + d.value, 0);
  const result = [];
  
  function squarify(remaining, row, x, y, w, h) {
    if (!remaining.length) return;
    const area = w * h;
    const rowTotal = row.reduce((s, d) => s + d.value, 0);
    const next = remaining[0];
    const newRowTotal = rowTotal + next.value;
    
    function worst(r) {
      if (!r.length) return Infinity;
      const rt = r.reduce((s, d) => s + d.value, 0);
      const s = rt / total * area;
      const maxV = Math.max(...r.map(d => d.value / total * area));
      const minV = Math.min(...r.map(d => d.value / total * area));
      const l = w < h ? w : h;
      return Math.max((l * l * maxV) / (s * s), (s * s) / (l * l * minV));
    }
    
    if (!row.length || worst(row) >= worst([...row, next])) {
      squarify(remaining.slice(1), [...row, next], x, y, w, h);
    } else {
      const rt = rowTotal / total * area;
      if (w <= h) {
        const rh = rt / w;
        let cx = x;
        for (const d of row) {
          const rw = (d.value / rowTotal) * rt / rh;
          result.push({ ...d, x: cx, y, width: rw, height: rh });
          cx += rw;
        }
        squarify(remaining, [], x, y + rh, w, h - rh);
      } else {
        const rw = rt / h;
        let cy = y;
        for (const d of row) {
          const rh2 = (d.value / rowTotal) * rt / rw;
          result.push({ ...d, x, y: cy, width: rw, height: rh2 });
          cy += rh2;
        }
        squarify(remaining, [], x + rw, y, w - rw, h);
      }
    }
  }
  
  const sorted = [...items].sort((a, b) => b.value - a.value);
  squarify(sorted, [], 0, 0, width, height);
  return result;
}

export default function IndiaJobsVisualizer() {
  const [metric, setMetric] = useState("aiExposure");
  const [tooltip, setTooltip] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 900, height: 520 });

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ width: Math.max(320, rect.width), height: Math.max(300, Math.min(580, rect.width * 0.58)) });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const allJobs = SECTORS.flatMap(sector =>
    sector.jobs.map(job => ({
      ...job,
      sector: sector.name,
      sectorColor: sector.color,
      value: job.employment,
    }))
  ).filter(job => {
    const q = search.toLowerCase();
    return !q || job.title.toLowerCase().includes(q) || job.sector.toLowerCase().includes(q);
  }).filter(job => !selectedSector || job.sector === selectedSector);

  const nodes = computeTreemap(allJobs, dims.width, dims.height);
  const totalEmp = allJobs.reduce((s, j) => s + j.employment, 0);
  const avgAI = allJobs.reduce((s, j) => s + j.aiExposure * j.employment, 0) / totalEmp;

  return (
    <div style={{ fontFamily: "'Syne', 'Helvetica Neue', sans-serif", background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0e1a; }
        .metric-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid #2d3748; background: transparent; color: #94a3b8; font-family: inherit; font-size: 12px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .metric-btn.active { background: #1e3a5f; border-color: #3b82f6; color: #93c5fd; }
        .metric-btn:hover:not(.active) { border-color: #4a5568; color: #cbd5e1; }
        .sector-chip { padding: 4px 10px; border-radius: 4px; border: 1px solid #2d3748; background: transparent; color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 10px; cursor: pointer; transition: all 0.15s; }
        .sector-chip.active { background: #1a2540; border-color: #60a5fa; color: #e2e8f0; }
        .stat-card { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 12px 16px; }
      `}</style>
      <div style={{ padding: "24px 28px 0", background: "linear-gradient(180deg, #0d1224 0%, #0a0e1a 100%)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#f1f5f9" }}>🇮🇳 India Job Market</span>
              <span style={{ background: "#1e3a5f", color: "#60a5fa", fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", border: "1px solid #1d4ed8" }}>AI EXPOSURE VISUALIZER</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>Inspired by Karpathy's US jobs viz · India occupations across 13 sectors · ~{(totalEmp / 100).toFixed(0)} crore workers</p>
          </div>
          <input placeholder="Search occupation or sector…" value={search} onChange={e => setSearch(e.target.value)} style={{ background: "#111827", border: "1px solid #2d3748", borderRadius: 8, color: "#e2e8f0", padding: "8px 14px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: "none", width: 200 }} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0 16px" }}>
          <div className="stat-card"><div style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono", marginBottom: 2 }}>TOTAL WORKERS</div><div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{(totalEmp / 100).toFixed(0)} Cr</div></div>
          <div className="stat-card"><div style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono", marginBottom: 2 }}>AVG AI EXPOSURE</div><div style={{ fontSize: 18, fontWeight: 700, color: avgAI > 5 ? "#f97316" : avgAI > 3.5 ? "#eab308" : "#22c55e" }}>{avgAI.toFixed(1)} / 10</div></div>
          <div className="stat-card"><div style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono", marginBottom: 2 }}>OCCUPATIONS</div><div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{allJobs.length}</div></div>
          <div className="stat-card"><div style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono", marginBottom: 2 }}>HIGH RISK (&gt;7)</div><div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>{allJobs.filter(j => j.aiExposure >= 7).length} jobs</div></div>
          <div className="stat-card"><div style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono", marginBottom: 2 }}>SAFE (&lt;3)</div><div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{allJobs.filter(j => j.aiExposure < 3).length} jobs</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {METRIC_KEYS.map(k => <button key={k} className={`metric-btn ${metric === k ? "active" : ""}`} onClick={() => setMetric(k)}>{METRIC_LABELS[k]}</button>)}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <button className={`sector-chip ${!selectedSector ? "active" : ""}`} onClick={() => setSelectedSector(null)}>ALL</button>
          {SECTORS.map(s => <button key={s.name} className={`sector-chip ${selectedSector === s.name ? "active" : ""}`} onClick={() => setSelectedSector(selectedSector === s.name ? null : s.name)} style={selectedSector === s.name ? { borderColor: s.color, color: s.color } : {}}>{s.name}</button>)}
        </div>
      </div>
      <div ref={containerRef} style={{ padding: "0 28px 8px", position: "relative" }}>
        <div style={{ position: "relative", width: "100%", height: dims.height, overflow: "hidden", borderRadius: 10, border: "1px solid #1f2937" }}>
          <svg width={dims.width} height={dims.height} style={{ display: "block" }}>
            {nodes.map((node, i) => {
              const color = getColorForMetric(node, metric, node.sectorColor);
              const w = Math.max(0, node.width - 1.5);
              const h = Math.max(0, node.height - 1.5);
              const fontSize = Math.min(12, Math.max(6, Math.sqrt(w * h) / 8));
              const showText = w > 30 && h > 18;
              const showSub = w > 60 && h > 34;
              return (
                <g key={i} transform={`translate(${node.x + 0.75}, ${node.y + 0.75})`} onMouseEnter={(e) => setTooltip({ job: node, x: e.clientX, y: e.clientY })} onMouseLeave={() => setTooltip(null)} onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)} style={{ cursor: "pointer" }}>
                  <rect width={w} height={h} fill={color} opacity={0.88} rx={2} />
                  <rect width={w} height={h} fill="url(#noise)" rx={2} opacity={0.06} />
                  {showText && <text x={4} y={fontSize + 3} fontSize={fontSize} fill="white" fontWeight="600" style={{ fontFamily: "Syne, sans-serif", pointerEvents: "none" }}><title>{node.title}</title>{node.title.length > 20 ? node.title.slice(0, 18) + "…" : node.title}</text>}
                  {showSub && <text x={4} y={fontSize * 2 + 5} fontSize={Math.max(7, fontSize - 1)} fill="rgba(255,255,255,0.65)" style={{ fontFamily: "JetBrains Mono, monospace", pointerEvents: "none" }}>{metric === "aiExposure" && `AI: ${node.aiExposure}/10`}{metric === "medianSalary" && formatSalary(node.medianSalary)}{metric === "growth" && node.growth}{metric === "education" && node.education}</text>}
                </g>
              );
            })}
            <defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect id="noise" width="100%" height="100%" filter="url(#noise)" /></defs>
          </svg>
        </div>
      </div>
      <div style={{ padding: "8px 28px 16px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {metric === "aiExposure" && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, color: "#64748b", fontFamily: "JetBrains Mono" }}>AI EXPOSURE:</span>{[["#22c55e", "Low (0–3)"], ["#eab308", "Medium (4–6)"], ["#f97316", "High (7–8)"], ["#ef4444", "Critical (9–10)"]].map(([c, l]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}><span style={{ width: 10, height: 10, background: c, borderRadius: 2, display: "inline-block" }} />{l}</span>)}</div>}
        {metric === "growth" && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, color: "#64748b", fontFamily: "JetBrains Mono" }}>OUTLOOK:</span>{[["#22c55e", "Growing"], ["#facc15", "Stable"], ["#f87171", "Declining"]].map(([c, l]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}><span style={{ width: 10, height: 10, background: c, borderRadius: 2, display: "inline-block" }} />{l}</span>)}</div>}
        <span style={{ fontSize: 10, color: "#374151", fontFamily: "JetBrains Mono", marginLeft: "auto" }}>Rectangle area ∝ employment size · Data: PLFS 2023-24, India KLEMS, NSSO</span>
      </div>
      {tooltip && <div style={{ position: "fixed", left: Math.min(tooltip.x + 14, window.innerWidth - 300), top: Math.max(tooltip.y - 10, 8), background: "#111827", border: "1px solid #2d3748", borderRadius: 10, padding: "14px 16px", pointerEvents: "none", zIndex: 1000, maxWidth: 290, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{tooltip.job.title}</div>
        <div style={{ fontSize: 11, color: "#60a5fa", fontFamily: "JetBrains Mono", marginBottom: 8 }}>📂 {tooltip.job.sector}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 8 }}>
          {[ ["Workers", `${(tooltip.job.employment / 100).toFixed(2)} Cr`], ["Median Salary", formatSalary(tooltip.job.medianSalary)], ["Education", tooltip.job.education], ["Outlook", tooltip.job.growth] ].map(([k, v]) => <div key={k}><div style={{ fontSize: 9, color: "#64748b", fontFamily: "JetBrains Mono" }}>{k.toUpperCase()}</div><div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{v}</div></div>)}
        </div>
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono" }}>AI EXPOSURE</span><span style={{ fontSize: 16, fontWeight: 800, color: tooltip.job.aiExposure >= 7 ? "#ef4444" : tooltip.job.aiExposure >= 5 ? "#f97316" : tooltip.job.aiExposure >= 3 ? "#eab308" : "#22c55e" }}>{tooltip.job.aiExposure} / 10</span></div>
          <div style={{ background: "#1f2937", borderRadius: 4, height: 6, marginBottom: 6 }}><div style={{ height: 6, borderRadius: 4, width: `${tooltip.job.aiExposure * 10}%`, background: tooltip.job.aiExposure >= 7 ? "#ef4444" : tooltip.job.aiExposure >= 5 ? "#f97316" : tooltip.job.aiExposure >= 3 ? "#eab308" : "#22c55e", transition: "width 0.3s" }} /></div>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{tooltip.job.aiReason}</p>
        </div>
      </div>}
      <div style={{ padding: "0 28px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[ { label: "⚠️ Highest AI Exposure", jobs: [...allJobs].sort((a, b) => b.aiExposure - a.aiExposure).slice(0, 8), color: "#ef4444" }, { label: "✅ Most AI-Safe Roles", jobs: [...allJobs].sort((a, b) => a.aiExposure - b.aiExposure).slice(0, 8), color: "#22c55e" } ].map(({ label, jobs, color }) => <div key={label} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: "14px 16px" }}><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#f1f5f9" }}>{label}</div>{jobs.map((j, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #1f2937" }}><div><div style={{ fontSize: 12, color: "#e2e8f0" }}>{j.title}</div><div style={{ fontSize: 10, color: "#475569", fontFamily: "JetBrains Mono" }}>{j.sector}</div></div><span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 12, color }}>{j.aiExposure}/10</span></div>)}</div>)}
        </div>
      </div>
    </div>
  );
}
