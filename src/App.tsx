import { useState, useCallback, useEffect } from 'react';
import FluidCanvas from './components/FluidCanvas';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPage from './admin/AdminPage';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const fn = () => setHash(window.location.hash);
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const [loaded, setLoaded] = useState(false);
  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  // Admin route
  if (hash === '#/admin' || hash === '#admin') {
    return <AdminPage />;
  }

  return (
    <div className="bg-black text-white font-inter overflow-x-hidden">
      {!loaded && <Loader onDone={handleLoaderDone} />}
      <FluidCanvas />
      <div className="relative" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.7s ease' }}>
        <Nav />
        <main>
          <Hero loaded={loaded} />
          <About />
          <Work />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
