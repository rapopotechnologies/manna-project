// The 66 books, grouped the way our Book of the Bible bookmarks color-code them.

export type BookGroup = "Law" | "History" | "Poetry" | "Prophets" | "Gospels & Acts" | "Letters" | "Revelation";

export const BOOK_GROUP_COLORS: Record<BookGroup, string> = {
  Law: "#7E7A3F",
  History: "#C28E2C",
  Poetry: "#E1AD37",
  Prophets: "#6FA597",
  "Gospels & Acts": "#3F6B5C",
  Letters: "#A9A06A",
  Revelation: "#8A6208",
};

const groups: [BookGroup, string[]][] = [
  ["Law", ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]],
  ["History", ["Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"]],
  ["Poetry", ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"]],
  ["Prophets", ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"]],
  ["Gospels & Acts", ["Matthew", "Mark", "Luke", "John", "Acts"]],
  ["Letters", ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"]],
  ["Revelation", ["Revelation"]],
];

export const BOOKS: { name: string; group: BookGroup }[] = groups.flatMap(([group, names]) => names.map((name) => ({ name, group })));

const ALIASES: Record<string, string> = {
  psalm: "Psalms",
  "song of songs": "Song of Solomon",
  songs: "Song of Solomon",
  revelations: "Revelation",
  "acts of the apostles": "Acts",
};

const byLower = new Map(BOOKS.map((b) => [b.name.toLowerCase(), b.name]));

/** "1 Corinthians 13:4–8" → "1 Corinthians". Unknown → null. */
export function bookFromReference(reference: string): string | null {
  const match = reference.trim().match(/^((?:[1-3]\s*)?[A-Za-z][A-Za-z\s]*?)\s*\d/);
  if (!match) return null;
  const raw = match[1].replace(/\s+/g, " ").replace(/^([1-3])(\S)/, "$1 $2").trim().toLowerCase();
  return byLower.get(raw) ?? ALIASES[raw] ?? null;
}
