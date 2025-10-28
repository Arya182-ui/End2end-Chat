import { Shield, Lock, Key, Database, Wifi, Server, AlertTriangle } from 'lucide-react';
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
      <div className="text-white py-16 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Security & Privacy
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your privacy is our priority. Learn how we protect your conversations with military-grade encryption.
        </p>
      </div>

      {/* Security Layers */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Security Layers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{layer.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{layer.title}</h3>
                  <p className="text-blue-300 font-mono text-sm mb-2">{layer.tech}</p>
                  <p className="text-gray-400 text-sm">Protects against: {layer.protection}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encryption Process */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How Encryption Works</h2>
        
        {/* Dual Mode Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-3 text-blue-300">🌐 Group Mode</h3>
            <p className="text-gray-300 mb-3">Shared AES-256 session key for broadcast messaging</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ One message reaches everyone</li>
              <li>✓ Single session key encrypted per user</li>
              <li>✓ Ideal for team chats (4+ members)</li>
              <li>✓ Unlimited participants</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-3 text-purple-300">🔐 Private Mode</h3>
            <p className="text-gray-300 mb-3">RSA-2048 hybrid encryption for 1-to-1 chats</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Maximum 2 members (creator + 1 joiner)</li>
              <li>✓ Per-message unique encryption</li>
              <li>✓ Ideal for sensitive conversations</li>
              <li>✓ Forward secrecy guaranteed</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Key Generation",
                description: "Each user generates RSA-2048 key pair on their device. Private key never leaves device."
              },
              {
                step: "2",
                title: "Key Exchange",
                description: "Public keys are exchanged via WebSocket server (server cannot decrypt messages)."
              },
              {
                step: "3",
                title: "Message Encryption",
                description: "Group: AES-GCM-256 shared key. Private: Unique AES key per message for forward secrecy."
              },
              {
                step: "4",
                title: "Key Encryption",
                description: "AES key encrypted with recipient's RSA public key for each participant."
              },
              {
                step: "5",
                title: "Secure Transmission",
                description: "Encrypted message + encrypted keys sent via WebSocket over WSS (TLS 1.3)."
              },
              {
                step: "6",
                title: "Decryption",
                description: "Recipient decrypts AES key with their private key, then decrypts message content."
              }
            ].map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-xl">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Features */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Privacy Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "❌", title: "No Account Creation", desc: "Zero personal information required" },
            { icon: "❌", title: "No Email/Phone", desc: "No contact information collected" },
            { icon: "❌", title: "No IP Logging", desc: "Server doesn't log connection IPs" },
            { icon: "❌", title: "No Tracking", desc: "No analytics or behavioral monitoring" },
            { icon: "❌", title: "No Persistent IDs", desc: "Session-based temporary identifiers" },
            { icon: "✅", title: "Auto-Cleanup", desc: "Sessions auto-delete on disconnect" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Important Security Considerations</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>Educational Purpose:</strong> This project is designed for learning and demonstration, not for highly sensitive communications.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>Device Security:</strong> Your device's security is critical. Use trusted devices and keep them updated.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>Browser Security:</strong> Encryption relies on Web Crypto API. Use modern, updated browsers.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>Screenshot Protection:</strong> While we block Print Screen, advanced screen capture tools may bypass this.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>No Warranty:</strong> This is open-source software provided "as-is" without security guarantees.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Questions About Security?</h2>
        <p className="text-gray-300 mb-8">
          Check our GitHub repository for detailed technical documentation and security audits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.open('https://github.com/Arya182-ui/End2end-Chat', '_blank')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View on GitHub
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
