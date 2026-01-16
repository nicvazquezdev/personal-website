import Link from "next/link";

// Hoisted regex - non-global for testing (avoids mutable lastIndex state)
// Rule: js-hoist-regexp
const URL_REGEX = /^https?:\/\/[^\s]+$/;
const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;

// Function to detect URLs and convert them to clickable links
export const linkifyText = (text: string) => {
  const parts = text.split(URL_SPLIT_REGEX);

  return parts.map((part, index) => {
    // Use non-global regex for testing to avoid mutable lastIndex bug
    if (URL_REGEX.test(part)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-white"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};
