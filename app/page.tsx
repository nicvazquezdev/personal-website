import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:pt-20 md:pl-80">
      <div className="max-w-lg w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
          <Image
            src="/avatar.png"
            alt="Avatar pixel art"
            width={100}
            height={100}
          />

          <div className="space-y-4 font-mono">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Nicolas Vazquez</span>{" "}
              is a software engineer from Buenos Aires, Argentina.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
