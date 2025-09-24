import Link from "next/link";
import { socialLinks } from "@/data";

export default function SocialLinks() {
  return (
    <div className="flex gap-4">
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200"
          aria-label={social.name}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  );
}
