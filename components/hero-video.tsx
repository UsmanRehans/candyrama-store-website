"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 639px)");
    const mediaBase = () => `/videos/hero/package-scene${mobile.matches ? "-mobile" : ""}`;
    video.poster = `${mediaBase()}.jpg`;
    let manualPause = false;
    let explicitPlay = false;
    let visible = false;
    let disposed = false;
    let broken = false;
    let pending = false;
    let revision = 0;
    const wantsPlayback = () => !disposed && !broken && !manualPause &&
      (!reduced.matches || explicitPlay) && visible && !document.hidden;

    const sync = () => {
      if (!wantsPlayback()) {
        revision += 1;
        pending = false;
        video.pause();
        setPlaying(false);
        return;
      }
      if (pending || !video.paused) return;
      if (!video.getAttribute("src")) {
        video.src = `${mediaBase()}.mp4`;
        video.load();
      }
      const request = ++revision;
      pending = true;
      void video.play().then(() => {
        if (disposed) return;
        if (request === revision) pending = false;
        if (!wantsPlayback()) video.pause();
      }).catch(() => {
        if (disposed || request !== revision) return;
        pending = false;
        setPlaying(false);
      });
    };
    const checkVisibility = () => {
      const rect = video.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight &&
        rect.right > 0 && rect.left < window.innerWidth;
      sync();
    };
    const breakpointChanged = () => {
      const hadSource = Boolean(video.getAttribute("src"));
      revision += 1;
      pending = false;
      broken = false;
      video.pause();
      setPlaying(false);
      setReady(false);
      setFailed(false);
      video.poster = `${mediaBase()}.jpg`;
      // An untouched reduced-motion hero remains poster-only at either size.
      if (hadSource) {
        video.src = `${mediaBase()}.mp4`;
        video.load();
      }
      checkVisibility();
    };
    const preferenceChanged = () => {
      // A new system preference takes priority over an earlier explicit play.
      explicitPlay = false;
      sync();
    };
    const onPlaying = () => {
      if (!wantsPlayback()) {
        video.pause();
        return;
      }
      setReady(true);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onError = () => {
      broken = true;
      revision += 1;
      pending = false;
      video.pause();
      setFailed(true);
      setPlaying(false);
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    const observer = typeof IntersectionObserver === "undefined" ? null :
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
    observer?.observe(video);
    if (!observer) window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    reduced.addEventListener("change", preferenceChanged);
    mobile.addEventListener("change", breakpointChanged);
    document.addEventListener("visibilitychange", sync);
    toggleRef.current = () => {
      if (pending || !video.paused) {
        manualPause = true;
      } else {
        manualPause = false;
        explicitPlay = true;
      }
      sync();
    };
    checkVisibility();
    return () => {
      disposed = true;
      revision += 1;
      toggleRef.current = () => {};
      observer?.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      reduced.removeEventListener("change", preferenceChanged);
      mobile.removeEventListener("change", breakpointChanged);
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.pause();
    };
  }, []);

  return (
    <div className="hero-scene">
      <div className="hero-scene-poster" aria-hidden="true" />
      <video
        ref={videoRef}
        className="hero-ambient-video"
        poster="/videos/hero/package-scene.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{ opacity: failed || !ready ? 0 : undefined }}
      />
      {!failed && (
        <div className="hero-video-controls">
          <button type="button" onClick={() => toggleRef.current()} aria-label={playing ? "Pause banner video" : "Play banner video"}>
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          </button>
        </div>
      )}
    </div>
  );
}
