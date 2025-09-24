import { supabase, GuestbookEntry } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Blacklist of prohibited words (Spanish and English)
const BANNED_WORDS = [
  // Spanish words
  "puto",
  "puta",
  "hijo de puta",
  "concha",
  "forro",
  "boludo",
  "pelotudo",
  "gordo",
  "gorda",
  "feo",
  "fea",
  "tonto",
  "tonta",
  "idiota",
  "imbecil",
  "mierda",
  "caca",
  "pija",
  "pene",
  "vagina",
  "culo",
  "chupame",
  "chupala",
  "jodete",
  "matar",
  "morir",

  // English words
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "damn",
  "hell",
  "crap",
  "piss",
  "dick",
  "cock",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "bastard",
  "stupid",
  "idiot",
  "moron",
  "retard",
  "gay",
  "fag",
  "nigger",
  "kill",
  "die",
  "death",
  "murder",
  "suicide",
  "hate",
  "kill yourself",
  "dead",
];

// Create regex to detect variants of prohibited words
const createBannedWordRegex = (word: string) => {
  // Simple approach: check for word with optional special characters between letters
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escapedWord.split("").join("[^a-zA-Z0-9]*");
  return new RegExp(pattern, "gi");
};

const bannedWordRegexes = BANNED_WORDS.map(createBannedWordRegex);

export function validateContent(content: string): {
  isValid: boolean;
  reason?: string;
} {
  // Check length
  if (content.length > 30) {
    return {
      isValid: false,
      reason: "Message is too long (maximum 30 characters)",
    };
  }

  if (content.length < 1) {
    return { isValid: false, reason: "why would you send an empty message?" };
  }

  // Check for prohibited words
  const lowerContent = content.toLowerCase();

  for (const regex of bannedWordRegexes) {
    if (regex.test(lowerContent)) {
      return {
        isValid: false,
        reason: "why would you send inappropriate content?",
      };
    }
  }

  return { isValid: true };
}

export function generateSessionId(): string {
  return uuidv4();
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("guestbook_session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("guestbook_session_id", sessionId);
  }
  return sessionId;
}

export async function checkIfUserHasSigned(
  sessionId: string,
): Promise<boolean> {
  if (!supabase) {
    // Development mode: check localStorage
    return localStorage.getItem("guestbook_session_signed") === "true";
  }

  const { data, error } = await supabase
    .from("guestbook")
    .select("id")
    .eq("session_id", sessionId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error checking if user has signed:", error);
    return false;
  }

  return !!data;
}

export async function addGuestbookEntry(
  name: string,
  message: string,
  sessionId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    // Development mode: store locally
    try {
      // Check if user has already signed locally
      const hasSigned =
        localStorage.getItem("guestbook_session_signed") === "true";
      if (hasSigned) {
        return {
          success: false,
          error: "you have already left your signature in the guestbook",
        };
      }

      // Validate content
      const nameValidation = validateContent(name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.reason };
      }

      const messageValidation = validateContent(message);
      if (!messageValidation.isValid) {
        return { success: false, error: messageValidation.reason };
      }

      // Store locally
      const localEntries = JSON.parse(
        localStorage.getItem("guestbook_entries") || "[]",
      );
      const newEntry = {
        id: uuidv4(),
        name: name.trim(),
        message: message.trim(),
        session_id: sessionId,
        created_at: new Date().toISOString(),
      };

      localEntries.unshift(newEntry);
      localStorage.setItem("guestbook_entries", JSON.stringify(localEntries));
      localStorage.setItem("guestbook_session_signed", "true");

      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return {
        success: false,
        error: "error saving signature locally",
      };
    }
  }

  try {
    // Check if user has already signed
    const hasSigned = await checkIfUserHasSigned(sessionId);
    if (hasSigned) {
      return {
        success: false,
        error: "you have already left your signature in the guestbook",
      };
    }

    // Validate content
    const nameValidation = validateContent(name);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.reason };
    }

    const messageValidation = validateContent(message);
    if (!messageValidation.isValid) {
      return { success: false, error: messageValidation.reason };
    }

    // Insert entry
    const { error } = await supabase.from("guestbook").insert({
      name: name.trim(),
      message: message.trim(),
      session_id: sessionId,
    });

    if (error) {
      console.error("Error adding guestbook entry:", error);
      return {
        success: false,
        error: "error saving signature. please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in addGuestbookEntry:", error);
    return { success: false, error: "unexpected error. please try again." };
  }
}

