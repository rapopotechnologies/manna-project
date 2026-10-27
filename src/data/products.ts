// The Etsy listings shown in the shop. Add a product by adding one entry here.
// Image paths are the original site's paths, served from /public.

export type ProductCategory = "Bookmarks" | "Journals" | "Stickers";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  blurb: string;
  etsyUrl: string;
  images: string[];
};

export const ETSY_SHOP_URL = "https://www.etsy.com/shop/MannaProject";
export const CONTACT_EMAIL = "manna.pjkt@gmail.com";

const range = (n: number, make: (i: number) => string) =>
  Array.from({ length: n }, (_, i) => make(i + 1));

export const products: readonly Product[] = [
  {
    slug: "bible-reading-tracker",
    name: "Bible Reading Tracker",
    category: "Journals",
    blurb:
      "A digital journal with a chronological weekly reading plan, a S.O.A.P. journal and truth reminders. Includes bonus digital stickers.",
    etsyUrl: "https://www.etsy.com/listing/1581433227/digital-bible-reading-tracker-soap",
    images: range(7, (i) => `/journals/BRT/bible-reading-tracker-journal-${i}.jpg`),
  },
  {
    slug: "book-of-the-bible-bookmarks-bundle",
    name: "Book of the Bible Bookmarks: Bundle",
    category: "Bookmarks",
    blurb:
      "Printable bookmarks for all 66 books of the Bible in both the Flowers and Notes designs.",
    etsyUrl: "https://www.etsy.com/listing/1623023143/book-of-the-bible-bookmarks-floral-notes",
    images: range(4, (i) => `/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-${i}.jpg`),
  },
  {
    slug: "book-of-the-bible-bookmarks-floral",
    name: "Book of the Bible Bookmarks: Floral",
    category: "Bookmarks",
    blurb: "Printable bookmarks for all 66 books of the Bible, each with a hand-drawn flower.",
    etsyUrl: "https://www.etsy.com/listing/1622985103/book-of-the-bible-bookmarks-floral",
    images: range(4, (i) => `/bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-${i}.jpg`),
  },
  {
    slug: "book-of-the-bible-bookmarks-notes",
    name: "Book of the Bible Bookmarks: Notes",
    category: "Bookmarks",
    blurb: "Printable bookmarks for all 66 books of the Bible with lined space for your notes.",
    etsyUrl: "https://www.etsy.com/listing/1622990949/book-of-the-bible-bookmarks-notes-design",
    images: range(4, (i) => `/bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-${i}.jpg`),
  },
  {
    slug: "bible-journal-basic-stickers",
    name: "Bible Journal Basic Stickers",
    category: "Stickers",
    blurb: "Everyday digital stickers for Bible journaling.",
    etsyUrl: "https://www.etsy.com/listing/1570597712/bible-journal-basic-stickers-vol-01",
    images: range(3, (i) => `/stickers/basic_stickers/basic_stickers${i}.jpg`),
  },
  {
    slug: "floral-line-digital-stickers",
    name: "Floral Line Digital Stickers",
    category: "Stickers",
    blurb: "Delicate line-drawn flowers to decorate digital journals and planners.",
    etsyUrl: "https://www.etsy.com/listing/1570603120/floral-line-digital-stickers-digital",
    images: range(3, (i) => `/stickers/Floral Stickers/floral_stickers${i}.jpg`),
  },
];
