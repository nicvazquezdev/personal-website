"use client";

import { useState, useEffect, useCallback } from "react";
import { GuestbookEntry } from "@/lib/supabase";
import {
  getSessionId,
  addGuestbookEntry,
  getGuestbookEntries,
  updateGuestbookEntry,
  deleteGuestbookEntry,
  checkIfUserHasSigned,
} from "@/lib/guestbook";
import GuestbookForm from "./GuestbookForm";
import GuestbookList from "./GuestbookList";
import GuestbookStatus from "./GuestbookStatus";

interface GuestbookProps {
  className?: string;
}

export default function Guestbook({ className = "" }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const sessionId = getSessionId();

  const loadEntries = useCallback(
    async (page: number = 0, append: boolean = false) => {
      try {
        setLoading(true);
        const { entries: newEntries, hasMore: moreEntries } =
          await getGuestbookEntries(page, 10);

        if (append) {
          setEntries((prev) => [...prev, ...newEntries]);
        } else {
          setEntries(newEntries);
        }

        setHasMore(moreEntries);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error loading entries:", error);
        setError("error loading signatures");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const checkUserStatus = useCallback(async () => {
    try {
      const signed = await checkIfUserHasSigned(sessionId);
      setHasSigned(signed);
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadEntries();
    checkUserStatus();
  }, [loadEntries, checkUserStatus]);

  const handleFormSubmit = async (name: string, message: string) => {
    setSubmitting(true);
    setError("");

    try {
      if (editingEntry) {
        const result = await updateGuestbookEntry(
          editingEntry.id,
          name,
          message,
          sessionId,
        );

        if (result.success) {
          setEditingEntry(null);
          loadEntries(0, false);
        } else {
          setError(result.error || "error updating signature");
        }
      } else {
        const result = await addGuestbookEntry(name, message, sessionId);

        if (result.success) {
          setHasSigned(true);
          loadEntries(0, false);
        } else {
          setError(result.error || "error saving signature");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("unexpected error. please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: GuestbookEntry) => {
    setEditingEntry(entry);
  };

  const handleCancel = () => {
    setEditingEntry(null);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("are you sure you want to delete your signature?")) return;

    try {
      const result = await deleteGuestbookEntry(entryId, sessionId);

      if (result.success) {
        setHasSigned(false);
        loadEntries(0, false);
      } else {
        setError(result.error || "error deleting signature");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("unexpected error. please try again.");
    }
  };

  const handleLoadMore = () => {
    loadEntries(currentPage + 1, true);
  };

  if (initialLoading) {
    return (
      <div className={`space-y-6 md:w-1/2 ${className}`}>
        <div className="text-gray-400">loading...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 md:w-1/2 ${className}`}>
      {(!hasSigned || editingEntry) && (
        <GuestbookForm
          editingEntry={editingEntry}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitting={submitting}
        />
      )}

      <GuestbookStatus error={error} />

      <GuestbookList
        entries={entries}
        loading={loading}
        hasMore={hasMore}
        sessionId={sessionId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
