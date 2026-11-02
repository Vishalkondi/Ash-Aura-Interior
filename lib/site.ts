/**
 * All site content lives here. Edit this file to change text, contact details,
 * projects and photos — no component changes needed.
 */

export const site = {
  name: "Ash Aura Interiors",
  title: "Ash Aura Interiors | Interior Designer in PCMC, Pune",
  description:
    "Ash Aura Interiors is an interior design studio in PCMC, Pune, led by Aishwarya Alatagi. Residential and commercial interiors, turnkey execution, styling and décor, shaped by light, texture and calm.",
  tagline: "Interiors shaped by light, texture and calm.",
  location: "PCMC, Pune",
  founder: "Aishwarya Alatagi",
  experience: "8+",
};

/** Public URL: NEXT_PUBLIC_SITE_URL once a domain is connected, else Vercel's production URL. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const contact = {
  phoneDisplay: "+91 93701 51713",
  phoneHref: "tel:+919370151713",
  email: "ashaura.interiors@gmail.com",
  instagramHandle: "@ash_aura_interiors",
  instagramUrl: "https://www.instagram.com/ash_aura_interiors/",
  whatsappNumber: "919370151713",
  whatsappUrl: `https://wa.me/919370151713?text=${encodeURIComponent(
    "Hello Aishwarya, I came across Ash Aura Interiors and would like to discuss an interior design project.",
  )}`,
  studio: "PCMC, Pune",
};

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "#contact" },
];

export const marquee = [
  "Residential",
  "Commercial",
  "Turnkey",
  "Styling",
  "Furniture",
  "Lighting",
  "Joinery",
  "Décor",
];

export const statement = {
  eyebrow: "The studio",
  heading: "spaces that feel like you, finished to the last detail",
  body: "Ash Aura Interiors is a design studio in PCMC, Pune, creating homes and workplaces that are calm, warm and deeply personal. We begin with how you live and work, then layer natural light, honest materials and considered joinery until every room feels resolved. From the first sketch to the last cushion, one team carries your project through.",
  facts: [
    { value: "8+ years", label: "of designing and delivering interiors" },
    { value: "Aishwarya Alatagi", label: "Founder and lead designer" },
    { value: "PCMC, Pune", label: "Studio location" },
  ],
};

/* ----------------------------------------------------------------------------
 * PHOTOS
 * Put image files in /public/photos and set the path for a slot, e.g.
 *   "hero-1": "/photos/living-room.jpg",
 * Leave a slot as "" to show a tone-coloured placeholder panel.
 * ------------------------------------------------------------------------- */

export type PhotoSlot =
  | "hero-1"
  | "hero-2"
  | "hero-3"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "feature"
  | "founder";

export const photos: Record<PhotoSlot, string> = {
  "hero-1": "/photos/sage-living-room.jpg",
  "hero-2": "/photos/tv-wall.jpg",
  "hero-3": "/photos/study-corner.jpg",
  p1: "/photos/jhoola-living-dining.jpg",
  p2: "/photos/mandala-living-room.jpg",
  p3: "/photos/tv-wall.jpg",
  p4: "",
  p5: "/photos/sage-living-room.jpg",
  p6: "",
  p7: "/photos/study-corner.jpg",
  feature: "/photos/stained-glass-hall.jpg",
  founder: "",
};

