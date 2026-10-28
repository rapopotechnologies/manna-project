import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { dayKeyFor, dayNumber } from "@/lib/day";
import { addQuestion, deleteQuestion, updateQuestion } from "./actions";

export default function KidsAdminPage({ searchParams }: PageProps<"/admin/kids">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <KidsAdmin searchParams={searchParams} />
    </Suspense>
  );
}

const errors: Record<string, string> = {
  short: "Questions need at least a few words.",
  min: "Keep at least 7 questions so there’s one for every day of the week.",
};

async function KidsAdmin({ searchParams }: { searchParams: PageProps<"/admin/kids">["searchParams"] }) {
  const admin = await requireAdmin();
  const { saved, added, removed, error } = await searchParams;
  const { data } = await admin.supabase.from("kids_questions").select("*").order("position");
  const questions = data ?? [];
  const todayIndex = questions.length ? dayNumber(dayKeyFor(new Date())) % questions.length : -1;

  return (
    <AdminShell
      admin={admin}
      title="Kids questions"
      intro={`${questions.length} questions. Every family sees the same one each day, going down this list in order and starting over at the end. The Indonesian site shows the Indonesian wording (or the English one if it’s left empty).`}
    >
      {typeof error === "string" && errors[error] && <p className="notice notice-error" role="alert">{errors[error]}</p>}
      {saved && <p className="notice notice-ok" role="status">Saved.</p>}
      {added && <p className="notice notice-ok" role="status">Added to the end of the list.</p>}
      {removed && <p className="notice notice-ok" role="status">Removed.</p>}

      <section className="panel">
        {questions.map((q, i) => (
          <div key={q.id} id={`q-${q.id}`} className={`question-row${i === todayIndex ? " today" : ""}`}>
            <b>{q.position}</b>
            <form action={updateQuestion} style={{ display: "contents" }}>
              <input type="hidden" name="id" value={q.id} />
              <span className="question-pair">
                <input name="question" defaultValue={q.question} aria-label={`Question ${q.position}${i === todayIndex ? " (today)" : ""}, English`} />
                <input name="question_id" defaultValue={q.question_id ?? ""} lang="id" placeholder="Bahasa Indonesia" aria-label={`Question ${q.position}, Indonesian`} />
              </span>
              <button className="icon-btn" type="submit">Save</button>
            </form>
            <form action={deleteQuestion}>
              <input type="hidden" name="id" value={q.id} />
              <button className="icon-btn" type="submit" aria-label={`Remove question ${q.position}`}>Remove</button>
            </form>
          </div>
        ))}
        <p className="muted" style={{ fontSize: "0.85rem" }}>The highlighted question is today’s.</p>
      </section>

      <section className="panel" id="add" aria-labelledby="add-q">
        <h2 id="add-q">Add a question</h2>
        <form action={addQuestion} className="admin-form">
          <label className="field" htmlFor="new-question">
            <span>Question (English)</span>
            <input id="new-question" name="question" required minLength={3} maxLength={300} placeholder="What made you smile today?" />
          </label>
          <label className="field" htmlFor="new-question-id">
            <span>Question (Indonesian, optional)</span>
            <input id="new-question-id" name="question_id" lang="id" minLength={3} maxLength={300} placeholder="Apa yang membuatmu tersenyum hari ini?" />
          </label>
          <div><button className="btn btn-primary" type="submit">Add question</button></div>
        </form>
      </section>
    </AdminShell>
  );
}
