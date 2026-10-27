// NIV verses shown only if OurManna can't be reached, so the daily page is never blank.
// One is picked by date. Please proofread against an NIV Bible before launch.

export type Verse = { text: string; reference: string; version: string };

export const fallbackVerses: readonly Verse[] = [
  {
    reference: "Lamentations 3:22–23",
    text: "Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
    version: "NIV",
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    version: "NIV",
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    version: "NIV",
  },
  {
    reference: "Proverbs 3:5–6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    version: "NIV",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    version: "NIV",
  },
  {
    reference: "Philippians 4:6",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    version: "NIV",
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    version: "NIV",
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    version: "NIV",
  },
];
