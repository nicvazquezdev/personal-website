"use client";

interface GuestbookStatusProps {
  error: string;
  success: string;
}

export default function GuestbookStatus({
  error,
  success,
}: GuestbookStatusProps) {
  if (!error && !success) return null;

  return (
    <div className="space-y-2">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && <div className="text-green-400 text-sm">{success}</div>}
    </div>
  );
}
