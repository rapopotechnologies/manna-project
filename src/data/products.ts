// The Etsy listings shown in the shop. Add a product by adding one entry here.
// Details come from the listing photos; check them against Etsy when a listing changes.
// Image paths are the original site's paths, served from /public.

export type ProductCategory = "Journals" | "Planners" | "Bookmarks" | "Stickers";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  /** One line for cards. */
  blurb: string;
  /** A short paragraph for the product page. */
  description: string;
  includes: string[];
  details: { label: string; value: string }[];
  /** Slugs of products that go well with this one. */
  pairsWith: string[];
  etsyUrl: string;
  /** Shopee listing for Indonesian buyers. Falls back to the Shopee shop when missing. */
  shopeeUrl?: string;
  images: { src: string; alt: string }[];
};

export const ETSY_SHOP_URL = "https://www.etsy.com/shop/MannaProject";
/** Shopee shop for buyers in Indonesia (most of our readers). */
export const SHOPEE_SHOP_URL = "https://id.shp.ee/K3zkZe4a";
/** General questions, ideas and partnerships. Forwards to the team inbox. */
export const CONTACT_EMAIL = "info@bymannaproject.com";
/** Order and account help. Also the address site emails are sent from, so replies reach the team. */
export const SUPPORT_EMAIL = "support@bymannaproject.com";

export const CATEGORY_NOTES: Record<ProductCategory, string> = {
  Journals: "Digital journals for your tablet",
  Planners: "Printable planners for your days, weeks and year",
  Bookmarks: "Printable bookmarks for all 66 books",
  Stickers: "Digital stickers for journaling apps, and vinyl stickers",
};

const bookmarkDetails = [
  { label: "Format", value: "Printable PDF and JPEG" },
  { label: "Bookmark size", value: "5.5 × 15 cm" },
  { label: "Paper", value: "Arranged on ready-to-print A4 pages" },
  { label: "Delivery", value: "Instant download from Etsy" },
];

