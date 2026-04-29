export type SeedOpportunity = {
  id: string;
  title: string;
  org: string;
  category: "Arts" | "Medicine" | "STEM" | "Community" | "Education" | "Advocacy";
  major: string[];
  hours: number;
  location: string;
  description: string;
  date: string;
};

export const SEED_OPPORTUNITIES: SeedOpportunity[] = [
  { id: "seed-1", title: "Studio Assistant — Mural Project", org: "Bronx Arts Collective", category: "Arts", major: ["Art", "Design", "Architecture"], hours: 4, location: "Bronx, NY", description: "Help artists prep walls, mix paint and document a community mural near Yankee Stadium.", date: "2025-07-12" },
  { id: "seed-2", title: "Gallery Docent — Saturday Tours", org: "Brooklyn Museum", category: "Arts", major: ["Art History", "English", "Communications"], hours: 5, location: "Brooklyn, NY", description: "Lead Saturday afternoon walking tours for first-time visitors.", date: "2025-07-19" },
  { id: "seed-3", title: "ER Volunteer — Patient Support", org: "NYC Health + Hospitals/Lincoln", category: "Medicine", major: ["Pre-Med", "Nursing", "Public Health"], hours: 6, location: "South Bronx, NY", description: "Comfort patients, escort visitors and stock supplies in a Level 1 trauma ER.", date: "2025-07-08" },
  { id: "seed-4", title: "Free Clinic Intake Volunteer", org: "NY Common Pantry Health Hub", category: "Medicine", major: ["Public Health", "Pre-Med", "Social Work"], hours: 4, location: "East Harlem, NY", description: "Greet patients, take vitals and translate intake forms (Spanish a plus).", date: "2025-07-15" },
  { id: "seed-5", title: "Robotics Mentor — High School Team", org: "FIRST NYC", category: "STEM", major: ["Computer Science", "Engineering", "Mechatronics"], hours: 3, location: "Queens, NY", description: "Mentor a HS robotics team on CAD, Python and field strategy.", date: "2025-07-10" },
  { id: "seed-6", title: "Coding Coach — Code Nation", org: "Code Nation NYC", category: "STEM", major: ["Computer Science", "Information Systems", "Math"], hours: 2, location: "Manhattan, NY", description: "Lead beginner JavaScript labs for Title-I high school students.", date: "2025-07-17" },
  { id: "seed-7", title: "Bowery Mission — Meal Service", org: "The Bowery Mission", category: "Community", major: ["Any Major"], hours: 4, location: "Lower Manhattan, NY", description: "Plate and serve hot meals to NYC neighbors experiencing homelessness.", date: "2025-07-05" },
  { id: "seed-8", title: "Habitat for Humanity Build Day", org: "Habitat NYC & Westchester", category: "Community", major: ["Engineering", "Architecture", "Any Major"], hours: 8, location: "Brownsville, NY", description: "Frame walls, install drywall and landscape on an affordable home build.", date: "2025-07-26" },
  { id: "seed-9", title: "ESL Tutor — Adult Learners", org: "Queens Public Library", category: "Education", major: ["English", "Education", "Linguistics"], hours: 2, location: "Flushing, NY", description: "Run conversation circles for adults preparing for the citizenship test.", date: "2025-07-09" },
  { id: "seed-10", title: "After-School Reading Buddy", org: "Read Ahead", category: "Education", major: ["Education", "Psychology", "Any Major"], hours: 1, location: "Citywide", description: "30 min weekly reading sessions with K-3 students at Title-I schools.", date: "2025-07-11" },
  { id: "seed-11", title: "Voter Registration Canvasser", org: "League of Women Voters NYC", category: "Advocacy", major: ["Political Science", "Sociology", "Any Major"], hours: 3, location: "Citywide", description: "Register CUNY peers and Bronx residents ahead of the 2025 primaries.", date: "2025-07-14" },
  { id: "seed-12", title: "Tenant Rights Phone Bank", org: "Housing Justice for All", category: "Advocacy", major: ["Law", "Sociology", "Urban Studies"], hours: 2, location: "Remote", description: "Call NYCHA tenants about Good Cause Eviction protections.", date: "2025-07-18" },
  { id: "seed-13", title: "Climate Block Cleanup", org: "GrowNYC", category: "Community", major: ["Environmental Science", "Biology", "Any Major"], hours: 3, location: "Astoria, NY", description: "Compost run + waterfront cleanup along the East River esplanade.", date: "2025-07-22" },
  { id: "seed-14", title: "Performing Arts Festival Stagehand", org: "Lincoln Center", category: "Arts", major: ["Theater", "Music", "Communications"], hours: 5, location: "Manhattan, NY", description: "Help run sound checks and load-in/out for the Summer for the City festival.", date: "2025-07-25" },
];

export const ALL_MAJORS = Array.from(
  new Set(SEED_OPPORTUNITIES.flatMap((o) => o.major))
).sort();
