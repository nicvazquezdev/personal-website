"use client";
import Image from "next/image";
import Link from "next/link";
import { GlitchText, TypingText } from "@/components/ui";
import SocialLinks from "./SocialLinks";

export default function Header() {
  return (
    <header className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
      <Link href="/">
        <Image
          src="/avatar.png"
          alt="Avatar pixel art"
          width={80}
          height={117}
          priority
        />
      </Link>

      <div className="space-y-4">
        <h2 className="text-gray-300 leading-relaxed text-lg md:text-base">
          <GlitchText text="nicolás vazquez" className="text-white font-semibold" />{" "}
          <TypingText
            lines={[
              "is a senior software engineer",
              "from buenos aires, argentina",
            ]}
            speed={40}
            delay={300}
          />
        </h2>
        <SocialLinks />
      </div>
    </header>
  );
}
