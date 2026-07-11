const LOOP_AFTER_FINAL_VIDEO = true;
const RESET_VIDEO_WHEN_INACTIVE = false;
const VIDEO_START_OFFSET_SECONDS = 1.2;

// Static hosting cannot scan folders at runtime. Keep seasons in viewing order.
// Add a new season by adding one object with its folder and files.
const seasonManifest = [
  {
    folder: "video/S0",
    files: ["02.mp4"],
  },
  {
    folder: "video/S1",
    files: ["S1.mp4", "s2.mp4", "s3.mp4", "s4.mp4", "s5.mp4", "s6.mp4", "s7.mp4", "s8.mp4"],
  },
  {
    folder: "video/S2",
    files: ["p1.mp4", "p10.mp4", "p2.mp4", "p3.mp4", "p4.mp4", "p5.mp4", "p6.mp4", "p7.mp4", "p8.mp4", "p9.mp4"],
  },
  {
    folder: "video/S3",
    files: [
      "c1.mp4",
      "c10.mp4",
      "c11.mp4",
      "c12.mp4",
      "c13.mp4",
      "c14.mp4",
      "c15.mp4",
      "c16.mp4",
      "c17.mp4",
      "c18.mp4",
      "c19.mp4",
      "c2.mp4",
      "c20.mp4",
      "c21. 1.mp4",
      "c21.mp4",
      "c22.mp4",
      "c3.mp4",
      "c4.mp4",
      "c5.mp4",
      "c6.mp4",
      "c7.mp4",
      "c8.mp4",
      "c9.mp4",
    ],
  },
  {
    folder: "video/S4",
    files: [
      "a1.mp4",
      "a10.mp4",
      "a11.mp4",
      "a12.mp4",
      "a13.mp4",
      "a14.mp4",
      "a15.mp4",
      "a16.mp4",
      "a17.mp4",
      "a18.mp4",
      "a19.mp4",
      "a2.mp4",
      "a20.mp4",
      "a3.mp4",
      "a4.mp4",
      "a5.mp4",
      "a6.mp4",
      "a7.mp4",
      "a8.mp4",
      "a9.mp4",
    ],
  },
  {
    folder: "video/S5",
    files: [
      "a1.mp4",
      "a10.mp4",
      "a11.mp4",
      "a12.mp4",
      "a13.mp4",
      "a14.mp4",
      "a15.mp4",
      "a16.mp4",
      "a17.mp4",
      "a18.mp4",
      "a19.mp4",
      "a2.mp4",
      "a20.mp4",
      "a3.mp4",
      "a4.mp4",
      "a5.mp4",
      "a6.mp4",
      "a7.mp4",
      "a8.mp4",
      "a9.mp4",
    ],
  },
  {
    folder: "video/S6",
    files: ["a1.mp4", "a2.mp4", "a3.mp4", "a4.mp4", "a5.mp4", "a6.mp4", "a7.mp4"],
  },
  {
    folder: "video/S7",
    files: ["a1.mp4", "a2.mp4", "a3.mp4", "a4.mp4", "a5.mp4", "a6.mp4"],
  },
  {
    folder: "video/S8",
    files: ["a1.mp4", "a10.mp4", "a2.mp4", "a3.mp4", "a4.mp4", "a5.mp4", "a6.mp4", "a7.mp4", "a8.mp4", "a9.mp4"],
  },
  {
    folder: "video/S9",
    files: ["b1.mp4", "b2.mp4", "b3.mp4", "b4.mp4", "b5.mp4", "b6.mp4"],
  },
  {
    folder: "video/S10",
    files: ["a1.mp4", "a2.mp4", "a3.mp4", "a4.mp4", "a5.mp4", "a6.mp4", "a7.mp4", "a8.mp4"],
  },
  {
    folder: "video/S11",
    files: ["s1.mp4", "s2.mp4", "s3.mp4"],
  },
  {
    folder: "video/S12",
    files: [
      "a1.mp4",
      "a10.mp4",
      "a11.mp4",
      "a12.mp4",
      "a13.1.mp4",
      "a13.mp4",
      "a14.mp4",
      "a15.mp4",
      "a16.1.mp4",
      "a16.mp4",
      "a17.mp4",
      "a18.mp4",
      "a19.1.mp4",
      "a19.mp4",
      "a2.1.mp4",
      "a2.mp4",
      "a20.1.mp4",
      "a20.mp4",
      "a21.mp4",
      "a22.mp4",
      "a3.1.mp4",
      "a3.mp4",
      "a4.1.mp4",
      "a4.mp4",
      "a5.1.mp4",
      "a5.mp4",
      "a6.1.mp4",
      "a6.mp4",
      "a7.1.mp4",
      "a7.mp4",
      "a8.1.mp4",
      "a8.mp4",
      "a9.1.mp4",
      "a9.mp4",
    ],
  },
];

