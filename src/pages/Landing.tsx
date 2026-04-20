import { useNavigate } from 'react-router-dom';
import { Map, MapPin, CreditCard, MessageSquarePlus, MessageSquareHeart, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 transition-colors duration-500">
      {/* --- FLUID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        {/* Tematik müze/istanbul görseli */}
        <img 
          src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070&auto=format&fit=crop" 
          alt="Museum Background" 
          className="w-full h-full object-cover scale-110 opacity-100 dark:opacity-40 transition-opacity duration-700"
        />
        {/* iOS Vari Yarı Şeffaf Blur Katmanı */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60 backdrop-blur-[60px] mix-blend-overlay transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-sky-50/50 dark:bg-slate-900/50 backdrop-blur-3xl transition-colors duration-500"></div>
        
        {/* Dinamik Fluid Blob'lar */}
        <motion.div 
           animate={{ x: [0, 80, 0], y: [0, -60, 0] }} 
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-400/30 dark:bg-sky-600/20 rounded-full blur-[100px]" 
        />
        <motion.div 
           animate={{ x: [0, -60, 0], y: [0, 80, 0] }} 
           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- İÇERİK (GLASSMORPHISM) --- */}
      <div className="relative z-10 flex flex-col min-h-screen border-slate-200 dark:border-slate-800">
        
        {/* Glass Navbar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 w-full px-6 py-4 flex items-center justify-between border-b border-white/30 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-50 transition-colors duration-500"
        >
           <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 font-bold text-xl drop-shadow-sm">
              <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-[14px] border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md">
                <Map className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="tracking-tight hidden sm:block">KültürRota</span>
           </div>

           {/* Navbar Linkleri */}
           <nav className="hidden md:flex items-center gap-8 font-medium text-slate-700 dark:text-slate-300">
              <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Hakkında</a>
              <a href="https://muze.gov.tr/MuseumPass" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">MüzeKart</a>
              <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">İletişim</a>
           </nav>

           <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/30 dark:border-white/10 shadow-sm transition-all"
              title={isDark ? "Açık Tema" : "Koyu Tema"}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
           </button>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-20 pb-28">
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm"
          >
            İstanbul'un Tarihi <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 drop-shadow-none">
              Parmaklarınızın Ucunda
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-xl text-slate-700/80 dark:text-slate-300/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Seçtiğiniz müze ve kütüphaneleri şeffaf, akıcı ve büyüleyici bir harita üzerinde keşfedin. 
            Görseller, Youtube videoları ve anlık yerel veriler tek bir arayüzde.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <button 
              onClick={() => navigate('/map')}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-slate-900/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full hover:bg-slate-800 dark:hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:duration-1000 group-hover:transition-transform group-hover:translate-x-[150%]"></div>
              <MapPin className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Haritayı Keşfet
            </button>
          </motion.div>

          {/* Aksiyon Kartları */}
          <div id="about" className="grid sm:grid-cols-3 gap-6 mt-28 w-full text-left">
            {/* Müze Kart */}
            <motion.a 
              href="https://muze.gov.tr/MuseumPass" target="_blank" rel="noreferrer"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-[40px] p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-white/70 dark:bg-slate-900/70 rounded-2xl flex items-center justify-center mb-6 border border-white/60 dark:border-white/10 shadow-lg shadow-indigo-500/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}>
                <CreditCard className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">MüzeKart Al</h3>
              <p className="text-slate-700/80 dark:text-slate-300/80 leading-relaxed font-medium text-sm mb-4">Müzeleri özgürce ve ücretsiz gezebilmek için resmi MüzeKart uygulamasını indirin veya kartınızı online alın.</p>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">Resmi Siteye Git &rarr;</span>
            </motion.a>

            {/* Mekan Ekle / Tavsiye */}
            <motion.a 
              href="mailto:ornekmail@site.com?subject=Yeni%20Mekan%20Tavsiyesi" 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-[40px] p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-white/70 dark:bg-slate-900/70 rounded-2xl flex items-center justify-center mb-6 border border-white/60 dark:border-white/10 shadow-lg shadow-purple-500/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}>
                <MessageSquarePlus className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Mekan Ekle / Öner</h3>
              <p className="text-slate-700/80 dark:text-slate-300/80 leading-relaxed font-medium text-sm mb-4">Haritada göremediğiniz gizli kalmış tarihi mekanları, yerel kütüphaneleri veya zanaatkarları bize bildirin. Haritayı birlikte büyütelim.</p>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:underline">Bize Yazın &rarr;</span>
            </motion.a>

            {/* Geri Bildirim */}
            <motion.a 
              id="contact"
              href="mailto:ornekmail@site.com?subject=Geri%20Bildirim" 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="group block bg-white/40 dark:bg-slate-800/40 backdrop-blur-[40px] p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-white/70 dark:bg-slate-900/70 rounded-2xl flex items-center justify-center mb-6 border border-white/60 dark:border-white/10 shadow-lg shadow-blue-500/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}>
                <MessageSquareHeart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Geri Bildirim / Teşekkür</h3>
              <p className="text-slate-700/80 dark:text-slate-300/80 leading-relaxed font-medium text-sm mb-4">Projemizi beğendiniz mi? Hata mı buldunuz? Fikirlerinizi, teşekkürlerinizi ve desteklerinizi ulaştırmak için iletişime geçin.</p>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">Mesaj Gönder &rarr;</span>
            </motion.a>
          </div>
        </main>
      </div>
    </div>
  );
}
