import React from 'react';
import Section from '../components/Section';
import { Github, FileText, ExternalLink } from 'lucide-react';

const Conclusion = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-24">
            <Section id="conclusion" className="py-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Summary</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            This study demonstrates that non-linear time series analysis, combined with deep learning, can effectively detect Mild Cognitive Impairment from resting-state fMRI.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            By encoding the complex dynamics of brain networks into compact latent embeddings, we achieve superior classification performance compared to traditional RQA measures, paving the way for more accurate early diagnostic tools.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-6">Resources</h3>
                        <div className="space-y-4">
                            <a href="https://tinyurl.com/ycyhka6m" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors group">
                                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 text-white">
                                    <Github size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-white">View Source Code</div>
                                    <div className="text-xs text-slate-500">GitHub Repository</div>
                                </div>
                                <ExternalLink size={16} className="ml-auto text-slate-500 group-hover:text-white" />
                            </a>

                            <a href="https://arxiv.org/abs/2311.18265" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors group">
                                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 text-white">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-white">Read the Paper</div>
                                    <div className="text-xs text-slate-500">arXiv Preprint</div>
                                </div>
                                <ExternalLink size={16} className="ml-auto text-slate-500 group-hover:text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2024 Ninad Aithal · Centre for Brain Research, IISc Bengaluru</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </Section>
        </footer>
    );
};

export default Conclusion;
