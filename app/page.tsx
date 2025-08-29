import Image from "next/image";
import InfoSection from "./components/InfoSection";
import SocialLinks from "./components/SocialLinks";
import { infoData } from "../data";
import { getThoughtsData } from "../lib/getThoughtsData";

export default function Home() {
  // Get dynamic thoughts data that includes recent blog posts
  const dynamicInfoData = {
    thoughts: getThoughtsData(),
    "open-source": infoData["open-source"],
    me: infoData.me,
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:pt-20 md:pl-80">
      <div className="w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
          <Image
            src="/avatar.png"
            alt="Avatar pixel art"
            width={100}
            height={100}
            priority
          />

          <div className="space-y-4 font-mono">
            <p className="text-gray-300 leading-relaxed text-lg md:text-base">
              <span className="text-white font-semibold">Nicolas Vazquez</span>{" "}
              is a software engineer{" "}
              <span className="hidden md:inline">
                <br />
              </span>{" "}
              from Buenos Aires, Argentina.
            </p>
            <SocialLinks />
          </div>
        </div>

        <div className="mt-12">
          <InfoSection data={dynamicInfoData} />
        </div>
      </div>
    </div>
  );
}
