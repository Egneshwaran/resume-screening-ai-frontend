import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative z-10 bg-[#0f172a] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">AI</div>
                            <span className="text-2xl font-bold gradient-text">RecruitAI</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Revolutionizing recruitment with AI-powered resume screening and analysis. Helping job seekers stand out and recruiters find the best talent faster.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a></li>
                            <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">How it Works</a></li>
                            <li><Link to="/resume-checker" className="text-slate-400 hover:text-white transition-colors text-sm">Resume Checker</Link></li>
                            <li><Link to="/admin/jobs" className="text-slate-400 hover:text-white transition-colors text-sm">Resume Screening</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail size={18} className="text-indigo-500" />
                                <span>egnesh2005@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Phone size={18} className="text-indigo-500" />
                                <span>+91 6380983866</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <MapPin size={18} className="text-indigo-500 mt-1" />
                                <span>Surya Engineering College, Mettukadai,<br />Erode, INDIA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2026 RecruitAI. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