/** Alt text, placeholder label and placeholder tone for each slot. */
export const photoDetails: Record<PhotoSlot, { alt: string; label: string; tone: string }> = {
  "hero-1": { alt: "Living room with a sage and cream sculpted wall, curved sofa and rattan pendant", label: "Living room", tone: "#2b241d" },
  "hero-2": { alt: "TV wall with fluted wood panels, backlit shelves and a floating console", label: "TV wall", tone: "#3a2f25" },
  "hero-3": { alt: "Study corner with a built-in desk, lit open shelving and a white swivel chair", label: "Study", tone: "#1f2a22" },
  p1: { alt: "Open living and dining with a carved wooden jhoola, sculpted rug and painted screens", label: "Project 01", tone: "#2e261f" },
  p2: { alt: "Living room with a terracotta mandala wall, fluted wood panels and a low sectional sofa", label: "Project 02", tone: "#3b2a26" },
  p3: { alt: "TV wall with fluted wood panels, backlit shelves and a floating console", label: "Project 03", tone: "#24302a" },
  p4: { alt: "Reception and lounge of a boutique office", label: "Project 04", tone: "#2a2522" },
  p5: { alt: "Living room with a sage and cream sculpted wall, curved sofa and rattan pendant", label: "Project 05", tone: "#3d3024" },
  p6: { alt: "Café interior with banquette seating and terracotta tones", label: "Project 06", tone: "#3a1f22" },
  p7: { alt: "Study corner with a built-in desk, lit open shelving and a white swivel chair", label: "Project 07", tone: "#2c2a24" },
  feature: { alt: "Sunlit hall with a coloured glass inlay running from the ceiling down the wall and across the floor", label: "Feature", tone: "#13382b" },
  founder: { alt: "Portrait of Aishwarya Alatagi, founder of Ash Aura Interiors", label: "Aishwarya", tone: "#2b241d" },
};

/* ----------------------------------------------------------------------------
 * PROJECTS
 * `grid` holds the 12-column placement used on tablet and desktop.
 * A project is only shown once its photo slot has an image.
 * ------------------------------------------------------------------------- */

export type ProjectImage = { src: string; alt: string };

export type Project = {
  slot: PhotoSlot;
  slug: string;
  name: string;
  type: string;
  /** Shown on the project page. Leave `area`, `year` and `scope` out until confirmed. */
  location: string;
  /** Used by the filter above the project grid. */
  category: "Residential" | "Commercial";
  area?: string;
  year?: string;
  /** What the studio did, e.g. "Full home: design, joinery and styling". */
  scope?: string;
  summary: string;
  story: string[];
  /** Extra photos for the project page gallery (the main photo is always included). */
  gallery?: ProjectImage[];
  /** A real before/after pair from the same viewpoint, shown with a comparison slider. */
  beforeAfter?: { before: ProjectImage; after: ProjectImage; caption?: string };
  aspect: string;
  grid: string;
};

