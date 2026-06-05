import Button from "../Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
  className = "",
}) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center",
        className,
      ].join(" ")}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400">
        {Icon ? (
          <Icon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <span className="text-xl">✨</span>
        )}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500 max-w-xs">
        {description}
      </p>
      {actionText && onActionClick && (
        <div className="mt-5">
          <Button size="sm" variant="secondary" onClick={onActionClick}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
