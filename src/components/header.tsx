import { Shield, Github, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DonationButtonCompact } from './DonationButton';

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/encrypted-chat-features', label: 'Features' },
        { path: '/security-encryption', label: 'Security' },
        { path: '/about-securechat', label: 'About' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
                scrolled
                    ? 'bg-black/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50'
                    : 'bg-transparent border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-3 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
                            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 relative border border-white/10">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                                SecureChat
                            </h1>
                            <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">End-to-End Encrypted</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                         <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1 mr-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        isActive(link.path)
                                            ? 'text-white bg-white/10 shadow-inner'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                             <a
                                href="https://github.com/Arya182-ui/End2end-Chat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                                aria-label="GitHub Repository"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <DonationButtonCompact />
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative z-50 p-2 text-gray-300 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-6 h-6">
                            <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                            <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                            <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div
                className={`fixed inset-0 bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-2xl font-bold tracking-tight transition-all duration-300 transform ${
                                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                             <span className={isActive(link.path) ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'text-gray-400'}>
                                {link.label}
                            </span>
                        </Link>
                    ))}
                    
                    <div 
                         className={`flex flex-col items-center gap-6 mt-8 transition-all duration-300 transform ${
                            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                        style={{ transitionDelay: '300ms' }}
                    >
                         <div className="flex items-center gap-6">
                            <a
                                href="https://github.com/Arya182-ui/End2end-Chat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-400 hover:text-white"
                            >
                                <Github className="w-6 h-6" />
                                <span>GitHub</span>
                            </a>
                        </div>
                        <DonationButtonCompact />
                    </div>
                </div>
            </div>
        </header>
    );
};