export const projects: Project[] = [
  {
    slot: "p1",
    category: "Residential",
    slug: "wakad-residence",
    name: "Wakad Residence",
    type: "Living & dining with jhoola · Residential",
    location: "Wakad, Pune",
    summary: "An open living and dining room gathered around a carved wooden jhoola.",
    story: [
      "The swing sits at the centre of the plan, hung from the ceiling on rope and brass so it reads as furniture rather than an afterthought. Its carved backrest and indigo cushions set the tone for the rest of the room.",
      "Painted screens and carved timber frame the dining area behind, while a sculpted floral rug and a dark stone coffee table anchor the seating. Track lights keep the ceiling clean, and the warm grey floor and ivory drapes let the crafted pieces carry the room.",
    ],
    aspect: "aspect-[4/3]",
    grid: "md:col-span-7",
  },
  {
    slot: "p2",
    category: "Residential",
    slug: "ravet-residence",
    name: "Ravet Residence",
    type: "Mandala wall living room · Residential",
    location: "Ravet, Pune",
    summary: "A sunlit living room built around a terracotta mandala wall.",
    story: [
      "A hand-drawn mandala on a textured terracotta wall becomes the room's centrepiece, framed by fluted wood panels and edged with concealed warm light.",
      "A low, deep sectional in natural linen wraps the space, layered with rust and indigo cushions. A round jute rug, a stone-topped coffee table and an arched niche with carved wood bring craft and warmth without clutter.",
    ],
    aspect: "aspect-[4/5]",
    grid: "md:col-span-4 md:col-start-9 md:mt-28",
  },
  {
    slot: "p3",
    category: "Residential",
    slug: "pimple-saudagar-apartment",
    name: "Pimple Saudagar Apartment",
    type: "TV wall & joinery · Residential",
    location: "Pimple Saudagar, Pune",
    summary: "A media wall that balances fluted wood, stone texture and soft light.",
    story: [
      "The television sits on a large stone-finish panel with a gentle arched reveal, flanked by fluted wood slats and a pair of glass pendants on one side.",
      "On the other, a tall backlit niche holds books, vases and trailing plants. A floating console with a fluted shutter and a soft under-glow keeps the floor clear and makes the wall feel lighter in the evening.",
    ],
    aspect: "aspect-square",
    grid: "md:col-span-5 md:col-start-2",
  },
  {
    slot: "p4",
    category: "Commercial",
    slug: "hinjewadi-studio-office",
    name: "Hinjewadi Studio Office",
    type: "Workplace · Commercial",
    location: "Hinjewadi, Pune",
    summary: "A workplace interior.",
    story: [],
    aspect: "aspect-[3/2]",
    grid: "md:col-span-6 md:col-start-7 md:mt-20",
  },
  {
    slot: "p5",
    category: "Residential",
    slug: "chinchwad-apartment",
    name: "Chinchwad Apartment",
    type: "Sage living room · Residential",
    location: "Chinchwad, Pune",
    summary: "A calm living room in sage and cream with a sculpted, softly lit wall.",
    story: [
      "Sage and cream panels curve across the main wall, traced with concealed light and a raised plaster leaf motif that grows from the corner.",
      "A curved bouclé sofa and a sage swivel chair keep the lines soft, while an arched niche with lit shelves, a rattan pendant and an olive tree bring texture and life to the room.",
    ],
    aspect: "aspect-[4/5]",
    grid: "md:col-span-4 md:col-start-8 md:mt-24",
  },
  {
    slot: "p6",
    category: "Commercial",
    slug: "pimple-nilakh-cafe",
    name: "Pimple Nilakh Café",
    type: "Café · Commercial",
    location: "Pimple Nilakh, Pune",
    summary: "A café interior.",
    story: [],
    aspect: "aspect-[16/10]",
    grid: "md:col-span-8 md:mt-24",
  },
  {
    slot: "p7",
    category: "Residential",
    slug: "moshi-family-home",
    name: "Moshi Family Home",
    type: "Study corner · Joinery",
    location: "Moshi, Pune",
    summary: "A compact study corner fitted into a guest bedroom.",
    story: [
      "A built-in desk with a curved backsplash tucks into the corner beside the daybed, so the room works for both guests and everyday study.",
      "Wall cabinets and open shelves above are lit from within, and the light oak and greige palette keeps the joinery quiet and the small room feeling open.",
    ],
    aspect: "aspect-square",
    grid: "md:col-span-5 md:col-start-3",
  },
];

/** Projects that have a photo, in display order. Only these get cards and pages. */
export const visibleProjects = projects.filter((project) => photos[project.slot]);

export function getProject(slug: string) {
  return visibleProjects.find((project) => project.slug === slug);
}

export const projectHref = (project: Project) => `/projects/${project.slug}`;

export const feature = {
  eyebrow: "Colour & material",
  heading: "colour with depth, materials with character",
  body: "Bottle greens, oxblood and warm stone; fluted wood, brushed brass and hand-finished plaster. We choose palettes that age gracefully and materials that feel good to touch, so your space grows richer with time rather than tired.",
  cta: "Start a project",
};

