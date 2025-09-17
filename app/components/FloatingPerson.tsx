"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function FloatingPerson() {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  return (
    <>
      <Image
        src={
          isClicked ? "/floating-person-clicked.png" : "/floating-person.png"
        }
        alt="Pixel art of a person lying down relaxed, floating in nothingness, with arms behind the head and eyes closed"
        onClick={() => setIsClicked(true)}
        className="absolute right-0 top-40 md:top-80 md:right-120 transform scale-x-[-1] opacity-50 animate-float cursor-pointer"
        width={180}
        height={180}
        priority
      />
    </>
  );
}
