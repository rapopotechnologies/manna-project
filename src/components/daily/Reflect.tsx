"use client";

import { useEffect, useState } from "react";

const steps = [
  { key: "s", letter: "S", name: "Scripture", hint: "Write out the phrase that stood out to you." },
  { key: "o", letter: "O", name: "Observation", hint: "What do you notice? What is God saying here?" },
  { key: "a", letter: "A", name: "Application", hint: "How will this shape your day today?" },
  { key: "p", letter: "P", name: "Prayer", hint: "Turn it into a short prayer." },
] as const;

type Notes = Record<(typeof steps)[number]["key"], string>;
const empty: Notes = { s: "", o: "", a: "", p: "" };

const storageKey = (dayKey: string) => `manna:soap:${dayKey}`;

/** A S.O.A.P. reflection for today's verse, saved only on this device. */
export function Reflect({ dayKey }: { dayKey: string }) {
  const [notes, setNotes] = useState<Notes>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(dayKey));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loading saved notes once on mount
      if (raw) setNotes({ ...empty, ...JSON.parse(raw) });
    } catch {
      // Storage unavailable (private mode); the form still works for this visit.
    }
  }, [dayKey]);

  function update(key: keyof Notes, value: string) {
    const next = { ...notes, [key]: value };
    setNotes(next);
    try {
      localStorage.setItem(storageKey(dayKey), JSON.stringify(next));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <details className="reflect">
      <summary>
        <span className="label">Reflect</span>
        <span className="reflect-title">Spend five minutes with it</span>
        <span className="reflect-sub">The S.O.A.P. method, the same one in our Bible Reading Tracker.</span>
      </summary>
      <div className="reflect-grid">
        {steps.map((step) => (
          <label key={step.key} className="reflect-field" htmlFor={`soap-${step.key}`}>
            <span className="reflect-letter" aria-hidden="true">{step.letter}</span>
            <span className="reflect-name">{step.name}</span>
            <textarea
              id={`soap-${step.key}`}
              rows={3}
              placeholder={step.hint}
              value={notes[step.key]}
              onChange={(e) => update(step.key, e.target.value)}
            />
          </label>
        ))}
      </div>
      <p className="reflect-note">{saved ? "Saved on this device." : "Your notes stay on this device. Nothing is sent anywhere."}</p>
    </details>
  );
}
