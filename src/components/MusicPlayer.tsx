import React, { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    SC?: any;
  }
}

type Track = {
  title: string;
  author: string;
  url: string;
};

type MusicPlayerProps = {
  musicOn: boolean;
};

const playlist: Track[] = [
  {
    title: "DONNE RICCHE (Acoustic)",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/donne-ricche-acoustic-version",
  },
  {
    title: "CULO",
    author: "TonyPitony",
    url: "https://soundcloud.com/tonypitony/culo",
  },
  {
    title: "RIO DE JANEIRO",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/rio-de-janeiro",
  },
  {
    title: "STRISCIA",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/striscia",
  },
  {
    title: "SESSONLINE",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/sessonline",
  },
  {
    title: "GIOVANNI",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/giovanni",
  },
  {
    title: "BALÙ",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/balu",
  },
  {
    title: "STIMOLI",
    author: "TonyPitony",
    url: "https://soundcloud.com/user-905529037/stimoli",
  },
];

function loadSoundCloudApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.SC?.Widget) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://w.soundcloud.com/player/api.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Errore caricamento SoundCloud API"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Errore caricamento SoundCloud API"));
    document.body.appendChild(script);
  });
}

function getSoundCloudEmbedUrl(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: "false",
    buying: "false",
    sharing: "false",
    download: "false",
    show_comments: "false",
    show_playcount: "false",
    show_user: "true",
    visual: "false",
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export default function MusicPlayer({ musicOn }: MusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const currentTrack = playlist[currentIndex];

  const iframeSrc = useMemo(() => {
    return getSoundCloudEmbedUrl(currentTrack.url);
  }, [currentTrack.url]);

  async function setupWidget() {
    if (!iframeRef.current) return;

    try {
      await loadSoundCloudApi();

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        setIsReady(true);
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
      });

      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false);
      });

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        playNextTrack();
      });
    } catch {
      setError("Impossibile caricare il player musicale.");
    }
  }

  useEffect(() => {
    if (!musicOn) {
      widgetRef.current?.pause?.();
      setIsPlaying(false);
      return;
    }

    setupWidget();
  }, [musicOn, iframeSrc]);

  function playCurrentTrack() {
    const widget = widgetRef.current;
    if (!widget) return;

    widget.play();
    setIsPlaying(true);
  }

  function pauseTrack() {
    const widget = widgetRef.current;
    if (!widget) return;

    widget.pause();
    setIsPlaying(false);
  }

  function loadTrack(index: number, shouldPlay = false) {
    const nextIndex = (index + playlist.length) % playlist.length;
    const nextTrack = playlist[nextIndex];

    setCurrentIndex(nextIndex);

    const widget = widgetRef.current;
    if (!widget) return;

    widget.load(nextTrack.url, {
      auto_play: shouldPlay,
      callback: () => {
        if (shouldPlay) {
          widget.play();
          setIsPlaying(true);
        }
      },
    });
  }

  function playNextTrack() {
    loadTrack(currentIndex + 1, true);
  }

  function playPreviousTrack() {
    loadTrack(currentIndex - 1, true);
  }

  if (!musicOn) return null;

  return (
    <section className="music-player" aria-label="Player musicale Tony Pitony">
      <div className="music-player__info">
        <strong>{currentTrack.title}</strong>
        <span>{currentTrack.author}</span>
      </div>

      <div className="music-player__controls">
        <button type="button" onClick={playPreviousTrack}>
          ⏮
        </button>

        {!isPlaying ? (
          <button type="button" onClick={playCurrentTrack} disabled={!isReady}>
            ▶ Avvia playlist
          </button>
        ) : (
          <button type="button" onClick={pauseTrack}>
            ⏸ Pausa
          </button>
        )}

        <button type="button" onClick={playNextTrack}>
          ⏭
        </button>
      </div>

      {error && <p className="music-player__error">{error}</p>}

      <iframe
        ref={iframeRef}
        title="SoundCloud player"
        width="100%"
        height="120"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={iframeSrc}
      />
    </section>
  );
}