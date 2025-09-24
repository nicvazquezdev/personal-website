import { supabase, GuestbookEntry, isDevelopmentMode } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Get the correct table name based on environment
const getTableName = () => {
  return isDevelopmentMode ? "guestbook_dev" : "guestbook";
};

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
  "zorra",
  "perra",
  "marica",
  "putazo",
  "pajero",
  "mogólico",
  "tarado",
  "cabrón",
  "chupapija",
  "tragaleche",
  "malparido",
  "sorete",
  "pelmazo",
  "pedorro",
  "gil",
  "cornudo",
  "pedorra",
  "inútil",
  "desgraciado",
  "pendejo",
  "pendeja",

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
  "jerk",
  "dumbass",
  "prick",
  "twat",
  "loser",
  "fatass",
  "hoe",
  "douche",
  "scumbag",
  "trash",
  "worthless",
  "ugly",
  "motherfucker",
  "bitch",
  "choke",
  "hang yourself",
  "nigga",
];

// Normalize text to handle unicode variants, accents, and invisible separators
function normalizeText(text: string): string {
  return (
    text
      .toLowerCase()
      // Normalize unicode (NFD) and remove diacritics
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Remove invisible characters and normalize spaces
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Check if text contains banned words with various separators
function containsBannedWordWithSeparators(
  text: string,
  bannedWord: string,
): boolean {
  const normalizedText = normalizeText(text);
  const normalizedBannedWord = normalizeText(bannedWord);

  // Check direct match
  if (normalizedText.includes(normalizedBannedWord)) {
    return true;
  }

  // Check with various separators
  const separators = ["", " ", ".", "-", "_", "*", "🦆", "\u200B", "\uFEFF"];

  for (const sep of separators) {
    const pattern = bannedWord.split("").join(sep);
    if (normalizedText.includes(normalizeText(pattern))) {
      return true;
    }
  }

  return false;
}

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

  // Check for prohibited words using robust detection
  for (const bannedWord of BANNED_WORDS) {
    if (containsBannedWordWithSeparators(content, bannedWord)) {
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

  const tableName = getTableName();
  const { data, error } = await supabase
    .from(tableName)
    .select("id")
    .eq("session_id", sessionId);

  if (error) {
    console.error("Error checking if user has signed:", error);
    return false;
  }

  return data && data.length > 0;
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
    const tableName = getTableName();
    const { error } = await supabase.from(tableName).insert({
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
    const tableName = getTableName();
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error("Error fetching guestbook entries:", error);
      return { entries: [], hasMore: false };
    }

    // Check if there are more pages
    const { count } = await supabase
      .from(tableName)
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
    const tableName = getTableName();

    // Verify that the entry belongs to this session
    const { data: entry, error: fetchError } = await supabase
      .from(tableName)
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
      .from(tableName)
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
    const tableName = getTableName();

    // Verify that the entry belongs to this session
    const { data: entry, error: fetchError } = await supabase
      .from(tableName)
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
    const { error } = await supabase.from(tableName).delete().eq("id", id);

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
