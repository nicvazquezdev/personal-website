"use client";

import { GuestbookEntry } from "@/lib/supabase";
import GuestbookEntryComponent from "./GuestbookEntry";

interface GuestbookListProps {
  entries: GuestbookEntry[];
  loading: boolean;
  hasMore: boolean;
  sessionId: string;
  onEdit: (entry: GuestbookEntry) => void;
  onDelete: (entryId: string) => void;
  onLoadMore: () => void;
}

export default function GuestbookList({
  entries,
  loading,
  hasMore,
  sessionId,
  onEdit,
  onDelete,
  onLoadMore,
}: GuestbookListProps) {
  if (loading && entries.length === 0) {
    return <div className="text-gray-400">loading signatures...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-gray-400">
        no signatures yet. be the first to sign!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <GuestbookEntryComponent
          key={entry.id}
          entry={entry}
          sessionId={sessionId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {hasMore && (
        <div>
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-50 px-4 py-2"
          >
            {loading ? "loading..." : "load more signatures"}
          </button>
        </div>
      )}
    </div>
  );
}
