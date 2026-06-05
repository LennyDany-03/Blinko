export default function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-lg border border-[#222222] bg-[#111111] shadow-2xl shadow-black/20",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
