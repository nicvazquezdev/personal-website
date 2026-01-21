import { Suspense } from "react";
import { InfoSection } from "@/components/features/info-section";
import { FloatingAvatar } from "@/components/interactive";
import { infoData } from "@/data";
import { getThoughtsData } from "@/lib/blog";

export default function Home() {
  // Get dynamic thoughts data that includes recent blog posts
  const dynamicInfoData = {
    thoughts: getThoughtsData(),
    ...infoData,
  };

  return (
    <main className="py-6">
      <div className="w-full">
        <section
          className="relative"
          aria-label="Professional information and portfolio"
        >
          <Suspense fallback={<div className="text-gray-400">loading...</div>}>
            <InfoSection data={dynamicInfoData} />
          </Suspense>

          <FloatingAvatar />
        </section>
      </div>
    </main>
  );
}
