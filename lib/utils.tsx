import Link from "next/link";

// Function to detect URLs and convert them to clickable links
export const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
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