const videos = seasonManifest.flatMap((season) => {
  return season.files.map((file) => ({
    src: `${season.folder}/${file}`,
    poster: season.poster || "",
  }));
});

const icons = {
  speaker: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
      <path d="M16 8.5a5 5 0 0 1 0 7"></path>
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12"></path>
    </svg>`,
  muted: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
      <path d="M18 9l4 4"></path>
      <path d="M22 9l-4 4"></path>
    </svg>`,
};

const loader = document.querySelector("#loader");
const loaderPercent = document.querySelector("#loaderPercent");
const loaderBar = document.querySelector("#loaderBar");
const feed = document.querySelector("#reelFeed");
const template = document.querySelector("#reelTemplate");
const startButton = document.querySelector("#startButton");
const particleField = document.querySelector(".particle-field");

let reels = [];
let activeIndex = 0;
let loaderValue = 0;
let hasUserInteracted = false;
let isMuted = false;
let isAutoScrolling = false;
let controlsTimer = 0;
let lastTapAt = 0;
let activationTimer = 0;
const visibilityRatios = new Map();

const videoFor = (reel) => reel.querySelector(".reel__video");
const backdropFor = (reel) => reel.querySelector(".reel__backdrop");
const previousIndexFor = (index) => (index > 0 ? index - 1 : LOOP_AFTER_FINAL_VIDEO ? reels.length - 1 : -1);
const nextIndexFor = (index) => (index + 1 < reels.length ? index + 1 : LOOP_AFTER_FINAL_VIDEO ? 0 : -1);
const startOffsetFor = (video) => (video.duration > VIDEO_START_OFFSET_SECONDS + 0.5 ? VIDEO_START_OFFSET_SECONDS : 0);

const createParticles = () => {
  const colors = ["#ff2d95", "#8b5cff", "#00e5ff", "#ff7a18", "#ffffff"];

  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement("span");
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--y", `${Math.random() * 100}%`);
    particle.style.setProperty("--s", `${Math.random() * 2.6 + 1}px`);
    particle.style.setProperty("--c", colors[Math.floor(Math.random() * colors.length)]);
    particle.style.setProperty("--d", `${Math.random() * 8 + 8}s`);
    particle.style.setProperty("--delay", `${Math.random() * -12}s`);
    particleField.appendChild(particle);
  }
};

const setControlState = (reel) => {
  const video = videoFor(reel);
  const play = reel.querySelector(".control-play");
  const mute = reel.querySelector(".control-mute");

  play.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  mute.innerHTML = isMuted ? icons.muted : icons.speaker;
  mute.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
  reel.classList.toggle("is-muted", isMuted);
};

const assignSource = (video, preload = "metadata") => {
  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src;
    video.preload = preload;
    video.load();
  }
};

const loadVideo = (reel, includeBackdrop = false) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);

  video.muted = isMuted;
  assignSource(video, "metadata");

  if (includeBackdrop) {
    assignSource(backdrop, "metadata");
    backdrop.muted = true;
  }
};

const moveToStartOffset = (reel) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);
  const offset = startOffsetFor(video);

  if (offset && video.currentTime < offset) {
    video.currentTime = offset;
  }

  if (offset && backdrop.src && backdrop.currentTime < offset) {
    backdrop.currentTime = offset;
  }
};

const cleanupVideo = (reel, index) => {
  const previousIndex = previousIndexFor(activeIndex);
  const nextIndex = nextIndexFor(activeIndex);
  if (index === activeIndex || index === previousIndex || index === nextIndex) return;

  const video = videoFor(reel);
  const backdrop = backdropFor(reel);
  video.pause();
  backdrop.pause();

  if (RESET_VIDEO_WHEN_INACTIVE) {
    video.currentTime = startOffsetFor(video);
    backdrop.currentTime = startOffsetFor(video);
  }

  if (video.src) {
    video.removeAttribute("src");
    video.preload = "none";
    video.load();
  }

  if (backdrop.src) {
    backdrop.removeAttribute("src");
    backdrop.preload = "none";
    backdrop.load();
  }
};

