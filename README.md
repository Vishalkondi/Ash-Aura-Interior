# Ash Aura Interiors

Website for Ash Aura Interiors, an interior design studio in PCMC, Pune.

Pages are prerendered as static HTML. The enquiry and booking forms send email through server actions, which Vercel runs as serverless functions, so no separate backend is needed.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, colour and font tokens in `app/globals.css` |
| Animation | Motion (`motion/react`, formerly Framer Motion) |
| Smooth scroll | Lenis |
| Fonts | Cormorant Garamond and Jost, self-hosted with `@fontsource` |
| Images | `next/image`, served as AVIF/WebP |
| Email | Resend, called from server actions, with input validated by zod |
| Analytics | Vercel Analytics (`@vercel/analytics`) |
| Hosting | Vercel |

## Features

- **Hero logo video:** the logo animation plays once in the hero, then the finished logo stays alive with drifting gold particles (see "Hero logo video" below).
- **Motion:** headings rise word by word from a mask, and photos open with a curtain reveal. The hero photos drift at different speeds on scroll, and the green feature photo has parallax. The "8+" counts up, and the marquee speeds up and reverses with scroll. A gold line draws across the process steps, and another under the nav tracks page progress.
- **Desktop cursor:** a gold ring follows the pointer, grows over links and reads "view" over projects. The main buttons are magnetic.
- **Project lightbox:** full, uncropped photos with arrow keys, swipe, Escape and focus management.
- **Project pages** (`/projects/[slug]`): hero photo, a gallery with the lightbox, details, the design story, an enquiry button and a link to the next project. Each page is pre-rendered and has its own title, description and share image.
- **Before/after slider:** drag, swipe or use the arrow keys. It appears on a project page once that project has a `beforeAfter` pair.
- **Testimonials:** a carousel with arrows, dots, swipe and keyboard. It stays hidden until real quotes are added.
- **Enquiry form:** emails the enquiry to Aishwarya through Resend. It includes validation (in the browser and again on the server with zod), a spam trap, a limit of 5 requests per visitor every 10 minutes, and sending, success and error states. "Or send on WhatsApp" stays available as an alternative.
- **Book a consultation** (`#book`): visitors pick a day (the next 14 days, Sundays off) and a time slot. The request is emailed to Aishwarya, and WhatsApp opens with the booking filled in. Days, slots and meeting types are in `booking` in `lib/site.ts`.
- **Auto-reply:** visitors who give an email get a short thank-you, once a sending domain is verified in Resend (see below).
- **Lead source:** every enquiry and booking email ends with where the visitor came from: UTM campaign tags, a Google or Meta ad click, the referring site, or "Direct". The first page they landed on and the date of their first visit are included too. This is remembered in the visitor's browser for 90 days.
- **Mobile contact bar:** Call and WhatsApp buttons fixed to the bottom of the screen on phones. The bar slides away while the keyboard is open. From tablet width up, the floating WhatsApp button is used instead.
- **Style quiz:** four questions (space, size, style, budget) that suggest a style with a matching project, then open WhatsApp with the answers filled in.
- **SEO:** LocalBusiness JSON-LD, `sitemap.xml`, `robots.txt`, an Open Graph image, and per-page metadata.
- **Analytics:** Vercel Analytics counts page views once it is enabled in the Vercel dashboard.
- **FAQ:** an accordion, with content in `lib/site.ts`.
- **Floating WhatsApp button** (tablet and desktop): appears after the hero and hides over the contact section.

Every animation is switched off for visitors whose system has *reduce motion* turned on.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

To check the production build:

```bash
npm run build
npm start
```

## Editing content

All text lives in [`lib/site.ts`](lib/site.ts): contact details, the statement, projects, services, process steps and the WhatsApp message. Change it there; you never need to edit a component to update copy.

## Adding the logo

The hero shows the logo through the logo video (see "Hero logo video" below). The small "A" mark in the nav, footer and share image is drawn in code, in [`components/Logo.tsx`](components/Logo.tsx).

The favicon is the "A" mark in [`app/icon.svg`](app/icon.svg).

## Adding photos

1. Put image files in `public/photos/`, for example `public/photos/living-room.jpg`.
2. Open [`lib/site.ts`](lib/site.ts) and set the path for a slot in the `photos` map:

   ```ts
   export const photos = {
     "hero-1": "/photos/living-room.jpg",
     // ...
   };
   ```

3. Update the slot's `alt` text in `photoDetails` so it describes the photo.

| Slot | Where it appears | Best shape |
| --- | --- | --- |
| `hero-1` … `hero-3` | Hero, three staggered frames | Portrait (3:4) |
| `p1` | Project 1 | Landscape (4:3) |
| `p2` | Project 2 | Portrait (4:5) |
| `p3` | Project 3 | Square |
| `p4` | Project 4 | Landscape (3:2) |
| `p5` | Project 5 | Portrait (4:5) |
| `p6` | Project 6 | Wide landscape (16:10) |
| `p7` | Project 7 | Square |
| `feature` | Green feature band (parallax) | Portrait (4:5) |
| `founder` | "The designer" section, portrait of Aishwarya | Portrait (4:5) |

Images are cropped to fill each frame (`object-cover`), and `next/image` resizes them and serves them as AVIF/WebP. Export photos at around 2400px on the long edge. An empty slot shows a tone-coloured panel with its label.

