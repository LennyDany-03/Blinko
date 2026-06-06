import Link from "next/link";

export default function BlinkoLogo({ href = "/", compact = false, className = "", dark = false }) {
  const hasTextColor = /\btext-/.test(className);
  const logoColorClass = [
    hasTextColor ? "" : (dark ? "text-[#26fedc]" : "text-primary"),
    "flex items-center gap-2 font-display-xl tracking-tighter select-none transition-colors",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={logoColorClass}>
      <svg className="h-7 w-7 shrink-0" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"></circle>
        <path
          d="M11 9h5.5a3.5 3.5 0 0 1 0 7h-5.5h5.5a3.5 3.5 0 0 1 0 7h-5.5V9z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        ></path>
      </svg>
      {!compact && (
        <span className="font-bold text-headline-md leading-none">
          Blinko
        </span>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="scale-95 active:scale-90 transition-transform inline-block"
      aria-label="Blinko home"
    >
      {content}
    </Link>
  );
}