export const products: readonly Product[] = [
  {
    slug: "bible-reading-tracker",
    name: "Bible Reading Tracker",
    category: "Journals",
    blurb: "A chronological reading plan, S.O.A.P. journal and truth reminders in one digital journal.",
    description:
      "Three Bible study tools in one hyperlinked journal for your tablet. Follow a chronological weekly reading plan, slow down with the S.O.A.P. method, and keep your go-to verses close in Truth Reminders. The weeks are undated, so you can start any time of the year.",
    includes: [
      "Chronological weekly Bible reading tracker",
      "S.O.A.P. journal pages (Scripture, Observation, Application, Prayer)",
      "Truth Reminders pages for the verses you want to remember",
      "Free digital stickers, as single pre-cropped PNGs",
    ],
    details: [
      { label: "Format", value: "Digital PDF with hyperlinked pages and clickable tabs" },
      { label: "Works with", value: "Note-taking apps such as GoodNotes" },
      { label: "Page size", value: "A4 ratio" },
      { label: "Pages", value: "Duplicate any page as often as you like" },
      { label: "Delivery", value: "Instant download from Etsy" },
    ],
    pairsWith: ["bible-journal-basic-stickers", "floral-line-digital-stickers"],
    etsyUrl: "https://www.etsy.com/listing/1581433227/digital-bible-reading-tracker-soap",
    images: [
      { src: "/journals/BRT/bible-reading-tracker-journal-1.jpg", alt: "Bible Reading Tracker cover and weekly tracker page on two tablets" },
      { src: "/journals/BRT/bible-reading-tracker-journal-2.jpg", alt: "Weekly Bible reading tracker pages with undated weeks" },
      { src: "/journals/BRT/bible-reading-tracker-journal-3.jpg", alt: "S.O.A.P. journal page filled in by hand" },
      { src: "/journals/BRT/bible-reading-tracker-journal-4.jpg", alt: "Truth Reminders page listing go-to verses" },
      { src: "/journals/BRT/bible-reading-tracker-journal-5.jpg", alt: "The three tools: reading tracker, S.O.A.P. journal and truth reminders" },
      { src: "/journals/BRT/bible-reading-tracker-journal-6.jpg", alt: "Main features: hyperlinked pages, A4 size, works with GoodNotes" },
      { src: "/journals/BRT/bible-reading-tracker-journal-7.jpg", alt: "Free digital stickers included with the reading tracker" },
    ],
  },
  {
    slug: "book-of-the-bible-bookmarks-bundle",
    name: "Book of the Bible Bookmarks: Bundle",
    category: "Bookmarks",
    blurb: "All 66 books in four bookmark styles: flowers and lined notes, with or without chapter circles.",
    description:
      "One bookmark for every book of the Bible, so you always know where you are and what you noticed. Each bookmark lists the book's chapters to mark as you read, with space for notes or a flower to color. The bundle includes all four styles.",
    includes: [
      "Bookmarks for all 66 books of the Bible",
      "Four styles: Circle Flowers, Circle Notes, Flowers and Notes",
      "8 color tabs for the sections of the Bible, from the Law to the General Epistles",
      "Bonus: Sections of the Bible bookmarks",
    ],
    details: bookmarkDetails,
    pairsWith: ["bible-reading-tracker", "book-of-the-bible-bookmarks-floral"],
    etsyUrl: "https://www.etsy.com/listing/1623023143/book-of-the-bible-bookmarks-floral-notes",
    images: [
      { src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-1.jpg", alt: "Book of the Bible bookmarks bundle with flowers and notes designs" },
      { src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-2.jpg", alt: "Bookmark anatomy: section color tabs, chapter numbers and notes space" },
      { src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-3.jpg", alt: "What's inside: ready-to-print A4 pages of 5.5 by 15 cm bookmarks" },
      { src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-4.jpg", alt: "The four bookmark options: circle flowers, circle notes, flowers and notes" },
    ],
  },
  {
    slug: "book-of-the-bible-bookmarks-floral",
    name: "Book of the Bible Bookmarks: Floral",
    category: "Bookmarks",
    blurb: "All 66 books with a hand-drawn flower on each bookmark to color as you finish.",
    description:
      "A bookmark for every book of the Bible, each with a line-drawn flower. Mark the chapters as you read them, then color the flower when you finish the book.",
    includes: [
      "Bookmarks for all 66 books of the Bible",
      "Two styles: Circle Flowers and Flowers",
      "8 color tabs for the sections of the Bible",
      "Bonus: Sections of the Bible bookmarks",
    ],
    details: bookmarkDetails,
    pairsWith: ["book-of-the-bible-bookmarks-bundle", "floral-line-digital-stickers"],
    etsyUrl: "https://www.etsy.com/listing/1622985103/book-of-the-bible-bookmarks-floral",
    images: [
      { src: "/bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-1.jpg", alt: "Floral Book of the Bible bookmarks" },
      { src: "/bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-2.jpg", alt: "Bookmark anatomy with a flower to color in" },
      { src: "/bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-3.jpg", alt: "What's inside: ready-to-print A4 pages of floral bookmarks" },
      { src: "/bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-4.jpg", alt: "The two floral bookmark options" },
    ],
  },
  {
    slug: "book-of-the-bible-bookmarks-notes",
    name: "Book of the Bible Bookmarks: Notes",
    category: "Bookmarks",
    blurb: "All 66 books with lined space on each bookmark for your notes.",
    description:
      "A bookmark for every book of the Bible with lined space to write what stood out. Circle the chapters as you go and keep your notes right where you're reading.",
    includes: [
      "Bookmarks for all 66 books of the Bible",
      "Two styles: Circle Notes and Notes",
      "8 color tabs for the sections of the Bible",
      "Bonus: Sections of the Bible bookmarks",
    ],
    details: bookmarkDetails,
    pairsWith: ["book-of-the-bible-bookmarks-bundle", "bible-reading-tracker"],
    etsyUrl: "https://www.etsy.com/listing/1622990949/book-of-the-bible-bookmarks-notes-design",
    images: [
      { src: "/bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-1.jpg", alt: "Notes design Book of the Bible bookmarks" },
      { src: "/bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-2.jpg", alt: "What's inside: lined notes bookmarks on A4 pages" },
      { src: "/bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-3.jpg", alt: "The two notes bookmark options" },
      { src: "/bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-4.jpg", alt: "Bookmark anatomy: section tabs, chapter numbers and notes space" },
    ],
  },
  {
    slug: "bible-journal-basic-stickers",
    name: "Bible Journal Basic Stickers, Vol. 01",
    category: "Stickers",
    blurb: "130 everyday digital stickers: washi tape, flags, sticky notes, AMEN tags and more.",
    description:
      "The everyday kit for digital Bible journaling: washi tape, flags, sticky notes, AMEN tags, stars, hearts, check marks, pins and paper clips, in the same muted palette as our journals.",
    includes: [
      "130 digital stickers in total",
      "Washi tape, flags, sticky notes and AMEN tags",
      "Stars, hearts, check marks, pins and paper clips",
    ],
    details: [
      { label: "Formats", value: "Pre-cropped GoodNotes sticker book and individual PNG files" },
      { label: "Works with", value: "GoodNotes and other note-taking apps" },
      { label: "Delivery", value: "Instant download from Etsy" },
    ],
    pairsWith: ["bible-reading-tracker", "floral-line-digital-stickers"],
    etsyUrl: "https://www.etsy.com/listing/1570597712/bible-journal-basic-stickers-vol-01",
    images: [
      { src: "/stickers/basic_stickers/basic_stickers1.jpg", alt: "Bible Journal Basic Stickers Vol. 01 sticker book on a tablet" },
      { src: "/stickers/basic_stickers/basic_stickers2.jpg", alt: "What's inside: 130 digital stickers" },
      { src: "/stickers/basic_stickers/basic_stickers3.jpg", alt: "Stickers decorating a Truth Reminders journal page" },
    ],
  },
  {
    slug: "floral-line-digital-stickers",
    name: "Floral Line Digital Stickers",
    category: "Stickers",
    blurb: "15 delicate line-drawn flowers for digital journals and planners.",
    description:
      "Fifteen hand-drawn line flowers that sit quietly beside your notes, the same style as the flowers on our bookmarks.",
    includes: ["15 line-drawn flower stickers"],
    details: [
      { label: "Formats", value: "Pre-cropped GoodNotes sticker book and individual PNG files" },
      { label: "Works with", value: "GoodNotes and other note-taking apps" },
      { label: "Delivery", value: "Instant download from Etsy" },
    ],
    pairsWith: ["bible-journal-basic-stickers", "book-of-the-bible-bookmarks-floral"],
    etsyUrl: "https://www.etsy.com/listing/1570603120/floral-line-digital-stickers-digital",
    images: [
      { src: "/stickers/Floral Stickers/floral_stickers1.jpg", alt: "Floral Line Digital Stickers sticker book on a tablet" },
      { src: "/stickers/Floral Stickers/floral_stickers2.jpg", alt: "What's inside: 15 line-drawn flower stickers" },
      { src: "/stickers/Floral Stickers/floral_stickers3.jpg", alt: "Floral stickers on a S.O.A.P. journal page" },
    ],
  },
];

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const CATEGORY_ORDER: ProductCategory[] = ["Journals", "Planners", "Bookmarks", "Stickers"];
