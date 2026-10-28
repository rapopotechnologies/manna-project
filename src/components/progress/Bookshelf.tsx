"use client";

import { BOOK_GROUP_COLORS, BOOKS, type BookGroup } from "@/data/bible-books";
import { BOOK_GROUPS_ID, bookNameId } from "@/data/bible-id";
import { useLang } from "@/i18n/client";

/** 66 spines, colored in once a daily verse has come from that book. */
export function Bookshelf({ books }: { books: Record<string, string> }) {
  const lang = useLang();
  const id = lang === "id";
  const name = (b: string) => (id ? bookNameId(b) : b);
  const count = BOOKS.filter((b) => books[b.name]).length;
  const groups = Object.keys(BOOK_GROUP_COLORS) as BookGroup[];
  return (
    <div className="bookshelf">
      <div className="shelf-row" role="list" aria-label={id ? `Rak buku: ${count} dari 66 kitab` : `Bookshelf: ${count} of 66 books`}>
        {BOOKS.map((b, i) => {
          const on = Boolean(books[b.name]);
          return (
            <span
              key={b.name}
              role="listitem"
              className={`spine${on ? " on" : ""}`}
              style={{ height: `${44 + ((i * 37) % 22)}px`, background: on ? BOOK_GROUP_COLORS[b.group] : undefined }}
              title={on ? (id ? `${name(b.name)}: ayat pertama ${books[b.name]}` : `${b.name}: first verse ${books[b.name]}`) : name(b.name)}
            >
              <span className="sr-only">{`${name(b.name)}${on ? (id ? ", ada di rakmu" : ", on your shelf") : ""}`}</span>
            </span>
          );
        })}
      </div>
      <div className="shelf-legend" aria-hidden="true">
        {groups.map((g) => (
          <span key={g}><i style={{ background: BOOK_GROUP_COLORS[g] }} />{id ? BOOK_GROUPS_ID[g] : g}</span>
        ))}
      </div>
    </div>
  );
}
