import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Target, Compass } from 'lucide-react';
import heroBg from '../../assets/BG-Masjid.svg';

const About = () => {
    const { state } = useApp();
    const { about } = state;
    const historyImage = about.image || heroBg;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="bg-white min-h-screen pb-20 overflow-hidden">
            {/* New Integrated Hero & History Section */}
            <section className="relative lg:h-screen min-h-[600px] flex items-center pt-36 pb-32 overflow-hidden bg-emerald-50/40">
                {/* SVG Background Layer */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url(${heroBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                {/* Abstract Background Design Overlay */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white/80 backdrop-blur-sm clip-path-hero hidden lg:block"></div>
                <div className="absolute top-20 right-20 w-128 h-128 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Smooth Blend Gradient at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white z-20 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-12 lg:mb-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} space-y-5 lg:pr-8`}>
                            <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm tracking-wide border border-emerald-600/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                Mengenal Lebih Dekat
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                Tentang <span className="text-emerald-700 text-nowrap">Masjid Raya</span>
                            </h1>
                            <div className="w-12 h-1.5 bg-emerald-600 rounded-full"></div>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                                Mengenal perjalanan sejarah, impian, dan tujuan mulia kami dalam melayani umat dan menjaga syiar Islam.
                            </p>
                        </div>

                        {/* Right: Integrated History Card */}
                        <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 overflow-hidden group">
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={historyImage}
                                        alt="Sejarah Masjid"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/10 transition-colors" />
                                    <div className="absolute bottom-4 left-4">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-emerald-700 shadow-lg">
                                            <History size={18} className="font-bold" />
                                            <span className="text-sm font-black uppercase tracking-widest">Sejarah Kami</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-9">
                                    <h2 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Jejak Perjalanan</h2>
                                    <div className="prose prose-emerald prose-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap text-sm">
                                        {about.history}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 space-y-16 lg:space-y-20">
                {/* Vision & Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Vision Card */}
                    <div className={`bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 p-10 transition-all duration-1000 delay-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} hover:shadow-emerald-900/15 hover:scale-[1.02] cursor-default relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full -mr-12 -mt-12 z-0 transition-transform duration-700 group-hover:scale-125" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shadow-sm transition-colors duration-300">
                                    <Target size={28} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Visi</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base font-medium group-hover:text-gray-800 transition-colors">
                                {about.vision}
                            </p>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className={`bg-white rounded-[2rem] shadow-xl shadow-amber-900/5 border border-amber-50 p-10 transition-all duration-1000 delay-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} hover:shadow-amber-900/15 hover:scale-[1.02] cursor-default relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-bl-full -mr-12 -mt-12 z-0 transition-transform duration-700 group-hover:scale-125" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shadow-sm transition-colors duration-300">
                                    <Compass size={28} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Misi</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base font-medium group-hover:text-gray-800 transition-colors">
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
