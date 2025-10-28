import { Shield, Lock, Zap, Users, FileText, Download, Eye, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';

const Features = () => {
  const features = [
    {
      icon: <Lock className="w-12 h-12 text-blue-500" />,
      title: "Three Chat Modes",
      description: "Group mode for teams, Private mode for 1-on-1 conversations, and Password mode for extra security.",
      details: ["Group: unlimited members", "Private: max 2 people", "Password: secure with passphrase"]
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-500" />,
      title: "Real End-to-End Encryption",
      description: "Messages are encrypted on your device before sending. We use RSA-2048 and AES-256 - the same standards as Signal.",
      details: ["Keys generated locally", "Server can't decrypt", "No plaintext storage"]
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

      <div className="text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Features
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Everything you need for secure, private messaging without the bloat
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-xl"></div>

            <div className="relative z-10">
              <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:animate-pulse"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="relative group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Start Chatting</h2>
            <p className="text-xl text-gray-100 mb-8">
              No account, no hassle. Just pick a name and you're in.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="group/btn bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl inline-flex items-center gap-2"
            >
              <span>Start Chatting Now</span>
              <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Features;
