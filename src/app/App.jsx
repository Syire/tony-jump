
import React, { useState, createContext } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';


// @ts-ignore
export const MusicContext = createContext({
  musicOn: false,
  setMusicOn: () => {},
});

export default function App() {
  const [musicOn, setMusicOn] = useState(false);
  return (
    <MusicContext.Provider value={{ musicOn, setMusicOn }}>
      <MusicPlayer musicOn={musicOn} />
      <RouterProvider router={router} />
    </MusicContext.Provider>
  );
}