export const services = {
  eyebrow: "Services",
  heading: "what we do",
  items: [
    {
      title: "Residential design",
      body: "Apartments, villas and bungalows planned around the way your family lives, with layouts, lighting and storage resolved room by room.",
      points: ["Space planning", "Kitchens & wardrobes", "Lighting design"],
    },
    {
      title: "Commercial interiors",
      body: "Offices, clinics, cafés and retail spaces that work hard every day while carrying a clear, memorable character for your brand.",
      points: ["Workplaces", "Hospitality", "Retail & clinics"],
    },
    {
      title: "Turnkey execution",
      body: "One accountable team for civil work, electricals, false ceilings, carpentry and finishes, delivered to schedule with regular site updates.",
      points: ["Site supervision", "Vendor management", "Quality checks"],
    },
    {
      title: "Styling and décor",
      body: "The finishing layer: furniture, soft furnishings, art and accessories curated so the space feels complete on the day you move in.",
      points: ["Furniture selection", "Soft furnishings", "Art & accessories"],
    },
  ],
};

export const processSection = {
  eyebrow: "Process",
  heading: "how a project unfolds",
  intro: "Five clear stages and one point of contact. You always know what happens next, and what it will cost.",
  steps: [
    {
      title: "Consultation",
      body: "We meet at your site or our studio to understand your needs, routines, budget and timeline.",
    },
    {
      title: "Concept",
      body: "Mood boards, layouts and a material palette set the direction before any detailed drawing begins.",
    },
    {
      title: "Detailed design",
      body: "3D views, working drawings, joinery details and a clear bill of quantities, all signed off with you.",
    },
    {
      title: "Execution",
      body: "Our team manages trades and vendors on site, with quality checks and progress updates at every stage.",
    },
    {
      title: "Styling and handover",
      body: "We style, clean and walk you through every room, so you receive a space that is truly ready to live in.",
    },
  ],
};

export const founderSection = {
  eyebrow: "The designer",
  name: "Aishwarya Alatagi",
  role: "Founder and lead designer",
  years: "8+",
  yearsLabel: "years of experience",
  bio: [
    "Aishwarya founded Ash Aura Interiors to bring a calm, considered way of designing to homes and workplaces across PCMC and Pune.",
    "With more than eight years in interior design, she leads every project herself, from the first conversation and concept through drawings, site work and the final styling.",
  ],
  note: "Speak to Aishwarya directly",
};

export const contactSection = {
  eyebrow: "Contact",
  heading: "let's design your space",
  body: "Tell us about your home or workplace. Share a floor plan, a few photographs or simply an idea, and Aishwarya will get back to you to plan a first consultation.",
};

export const faq = {
  eyebrow: "Questions",
  heading: "before you begin",
  items: [
    {
      q: "Which areas do you work in?",
      a: "Our studio is in PCMC, and we take on homes and workplaces across Pimpri-Chinchwad and Pune, including Wakad, Hinjewadi, Ravet, Pimple Saudagar, Baner and Aundh. For projects further away, get in touch and we will talk it through.",
    },
    {
      q: "Do you handle execution, or only design?",
      a: "Both. You can engage us for design alone, or for turnkey execution, where one team manages civil work, electricals, false ceilings, carpentry, finishes and styling through to handover.",
    },
    {
      q: "Can you design a single room?",
      a: "Yes. Alongside full homes we design single rooms and pieces such as kitchens, wardrobes, TV walls, study corners and pooja units.",
    },
    {
      q: "Will I see the design before work starts?",
      a: "Always. You review mood boards, layouts, material samples and 3D views, and nothing goes to site until you have signed off the detailed drawings.",
    },
    {
      q: "How is the cost worked out?",
      a: "Every project is quoted from the detailed design, with a clear bill of quantities covering materials, finishes and labour, so you know what you are paying for before work begins.",
    },
    {
      q: "How long does a project take?",
      a: "It depends on the size of the space and the scope of work. After the first consultation we share a timeline for your project, and keep you updated at every stage on site.",
    },
  ],
};

export const enquiry = {
  heading: "tell us about your space",
  spaceTypes: ["Apartment", "Villa / bungalow", "Office", "Café / retail", "Single room"],
  budgets: ["Under ₹5 lakh", "₹5–10 lakh", "₹10–20 lakh", "₹20 lakh +", "Not sure yet"],
};

