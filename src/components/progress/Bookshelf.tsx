import { BOOK_GROUP_COLORS, BOOKS, type BookGroup } from "@/data/bible-books";

/** 66 spines, colored in once a daily verse has come from that book. */
export function Bookshelf({ books }: { books: Record<string, string> }) {
  const count = BOOKS.filter((b) => books[b.name]).length;
  const groups = Object.keys(BOOK_GROUP_COLORS) as BookGroup[];
  return (
    <div className="bookshelf">
      <div className="shelf-row" role="list" aria-label={`Bookshelf: ${count} of 66 books`}>
        {BOOKS.map((b, i) => {
          const on = Boolean(books[b.name]);
          return (
            <span
              key={b.name}
              role="listitem"
              className={`spine${on ? " on" : ""}`}
              style={{ height: `${44 + ((i * 37) % 22)}px`, background: on ? BOOK_GROUP_COLORS[b.group] : undefined }}
              title={on ? `${b.name}: first verse ${books[b.name]}` : b.name}
            >
              <span className="sr-only">{`${b.name}${on ? ", on your shelf" : ""}`}</span>
            </span>
          );
        })}
      </div>
      <div className="shelf-legend" aria-hidden="true">
        {groups.map((g) => (
          <span key={g}><i style={{ background: BOOK_GROUP_COLORS[g] }} />{g}</span>
        ))}
      </div>
    </div>
  );
}
