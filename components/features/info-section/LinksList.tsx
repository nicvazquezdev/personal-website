import Link from "next/link";
import { Link as LinkType } from "@/types";

// Hoist external link icon outside component to avoid recreation
const externalLinkIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block ml-1 opacity-50 group-hover:opacity-70 transition-opacity"
    aria-hidden="true"
  >
    <path d="M3.5 3h5.5v5.5M9 3L3 9" />
  </svg>
);

interface LinksListProps {
  links: LinkType[];
}

export default function LinksList({ links }: LinksListProps) {
  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row md:items-end gap-1 md:gap-2"
        >
          {link.date && (
            <div className="text-gray-400 text-sm md:text-xs">{link.date}</div>
          )}
          <Link
            href={link.url}
            target={link.url.startsWith("http") ? "_blank" : undefined}
            rel={
              link.url.startsWith("http") ? "noopener noreferrer" : undefined
            }
            className="group inline-flex items-baseline hover:text-white text-sm md:text-base"
          >
            <span className="border-b border-gray-400 group-hover:border-gray-300 pb-0.5">
              {link.name}
            </span>
            {link.url.startsWith("http") ? externalLinkIcon : null}
          </Link>
        </div>
      ))}
    </div>
  );
}
