import { useEffect, useState } from "react";
import { useSettings } from "../app/SettingsContext";
import {
  getPlayerName,
  setPlayerName,
  generateRandomName,
} from "../utils/playerName";

export default function SettingsModal() {
  const {
    settingsOpen,
    closeSettings,
    musicOn,
    setMusicOn,
    effectsOn,
    setEffectsOn,
  } = useSettings();

  const [name, setName] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (settingsOpen) {
      setName(getPlayerName());
      setSaveMessage("");
    }
  }, [settingsOpen]);

  if (!settingsOpen) {
    return null;
  }

  function handleSaveName() {
    const cleanName = name.trim();

    if (!cleanName) {
      const randomName = generateRandomName();
      setName(randomName);
      setPlayerName(randomName);
      setSaveMessage("Nome casuale salvato!");
      return;
    }

    setPlayerName(cleanName);
    setSaveMessage("Nome salvato!");
  }

  function handleRandomName() {
    const randomName = generateRandomName();
    setName(randomName);
    setPlayerName(randomName);
    setSaveMessage("Nome casuale salvato!");
  }

  return (
    <div
      className="tony-settings-modal-backdrop"
      role="presentation"
      onClick={closeSettings}
    >
      <section
        className="tony-settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="tony-settings-close"
          onClick={closeSettings}
          aria-label="Chiudi impostazioni"
          type="button"
        >
          ×
        </button>

        <div className="tony-settings-modal-header">
          <span className="tony-settings-eyebrow">Tony Control Center</span>
          <h2 id="settings-title">Impostazioni</h2>
          <p>
            Personalizza nome, audio e preferenze del gioco.
          </p>
        </div>

        <div className="tony-settings-section">
          <div className="tony-setting-label-block">
            <strong>Nome giocatore</strong>
            <span>Questo nome verrà mostrato nella classifica.</span>
          </div>

          <input
            className="tony-settings-input"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaveMessage("");
            }}
            placeholder="Il tuo nome"
            maxLength={20}
          />

          <div className="tony-settings-actions">
            <button type="button" onClick={handleSaveName}>
              Salva nome
            </button>

            <button type="button" onClick={handleRandomName}>
              Nome casuale
            </button>
          </div>

          {saveMessage && (
            <p className="tony-settings-save-message">{saveMessage}</p>
          )}
        </div>

        <div className="tony-settings-section">
          <div className="tony-setting-row">
            <div className="tony-setting-label-block">
              <strong>Effetti sonori</strong>
              <span>Attiva o disattiva gli effetti durante il gioco.</span>
            </div>

            <label className="tony-switch">
              <input
                type="checkbox"
                checked={effectsOn}
                onChange={(event) => setEffectsOn(event.target.checked)}
              />
              <span className="tony-slider" />
            </label>
          </div>

          <div className="tony-setting-row">
            <div className="tony-setting-label-block">
              <strong>Musica Tony</strong>
              <span>Mostra il player SoundCloud laterale.</span>
            </div>

            <label className="tony-switch">
              <input
                type="checkbox"
                checked={musicOn}
                onChange={(event) => setMusicOn(event.target.checked)}
              />
              <span className="tony-slider" />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}