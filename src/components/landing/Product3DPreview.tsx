"use client";

export default function Product3DPreview() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-lg group">
      {/* 
        Video diletakkan di dalam folder public/ 
        Ganti src="/video-3d-pirotech.mp4" sesuai dengan nama file video Anda
      */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video-3d-pirotech.webm" type="video/webm" />
        Video Anda tidak didukung oleh browser.
      </video>

      {/* Decorative border glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-green/0 group-hover:ring-brand-green/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
