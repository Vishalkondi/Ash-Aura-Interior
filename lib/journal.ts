/* ----------------------------------------------------------------------------
 * JOURNAL
 * Short design notes from the studio. Each article gets a page at
 * /journal/<slug>. Newest first. `date` is YYYY-MM-DD. Images are local files
 * in /public/photos. A section may have a heading, paragraphs, or both.
 * ------------------------------------------------------------------------- */

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readMinutes: number;
  image: { src: string; alt: string };
  sections: { heading?: string; paragraphs: string[] }[];
};

export const journal = {
  eyebrow: "Journal",
  heading: "notes from the studio",
  intro: "Ideas, materials and lessons from site, for anyone planning a home or workplace in Pune.",
};

export const articles: Article[] = [
  {
    slug: "layered-lighting-living-room",
    title: "Layered lighting for a calm living room",
    excerpt:
      "One bright ceiling light flattens a room. Three softer layers, each with its own job, make it feel warm and spacious at any hour.",
    date: "2026-10-20",
    category: "Lighting",
    readMinutes: 4,
    image: {
      src: "/photos/sage-living-room.jpg",
      alt: "Living room with a sculpted sage wall traced by concealed warm light",
    },
    sections: [
      {
        paragraphs: [
          "Most living rooms we are asked to redo have the same problem: a single row of downlights doing every job at once. The room is either glaring or dim, and nothing in it feels special after dark.",
          "We plan light in three layers instead, and wire each one separately so you can mix them through the day.",
        ],
      },
      {
        heading: "Ambient: the base glow",
        paragraphs: [
          "Cove lights in a false-ceiling edge or concealed strips behind a panel wash the ceiling and walls with soft, even light. Choose a warm white (around 2700–3000K) so evenings feel relaxed rather than clinical.",
        ],
      },
      {
        heading: "Task: light where you do things",
        paragraphs: [
          "A reading lamp beside the sofa, a pendant over the dining table, under-shelf strips at a bar counter. Task lights sit lower and closer, so they light the activity without lighting the whole room.",
        ],
      },
      {
        heading: "Accent: the finishing layer",
        paragraphs: [
          "Backlit niches, a lit art wall or a glow behind fluted panels give the room depth. In the Chinchwad apartment, light traced along the sculpted sage wall became the room's evening character.",
          "A good test: switch off the main lights and use only accent and task lighting. If the room still feels inviting, the plan is working.",
        ],
      },
    ],
  },
  {
    slug: "tv-wall-that-lasts",
    title: "Designing a TV wall that still looks good in ten years",
    excerpt:
      "Screens get bigger and thinner every few years. A TV wall built around the room, not the television, ages far better.",
    date: "2026-09-12",
    category: "Joinery",
    readMinutes: 5,
    image: {
      src: "/photos/tv-wall.jpg",
      alt: "TV wall with fluted wood panels, a stone-finish panel and a backlit niche",
    },
    sections: [
      {
        paragraphs: [
          "The TV wall is often the most expensive piece of joinery in a living room, and the one most likely to date. A few decisions at the design stage keep it relevant long after the television itself has been replaced.",
        ],
      },
      {
        heading: "Size the panel, not the screen",
        paragraphs: [
          "Design the backing panel to suit the wall and the sofa distance, with room to spare around today's screen. A slightly larger television later then sits comfortably instead of crowding the edges.",
        ],
      },
      {
        heading: "Plan the cables early",
        paragraphs: [
          "A concealed conduit from the console to the screen height, with an extra spare pull wire, means no visible cables and no chasing walls when you add a sound bar or set-top box.",
        ],
      },
      {
        heading: "Keep the storage low and floating",
        paragraphs: [
          "A floating console with closed shutters hides routers and remotes and keeps the floor clear, which makes the wall feel lighter. Open shelves work best off to one side, where books and objects can change over the years.",
          "Materials matter too: fluted wood, stone-finish panels and textured plaster age gracefully, while high-gloss acrylic and busy patterns tend to tire quickly.",
        ],
      },
    ],
  },
  {
    slug: "planning-interiors-before-possession",
    title: "What to plan before you get possession of your flat",
    excerpt:
      "The weeks before possession are the best time to plan interiors. A little preparation saves time and rework once the keys are in hand.",
    date: "2026-08-05",
    category: "Planning",
    readMinutes: 4,
    image: {
      src: "/photos/jhoola-living-dining.jpg",
      alt: "Open living and dining room with a carved wooden jhoola",
    },
    sections: [
      {
        paragraphs: [
          "Many of our clients in PCMC come to us with a new flat in a project that is a few months from handover. That waiting time is valuable: the design can be finished and approved before work starts, so the site moves quickly once you have the keys.",
        ],
      },
      {
        heading: "Get the floor plan and electrical layout",
        paragraphs: [
          "Ask the builder for the carpet-area plan with dimensions and the electrical point layout. With these we can plan furniture, storage and lighting, and list the points that need to move or be added.",
        ],
      },
      {
        heading: "Write down how you live",
        paragraphs: [
          "Who works from home? Do you need a pooja unit, a study corner or space for visiting parents? How much do you cook? These answers shape the plan far more than any style board.",
        ],
      },
      {
        heading: "Decide what stays and what goes",
        paragraphs: [
          "List the furniture and appliances you are bringing with you, with sizes. It avoids building a wardrobe where your existing bed needs to go, or a kitchen that has no place for your fridge.",
          "Then, when possession comes, the site can start with civil and electrical work straight away, and the joinery is already detailed and ready to order.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export const articleHref = (article: Article) => `/journal/${article.slug}`;

/** "20 October 2026": fixed format, so server and browser render the same text. */
export function formatDate(date: string) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}