// Lazy loading: active reel gets video and blurred backdrop; neighbors get metadata only.
const updateNearbyVideos = () => {
  const previousIndex = previousIndexFor(activeIndex);
  const nextIndex = nextIndexFor(activeIndex);

  reels.forEach((reel, index) => {
    if (index === activeIndex) loadVideo(reel, true);
    else if (index === previousIndex || index === nextIndex) loadVideo(reel, false);
    else cleanupVideo(reel, index);
  });
};

const pauseReel = (reel, reset = false) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);
  video.pause();
  backdrop.pause();

  if (reset) {
    video.currentTime = startOffsetFor(video);
    backdrop.currentTime = startOffsetFor(video);
  }

  reel.classList.remove("is-playing");
  reel.classList.add("is-paused");
  setControlState(reel);
};

const pauseAllExcept = (targetReel) => {
  reels.forEach((reel) => {
    if (reel !== targetReel) pauseReel(reel, RESET_VIDEO_WHEN_INACTIVE);
  });
};

const syncBackdrop = (reel) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);

  if (backdrop.src && Math.abs(backdrop.currentTime - video.currentTime) > 0.35) {
    backdrop.currentTime = video.currentTime;
  }
};

const showControls = (reel) => {
  window.clearTimeout(controlsTimer);
  reel.classList.add("controls-visible");

  if (!videoFor(reel).paused) {
    controlsTimer = window.setTimeout(() => {
      reel.classList.remove("controls-visible");
    }, 2400);
  }
};

const playReel = async (reel) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);

  loadVideo(reel, true);
  pauseAllExcept(reel);
  video.muted = isMuted;
  backdrop.muted = true;
  moveToStartOffset(reel);
  syncBackdrop(reel);

  try {
    await video.play();
    backdrop.play().catch((error) => console.warn("Backdrop playback was blocked:", error));
    reel.classList.add("is-playing");
    reel.classList.remove("is-paused");
    setControlState(reel);
    showControls(reel);

  } catch (error) {
    console.warn("Playback was blocked:", error);
    reel.classList.remove("is-playing");
    reel.classList.add("is-paused");
    showControls(reel);
  }
};

const showFeedback = (reel, isPlaying) => {
  const icon = reel.querySelector(".feedback-icon");
  icon.classList.toggle("is-pause", !isPlaying);
  icon.classList.remove("is-visible");
  window.requestAnimationFrame(() => icon.classList.add("is-visible"));
};

const applyMuteState = () => {
  reels.forEach((reel) => {
    videoFor(reel).muted = isMuted;
    setControlState(reel);
  });
};

const scrollToIndex = (index, automatic = false) => {
  if (index < 0 || index >= reels.length) return;
  if (automatic && isAutoScrolling) return;

  if (automatic) isAutoScrolling = true;
  reels[index].scrollIntoView({ behavior: "smooth", block: "start" });

  if (automatic) {
    window.setTimeout(() => {
      isAutoScrolling = false;
    }, 700);
  }
};

const goToNext = (automatic = false) => {
  const nextIndex = nextIndexFor(activeIndex);
  if (nextIndex >= 0) scrollToIndex(nextIndex, automatic);
};

const goToPrevious = () => {
  const previousIndex = previousIndexFor(activeIndex);
  if (previousIndex >= 0) scrollToIndex(previousIndex);
};

const activateReel = (index) => {
  if (index === activeIndex && reels[index].classList.contains("is-active")) return;

  activeIndex = index;
  reels.forEach((reel, reelIndex) => {
    const isActive = reelIndex === activeIndex;
    reel.classList.toggle("is-active", isActive);
    if (!isActive) pauseReel(reel, RESET_VIDEO_WHEN_INACTIVE);
  });

  updateNearbyVideos();

  if (hasUserInteracted) {
    playReel(reels[activeIndex]);
  }
};

const buildReels = () => {
  videos.forEach((item, index) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    const video = clone.querySelector(".reel__video");
    const backdrop = clone.querySelector(".reel__backdrop");

    video.dataset.src = item.src;
    backdrop.dataset.src = item.src;
    if (item.poster) {
      video.poster = item.poster;
      backdrop.poster = item.poster;
    }

    clone.dataset.index = String(index);
    clone.classList.toggle("is-active", index === 0);
    clone.classList.add("is-paused");
    feed.appendChild(clone);
  });

  reels = [...document.querySelectorAll(".reel")];
};

