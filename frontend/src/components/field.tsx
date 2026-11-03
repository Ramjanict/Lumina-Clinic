export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-ink/80">{label}</p>
      {children}
      {error ? <p className="text-sm text-clay">{error}</p> : null}
    </div>
  );
}