Project names and types are in the `projects` list in the same file. The `aspect` and `grid` fields control each card's shape and its place in the 12-column mosaic.

## Hero logo video

The hero's centrepiece is the logo animation. It plays once, then holds the finished logo with a very slow zoom while gold particles keep drifting across it, so the hero never looks frozen. The files are in `public/videos/`:

| File | Used for |
| --- | --- |
| `logo-reveal.mp4` | Tablets and desktops (1280×720, 1.4 MB) |
| `logo-reveal-mobile.mp4` | Phones, below 768px wide (720×406, 0.5 MB) |
| `logo-reveal-poster.jpg` | The finished logo as a still. It is shown instead of the video when the visitor has *reduce motion* or data saver on, autoplay is blocked, or JavaScript is off |

The code is [`components/HeroVideo.tsx`](components/HeroVideo.tsx), with the particles in [`components/GoldParticles.tsx`](components/GoldParticles.tsx). An oval fade (`.hero-video` in `app/globals.css`) blends the video's black frame into the page and hides its bottom-right corner. On phones the video is drawn wider than the screen so the logo stays large. The particles pause when the hero is scrolled away or the tab is hidden, and are off for *reduce motion*.

To replace the video, compress the new one (needs [ffmpeg](https://ffmpeg.org)) and keep the same file names. Keep the logo near the centre of the frame so the oval fade does not cut into it:

```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart logo-reveal.mp4
ffmpeg -i input.mp4 -vf "scale=720:-2" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart logo-reveal-mobile.mp4
ffmpeg -i logo-reveal.mp4 -ss 9.8 -frames:v 1 logo-reveal-poster.jpg
```

## Environment variables

Set these in Vercel under **Project → Settings → Environment Variables**. For local testing, put them in a `.env.local` file, which git ignores.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For the forms | API key from [resend.com](https://resend.com) (**API Keys → Create**). Without it, the enquiry and booking forms ask visitors to use WhatsApp instead. |
| `ENQUIRY_FROM` | Recommended | Sender address, for example `Ash Aura Website <hello@ashaura.in>`. It must be on a domain verified in Resend. Defaults to `onboarding@resend.dev`. Visitor auto-replies are only sent once this is set. |
| `ENQUIRY_TO` | No | Where enquiries go. Defaults to `ashaura.interiors@gmail.com`. |
| `NEXT_PUBLIC_SITE_URL` | After adding a domain | For example `https://ashaura.in`. It is used for canonical links, the sitemap and share previews. |

**Resend setup.** Resend's test sender (`onboarding@resend.dev`) only delivers to the email address that owns the Resend account. Either:

- create the Resend account with `ashaura.interiors@gmail.com`, or
- verify your domain in Resend (**Domains → Add**, then add the DNS records it shows) and set `ENQUIRY_FROM` to an address on that domain.

After changing environment variables, redeploy so they take effect.

**Tracking campaigns.** Add UTM tags to links you share, for example `https://ashaura.in/?utm_source=instagram&utm_medium=bio&utm_campaign=diwali-2026`. Enquiries from that link will say `Source: Campaign: instagram / bio / diwali-2026`.

**Rate limit.** The limit of 5 requests per visitor every 10 minutes is counted in server memory. It stops a form from being flooded, but it resets on each deploy and is counted separately by each server instance.

## Adding testimonials, before/after photos and project details

All of these are in [`lib/site.ts`](lib/site.ts):

- **Testimonials:** add `{ name, area, quote, photo? }` items to `testimonials`. Use only real quotes, with the client's permission. The section appears once the list has an entry.
- **Before/after:** on a project, add `beforeAfter: { before: { src, alt }, after: { src, alt }, caption? }`, using two photos taken from the same spot.
- **Project details:** `area` (for example `"1,450 sq ft"`) and `year` show on the project page once set. Add more photos to a project with `gallery: [{ src, alt }]`.

## Deploy on Vercel

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository. Vercel detects Next.js, so the default settings work.
3. Click **Deploy**.
4. Add the environment variables above, then redeploy.
5. Turn on analytics in Vercel under **Project → Analytics → Enable**.

Or deploy from the command line:

```bash
npm i -g vercel
vercel --prod
```

## Structure

```
app/
  layout.tsx            fonts, metadata, Open Graph, JSON-LD
  page.tsx              section order
  globals.css           colour tokens, type utilities, reduced-motion rules
  icon.svg              favicon ("A" mark)
  opengraph-image.tsx   generated 1200×630 share image
  sitemap.ts, robots.ts search engine files
  actions/enquiry.ts    server action that emails enquiries (Resend)
  actions/booking.ts    server action that emails consultation requests
  projects/[slug]/      project detail pages
components/             one file per section, plus shared pieces (Photo, Lightbox, Reveal, Logo, HeroVideo…)
public/videos/          hero logo video, mobile version and poster
lib/site.ts             all content, photos map and projects
lib/leads.ts            shared form code: validation, rate limit, lead source, email
lib/leadSource.ts       records UTM tags and referrer in the visitor's browser
lib/booking.ts          bookable days, in Pune time
public/photos/          your photographs
```

## Accessibility and motion

- Animations are slow fades and gentle parallax. If the visitor's system has *reduce motion* turned on, smooth scrolling, parallax and the marquee are switched off.
- Every link and button shows a visible focus ring, and a "Skip to content" link appears on the first Tab press.
- The layout works down to 360px wide with no horizontal scroll.
