/* The brush-lettered logo. Two PNGs: ink for light walls, linen for dark ones. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="wordmark-ink" src="/brand/manna-wordmark.png" alt="Manna Project" width={619} height={252} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="wordmark-light" src="/brand/manna-wordmark-light.png" alt="" aria-hidden="true" width={619} height={252} />
    </span>
  );
}
