// Indonesian book names (as in the LAI Terjemahan Baru) and the codes Bible.com uses in its links.

import { bookFromReference } from "./bible-books";

const BOOKS_ID: Record<string, [name: string, code: string]> = {
  Genesis: ["Kejadian", "GEN"],
  Exodus: ["Keluaran", "EXO"],
  Leviticus: ["Imamat", "LEV"],
  Numbers: ["Bilangan", "NUM"],
  Deuteronomy: ["Ulangan", "DEU"],
  Joshua: ["Yosua", "JOS"],
  Judges: ["Hakim-hakim", "JDG"],
  Ruth: ["Rut", "RUT"],
  "1 Samuel": ["1 Samuel", "1SA"],
  "2 Samuel": ["2 Samuel", "2SA"],
  "1 Kings": ["1 Raja-raja", "1KI"],
  "2 Kings": ["2 Raja-raja", "2KI"],
  "1 Chronicles": ["1 Tawarikh", "1CH"],
  "2 Chronicles": ["2 Tawarikh", "2CH"],
  Ezra: ["Ezra", "EZR"],
  Nehemiah: ["Nehemia", "NEH"],
  Esther: ["Ester", "EST"],
  Job: ["Ayub", "JOB"],
  Psalms: ["Mazmur", "PSA"],
  Proverbs: ["Amsal", "PRO"],
  Ecclesiastes: ["Pengkhotbah", "ECC"],
  "Song of Solomon": ["Kidung Agung", "SNG"],
  Isaiah: ["Yesaya", "ISA"],
  Jeremiah: ["Yeremia", "JER"],
  Lamentations: ["Ratapan", "LAM"],
  Ezekiel: ["Yehezkiel", "EZK"],
  Daniel: ["Daniel", "DAN"],
  Hosea: ["Hosea", "HOS"],
  Joel: ["Yoel", "JOL"],
  Amos: ["Amos", "AMO"],
  Obadiah: ["Obaja", "OBA"],
  Jonah: ["Yunus", "JON"],
  Micah: ["Mikha", "MIC"],
  Nahum: ["Nahum", "NAM"],
  Habakkuk: ["Habakuk", "HAB"],
  Zephaniah: ["Zefanya", "ZEP"],
  Haggai: ["Hagai", "HAG"],
  Zechariah: ["Zakharia", "ZEC"],
  Malachi: ["Maleakhi", "MAL"],
  Matthew: ["Matius", "MAT"],
  Mark: ["Markus", "MRK"],
  Luke: ["Lukas", "LUK"],
  John: ["Yohanes", "JHN"],
  Acts: ["Kisah Para Rasul", "ACT"],
  Romans: ["Roma", "ROM"],
  "1 Corinthians": ["1 Korintus", "1CO"],
  "2 Corinthians": ["2 Korintus", "2CO"],
  Galatians: ["Galatia", "GAL"],
  Ephesians: ["Efesus", "EPH"],
  Philippians: ["Filipi", "PHP"],
  Colossians: ["Kolose", "COL"],
  "1 Thessalonians": ["1 Tesalonika", "1TH"],
  "2 Thessalonians": ["2 Tesalonika", "2TH"],
  "1 Timothy": ["1 Timotius", "1TI"],
  "2 Timothy": ["2 Timotius", "2TI"],
  Titus: ["Titus", "TIT"],
  Philemon: ["Filemon", "PHM"],
  Hebrews: ["Ibrani", "HEB"],
  James: ["Yakobus", "JAS"],
  "1 Peter": ["1 Petrus", "1PE"],
  "2 Peter": ["2 Petrus", "2PE"],
  "1 John": ["1 Yohanes", "1JN"],
  "2 John": ["2 Yohanes", "2JN"],
  "3 John": ["3 Yohanes", "3JN"],
  Jude: ["Yudas", "JUD"],
  Revelation: ["Wahyu", "REV"],
};

/** Indonesian name for an English book name: "Galatians" → "Galatia". */
export function bookNameId(book: string): string {
  return BOOKS_ID[book]?.[0] ?? book;
}

/** "Galatians 1:10" → { book: "Galatians", rest: "1:10" }. */
function split(reference: string) {
  const book = bookFromReference(reference);
  if (!book) return null;
  const rest = reference.trim().match(/(\d+(?::[\d\s,–—-]+)?)\s*$/)?.[1]?.trim() ?? "";
  return { book, rest };
}

/** "2 Corinthians 10:17-18" → "2 Korintus 10:17-18". Unknown books come back unchanged. */
export function referenceId(reference: string): string {
  const parts = split(reference);
  return parts ? `${bookNameId(parts.book)} ${parts.rest}`.trim() : reference;
}

/**
 * Bible.com / YouVersion code for a reference: "2 Corinthians 10:17-18" → { passage: "2CO.10.17-18", chapter: "2CO.10" }.
 * Unusual references (e.g. across chapters) give just the chapter as the passage.
 */
export function usfmFor(reference: string): { passage: string; chapter: string } | null {
  const parts = split(reference);
  const code = parts ? BOOKS_ID[parts.book]?.[1] : undefined;
  if (!parts || !code) return null;
  const m = parts.rest.match(/^(\d+)(?::(\d+)(?:\s*[-–—]\s*(\d+))?)?$/);
  const chapterNo = m?.[1] ?? parts.rest.match(/^\d+/)?.[0];
  if (!chapterNo) return null;
  const chapter = `${code}.${chapterNo}`;
  const verses = m?.[2] ? `.${m[2]}${m[3] ? `-${m[3]}` : ""}` : "";
  return { passage: `${chapter}${verses}`, chapter };
}

/** The passage in the Terjemahan Baru on Bible.com, e.g. https://www.bible.com/bible/306/GAL.1.10.TB */
export function tbUrl(reference: string): string | null {
  const u = usfmFor(reference);
  return u ? `https://www.bible.com/bible/306/${u.passage}.TB` : null;
}

/** The whole chapter in the Terjemahan Sederhana Indonesia on Bible.com. */
export function tsiChapterUrl(reference: string): string | null {
  const u = usfmFor(reference);
  return u ? `https://www.bible.com/bible/320/${u.chapter}.TSI` : null;
}

/** Credit line YouVersion asks for when showing the TSI. */
export const TSI_NAME = "Terjemahan Sederhana Indonesia";
export const TSI_COPYRIGHT = "©2014–2023 Yayasan Alkitab Bahasa Kita dan Pioneer Bible Translators International";

export const BOOK_GROUPS_ID: Record<string, string> = {
  Law: "Taurat",
  History: "Sejarah",
  Poetry: "Puisi",
  Prophets: "Para Nabi",
  "Gospels & Acts": "Injil & Kisah Para Rasul",
  Letters: "Surat-surat",
  Revelation: "Wahyu",
};
