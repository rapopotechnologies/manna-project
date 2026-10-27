import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap lost">
      <span className="label">Page not found</span>
      <h1>
        This room is still <span className="brush">under renovation</span>.
      </h1>
      <p>The page you’re looking for has moved or doesn’t exist. Today’s verse is always a good place to start.</p>
      <div className="porch-ctas">
        <Link className="btn btn-primary" href="/daily">Read today’s verse</Link>
        <Link className="btn" href="/">Go home</Link>
      </div>
    </div>
  );
}
