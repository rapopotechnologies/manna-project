import "server-only";
import { randomInt } from "node:crypto";
import { MIN_PASSWORD } from "./password-rules";

export { MIN_PASSWORD };

// No 0/O, 1/l/I: easy to read aloud or copy by hand.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** A temporary password like manna-k7Qw-3pRt-Xz9m. Must be changed at first sign-in. */
export function temporaryPassword(): string {
  const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `manna-${group()}-${group()}-${group()}`;
}

export function passwordProblem(password: string, confirm: string): string | null {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (password !== confirm) return "The two passwords don’t match.";
  if (password.startsWith("manna-")) return "Choose a new password, not the temporary one.";
  return null;
}
