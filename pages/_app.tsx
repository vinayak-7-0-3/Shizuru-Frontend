import type { AppProps } from 'next/app';
import { MusicPlayerProvider } from '../contexts/MusicPlayerContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MusicPlayerProvider>
      <Component {...pageProps} />
    </MusicPlayerProvider>
  );
}