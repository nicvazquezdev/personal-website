"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function FloatingPerson() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <Image
        src={
          isClicked ? "/floating-person-clicked.png" : "/floating-person.png"
        }
        alt="Pixel art of a person lying down, floating in nothingness"
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => {
          setTimeout(() => {
            setIsClicked(false);
          }, 1000);
        }}
        className="hidden md:block absolute right-0 top-40 md:top-80 md:right-120 transform scale-x-[-1] opacity-50 animate-float cursor-pointer"
        width={180}
        height={180}
        priority
      />
    </>
  );
}
