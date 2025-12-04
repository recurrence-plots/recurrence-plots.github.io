import React from 'react';
import Hero from './sections/Hero';
import ResearchContext from './sections/ResearchContext';
import InteractiveTutorial from './sections/InteractiveTutorial';
import Methodology from './sections/Methodology';
import Results from './sections/Results';
import ResearcherGuide from './sections/ResearcherGuide';
import InteractivePipeline from './sections/InteractivePipeline';
import Conclusion from './sections/Conclusion';
import ThemeToggle from './components/ThemeToggle';

function App() {
    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-slate-900 tracking-tight">Recurrence<span className="text-blue-600">Plots</span></div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
                        <a href="#research" className="hover:text-slate-900 transition-colors">Context</a>
                        <a href="#demo" className="hover:text-slate-900 transition-colors">Demo</a>
                        <a href="#methodology" className="hover:text-slate-900 transition-colors">Methodology</a>
                        <a href="#results" className="hover:text-slate-900 transition-colors">Results</a>
                        <a href="#guide" className="hover:text-slate-900 dark:hover:text-white transition-colors">Guide</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <a href="https://github.com/blackpearl006" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                            GitHub
                        </a>
                    </div>
                </div>
            </nav>

            <main>
                <Hero />
                <ResearchContext />
                <InteractiveTutorial />
                <InteractivePipeline />
                <Methodology />
                <Results />
                <ResearcherGuide />
            </main>

            <Conclusion />
        </div>
    );
}

export default App;
