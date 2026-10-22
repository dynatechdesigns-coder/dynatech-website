import type { SiteContent } from "./types";

// Starter content. The site shows this until you save changes from /admin
// (after that, MongoDB is the source of truth).
export const seed: SiteContent = {
  profile: {
    name: "Daniel Nathaniel Ayomide",
    role: "Graphic Designer & Web Developer",
    location: "Abuja, Nigeria",
    headline: "Design that speaks. Websites that work.",
    intro:
      "I'm Daniel, the designer and developer behind Dynatech Labs. I create bold brand graphics, build fast, modern websites, and capture moments through photography.",
    bio: [
      "I'm a graphic designer and web developer based in Abuja, with over four years of experience in branding, print and digital design.",
      "I started out designing flyers, posters and brand identities for churches, events and small businesses. Today I also build live websites, from the page people see to the admin dashboard the owner uses every day.",
      "Photography is a growing passion, and I'm currently training in cybersecurity, because what we build should be secure as well as beautiful.",
    ],
    photo: "/brand/daniel.webp",
    email: "dynatechdesigns@gmail.com",
    phone: "08053801610",
    socials: {
      x: "https://x.com/Dynatechdesign",
      linkedin: "https://www.linkedin.com/in/nathaniel-daniel-652307381",
      github: "https://github.com/dynatechdesigns-coder",
    },
    available: true,
    stats: [
      { value: "4+", label: "Years designing" },
      { value: "3", label: "Live web apps" },
      { value: "100%", label: "Built to work on phones" },
    ],
    skills: [
      "Brand identity",
      "Flyer & poster design",
      "Social media design",
      "Photo editing & retouching",
      "UI/UX design",
      "Web development",
      "Admin dashboards",
      "Photography",
    ],
    certifications: [
      { title: "Product Design", issuer: "SA Incubator · Digital SkillUp Africa", year: "2025" },
      { title: "Google Cybersecurity Certificate", issuer: "Google" },
      { title: "Advanced Photoshop & Lightroom", issuer: "Udemy" },
      { title: "Photoshop & Illustrator Masterclass", issuer: "Udemy" },
      { title: "Figma UI/UX Design", issuer: "Udemy" },
      { title: "Advanced Diploma in Computer Applications", issuer: "Goddian Tech Solutions" },
    ],
    education: {
      degree: "B.Sc. Sociology, Second Class Upper",
      school: "Prince Abubakar Audu University, Anyigba",
      year: "2026",
    },
  },

  projects: [
    {
      id: "toylad-concept",
      title: "Toylad Concept",
      category: "Business website + admin dashboard",
      summary:
        "A warm, mouth-watering website for a cake, pastry and events business in Abuja. Customers browse the work and request a quote; the owner runs the business from her own dashboard.",
      features: [
        "Gallery filtered by cakes, pastries, décor and events",
        "Booking form that turns visitors into quote requests",
        "One-tap WhatsApp chat",
        "Private dashboard for photos, orders, customers and feedback",
      ],
      stack: ["MongoDB", "Cloudinary", "Vercel"],
      url: "https://toylad-concept.vercel.app/",
      images: ["/work/web/toylad-home.webp", "/work/web/toylad-gallery.webp", "/work/web/toylad-admin.webp"],
    },
    {
      id: "rccg-glory-arena",
      title: "RCCG Glory Arena",
      category: "Church website + content dashboard",
      summary:
        "A simple, professional home online for a growing parish. Members and first-time visitors find service times, events and ways to connect, and the church team keeps it up to date themselves.",
      features: [
        "Live 'next service' banner and weekly schedule",
        "Events, announcements, ministries and building project",
        "Prayer requests and first-timer follow-up",
        "Dashboard with editor → approver publishing workflow",
      ],
      stack: ["Cloudinary", "Vercel"],
      url: "https://glory-arena-website.vercel.app/",
      images: ["/work/web/glory-home.webp", "/work/web/glory-admin.webp"],
    },
    {
      id: "profitpocket",
      title: "ProfitPocket",
      category: "Bookkeeping & inventory web app",
      summary:
        "Bookkeeping for small traders who don't have an accounting background. Log products, sales and expenses, and see your real profit after cost of goods sold.",
      features: [
        "Stock levels update automatically on every sale",
        "Profit & loss by day, week, month or year",
        "Expense tracking by category",
        "Dashboard with low-stock alerts",
      ],
      stack: ["Vercel"],
      url: "https://profit-pocket-tviz.vercel.app",
      images: ["/work/web/profitpocket-landing.webp", "/work/web/profitpocket-dashboard.webp"],
    },
  ],

  designs: [
    { id: "tehila", title: "Tehila Concert '26", client: "Latter House Mass Choir · RCF PAAU", category: "Event flyer", image: "/work/design/tehila-concert.webp" },
    { id: "drama", title: "Drama Night '26 — Isoji", client: "Soul Lifters Ministries", category: "Event poster", image: "/work/design/drama-night.webp" },
    { id: "business-week", title: "Business Week '26", client: "RCF PAAU", category: "Event flyer", image: "/work/design/business-week.webp" },
    { id: "zonal-congress", title: "Steadfast Zonal Congress", client: "CRM Kogi Zone", category: "Conference flyer", image: "/work/design/zonal-congress.webp" },
    { id: "thanksgiving", title: "Thanksgiving Service", client: "RCF PAAU", category: "Social media", image: "/work/design/thanksgiving.webp" },
    { id: "christmas", title: "The Prince of Peace", client: "RCF PAAU · Christmas Carol", category: "Event flyer", image: "/work/design/christmas-carol.webp" },
    { id: "billboard", title: "Back to School", client: "RCF PAAU", category: "Billboard", image: "/work/design/back-to-school-billboard.webp" },
    { id: "day-three", title: "Zonal Congress — Day Three", client: "CRM Kogi Zone", category: "Social media", image: "/work/design/zonal-day-three.webp" },
    { id: "birthday", title: "Birthday Celebration", client: "RCF PAAU", category: "Social media", image: "/work/design/birthday-president.webp" },
  ],

  photos: [
    { id: "trio", title: "Portraits — Zonal Congress", image: "/work/photo/portrait-trio.webp" },
    { id: "bass", title: "Worship — bass", image: "/work/photo/event-4.webp" },
    { id: "minister", title: "The message", image: "/work/photo/event-5.webp" },
    { id: "agbada", title: "Culture night", image: "/work/photo/event-2.webp" },
    { id: "drums", title: "Rhythm", image: "/work/photo/event-3.webp" },
    { id: "fellowship", title: "Fellowship", image: "/work/photo/event-1.webp" },
  ],

  services: [
    {
      title: "Brand & Graphic Design",
      text: "Visuals that make people stop scrolling and remember your name.",
      items: ["Logos & brand identity", "Flyers, posters & billboards", "Social media designs", "Print-ready files"],
    },
    {
      title: "Web Design & Development",
      text: "Fast, mobile-first websites you can update yourself.",
      items: ["Business & church websites", "Booking and contact forms", "Admin dashboards", "Hosting & launch"],
    },
    {
      title: "Photography & Media",
      text: "Events and portraits, edited to look their best.",
      items: ["Event coverage", "Portraits", "Photo editing & retouching", "Content for social media"],
    },
  ],
};
