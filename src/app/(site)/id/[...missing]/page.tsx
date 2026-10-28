import { notFound } from "next/navigation";

// Any /id address without a page shows the Indonesian "not found" page, inside the Indonesian header and footer.
export default function Missing() {
  notFound();
}