const hydrateReel = (reel) => {
  const video = videoFor(reel);
  const backdrop = backdropFor(reel);
  const playButton = reel.querySelector(".control-play");
  const muteButton = reel.querySelector(".control-mute");
  const seek = reel.querySelector(".seek");

  const togglePlayback = () => {
    const now = Date.now();
    if (now - lastTapAt < 260) return;
    lastTapAt = now;

    if (video.paused) {
      playReel(reel);
      showFeedback(reel, true);
    } else {
      pauseReel(reel);
      showFeedback(reel, false);
      showControls(reel);
    }
  };

  video.addEventListener("click", togglePlayback);

  playButton.addEventListener("click", () => {
    if (video.paused) playReel(reel);
    else pauseReel(reel);
    showFeedback(reel, !video.paused);
  });

  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    applyMuteState();
    showControls(reel);
  });

  seek.addEventListener("input", () => {
    if (video.duration) {
      const nextTime = (Number(seek.value) / 100) * video.duration;
      video.currentTime = Math.max(nextTime, startOffsetFor(video));
      syncBackdrop(reel);
    }
    showControls(reel);
  });

  video.addEventListener("loadedmetadata", () => moveToStartOffset(reel));

  video.addEventListener("timeupdate", () => {
    seek.value = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  });

  video.addEventListener("play", () => {
    reel.classList.add("is-playing");
    reel.classList.remove("is-paused");
    setControlState(reel);
  });

  video.addEventListener("pause", () => {
    reel.classList.remove("is-playing");
    reel.classList.add("is-paused");
    setControlState(reel);
  });

  video.addEventListener("ended", () => {
    pauseReel(reel, true);
    goToNext(true);
  });

  backdrop.addEventListener("timeupdate", () => {
    if (video.paused) backdrop.pause();
  });

  reel.addEventListener("mousemove", () => showControls(reel), { passive: true });
  reel.addEventListener("touchstart", () => showControls(reel), { passive: true });

  setControlState(reel);
};

const setupObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityRatios.set(Number(entry.target.dataset.index), entry.intersectionRatio);
      });

      const [candidateIndex, ratio] = [...visibilityRatios.entries()].sort((a, b) => b[1] - a[1])[0] || [activeIndex, 0];
      window.clearTimeout(activationTimer);

      if (ratio >= 0.6) {
        activationTimer = window.setTimeout(() => activateReel(candidateIndex), 100);
      }
    },
    {
      root: feed,
      threshold: [0.6, 0.75, 0.9],
    }
  );

  reels.forEach((reel) => observer.observe(reel));
};

const runLoader = () => {
  const timer = window.setInterval(() => {
    loaderValue += Math.ceil(Math.random() * 7);
    loaderValue = Math.min(loaderValue, 100);
    loaderPercent.textContent = `${loaderValue}%`;
    loaderBar.style.width = `${loaderValue}%`;

    if (loaderValue >= 100) {
      window.clearInterval(timer);
      window.setTimeout(() => {
        loader.classList.add("is-hidden");
        document.body.classList.add("is-ready");
        updateNearbyVideos();
      }, 420);
    }
  }, 90);
};

startButton.addEventListener("click", () => {
  hasUserInteracted = true;
  startButton.classList.add("is-hidden");
  playReel(reels[activeIndex]);
});

["wheel", "touchstart", "pointerdown"].forEach((eventName) => {
  feed.addEventListener(
    eventName,
    () => {
      isAutoScrolling = false;
    },
    { passive: true }
  );
});

document.addEventListener("keydown", (event) => {
  const activeReel = reels[activeIndex];
  if (!activeReel) return;

  if (["Space", "ArrowDown", "ArrowUp"].includes(event.code)) {
    event.preventDefault();
    isAutoScrolling = false;
  }

  if (event.code === "Space") {
    if (videoFor(activeReel).paused) playReel(activeReel);
    else pauseReel(activeReel);
  }

  if (event.code === "ArrowDown") goToNext();
  if (event.code === "ArrowUp") goToPrevious();
  if (event.key.toLowerCase() === "m") {
    isMuted = !isMuted;
    applyMuteState();
  }
});

createParticles();
buildReels();
reels.forEach(hydrateReel);
setupObserver();
loadVideo(reels[0], true);
runLoader();
