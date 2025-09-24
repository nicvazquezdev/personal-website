interface GuestbookStatusProps {
  error: string;
}

export default function GuestbookStatus({ error }: GuestbookStatusProps) {
  if (!error) return null;

  return (
    <div className="space-y-2">
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
