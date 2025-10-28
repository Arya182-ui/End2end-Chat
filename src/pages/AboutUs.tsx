import { Heart, Code, Shield, Users, Github, Mail, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';
import { DonationButton } from '../components/DonationButton';

const AboutUs = () => {
    return (
        <Layout>
            <Helmet>
                <title>About Us - SecureChat | Open Source Encrypted Messaging</title>
                <meta name="description" content="Learn about SecureChat's mission to provide free, secure, and private communication. Open-source encrypted messaging built with React, Node.js, and WebSocket." />
                <meta name="keywords" content="about securechat, open source encrypted chat, free secure messaging, privacy-focused chat, secure chat developer, encrypted messaging project" />
                <link rel="canonical" href="https://securechat.vercel.app/about" />
            </Helmet>
            <div className="text-white py-16 px-4">
                {/* Header */}
                <div className="max-w-7xl mx-auto text-center mb-16 animate-fade-in">
                    <div className="inline-block mb-6">
                        <Heart className="w-20 h-20 text-red-400 mx-auto animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                            About SecureChat
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        An open-source project making encrypted messaging simple and accessible
                    </p>
                </div>

                {/* Mission Section */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
                        <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Why We Built This
                        </h2>
                        <p className="text-xl text-gray-300 text-center mb-8 leading-relaxed">
                            Most encrypted messaging apps require phone numbers, email addresses, or extensive permissions.
                            We built SecureChat to prove that you can have strong encryption without giving up your privacy
                            or personal data.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                <div className="inline-block p-4 bg-blue-500/20 rounded-2xl mb-4 group-hover:bg-blue-500/30 transition-colors">
                                    <Shield className="w-16 h-16 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Zero Data Collection</h3>
                                <p className="text-gray-400">We don't ask for your phone, email, or any personal information</p>
                            </div>
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                <div className="inline-block p-4 bg-green-500/20 rounded-2xl mb-4 group-hover:bg-green-500/30 transition-colors">
                                    <Code className="w-16 h-16 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Fully Transparent</h3>
                                <p className="text-gray-400">Every line of code is open source and auditable on GitHub</p>
                            </div>
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                <div className="inline-block p-4 bg-purple-500/20 rounded-2xl mb-4 group-hover:bg-purple-500/30 transition-colors">
                                    <Users className="w-16 h-16 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Actually Free</h3>
                                <p className="text-gray-400">No premium tiers, no ads, no hidden costs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center">How It Started</h2>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-gray-300 mb-4">
                                SecureChat began as a college project to learn how end-to-end encryption really works.
                                After weeks of reading cryptography papers and studying Signal's protocol, I wanted to
                                build something practical that others could use and learn from.
                            </p>
                            <p className="text-lg text-gray-300 mb-4">
                                The goal was simple: create a messaging app where:
                            </p>
                            <ul className="space-y-2 text-gray-300 mb-4">
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">•</span>
                                    <span><strong>Messages are encrypted on your device</strong> before being sent</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">•</span>
                                    <span><strong>The server can't read your messages</strong> even if it wanted to</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">•</span>
                                    <span><strong>You can start chatting instantly</strong> without creating an account</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">•</span>
                                    <span><strong>Everything is temporary</strong> and disappears when you close the tab</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-400 mr-2">•</span>
                                    <span><strong>The code is educational</strong> so others can learn from it</span>
                                </li>
                            </ul>
                            <p className="text-lg text-gray-300">
                                What started as a learning project turned into something people actually use. It's not perfect,
                                but it demonstrates that privacy-focused tools don't need to be complicated.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Technology Stack
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            { name: "React 18", color: "from-blue-400 to-cyan-400" },
                            { name: "TypeScript", color: "from-blue-600 to-blue-400" },
                            { name: "Node.js", color: "from-green-500 to-green-400" },
                            { name: "Socket.IO", color: "from-gray-600 to-gray-400" },
                            { name: "Tailwind CSS", color: "from-teal-400 to-blue-400" },
                            { name: "Web Crypto API", color: "from-purple-500 to-pink-500" },
                            { name: "Vite", color: "from-yellow-400 to-orange-400" },
                            { name: "Express.js", color: "from-gray-500 to-gray-700" }
                        ].map((tech, idx) => (
                            <div
                                key={idx}
                                className="group bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 text-center hover:scale-105 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
                            >
                                <div className={`text-xl font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                                    {tech.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Developer Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center">About the Developer</h2>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                {/* Replaced AR text with image */}
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20">
                                    <img
                                        src="https://www.ayushgangwar.tech/assets/logo-D-q9n3Ue.png"
                                        alt="Arya Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-2">Arya</h3>
                                <p className="text-gray-400 mb-4">
                                    Full-Stack Developer & Security Enthusiast
                                </p>
                                <p className="text-gray-300 mb-6">
                                    I'm currently a BTech student specializing in Cybersecurity and IoT Security.
                                    This project started as a way to deeply understand how encryption actually works
                                    in real applications, beyond just theory. I built it to learn, and I'm sharing it
                                    so others can learn too.
                                </p>
                                <div className="flex gap-4 justify-center md:justify-start">
                                    <a
                                        href="https://github.com/Arya182-ui"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                        <span>GitHub</span>
                                    </a>
                                    <a
                                        href="mailto:arya119000@gmail.com"
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span>Contact</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Open Source & Support Section - Combined */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Open Source & Support
                    </h2>
                    
                    {/* Single Combined Box */}
                    <div className="relative group bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-12 border border-white/20 overflow-hidden shadow-2xl">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            {/* GitHub Section */}
                            <div className="text-center mb-12 pb-12 border-b border-white/20">
                                <Github className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-4 text-white">Contribute on GitHub</h3>
                                <p className="text-lg mb-6 text-gray-300 max-w-2xl mx-auto">
                                    This project is completely open source. Explore the code, suggest improvements,
                                    or report bugs. Every contribution helps make this project better.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="https://github.com/Arya182-ui/End2end-Chat"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/btn inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        <Github className="w-5 h-5" />
                                        View on GitHub
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                                    </a>
                                    <a
                                        href="https://github.com/Arya182-ui/End2end-Chat/issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/btn inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 transform hover:scale-105 shadow-lg"
                                    >
                                        Report an Issue
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            </div>

                            {/* Donation Section */}
                            <div className="text-center">
                                <Heart className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
                                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Support This Project
                                </h3>
                                <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                                    SecureChat is completely free and open-source. If you find it useful,
                                    consider supporting its development to keep it running and improving.
                                </p>
                                <div className="flex justify-center">
                                    <DonationButton />
                                </div>
                                <p className="text-sm text-gray-400 mt-6">
                                    Every contribution helps maintain servers and add new features! 🚀
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Try It Out
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        No signup required. Just pick a name and start chatting securely.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl inline-flex items-center gap-2"
                    >
                        <span>Start Chatting Now</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default AboutUs;
