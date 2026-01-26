

// TypeScript: declare SC on window
declare global {
    interface Window {
        SC: any;
    }
}
const playlist = [
    { title: 'DONNE RICCHE (Acoustic)', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/donne-ricche-acoustic-version' },
    { title: 'CULO', author: 'TonyPitony', url: 'https://soundcloud.com/tonypitony/culo' },
    { title: 'RIO DE JANEIRO', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/rio-de-janeiro' },
    { title: 'MI PIACCIONO LE NERE', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/mi-piacciono-le-nere' },
    { title: 'STRISCIA', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/striscia' },
    { title: 'SESSONLINE', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/sessonline' },
    { title: 'GIOVANNI', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/giovanni' },
    { title: 'BALÙ', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/balu' },
    { title: 'STIMOLI', author: 'TonyPitony', url: 'https://soundcloud.com/user-905529037/stimoli' },
];

interface Props {
    musicOn: boolean;
}


const MusicPlayer: React.FC<Props> = ({ musicOn }) => {
    const current = 0;
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const widgetRef = React.useRef<any>(null);

    // Setup widget and FINISH event: loop sempre la stessa canzone
    React.useEffect(() => {
        if (!musicOn) return;
        const iframe = iframeRef.current;
        if (!iframe) return;
        function setupWidget() {
            // @ts-ignore
            const widget = window.SC.Widget(iframe);
            widgetRef.current = widget;
            widget.bind(window.SC.Widget.Events.FINISH, () => {
                widget.seekTo(0);
                widget.play();
            });
        }
        // @ts-ignore
        if (!window.SC) {
            const script = document.createElement('script');
            script.src = 'https://w.soundcloud.com/player/api.js';
            script.onload = setupWidget;
            document.body.appendChild(script);
        } else {
            setupWidget();
        }
    }, [musicOn]);

    if (!musicOn) return null;

    return (
        <div className="music-player-responsive">
            <span className="music-player-title">
                {playlist[0].title} <span style={{ color: '#b97a56', fontWeight: 400 }}>— {playlist[0].author}</span>
            </span>
            <iframe
                ref={iframeRef}
                title={playlist[0].title}
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist[0].url)}&color=%23b97a56&auto_play=true&show_comments=false&show_user=false&show_reposts=false&visual=false`}
                width="100%"
                height="60"
                style={{ border: 'none', marginLeft: 0, maxWidth: 400 }}
                allow="autoplay"
            />
        </div>
    );
};

export default MusicPlayer;
import React from "react";
let _val: any;
// gestione base di useState per l'ambiente non-React
function useState<T>(initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
    const setState = (v: T | ((prev: T) => T)) => {
        _val = typeof v === "function" ? (v as (prev: T) => T)(_val) : v;
    };
    if (_val === undefined) _val = initialValue;
    return [_val, setState];
}

