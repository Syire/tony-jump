import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    color: "b97a56",
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export default function MusicPlayer({ musicOn }: MusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any | null>(null);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [needsManualStart, setNeedsManualStart] = useState(false);
  const [error, setError] = useState("");

  const currentTrack = playlist[currentIndex];

  const initialIframeSrc = useMemo(() => {
    return getSoundCloudEmbedUrl(playlist[0].url);
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  function tryPlay() {
    const widget = widgetRef.current;

    if (!widget) {
      setNeedsManualStart(true);
      return;
    }

    setNeedsManualStart(false);
    widget.play();

    window.setTimeout(() => {
      if (!isPlayingRef.current) {
        setNeedsManualStart(true);
      }
    }, 900);
  }

  function pauseTrack() {
    const widget = widgetRef.current;
    if (!widget) return;

    widget.pause();
    setIsPlaying(false);
  }

  const loadTrack = useCallback((index: number, shouldPlay = false) => {
    const nextIndex = (index + playlist.length) % playlist.length;
    const nextTrack = playlist[nextIndex];
    const widget = widgetRef.current;

    setCurrentIndex(nextIndex);
    setIsReady(false);
    setNeedsManualStart(false);

    if (!widget) return;

    widget.load(nextTrack.url, {
      auto_play: shouldPlay,
      buying: false,
      sharing: false,
      download: false,
      show_comments: false,
      show_playcount: false,
      show_user: true,
      visual: false,
      color: "b97a56",
      callback: () => {
        setIsReady(true);

        if (shouldPlay) {
          widget.play();

          window.setTimeout(() => {
            if (!isPlayingRef.current) {
              setNeedsManualStart(true);
            }
          }, 900);
        }
      },
    });
  }, []);

  const playNextTrack = useCallback(() => {
    loadTrack(currentIndexRef.current + 1, true);
  }, [loadTrack]);

  const playPreviousTrack = useCallback(() => {
    loadTrack(currentIndexRef.current - 1, true);
  }, [loadTrack]);

  useEffect(() => {
    if (!musicOn) {
      widgetRef.current?.pause?.();
      setIsPlaying(false);
      setNeedsManualStart(false);
      return;
    }

    let cancelled = false;

    async function setupWidget() {
      try {
        setError("");
        await loadSoundCloudApi();

        if (cancelled || !iframeRef.current) return;

        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(window.SC.Widget.Events.READY, () => {
          setIsReady(true);
          tryPlay();
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
          setNeedsManualStart(false);
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          playNextTrack();
        });

        widget.bind(window.SC.Widget.Events.ERROR, () => {
          setError("Impossibile caricare questa traccia.");
        });
      } catch {
        setError("Impossibile caricare il player musicale.");
      }
    }

    setupWidget();

    return () => {
      cancelled = true;
      widgetRef.current?.pause?.();
    };
  }, [musicOn, playNextTrack]);

  if (!musicOn) return null;

  return (
    <aside
      className={`music-player-responsive ${isCollapsed ? "is-collapsed" : ""
        }`}
      aria-label="Player musicale"
    >
      <button
        type="button"
        className="music-player-tab"
        onClick={() => setIsCollapsed((value) => !value)}
        aria-label={isCollapsed ? "Apri player musicale" : "Chiudi player musicale"}
        title={isCollapsed ? "Apri player musicale" : "Chiudi player musicale"}
      >
        {isCollapsed ? "🎵" : "×"}
      </button>

      <div className="music-player-content" aria-hidden={isCollapsed}>
        <div className="music-player-header">
          <span className="music-player-kicker">Tony Radio</span>
          <strong className="music-player-title">{currentTrack.title}</strong>
          <span className="music-player-author">{currentTrack.author}</span>
        </div>

        <iframe
          ref={iframeRef}
          title="SoundCloud music player"
          className="music-player-iframe"
          src={initialIframeSrc}
          allow="autoplay"
        />

        <div className="music-player-controls">
          <button
            type="button"
            onClick={playPreviousTrack}
            disabled={!isReady}
            aria-label="Traccia precedente"
          >
            ⏮
          </button>

          {isPlaying ? (
            <button type="button" onClick={pauseTrack} disabled={!isReady}>
              ⏸ Pausa
            </button>
          ) : (
            <button type="button" onClick={tryPlay} disabled={!isReady}>
              ▶ Play
            </button>
          )}

          <button
            type="button"
            onClick={playNextTrack}
            disabled={!isReady}
            aria-label="Traccia successiva"
          >
            ⏭
          </button>
        </div>

        {needsManualStart && (
          <small className="music-player-hint">
            Tocca Play per avviare la musica.
          </small>
        )}

        {error && <small className="music-player-error">{error}</small>}
      </div>
    </aside>
  );
}