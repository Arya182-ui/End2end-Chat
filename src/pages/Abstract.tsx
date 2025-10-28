import { Shield, Lock, Code, Users, Zap, Database, CheckCircle, XCircle, FileCode, Globe, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';
import { DonationButton } from '../components/DonationButton';

const Abstract = () => {
    return (
        <Layout>
            <Helmet>
                <title>SecureChat - Project Abstract | Technical Overview</title>
                <meta name="description" content="Complete technical and functional overview of SecureChat - an open-source encrypted messaging platform with RSA-2048 and AES-256 encryption." />
                <meta name="keywords" content="securechat abstract, project overview, technical documentation, encrypted chat architecture, end-to-end encryption implementation" />
                <link rel="canonical" href="https://securechat.vercel.app/abstract" />
            </Helmet>
            
            <div className="text-white py-16 px-4">
                {/* Header */}
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <div className="inline-block mb-6">
                        <FileCode className="w-20 h-20 text-blue-400 mx-auto" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            SecureChat
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A comprehensive overview of SecureChat - understanding the problem, solution, 
                        and implementation of a privacy-focused messaging platform
                    </p>
                </div>

                {/* Quick Summary */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
                        <h2 className="text-3xl font-bold mb-4 text-center">Executive Summary</h2>
                        <p className="text-lg text-gray-200 leading-relaxed text-center max-w-4xl mx-auto">
                            SecureChat is a web-based encrypted messaging application that prioritizes user privacy 
                            by implementing end-to-end encryption without requiring personal data. Unlike traditional 
                            messaging platforms that collect phone numbers and emails, this system allows anonymous, 
                            secure communication through temporary sessions with RSA-2048 and AES-256 encryption.
                        </p>
                    </div>
                </div>

                {/* Problem Statement */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        The Problem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Privacy Erosion</h3>
                                    <p className="text-gray-300 text-sm">
                                        Most messaging apps collect extensive personal data - phone numbers, email addresses, 
                                        contacts, and metadata - creating privacy risks and surveillance potential.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Centralized Control</h3>
                                    <p className="text-gray-300 text-sm">
                                        Traditional platforms store messages on servers, giving companies access to user 
                                        conversations and creating single points of failure for data breaches.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Complex Setup</h3>
                                    <p className="text-gray-300 text-sm">
                                        Secure messaging often requires technical knowledge, verification codes, 
                                        and lengthy setup processes that discourage adoption.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Lack of Transparency</h3>
                                    <p className="text-gray-300 text-sm">
                                        Closed-source applications make it impossible to verify security claims, 
                                        forcing users to trust companies blindly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Our Solution
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Zero Data Collection</h3>
                                    <p className="text-gray-300 text-sm">
                                        No phone numbers, emails, or personal information required. Users only provide 
                                        a display name that's never stored permanently.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">True End-to-End Encryption</h3>
                                    <p className="text-gray-300 text-sm">
                                        Messages are encrypted on the sender's device and only decrypted on the recipient's 
                                        device. The server never has access to plaintext messages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
                                    <p className="text-gray-300 text-sm">
                                        Start chatting in seconds. Just enter a name, create a session, and share 
                                        the link. No verification, no waiting.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Fully Open Source</h3>
                                    <p className="text-gray-300 text-sm">
                                        Every line of code is publicly available on GitHub. Security experts can audit, 
                                        verify, and contribute to the codebase.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works - For Non-Technical */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center">How It Works (Simple Explanation)</h2>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">You Create a Session</h3>
                                    <p className="text-gray-300">
                                        Think of it like creating a private room. You get a unique link that you can share 
                                        with people you want to chat with. The app generates special "keys" on your device.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Others Join Your Session</h3>
                                    <p className="text-gray-300">
                                        When someone clicks your link and enters their name, they also get their own set 
                                        of keys. Everyone exchanges their "public keys" (like a mailing address).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Messages Get Encrypted</h3>
                                    <p className="text-gray-300">
                                        When you type a message, it's scrambled using the recipient's public key before 
                                        leaving your device. Only they can unscramble it with their private key.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Server Just Delivers</h3>
                                    <p className="text-gray-300">
                                        The server acts like a postal service - it delivers encrypted messages but can't 
                                        read them. It's like sending locked boxes through the mail.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold text-xl">
                                    5
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Everything Disappears</h3>
                                    <p className="text-gray-300">
                                        When you close the tab, everything is deleted - messages, keys, session data. 
                                        Nothing is stored permanently anywhere.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Architecture */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Technical Architecture
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Frontend */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-8 h-8 text-blue-400" />
                                <h3 className="text-2xl font-bold">Frontend (Client)</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">React 18 + TypeScript:</strong> Component-based UI with type safety
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">Web Crypto API:</strong> Browser-native cryptographic operations
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">Socket.IO Client:</strong> Real-time WebSocket communication
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">Vite:</strong> Fast development and optimized production builds
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Backend */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-8 h-8 text-green-400" />
                                <h3 className="text-2xl font-bold">Backend (Server)</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">Node.js + Express:</strong> Lightweight HTTP server
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">Socket.IO Server:</strong> WebSocket event handling and routing
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">In-Memory Sessions:</strong> Temporary session data (auto-cleanup)
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Code className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white">No Database:</strong> Zero persistent storage of messages
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Encryption Details */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-8 h-8 text-purple-400" />
                            <h3 className="text-2xl font-bold">Encryption Implementation</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="text-lg font-bold text-purple-300 mb-3">Group Mode</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>• <strong>Algorithm:</strong> AES-GCM-256</li>
                                    <li>• <strong>Key Size:</strong> 256 bits</li>
                                    <li>• <strong>Shared Key:</strong> One session key for all members</li>
                                    <li>• <strong>Distribution:</strong> Key encrypted with RSA for each user</li>
                                    <li>• <strong>Use Case:</strong> Multi-user chats</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-blue-300 mb-3">Private Mode</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>• <strong>Algorithm:</strong> RSA-OAEP-2048</li>
                                    <li>• <strong>Key Size:</strong> 2048 bits</li>
                                    <li>• <strong>Per-Message:</strong> Unique encryption</li>
                                    <li>• <strong>Forward Secrecy:</strong> Yes</li>
                                    <li>• <strong>Use Case:</strong> 1-on-1 chats (max 2 users)</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-green-300 mb-3">Password Mode</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>• <strong>Algorithm:</strong> RSA-OAEP-2048</li>
                                    <li>• <strong>Access:</strong> Password-protected</li>
                                    <li>• <strong>Room ID:</strong> 5-character code</li>
                                    <li>• <strong>Password Hash:</strong> Base64 encoded</li>
                                    <li>• <strong>Use Case:</strong> Secure 2-person chats</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center">Key Features Implemented</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: "End-to-End Encryption", desc: "RSA-2048 + AES-256" },
                            { icon: Users, title: "Multi-Mode Support", desc: "Group, Private, Password" },
                            { icon: Zap, title: "Real-Time Messaging", desc: "WebSocket-based" },
                            { icon: Lock, title: "Typing Indicators", desc: "Live status updates" },
                            { icon: FileCode, title: "File Sharing", desc: "Encrypted file transfer" },
                            { icon: Database, title: "Zero Persistence", desc: "No message storage" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 text-center hover:scale-105 transition-transform">
                                <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Use Cases */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Practical Use Cases
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold mb-3 text-blue-300">1. Quick Team Collaboration</h3>
                            <p className="text-gray-300 text-sm">
                                Share a session link during meetings for secure real-time discussion without installing apps 
                                or creating accounts. Perfect for temporary project teams.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold mb-3 text-purple-300">2. Confidential Conversations</h3>
                            <p className="text-gray-300 text-sm">
                                Use Private or Password mode for sensitive 1-on-1 discussions where you need guaranteed 
                                privacy without leaving digital traces.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold mb-3 text-green-300">3. Anonymous Support</h3>
                            <p className="text-gray-300 text-sm">
                                Provide customer support or help desk services without collecting personal information 
                                from users who value privacy.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold mb-3 text-yellow-300">4. Educational Demos</h3>
                            <p className="text-gray-300 text-sm">
                                Learn how end-to-end encryption works by inspecting the open-source code and observing 
                                real cryptographic operations in action.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Limitations & Future Scope */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Limitations */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-yellow-500/30">
                            <h2 className="text-2xl font-bold mb-4 text-yellow-300">Current Limitations</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>No Message History:</strong> Messages disappear when you close the tab</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>Single Device:</strong> Can't sync across multiple devices</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>No Identity Verification:</strong> Users must share links securely</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>File Size Limit:</strong> Maximum 5MB per file</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>Educational Project:</strong> Not audited by professional security firms</span>
                                </li>
                            </ul>
                        </div>

                        {/* Future Enhancements */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30">
                            <h2 className="text-2xl font-bold mb-4 text-blue-300">Future Enhancements</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">→</span>
                                    <span><strong>Voice/Video Calls:</strong> WebRTC integration for encrypted calls</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">→</span>
                                    <span><strong>Optional Persistence:</strong> Client-side encrypted storage</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">→</span>
                                    <span><strong>Group Management:</strong> Admin controls, member permissions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">→</span>
                                    <span><strong>QR Code Sharing:</strong> Easier session link distribution</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">→</span>
                                    <span><strong>Read Receipts:</strong> Optional message read indicators</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-10 text-center">
                        <Heart className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Support This Project
                        </h2>
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            SecureChat is completely free and open-source. Your support helps keep this project alive 
                            and enables continuous development of privacy-focused features for everyone.
                        </p>
                        <DonationButton />
                        <p className="text-sm text-gray-400 mt-6">
                            Every contribution helps maintain servers and add new features! 🚀
                        </p>
                    </div>
                </div>

                {/* Conclusion */}
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4 text-white">Project Conclusion</h2>
                        <p className="text-xl text-gray-100 mb-6 leading-relaxed">
                            SecureChat demonstrates that privacy-focused communication doesn't require compromising 
                            user experience or collecting personal data. By leveraging modern web technologies and 
                            proven cryptographic standards, this project shows that secure messaging can be simple, 
                            transparent, and accessible to everyone.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                        >
                            <span>Try It Now</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Abstract;