export async function getGuestbookEntries(
  page: number = 0,
  limit: number = 10,
): Promise<{ entries: GuestbookEntry[]; hasMore: boolean }> {
  if (!supabase) {
    // Development mode: get from localStorage
    try {
      const localEntries = JSON.parse(
        localStorage.getItem("guestbook_entries") || "[]",
      );
      const startIndex = page * limit;
      const endIndex = startIndex + limit;
      const entries = localEntries.slice(startIndex, endIndex);
      const hasMore = endIndex < localEntries.length;

      return { entries, hasMore };
    } catch (error) {
      console.error("Error loading local entries:", error);
      return { entries: [], hasMore: false };
    }
  }

  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error("Error fetching guestbook entries:", error);
      return { entries: [], hasMore: false };
    }

    // Check if there are more pages
    const { count } = await supabase
      .from("guestbook")
      .select("*", { count: "exact", head: true });

    const hasMore = count ? (page + 1) * limit < count : false;

    return { entries: data || [], hasMore };
  } catch (error) {
    console.error("Error in getGuestbookEntries:", error);
    return { entries: [], hasMore: false };
  }
}

export async function updateGuestbookEntry(
  id: string,
  name: string,
  message: string,
  sessionId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    // Development mode: update locally
    try {
      const localEntries = JSON.parse(
        localStorage.getItem("guestbook_entries") || "[]",
      );
      const entryIndex = localEntries.findIndex(
        (entry: GuestbookEntry) => entry.id === id,
      );

      if (entryIndex === -1) {
        return { success: false, error: "entry not found" };
      }

      if (localEntries[entryIndex].session_id !== sessionId) {
        return {
          success: false,
          error: "you do not have permission to edit this entry",
        };
      }

      // Validate content
      const nameValidation = validateContent(name);
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.reason };
      }

      const messageValidation = validateContent(message);
      if (!messageValidation.isValid) {
        return { success: false, error: messageValidation.reason };
      }

      // Update entry
      localEntries[entryIndex] = {
        ...localEntries[entryIndex],
        name: name.trim(),
        message: message.trim(),
      };

      localStorage.setItem("guestbook_entries", JSON.stringify(localEntries));
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return {
        success: false,
        error: "error updating signature locally",
      };
    }
  }

  try {
    // Verify that the entry belongs to this session
    const { data: entry, error: fetchError } = await supabase
      .from("guestbook")
      .select("session_id")
      .eq("id", id)
      .single();

    if (fetchError || !entry) {
      return { success: false, error: "entry not found" };
    }

    if (entry.session_id !== sessionId) {
      return {
        success: false,
        error: "you do not have permission to edit this entry",
      };
    }

    // Validate content
    const nameValidation = validateContent(name);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.reason };
    }

    const messageValidation = validateContent(message);
    if (!messageValidation.isValid) {
      return { success: false, error: messageValidation.reason };
    }

    // Update entry
    const { error } = await supabase
      .from("guestbook")
      .update({
        name: name.trim(),
        message: message.trim(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating guestbook entry:", error);
      return {
        success: false,
        error: "error updating signature. please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateGuestbookEntry:", error);
    return { success: false, error: "unexpected error. please try again." };
  }
}

export async function deleteGuestbookEntry(
  id: string,
  sessionId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    // Development mode: delete locally
    try {
      const localEntries = JSON.parse(
        localStorage.getItem("guestbook_entries") || "[]",
      );
      const entryIndex = localEntries.findIndex(
        (entry: GuestbookEntry) => entry.id === id,
      );

      if (entryIndex === -1) {
        return { success: false, error: "entry not found" };
      }

      if (localEntries[entryIndex].session_id !== sessionId) {
        return {
          success: false,
          error: "you do not have permission to delete this entry",
        };
      }

      // Delete entry
      localEntries.splice(entryIndex, 1);
      localStorage.setItem("guestbook_entries", JSON.stringify(localEntries));
      localStorage.removeItem("guestbook_session_signed");

      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return {
        success: false,
        error: "error deleting signature locally",
      };
    }
  }

  try {
    // Verify that the entry belongs to this session
    const { data: entry, error: fetchError } = await supabase
      .from("guestbook")
      .select("session_id")
      .eq("id", id)
      .single();

    if (fetchError || !entry) {
      return { success: false, error: "entry not found" };
    }

    if (entry.session_id !== sessionId) {
      return {
        success: false,
        error: "you do not have permission to delete this entry",
      };
    }

    // Delete entry
    const { error } = await supabase.from("guestbook").delete().eq("id", id);

    if (error) {
      console.error("Error deleting guestbook entry:", error);
      return {
        success: false,
        error: "error deleting signature. please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteGuestbookEntry:", error);
    return { success: false, error: "unexpected error. please try again." };
  }
}
