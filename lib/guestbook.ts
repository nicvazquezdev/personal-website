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
  // Escape special regex characters
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Use exact word match with word boundaries for most cases
  // Only allow minimal character substitution for obvious attempts to bypass
  if (word.length <= 4) {
    return new RegExp(`\\b${escapedWord}\\b`, "gi");
  }

  // For longer words, be more permissive but still require word boundaries
  const pattern = `\\b${escapedWord.split("").join("[^a-zA-Z0-9]?")}\\b`;
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
    throw new Error("Supabase client not initialized");
  }

  // Try a simpler query first
  console.log("Testing basic Supabase connection...");
  const { data, error } = await supabase.from("guestbook").select("id");

  if (error) {
    console.error("Basic query error:", error);
    return false;
  }

  console.log("Basic query successful, data:", data);

  // Now try the specific query with different approaches
  console.log("Trying session_id query with sessionId:", sessionId);

  // First try without .single() to see if that's the issue
  const { data: userData, error: userError } = await supabase
    .from("guestbook")
    .select("id")
    .eq("session_id", sessionId);

  if (userError) {
    console.error("Error checking if user has signed:", userError);
    return false;
  }

  console.log("Session query successful, userData:", userData);
  return userData && userData.length > 0;
}

export async function addGuestbookEntry(
  name: string,
  message: string,
  sessionId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
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
    throw new Error("Supabase client not initialized");
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
    throw new Error("Supabase client not initialized");
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
    throw new Error("Supabase client not initialized");
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
