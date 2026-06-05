import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function BlinkoLogo({ href = "/", compact = false, className = "" }) {
  const content = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-950/30">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      </span>
      {!compact ? (
        <span className="text-lg font-semibold tracking-tight text-white">
          Blinko
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div className={["flex items-center gap-2", className].join(" ")}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={["flex items-center gap-2", className].join(" ")}
      aria-label="Blinko home"
    >
      {content}
    </Link>
  );
}
