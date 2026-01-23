import { Shield, Lock, Key, Database, Wifi, Server, AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';

const Security = () => {
    return (
        <Layout>
            <Helmet>
                <title>Security & Privacy - SecureChat | Military-Grade Encryption</title>
                <meta name="description" content="Learn how SecureChat protects your privacy with RSA-OAEP 2048-bit & AES-GCM 256-bit encryption. Zero logging, no tracking, anonymous messaging with forward secrecy." />
                <meta name="keywords" content="end-to-end encryption, AES-256 encryption, RSA-2048, secure messaging privacy, zero knowledge encryption, forward secrecy, anonymous chat security" />
                <link rel="canonical" href="https://securechat.vercel.app/security" />
            </Helmet>
            <div className="min-h-screen text-white py-20 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black">
                {/* Header */}
                <div className="max-w-7xl mx-auto text-center mb-24 animate-fade-in relative z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="inline-block mb-8 relative">
                         <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                         <Shield className="w-24 h-24 text-blue-500 mx-auto relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                           Unbreakable Security
                        </span>
                    </h1>
                    <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Military-grade encryption that guarantees your privacy. Not just a promise, but a mathematical certainty.
                    </p>
                </div>

                {/* Security Layers */}
                <div className="max-w-7xl mx-auto mb-24">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="h-px bg-white/10 w-24"></div>
                        <h2 className="text-3xl font-bold text-center">Defense in Depth</h2>
                         <div className="h-px bg-white/10 w-24"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Wifi className="w-10 h-10 text-green-400" />,
                                title: "Transport Security",
                                tech: "HTTPS/TLS 1.3 + WSS",
                                protection: "Man-in-the-middle attacks"
                            },
                            {
                                icon: <Key className="w-10 h-10 text-yellow-400" />,
                                title: "Key Management",
                                tech: "Client-side RSA-2048",
                                protection: "Server-side key compromise"
                            },
                            {
                                icon: <Lock className="w-10 h-10 text-blue-400" />,
                                title: "Message Encryption",
                                tech: "AES-GCM-256 per message",
                                protection: "Content interception"
                            },
                            {
                                icon: <Shield className="w-10 h-10 text-purple-400" />,
                                title: "Authentication",
                                tech: "Public key cryptography",
                                protection: "Identity spoofing"
                            },
                            {
                                icon: <Database className="w-10 h-10 text-red-400" />,
                                title: "Data Retention",
                                tech: "Zero persistent storage",
                                protection: "Long-term data exposure"
                            },
                            {
                                icon: <Server className="w-10 h-10 text-indigo-400" />,
                                title: "Forward Secrecy",
                                tech: "Ephemeral session keys",
                                protection: "Historical message compromise"
                            }
                        ].map((layer, idx) => (
                            <div key={idx} className="group cursor-default bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">{layer.title}</h3>
                                        <p className="text-blue-400 font-mono text-xs mb-3 bg-blue-500/10 inline-block px-2 py-1 rounded">{layer.tech}</p>
                                        <p className="text-gray-400 text-sm border-t border-white/5 pt-3 mt-1">Protects against: <span className="text-gray-300">{layer.protection}</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Encryption Process Timeline */}
                <div className="max-w-5xl mx-auto mb-24">
                    <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>

                    {/* Dual Mode Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Users className="w-32 h-32 text-blue-400 transform rotate-12 translate-x-8 -translate-y-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-blue-300 flex items-center gap-3">
                                <Users className="w-6 h-6" /> Group Mode
                            </h3>
                            <p className="text-gray-300 mb-6">Optimized for team collaboration with shared session keys.</p>
                            <ul className="space-y-3">
                                {[
                                    "One message reaches everyone securely",
                                    "Single session key encrypted per user",
                                    "Ideal for team chats (4+ members)",
                                    "Unlimited participants support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-lg">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lock className="w-32 h-32 text-purple-400 transform rotate-12 translate-x-8 -translate-y-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-3">
                                <Lock className="w-6 h-6" /> Private Mode
                            </h3>
                            <p className="text-gray-300 mb-6">Maximum security for 1-to-1 sensitive conversations.</p>
                            <ul className="space-y-3">
                                {[
                                    "Maximum 2 members (creator + 1 joiner)",
                                    "Unique key per message (Forward Secrecy)",
                                    "Ideal for sensitive conversations",
                                    "Keys destroyed immediately after use"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 pl-8 md:pl-12 space-y-12 py-4">
                        {[
                            {
                                step: "01",
                                title: "Key Generation",
                                description: "Your browser generates a cryptographically secure RSA-2048 key pair. The private key is stored in memory and NEVER leaves your device."
                            },
                            {
                                step: "02",
                                title: "Secure Handshake",
                                description: "Public keys are exchanged via the WebSocket server. The server acts only as a blind courier and cannot decrypt any content."
                            },
                            {
                                step: "03",
                                title: "Encryption",
                                description: "Messages are encrypted locally using AES-GCM-256. For private chats, a new key is generated for every single message."
                            },
                            {
                                step: "04",
                                title: "Secure Transit",
                                description: "The encrypted payload is wrapped in TLS 1.3 and sent over WSS. Even if the transport layer is breached, the message remains encrypted."
                            },
                            {
                                step: "05",
                                title: "Decryption",
                                description: "The recipient uses their private key to unlock the AES session key, which then decrypts the message content instantly."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="relative group">
                                <span className="absolute -left-[41px] md:-left-[59px] top-0 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black border-4 border-gray-900 text-sm md:text-base font-bold text-gray-400 group-hover:border-blue-500 group-hover:text-white transition-colors duration-300">
                                    {step.step}
                                </span>
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group-hover:border-blue-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Comparison */}
                <div className="max-w-6xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">Privacy by Design</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: <XCircle className="text-red-500" />, title: "No Account Creation", desc: "Zero personal information required" },
                            { icon: <XCircle className="text-red-500" />, title: "No Email/Phone", desc: "No contact information collected" },
                            { icon: <XCircle className="text-red-500" />, title: "No IP Logging", desc: "Server doesn't log connection IPs" },
                            { icon: <XCircle className="text-red-500" />, title: "No Tracking", desc: "No analytics or behavioral monitoring" },
                            { icon: <XCircle className="text-red-500" />, title: "No Persistent IDs", desc: "Session-based temporary identifiers" },
                            { icon: <CheckCircle className="text-green-500" />, title: "Auto-Cleanup", desc: "Sessions auto-delete on disconnect" }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center hover:bg-white/10 transition-colors">
                                <div className="inline-flex p-3 rounded-full bg-white/5 mb-4 transform scale-125">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Limitations */}
                <div className="max-w-4xl mx-auto mb-24">
                    <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl p-8 flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-yellow-500">Important Security Considerations</h3>
                            <ul className="space-y-3 text-gray-400/90 text-sm">
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span><strong>Educational Purpose:</strong> This project is designed for learning and demonstration, not for highly sensitive communications.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span><strong>Device Security:</strong> Your device's security is critical. Use trusted devices and keep them updated.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    <span><strong>Browser Security:</strong> Encryption relies on Web Crypto API. Use modern, updated browsers.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto text-center">
                   
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => window.open('https://github.com/Arya182-ui/End2end-Chat', '_blank')}
                            className="px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Shield className="w-5 h-5" />
                            Security Audit
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Start Secure Chat
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Security;

