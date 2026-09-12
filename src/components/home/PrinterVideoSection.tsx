'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function PrinterVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setActiveSpeed(speed);
  };

  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-900 text-white select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-neutral-500 lowercase tracking-widest block mb-2">
            high-speed additive manufacturing
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white lowercase">
            precision in motion
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 lowercase max-w-xl mx-auto">
            watch our high-speed corexy platform extrude engineering carbon fiber composite at 500 mm/s with active vibration compensation.
          </p>
        </div>

        {/* Video Player Frame */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50 shadow-2xl group">
          {/* HTML5 Video Element */}
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster="/images/loop_macro_nozzle.jpg"
              className="w-full h-full object-cover filter contrast-[1.05]"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-3d-printer-nozzle-printing-an-object-41486-large.mp4"
                type="video/mp4"
              />
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-3d-printer-printing-a-structure-41485-large.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/65 via-transparent to-black/45" />

            {/* Top Video HUD Telemetry Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono text-white/90 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="lowercase">cell 01 · hotend 285°c · bed 100°c</span>
              </div>

              <div className="hidden sm:flex items-center gap-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-neutral-300">
                <span>layer 1,842 / 2,400</span>
                <span>•</span>
                <span>speed 420 mm/s</span>
                <span>•</span>
                <span>pa-cf 0.12mm</span>
              </div>
            </div>

            {/* Center Play Button Overlay on Pause */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-black ml-1" />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="hidden md:inline text-neutral-400 lowercase">
                  300°c hardened nozzle depositing pa-cf @ 18 mm³/s flow
                </span>
              </div>

              {/* Speed Pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 text-[10px] hidden sm:inline mr-1 uppercase">playback:</span>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeed(s)}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                      activeSpeed === s
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
