import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Youtube, MoonStar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlobalToast } from '../UI/GlobalToast';

export const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();
  const { contactInfo } = state;


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

        }
      });
    }, observerOptions);


    const elements = document.querySelectorAll('.reveal-up, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Kegiatan', href: '/events' },
    { name: 'Donasi', href: '/donation' },
    { name: 'Kontak', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">

      <style>{`
        @keyframes pageEnter {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-page-enter {
          animation: pageEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>


      <header className="fixed inset-x-0 z-50 top-2 sm:top-4 mx-2 sm:mx-6 lg:mx-auto max-w-6xl transition-all duration-300">
        <nav className="bg-emerald-900/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-emerald-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link to="/" className="shrink-0 flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg ring-1 ring-emerald-700 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:ring-amber-400">
                    <MoonStar size={16} className="text-amber-400 transition-all duration-500 group-hover:text-amber-300" fill="currentColor" />
                  </div>
                  <span className="font-bold text-lg text-white tracking-tight group-hover:text-amber-50 transition-colors duration-300">Masjid Raya</span>
                </Link>
              </div>


              <div className="hidden md:flex md:items-center md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${isActive(item.href)
                      ? 'text-amber-400'
                      : 'text-emerald-100 hover:text-white'
                      } px-1 py-1 text-sm font-medium transition-all duration-300 relative group`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-300 ease-out ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                ))}
              </div>


              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-emerald-100 hover:text-amber-400 focus:outline-none p-2 transition-colors transform active:scale-95"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>


          {isMenuOpen && (
            <div className="md:hidden bg-emerald-900/95 backdrop-blur-xl border-t border-emerald-800 shadow-xl animate-page-enter rounded-b-2xl">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${isActive(item.href)
                      ? 'bg-emerald-800 text-amber-400 border-l-4 border-amber-400'
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                      } block px-3 py-2 rounded-r-md text-base font-medium transition-all duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="grow">
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>


      <footer className="mt-4 mb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto bg-emerald-950/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="px-8 py-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="reveal-up stagger-1">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
                  <MoonStar size={24} className="text-amber-400" fill="currentColor" />
                  Masjid Raya
                </h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm">
                  Pusat peradaban dan ibadah yang nyaman untuk seluruh umat muslim.
                  Mari makmurkan masjid bersama keluarga tercinta.
                </p>
              </div>
              <div className="reveal-up stagger-2">
                <h3 className="text-lg font-semibold mb-6 text-white border-b border-emerald-800/50 pb-2 inline-block">Tautan Cepat</h3>
                <ul className="space-y-3 text-emerald-100/70 text-sm">
                  <li><Link to="/about" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span>›</span> Tentang Kami</Link></li>
                  <li><Link to="/events" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span>›</span> Kegiatan</Link></li>
                  <li><Link to="/donation" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span>›</span> Infaq & Shodaqoh</Link></li>
                </ul>
              </div>
              <div className="reveal-up stagger-3">
                <h3 className="text-lg font-semibold mb-6 text-white border-b border-emerald-800/50 pb-2 inline-block">Terhubung</h3>
                <div className="flex space-x-3 mb-6">
                  <a
                    href={contactInfo.facebook || '#'}
                    target={contactInfo.facebook ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`transition-all duration-300 p-2.5 rounded-2xl ${contactInfo.facebook ? 'text-white bg-emerald-900/50 hover:bg-amber-500 hover:text-white hover:-translate-y-1 shadow-lg border border-white/5' : 'text-emerald-100/20 cursor-default bg-emerald-950/50 border border-white/5'}`}
                    aria-label="Facebook"
                    onClick={(e) => !contactInfo.facebook && e.preventDefault()}
                  >
                    <Facebook size={18} />
                  </a>

                  <a
                    href={contactInfo.instagram || '#'}
                    target={contactInfo.instagram ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`transition-all duration-300 p-2.5 rounded-2xl ${contactInfo.instagram ? 'text-white bg-emerald-900/50 hover:bg-amber-500 hover:text-white hover:-translate-y-1 shadow-lg border border-white/5' : 'text-emerald-100/20 cursor-default bg-emerald-950/50 border border-white/5'}`}
                    aria-label="Instagram"
                    onClick={(e) => !contactInfo.instagram && e.preventDefault()}
                  >
                    <Instagram size={18} />
                  </a>

                  <a
                    href={contactInfo.youtube || '#'}
                    target={contactInfo.youtube ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`transition-all duration-300 p-2.5 rounded-2xl ${contactInfo.youtube ? 'text-white bg-emerald-900/50 hover:bg-amber-500 hover:text-white hover:-translate-y-1 shadow-lg border border-white/5' : 'text-emerald-100/20 cursor-default bg-emerald-950/50 border border-white/5'}`}
                    aria-label="YouTube"
                    onClick={(e) => !contactInfo.youtube && e.preventDefault()}
                  >
                    <Youtube size={18} />
                  </a>
                </div>
                <p className="text-emerald-100/60 text-xs whitespace-pre-wrap leading-relaxed italic">
                  {contactInfo.address}
                </p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-emerald-100/40 text-xs flex items-center justify-between">
              <p>&copy; {new Date().getFullYear()} Masjid Raya. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to="/login" className="hover:text-amber-400 transition-colors">Admin Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <GlobalToast />
    </div>
  );
};

export default PublicLayout;