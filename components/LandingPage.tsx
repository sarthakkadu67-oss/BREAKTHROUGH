
import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Clock, Activity, Zap, ChevronDown, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

interface Props {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<Props> = ({ onEnterApp }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        
        {/* Parallax Title */}
        <div 
          className="z-10 text-center relative px-4 w-full max-w-full overflow-hidden flex flex-col items-center justify-center"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }} 
        >
          <div 
            style={{ 
              transform: `translateX(${scrollY * 0.3}px)`, 
              opacity: Math.max(0, 1 - scrollY / 700) 
            }}
          >
            <h1 
              className="font-display text-[8vw] md:text-[6vw] leading-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl animate-slide-in-left will-change-transform whitespace-nowrap px-4 py-2"
            >
              BREAKTHROUGH
            </h1>
          </div>
          
          <div
             className="animate-slide-up"
             style={{ 
              transform: `translateX(-${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 700)
            }}
          >
            <p className="text-sm md:text-xl font-light tracking-[0.5em] text-gray-300 mt-4 uppercase">
              Taste The Future
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 z-10 animate-bounce text-gray-400"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <ChevronDown size={32} />
        </div>
      </section>

      {/* 2. AUTH SECTION */}
      <section className="py-20 bg-black relative z-10 border-t border-gray-900" id="login">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif italic text-white mb-8">Ready to order?</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <button 
                onClick={onEnterApp}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
             >
                <span className="relative z-10 flex items-center gap-2">
                  LOG IN TO ACCOUNT <ArrowRight size={18} />
                </span>
                <div className="absolute inset-0 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  WELCOME BACK <ArrowRight size={18} />
                </span>
             </button>

             <button 
               onClick={onEnterApp}
               className="px-8 py-4 border border-gray-600 text-gray-300 font-bold rounded-full hover:border-white hover:text-white transition-colors"
             >
               SIGN UP AS NEW USER
             </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">By continuing, you agree to our Terms of Service.</p>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-800/50 p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-colors group">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                <Star size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Premium Selection</h3>
              <p className="text-gray-400 leading-relaxed">
                Curated restaurants with high health scores and exceptional culinary standards.
              </p>
            </div>

             <div className="bg-gray-800/50 p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-colors group">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Health Focused</h3>
              <p className="text-gray-400 leading-relaxed">
                Transparency in every bite. View health scores, calorie counts, and fresh ingredients.
              </p>
            </div>

             <div className="bg-gray-800/50 p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-colors group">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Zap size={32} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">AI Concierge</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask our AI for cravings like "spicy food for a rainy day" and get personalized picks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-black py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-display text-white">BREAKTHROUGH</h2>
              </div>
              <p className="text-gray-500 max-w-xs">
                Redefining the way you experience food. <br />
                Premium. Fast. Intelligent.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://github.com/Sarthakkadu18" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Github">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/sarthak-kadu-55046632a/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin size={24} />
                </a>
                <a href="https://www.instagram.com/sarthak.kaduu/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                  <Instagram size={24} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-16">
              <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Partner with us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                </ul>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Billing</li>
                </ul>
              </div>
            </div>

            <div>
               <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact</h4>
               <ul className="space-y-3 text-gray-500 text-sm">
                 <li>support@breakthrough.com</li>
                 <li>+1 (800) 123-4567</li>
                 <li>123 Innovation Dr,<br/>New York, NY 10001</li>
               </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 text-xs">
            © 2024 BREAKTHROUGH Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