/* ----------------------------------------------------------------------------
 * BOOK A CONSULTATION
 * The day and time-slot picker. Visitors choose from the next `daysAhead`
 * days (starting tomorrow), skipping `closedDays` (0 = Sunday … 6 = Saturday).
 * TO CONFIRM WITH AISHWARYA: working days, slot times and meeting types.
 * ------------------------------------------------------------------------- */

export const booking = {
  eyebrow: "Book a consultation",
  heading: "pick a time to talk",
  body: "Choose a day and a time that suits you, and Aishwarya will confirm it with you on WhatsApp.",
  daysAhead: 14,
  closedDays: [0],
  slots: ["11:00 am", "12:30 pm", "3:00 pm", "4:30 pm", "6:00 pm"],
  meetingTypes: ["At the studio", "At my site", "Video call"],
};

/* ----------------------------------------------------------------------------
 * INSTAGRAM
 * Six photos shown as a grid that links to the studio's Instagram. They are
 * local files in /public/photos (square crops work best). To link a tile to a
 * specific post, add its address as `href`; otherwise it opens the profile.
 * ------------------------------------------------------------------------- */

export type InstagramPost = { src: string; alt: string; href?: string };

export const instagram = {
  eyebrow: "Instagram",
  heading: "from the studio",
  body: "Recent projects, details from site and the materials we love.",
  posts: [
    { src: "/photos/mandala-living-room.jpg", alt: "Terracotta mandala wall in a sunlit living room" },
    { src: "/photos/study-corner.jpg", alt: "Built-in study desk with lit shelves above" },
    { src: "/photos/jhoola-living-dining.jpg", alt: "Carved wooden jhoola in an open living and dining room" },
    { src: "/photos/tv-wall.jpg", alt: "Fluted wood TV wall with a backlit niche" },
    { src: "/photos/stained-glass-hall.jpg", alt: "Coloured glass inlay running across a sunlit hall" },
    { src: "/photos/sage-living-room.jpg", alt: "Sage and cream sculpted wall with a curved sofa" },
  ] as InstagramPost[],
};

/* ----------------------------------------------------------------------------
 * PORTFOLIO DOWNLOAD
 * Visitors leave a name and phone number (emailed to Aishwarya), then get a
 * download link. The section only appears once the PDF exists at
 * public + `file`, e.g. public/portfolio/ash-aura-interiors-portfolio.pdf.
 * ------------------------------------------------------------------------- */

export const portfolio = {
  eyebrow: "Portfolio",
  heading: "take our work with you",
  body: "Leave your name and number to download a PDF of our recent homes and workplaces, to read at your own pace.",
  file: "/portfolio/ash-aura-interiors-portfolio.pdf",
};

/* ----------------------------------------------------------------------------
 * TESTIMONIALS
 * Add real client quotes only, with the client's permission. The section stays
 * hidden while this list is empty. Example:
 *   { name: "Client name", area: "Wakad", quote: "…", photo: "/photos/client.jpg" },
 * ------------------------------------------------------------------------- */

export type Testimonial = { name: string; area: string; quote: string; photo?: string };

export const testimonials: Testimonial[] = [];

/* ----------------------------------------------------------------------------
 * STYLE QUIZ
 * Each style links to a project whose photo shows it.
 * ------------------------------------------------------------------------- */

export type QuizStyle = { id: string; label: string; hint: string; description: string; project: string };

