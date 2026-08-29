"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/bannerimg/1 (1).jpeg",  w: 1402, h: 1122 },
  { src: "/bannerimg/1 (2).jpeg",  w: 1402, h: 1122 },
  { src: "/bannerimg/1 (3).jpeg",  w: 1402, h: 1122 },
  { src: "/bannerimg/1 (4).jpeg",  w: 1402, h: 1122 },
  { src: "/bannerimg/1 (5).jpeg",  w: 1086, h: 1448 },
  { src: "/bannerimg/1 (6).jpeg",  w: 1086, h: 1448 },
  { src: "/bannerimg/1 (7).jpeg",  w: 1086, h: 1448 },
  { src: "/bannerimg/1 (8).jpeg",  w: 1086, h: 1448 },
  { src: "/bannerimg/1 (9).jpeg",  w: 1086, h: 1448 },
  { src: "/bannerimg/1 (10).jpeg", w: 1448, h: 1086 },
  { src: "/bannerimg/1 (11).jpeg", w: 1080, h: 720  },
  { src: "/bannerimg/1 (12).jpeg", w: 1536, h: 1024 },
  { src: "/bannerimg/1 (13).jpeg", w: 1448, h: 1086 },
  { src: "/bannerimg/1 (14).jpeg", w: 1080, h: 1080 },
  { src: "/bannerimg/1 (15).jpeg", w: 1080, h: 1287 },
  { src: "/bannerimg/1 (16).jpeg", w: 1448, h: 1086 },
  { src: "/bannerimg/1 (17).jpeg", w: 1080, h: 720  },
];

const GROUP_A = SLIDES.filter((_, i) => i % 3 === 0);
const GROUP_B = SLIDES.filter((_, i) => i % 3 === 1);
const GROUP_C = SLIDES.filter((_, i) => i % 3 === 2);

// Max aspect ratio cap so banner doesn't get too tall
const MAX_RATIO = 0.85;

export default function BannerSlider() {
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(1 % GROUP_B.length);
  const [idxC, setIdxC] = useState(2 % GROUP_C.length);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdxA(c => (c + 1) % GROUP_A.length), 3500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setIdxB(c => (c + 1) % GROUP_B.length), 4300);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setIdxC(c => (c + 1) % GROUP_C.length), 5100);
    return () => clearInterval(t);
  }, []);

  // Each frame gets its own natural aspect ratio — no crop
  const ratioA = Math.min(GROUP_A[idxA].h / GROUP_A[idxA].w, MAX_RATIO);
  const ratioB = Math.min(GROUP_B[idxB].h / GROUP_B[idxB].w, MAX_RATIO);
  const ratioC = isMobile ? 0 : Math.min(GROUP_C[idxC].h / GROUP_C[idxC].w, MAX_RATIO);

  // All frames share the same height — use the tallest current image
  const tallest = Math.max(ratioA, ratioB, ratioC);
  const cols = isMobile ? 2 : 3;
  const pb = (tallest / cols) * 100;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ background: "var(--background)" }}>
      <div
        className="relative w-full transition-[padding] duration-500"
        style={{ paddingBottom: `${pb}%` }}
      >
        {/* Frame A */}
        <div
          className="absolute top-0 h-full"
          style={{ left: "0%", width: isMobile ? "50%" : "33.333%" }}
        >
          {GROUP_A.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center"
              style={{ opacity: i === idxA ? 1 : 0, zIndex: i === idxA ? 2 : 1 }}
            >
              <Image
                src={s.src}
                alt={`Banner A${i}`}
                fill
                className="object-contain object-center"
                priority={i === 0}
                sizes={isMobile ? "50vw" : "33vw"}
              />
            </div>
          ))}
        </div>

        {/* Frame B */}
        <div
          className="absolute top-0 h-full"
          style={{ left: isMobile ? "50%" : "33.333%", width: isMobile ? "50%" : "33.333%" }}
        >
          {GROUP_B.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center"
              style={{ opacity: i === idxB ? 1 : 0, zIndex: i === idxB ? 2 : 1 }}
            >
              <Image
                src={s.src}
                alt={`Banner B${i}`}
                fill
                className="object-contain object-center"
                priority={i === 0}
                sizes={isMobile ? "50vw" : "33vw"}
              />
            </div>
          ))}
        </div>

        {/* Frame C — desktop only */}
        {!isMobile && (
          <div
            className="absolute top-0 h-full"
            style={{ left: "66.666%", width: "33.333%" }}
          >
            {GROUP_C.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center"
                style={{ opacity: i === idxC ? 1 : 0, zIndex: i === idxC ? 2 : 1 }}
              >
                <Image
                  src={s.src}
                  alt={`Banner C${i}`}
                  fill
                  className="object-contain object-center"
                  priority={i === 0}
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
