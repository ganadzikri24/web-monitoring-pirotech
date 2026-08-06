"use client";

import { useRef, useEffect } from "react";

export default function Product3DPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-lg group">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video-3d-pirotech.webm" type="video/webm" />
        Video Anda tidak didukung oleh browser.
      </video>

      {/* Decorative border glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-green/0 group-hover:ring-brand-green/20 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}
