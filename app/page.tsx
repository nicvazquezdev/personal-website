import Image from "next/image";
import InfoSection from "./components/InfoSection";
import SocialLinks from "./components/SocialLinks";
import { infoData } from "../data";
import { getThoughtsData } from "../lib/getThoughtsData";
import { Suspense } from "react";

export default function Home() {
  // Get dynamic thoughts data that includes recent blog posts
  const dynamicInfoData = {
    thoughts: getThoughtsData(),
    ...infoData,
  };

  return (
    <main className="min-h-screen p-8 md:pt-20 md:pl-80">
      <div className="w-full">
        <header className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
          <Image
            src="/avatar.png"
            alt="Avatar pixel art"
            width={100}
            height={100}
            priority
          />

          <div className="space-y-4">
            <h1 className="text-gray-300 leading-relaxed text-lg md:text-base">
              <span className="text-white font-semibold">nicolás vazquez</span>{" "}
              is a senior software engineer{" "}
              <span className="hidden md:inline">
                <br />
              </span>{" "}
              from buenos aires, argentina.
            </h1>
            <SocialLinks />
          </div>
        </header>

        <section
          className="mt-12"
          aria-label="Professional information and portfolio"
        >
          <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
            <InfoSection data={dynamicInfoData} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
