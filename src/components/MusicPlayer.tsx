

// Playlist Tony Pitony su SoundCloud (embed visibile, autoplay e loop non gestibili via API)

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
    const [current, setCurrent] = useState(0);
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const widgetRef = React.useRef<any>(null);

    // Setup widget and FINISH event
    React.useEffect(() => {
        if (!musicOn) return;
        const iframe = iframeRef.current;
        if (!iframe) return;
        function setupWidget() {
            // @ts-ignore
            const widget = window.SC.Widget(iframe);
            widgetRef.current = widget;
            widget.bind(window.SC.Widget.Events.FINISH, () => {
                setCurrent((prev) => (prev + 1) % playlist.length);
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
    }, [musicOn, current]);


    React.useEffect(() => {
        if (!musicOn) return;
        let tries = 0;
        function tryLoad() {
            if (widgetRef.current && widgetRef.current.load) {
                widgetRef.current.load(playlist[current].url, { auto_play: true });
            } else if (tries < 10) {
                tries++;
                setTimeout(tryLoad, 120);
            }
        }
        tryLoad();
    }, [current, musicOn]);

    if (!musicOn) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: 'rgba(255,251,231,0.95)',
            zIndex: 1000,
            textAlign: 'center',
            padding: '8px 0',
            boxShadow: '0 2px 8px #0001',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
        }}>
            <span>
                {playlist[current].title} <span style={{ color: '#b97a56', fontWeight: 400 }}>— {playlist[current].author}</span>
            </span>
            <button
                onClick={() => setCurrent((prev) => (prev + 1) % playlist.length)}
                style={{
                    background: '#b97a56',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '4px 16px',
                    fontSize: 15,
                    cursor: 'pointer',
                    marginLeft: 8,
                    boxShadow: '0 1px 4px #0001',
                    transition: 'background 0.1s',
                }}
                title="Prossima canzone"
            >Avanti</button>
            <iframe
                ref={iframeRef}
                title={playlist[current].title}
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist[current].url)}&color=%23b97a56&auto_play=true&show_comments=false&show_user=false&show_reposts=false&visual=false`}
                width="320"
                height="60"
                style={{ border: 'none', marginLeft: 12 }}
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