export const quiz = {
  eyebrow: "Find your style",
  heading: "four questions to your style",
  intro: "Answer four quick questions and we'll suggest a direction for your space, then send your answers to Aishwarya on WhatsApp.",
  rooms: ["Living room", "Bedroom", "Kitchen", "Study / work corner", "Full home", "Office / café"],
  sizes: ["Single room", "1 BHK", "2 BHK", "3 BHK", "4 BHK + / villa"],
  styles: [
    {
      id: "soft-organic",
      label: "Soft organic",
      hint: "Curves, sage, sculpted walls",
      description:
        "Rounded furniture, sculpted plaster and a muted sage and cream palette, with light tucked into niches and coves for a calm, gentle room.",
      project: "chinchwad-apartment",
    },
    {
      id: "indian-contemporary",
      label: "Indian contemporary",
      hint: "Carved wood, jhoola, brass",
      description:
        "Crafted pieces such as a carved jhoola, painted screens and brass accents, set against quiet floors and walls so the craft carries the room.",
      project: "wakad-residence",
    },
    {
      id: "earthy-warm",
      label: "Earthy and warm",
      hint: "Terracotta, jute, hand-drawn motifs",
      description:
        "Terracotta and lime-plaster textures, fluted timber, jute and plenty of greenery, with hand-drawn motifs that make the room feel rooted and warm.",
      project: "ravet-residence",
    },
    {
      id: "modern-luxe",
      label: "Modern luxe",
      hint: "Fluted wood, stone, layered light",
      description:
        "Stone-finish panels, fluted wood, floating joinery and layered warm lighting for a polished room that still feels inviting.",
      project: "pimple-saudagar-apartment",
    },
    {
      id: "warm-minimal",
      label: "Warm minimal",
      hint: "Light oak, greige, hidden storage",
      description:
        "Light oak and greige, clean built-in joinery with hidden storage, and soft cove lighting, so small spaces feel open and uncluttered.",
      project: "moshi-family-home",
    },
  ] satisfies QuizStyle[],
};

/* ----------------------------------------------------------------------------
 * COST ESTIMATOR
 * Gives visitors an indicative range: carpet area × rate per sq ft for the
 * chosen finish, then multiplied by the scope. Ranges are rounded to the
 * nearest ₹10,000 and always shown as "indicative".
 * TO CONFIRM WITH AISHWARYA: the rates below are placeholders for Pune.
 * ------------------------------------------------------------------------- */

export const estimator = {
  eyebrow: "Cost estimator",
  heading: "an idea of your budget",
  intro:
    "Move the sliders to get an indicative range for your space. Every project is finally quoted from the detailed design, so treat this as a starting point for the conversation.",
  minArea: 150,
  maxArea: 4000,
  spaces: [
    { label: "Single room", area: 180 },
    { label: "1 BHK", area: 550 },
    { label: "2 BHK", area: 900 },
    { label: "3 BHK", area: 1300 },
    { label: "4 BHK + / villa", area: 2200 },
    { label: "Office / café", area: 1000 },
  ],
  /** Rupees per sq ft of carpet area, low and high, for full interiors. */
  finishes: [
    { label: "Essential", hint: "Laminates, standard hardware", rate: [1200, 1700] },
    { label: "Premium", hint: "Veneers, soft-close, profile lights", rate: [1700, 2600] },
    { label: "Luxe", hint: "Stone, custom joinery, designer lights", rate: [2600, 4000] },
  ],
  /** Share of a full-interiors budget for each scope. */
  scopes: [
    { label: "Full interiors", hint: "Civil, ceilings, joinery, styling", factor: 1 },
    { label: "Joinery only", hint: "Kitchen, wardrobes, TV unit", factor: 0.6 },
    { label: "Design only", hint: "Drawings, 3D views, BOQ", factor: 0.08 },
  ],
};

/* ----------------------------------------------------------------------------
 * TRANSFORMATIONS (home page)
 * Projects with a `beforeAfter` pair are shown as a before/after slider on the
 * home page. The section stays hidden until at least one project has a pair.
 * Use real photos taken from the same viewpoint before and after the work.
 * ------------------------------------------------------------------------- */

export const transformations = {
  eyebrow: "Transformations",
  heading: "before and after",
  body: "Drag across the photo to see the same room before we started and on the day we handed it over.",
};

export const transformationProjects = visibleProjects.filter((project) => project.beforeAfter);

/* ----------------------------------------------------------------------------
 * MATERIALS (home page, after "Colour & material")
 * Each swatch is drawn in CSS (see .swatch-* in globals.css), so no photos are
 * needed. `project` links to a project page where the material appears.
 * ------------------------------------------------------------------------- */

