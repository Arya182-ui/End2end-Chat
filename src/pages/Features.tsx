import { Shield, Lock, Zap, Users, FileText, Download, Eye, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';

const Features = () => {
  const features = [
    {
      icon: <Lock className="w-12 h-12 text-blue-500" />,
      title: "Three Chat Modes",
      description: "Flexible communication options for every scenario.",
      details: ["Group: unlimited members", "Private: max 2 people", "Password: secure with passphrase"],
      colSpan: "md:col-span-2 lg:col-span-1"
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-500" />,
      title: "Real End-to-End Encryption",
      description: "Messages are encrypted on your device before sending. We use RSA-2048 and AES-256 - the same standards as Signal.",
      details: ["Keys generated locally", "Server can't decrypt", "No plaintext storage"],
      colSpan: "md:col-span-2 lg:col-span-2",
      highlight: true
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "Instant Messaging",
      description: "WebSocket-based real-time communication with typing indicators and instant delivery.",
      details: ["Sub-second delivery", "Auto-reconnection", "Live typing status"]
    },
    {
      icon: <FileText className="w-12 h-12 text-green-500" />,
      title: "Secure File Sharing",
      description: "Share images, documents, and media files with the same encryption as messages.",
      details: ["Up to 5MB per file", "Image preview", "Multiple file types"]
    },
    {
      icon: <Eye className="w-12 h-12 text-red-500" />,
      title: "Screenshot Protection",
      description: "Blocks common screenshot methods to protect sensitive conversations.",
      details: ["Print Screen blocking", "Clipboard clearing", "Screenshot detection"]
    },
    {
      icon: <Download className="w-12 h-12 text-purple-500" />,
      title: "Download Tracking",
      description: "Get notified when someone downloads files you've shared in the chat.",
      details: ["Real-time notifications", "Visual feedback", "Privacy awareness"]
    },
    {
      icon: <Users className="w-12 h-12 text-teal-500" />,
      title: "No Account Needed",
      description: "Just enter a name and start chatting. No phone number, email, or personal data required.",
      details: ["Anonymous by default", "Instant access", "Temporary sessions"]
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-pink-500" />,
      title: "Clean Interface",
      description: "Simple, responsive design that works on any device without unnecessary complexity.",
      details: ["Mobile-friendly", "Dark theme", "Intuitive controls"]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Features - SecureChat | End-to-End Encrypted Messaging</title>
        <meta name="description" content="Discover SecureChat's powerful features: RSA-2048 encryption, real-time messaging, file sharing, screenshot protection, and zero data persistence. Privacy-first design." />
        <meta name="keywords" content="encrypted messaging features, secure chat features, file sharing encryption, screenshot protection, real-time encrypted chat, anonymous messaging" />
        <link rel="canonical" href="https://securechat.vercel.app/features" />
      </Helmet>

      <div className="min-h-screen text-white py-20 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black">
      {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-20 animate-fade-in relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Powerful Features
            </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Everything you need for secure, private messaging without the bloat.
            </p>
        </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.colSpan || ''}`}
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 inline-block bg-white/5 p-4 rounded-xl border border-white/5 w-fit">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                {feature.description}
              </p>
              
              <div className="pt-6 border-t border-white/5">
                  <ul className="space-y-3">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:shadow-[0_0_5px_rgba(59,130,246,0.8)] transition-shadow"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto mt-24 text-center">
        <div className="relative group overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="bg-black/90 rounded-[1.4rem] p-12 md:p-20 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
                 
                 <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Secure Your Chats?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    No sign-up tracking, no data harvesting. Just pure, encrypted communication.
                    </p>
                    <button
                    onClick={() => window.location.href = '/'}
                    className="group/btn relative px-8 py-4 bg-white text-black font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                        <span className="relative flex items-center gap-2">
                            Start Chatting Now
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                 </div>
            </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Features;
