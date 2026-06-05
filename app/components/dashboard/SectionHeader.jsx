export default function SectionHeader({ title, description, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
