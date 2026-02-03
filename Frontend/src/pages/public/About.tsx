import { useApp } from '../../context/AppContext';
import { History, Target, Compass } from 'lucide-react';
import heroBg from '../../assets/BG-Masjid.svg';

const About = () => {
  const { state } = useApp();
  const { about } = state;
  const historyImage = heroBg;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
        {/* Header - Simpler Version matching Events */}
        <div className="bg-emerald-800 text-white py-16 px-4 mb-12">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Tentang Masjid Raya</h1>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                    Mengenal lebih dekat sejarah perjalanan, impian, dan tujuan mulia kami dalam melayani umat.
                </p>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-12">
            {/* History Section - Card Style */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 reveal-up">
                <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="h-64 md:h-auto relative min-h-100 group overflow-hidden">
                        <img 
                            src={historyImage} 
                            alt="Sejarah Masjid" 
                            className="absolute inset-0 w-full h-full object-cover hover-zoom-img"
                        />
                        <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply group-hover:bg-emerald-900/20 transition-colors duration-500" />
                     </div>
                     <div className="p-8 md:p-14 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm">
                                <History size={28} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Sejarah Kami</h2>
                        </div>
                        <div className="prose prose-emerald prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {about.history}
                        </div>
                     </div>
                </div>
            </div>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vision Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group reveal-up stagger-1">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 z-0 transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <Target size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg group-hover:text-gray-700 transition-colors">
                            {about.vision}
                        </p>
                    </div>
                </div>

                {/* Mission Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group reveal-up stagger-2">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-full -mr-10 -mt-10 z-0 transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative z-10">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                <Compass size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg group-hover:text-gray-700 transition-colors">
                            {about.mission}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default About;