export type Material = { id: string; name: string; note: string; uses: string[]; project?: string };

export const materials = {
  eyebrow: "Material library",
  heading: "what our rooms are made of",
  intro: "A handful of materials we return to again and again. Choose one to see where it works best.",
  items: [
    {
      id: "fluted-wood",
      name: "Fluted wood",
      note: "Vertical grooves catch light and shadow, giving a plain wall or shutter rhythm and warmth.",
      uses: ["TV walls", "Wardrobe shutters", "Console fronts"],
      project: "pimple-saudagar-apartment",
    },
    {
      id: "brass",
      name: "Brushed brass",
      note: "A soft, warm metal that dulls gracefully. Used sparingly as inlays, handles and lights.",
      uses: ["Handles & trims", "Pendant lights", "Jhoola fittings"],
      project: "wakad-residence",
    },
    {
      id: "terracotta",
      name: "Terracotta plaster",
      note: "Earthy, hand-applied texture that suits hand-drawn motifs and warm evening light.",
      uses: ["Feature walls", "Arched niches", "Mandala art"],
      project: "ravet-residence",
    },
    {
      id: "sage",
      name: "Sage lime finish",
      note: "A muted green in a soft, chalky finish that keeps rooms calm and pairs well with oak and cream.",
      uses: ["Sculpted walls", "Bedroom backdrops", "Upholstery accents"],
      project: "chinchwad-apartment",
    },
    {
      id: "stone",
      name: "Warm stone",
      note: "Travertine and stone-finish panels bring weight and quiet luxury without feeling cold.",
      uses: ["Media walls", "Coffee tables", "Floors"],
      project: "pimple-saudagar-apartment",
    },
    {
      id: "cane",
      name: "Cane & rattan",
      note: "Woven natural fibre lightens joinery and lamps, and filters light beautifully.",
      uses: ["Cabinet panels", "Pendant shades", "Seating"],
      project: "chinchwad-apartment",
    },
    {
      id: "glass",
      name: "Coloured glass",
      note: "Stained or tinted glass turns sunlight into colour that moves across the room through the day.",
      uses: ["Inlays", "Partitions", "Door panels"],
    },
    {
      id: "oak",
      name: "Light oak",
      note: "A pale, even grain that keeps compact rooms open and pairs with greige and white.",
      uses: ["Study desks", "Shelving", "Wall cabinets"],
      project: "moshi-family-home",
    },
  ] satisfies Material[],
};

/* ----------------------------------------------------------------------------
 * ROOMS (home page tabs)
 * `photo` is a file in /public/photos. Rooms without a photo show a tinted
 * panel instead. `project` links to a project page.
 * ------------------------------------------------------------------------- */

export type Room = {
  id: string;
  label: string;
  heading: string;
  body: string;
  points: string[];
  photo?: ProjectImage;
  project?: string;
  tone: string;
};

