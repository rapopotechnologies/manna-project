// The ten hidden verses, kept word for word as they were printed on the original site.
// Slugs match the old /hidden_verses/<slug>/ URLs so printed links keep working.

export type HiddenVerse = {
  slug: string;
  reference: string;
  translation: "ESV" | "NIV";
  lines: string[];
};

export const hiddenVerses: readonly HiddenVerse[] = [
  {
    slug: "1corinthians_13",
    reference: "1 Corinthians 13",
    translation: "ESV",
    lines: [
      "Love is patient and kind;",
      "love does not envy or boast;",
      "it is not arrogant or rude.",
      "It does not insist on its own way;",
      "it is not irritable or resentful;",
      "it does not rejoice at wrongdoing,",
      "but rejoices with the truth.",
      "Love bears all things,",
      "believes all things,",
      "hopes all things,",
      "endures all things.",
      "Love never ends.",
    ],
  },
  {
    slug: "1corinthians_16_14",
    reference: "1 Corinthians 16:14",
    translation: "ESV",
    lines: ["Let all that you do be done in love."],
  },
  {
    slug: "john_3_16",
    reference: "John 3:16",
    translation: "ESV",
    lines: [
      "For God so loved the world, that he gave his only Son,",
      "that whoever believes in him should not perish but have eternal life.",
    ],
  },
  {
    slug: "matthew_11_28",
    reference: "Matthew 11:28",
    translation: "ESV",
    lines: ["Come to me, all who labor and are heavy laden, and I will give you rest."],
  },
  {
    slug: "matthew_6_33",
    reference: "Matthew 6:31–33",
    translation: "ESV",
    lines: [
      "Therefore do not be anxious, saying, ‘What shall we eat?’",
      "or ‘What shall we drink?’ or ‘What shall we wear?’",
      "For the Gentiles seek after all these things, and your heavenly Father knows that you need them all.",
      "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
    ],
  },
  {
    slug: "micah_6_8",
    reference: "Micah 6:8",
    translation: "ESV",
    lines: [
      "He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?",
    ],
  },
  {
    slug: "proverbs_3_5",
    reference: "Proverbs 3:5–6",
    translation: "ESV",
    lines: [
      "Trust in the Lord with all your heart, and do not lean on your own understanding.",
      "In all your ways acknowledge him, and he will make straight your paths.",
    ],
  },
  {
    slug: "psalm_116_7",
    reference: "Psalm 116:7",
    translation: "ESV",
    lines: ["Return, O my soul, to your rest; for the LORD has dealt bountifully with you."],
  },
  {
    slug: "psalm_119_105",
    reference: "Psalm 119:105",
    translation: "ESV",
    lines: ["Your word is a lamp to my feet and a light to my path."],
  },
  {
    slug: "romans_8_28",
    reference: "Romans 8:28",
    translation: "NIV",
    lines: [
      "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    ],
  },
];

export function findHiddenVerse(slug: string): HiddenVerse | undefined {
  return hiddenVerses.find((v) => v.slug === slug);
}

/**
 * Hidden verses are grouped into collections. "The attic" holds the original ten.
 * Seasonal sets (Advent, Lent) can be added here, and later from the admin.
 */
export type Collection = {
  id: string;
  name: string;
  blurb: string;
  slugs: string[];
};

export const collections: readonly Collection[] = [
  {
    id: "attic",
    name: "The attic",
    blurb: "Ten verses tucked into the walls of Manna Project.",
    slugs: hiddenVerses.map((v) => v.slug),
  },
];

export function collectionFor(slug: string): Collection | undefined {
  return collections.find((c) => c.slugs.includes(slug));
}
