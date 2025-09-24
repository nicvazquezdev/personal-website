"use client";

import type { GuestbookEntry } from "@/lib/supabase";

interface GuestbookEntryProps {
  entry: GuestbookEntry;
  sessionId: string;
  onEdit: (entry: GuestbookEntry) => void;
  onDelete: (entryId: string) => void;
}

export default function GuestbookEntry({
  entry,
  sessionId,
  onEdit,
  onDelete,
}: GuestbookEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwner = entry.session_id === sessionId;

  return (
    <div className="border-b border-gray-700 pb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium text-white">{entry.name}</div>
          <div className="text-gray-300 text-sm">{entry.message}</div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              edit
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              delete
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        {formatDate(entry.created_at)}
      </div>
    </div>
  );
}