export const rooms = {
  eyebrow: "Room by room",
  heading: "every room, considered",
  items: [
    {
      id: "living",
      label: "Living",
      heading: "a living room for every hour",
      body: "We plan seating around conversation and light, then layer a feature wall, soft furnishings and lighting you can dim from bright to cosy.",
      points: ["Feature & sculpted walls", "Layered lighting", "Sofa & rug planning", "Display niches"],
      photo: { src: "/photos/sage-living-room.jpg", alt: "Sage living room with a sculpted wall and curved sofa" },
      project: "chinchwad-apartment",
      tone: "#2b241d",
    },
    {
      id: "media",
      label: "TV wall",
      heading: "media walls without the clutter",
      body: "Concealed wiring, floating consoles and backlit shelves turn the television wall into a calm, finished piece of joinery.",
      points: ["Concealed cabling", "Floating consoles", "Backlit shelving", "Stone & fluted panels"],
      photo: { src: "/photos/tv-wall.jpg", alt: "Fluted wood TV wall with a backlit niche" },
      project: "pimple-saudagar-apartment",
      tone: "#3a2f25",
    },
    {
      id: "dining",
      label: "Dining",
      heading: "dining that brings everyone together",
      body: "Open living and dining plans that feel connected but distinct, with crafted pieces, pendant lights and storage close at hand.",
      points: ["Crockery units", "Pendant lighting", "Screens & partitions", "Jhoola & statement pieces"],
      photo: { src: "/photos/jhoola-living-dining.jpg", alt: "Living and dining room with a carved wooden jhoola" },
      project: "wakad-residence",
      tone: "#2e261f",
    },
    {
      id: "study",
      label: "Study",
      heading: "a desk that fits the room",
      body: "Built-in study corners that work for homework, work calls and guests, with storage above and lighting that is easy on the eyes.",
      points: ["Built-in desks", "Wall cabinets", "Task lighting", "Guest-room combos"],
      photo: { src: "/photos/study-corner.jpg", alt: "Built-in study desk with lit shelves above" },
      project: "moshi-family-home",
      tone: "#1f2a22",
    },
    {
      id: "kitchen",
      label: "Kitchen",
      heading: "kitchens planned around how you cook",
      body: "Modular kitchens laid out around your daily cooking, with tall units, easy-clean finishes and storage for every dabba and appliance.",
      points: ["Modular layouts", "Tall & corner units", "Easy-clean finishes", "Appliance planning"],
      tone: "#3b2a26",
    },
    {
      id: "bedroom",
      label: "Bedroom",
      heading: "bedrooms that help you rest",
      body: "Wardrobes sized to what you own, a soft headboard wall and warm, low light so the room winds down with you.",
      points: ["Wardrobes & lofts", "Headboard walls", "Dressing units", "Warm, dimmable light"],
      tone: "#24302a",
    },
    {
      id: "pooja",
      label: "Pooja",
      heading: "a calm corner for prayer",
      body: "Pooja units and mandirs in wood, brass and stone that sit beautifully in modern apartments, with space for lamps and flowers.",
      points: ["Mandir units", "Jaali & carved panels", "Brass & stone details", "Bell & lamp space"],
      tone: "#3d3024",
    },
    {
      id: "office",
      label: "Office",
      heading: "workplaces with character",
      body: "Offices, clinics and cafés that work hard every day while carrying a clear, memorable identity for your brand.",
      points: ["Reception & lounges", "Workstations", "Cabins & meeting rooms", "Brand-led details"],
      tone: "#2a2522",
    },
  ] satisfies Room[],
};

/* ----------------------------------------------------------------------------
 * AREAS WE SERVE (home page map)
 * Rough coordinates for a stylised map of PCMC and west Pune. An area with a
 * `project` gets a filled pin that previews and links to that project.
 * ------------------------------------------------------------------------- */

export type Area = { name: string; lat: number; lng: number; project?: string };

export const areas = {
  eyebrow: "Where we work",
  heading: "across pcmc and pune",
  body: "Our studio is in PCMC, and we design homes and workplaces across Pimpri-Chinchwad and west Pune. Further away? Get in touch and we will talk it through.",
  items: [
    { name: "Moshi", lat: 18.672, lng: 73.851, project: "moshi-family-home" },
    { name: "Ravet", lat: 18.649, lng: 73.744, project: "ravet-residence" },
    { name: "Chinchwad", lat: 18.63, lng: 73.8, project: "chinchwad-apartment" },
    { name: "Wakad", lat: 18.598, lng: 73.765, project: "wakad-residence" },
    { name: "Hinjewadi", lat: 18.591, lng: 73.739 },
    { name: "Pimple Saudagar", lat: 18.599, lng: 73.797, project: "pimple-saudagar-apartment" },
    { name: "Pimple Nilakh", lat: 18.578, lng: 73.785 },
    { name: "Baner", lat: 18.559, lng: 73.776 },
    { name: "Aundh", lat: 18.558, lng: 73.808 },
  ] satisfies Area[],
};
