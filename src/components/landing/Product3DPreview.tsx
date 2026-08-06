"use client";

import { useRef, useEffect, useState } from "react";
import { Play } from "lucide-react";

export default function Product3DPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to auto-play when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setShowPlayButton(false);
              })
              .catch(() => {
                // Autoplay blocked (common on iOS) — show manual play button
                setShowPlayButton(true);
              });
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => {
      setIsPlaying(true);
      setShowPlayButton(false);
    }).catch(() => {});
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-lg group">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
        onPlay={() => { setIsPlaying(true); setShowPlayButton(false); }}
      >
        <source src="/video-3d-pirotech.webm" type="video/webm" />
        <source src="/video-3d-pirotech.mp4" type="video/mp4" />
        Video Anda tidak didukung oleh browser.
      </video>

      {/* Manual Play Button (shown when autoplay is blocked on iOS) */}
      {showPlayButton && !isPlaying && (
        <button
          onClick={handleManualPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer transition-opacity hover:bg-black/40"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-7 h-7 text-brand-green700 ml-1" />
          </div>
        </button>
      )}

      {/* Decorative border glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-green/0 group-hover:ring-brand-green/20 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}
