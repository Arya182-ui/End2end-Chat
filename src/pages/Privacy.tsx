import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';
import { Shield, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy - SecureChat | Your Privacy is Our Priority</title>
        <meta name="description" content="SecureChat privacy policy. Learn how we protect your data with zero logging, no tracking, and end-to-end encryption." />
        <link rel="canonical" href="https://securechat.vercel.app/privacy" />
      </Helmet>
      <div className="text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: October 26, 2025</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                SecureChat ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we handle information when you use our end-to-end encrypted messaging service. The key principle
                is simple: <strong>we cannot and do not access your messages</strong> because they are encrypted on your device.
                SecureChat supports two modes: <strong>Group Chat</strong> (broadcast to all members) and <strong>Private Chat</strong> (1-to-1, maximum 2 members).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Display Name:</strong> When you create or join a chat session, you provide a display name</li>
                <li><strong>Messages & Files:</strong> All messages and files are encrypted on your device before transmission</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-blue-400">2.2 Information We Do NOT Collect</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>❌ Email addresses</li>
                <li>❌ Phone numbers</li>
                <li>❌ Payment information</li>
                <li>❌ Location data</li>
                <li>❌ IP addresses (not logged)</li>
                <li>❌ Message content (we cannot decrypt)</li>
                <li>❌ Personal identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Message Routing:</strong> We route encrypted messages between users in the same session</li>
                <li><strong>Session Management:</strong> We maintain temporary session data in memory only</li>
                <li><strong>Service Improvement:</strong> We may use anonymized, aggregated data to improve the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Storage & Retention</h2>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-semibold mb-2">✅ Zero Persistent Storage</p>
                <p className="text-gray-300">
                  All session data is stored in-memory only and is automatically deleted when:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>You disconnect from the session</li>
                  <li>The session ends</li>
                  <li>The server restarts</li>
                </ul>
              </div>
              <p className="text-gray-300">
                <strong>No database is used.</strong> Messages are never written to disk. Your encryption keys are
                generated and stored only on your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Encryption & Security</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>End-to-End Encryption:</strong> RSA-OAEP 2048-bit + AES-GCM 256-bit</li>
                <li><strong>Client-Side Keys:</strong> Your private key never leaves your device</li>
                <li><strong>Transport Security:</strong> TLS 1.3 + WebSocket Secure (WSS)</li>
                <li><strong>Forward Secrecy:</strong> Each message uses a unique encryption key</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Third-Party Services</h2>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">6.1 Analytics (Google Analytics)</h3>
              <p className="text-gray-300 mb-2">
                We may use Google Analytics to understand how users interact with our service. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Page views and navigation</li>
                <li>Device type and browser information</li>
                <li>Anonymized usage patterns</li>
              </ul>
              <p className="text-gray-300 mb-4">
                You can opt-out using browser extensions like uBlock Origin or Privacy Badger.
              </p>

              <h3 className="text-xl font-semibold mb-2 text-blue-400">6.2 Advertising (Google AdSense)</h3>
              <p className="text-gray-300">
                We may display advertisements through Google AdSense. Google may use cookies to serve ads based on
                your prior visits. You can opt-out at <a href="https://www.google.com/settings/ads" className="text-blue-400 underline">Google Ads Settings</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies & Local Storage</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>User ID:</strong> Stored in localStorage to maintain consistent identity across sessions</li>
                <li><strong>Encryption Keys:</strong> Stored in localStorage (never shared with server)</li>
                <li><strong>Session Info:</strong> Stored in localStorage to remember active sessions</li>
                <li><strong>Analytics Cookies:</strong> Used by Google Analytics (if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Right to Delete:</strong> Clear your browser's localStorage to remove all local data</li>
                <li><strong>Right to Access:</strong> All your data is stored locally on your device</li>
                <li><strong>Right to Opt-Out:</strong> Use ad blockers or privacy extensions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300">
                SecureChat is not intended for users under 13 years of age. We do not knowingly collect information
                from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Cookies and Tracking</h2>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">10.1 Cookies We Use</h3>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience and support our service:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Strictly Necessary Cookies:</strong> Required for basic functionality (session management, security)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics) - Optional</li>
                <li><strong>Advertising Cookies:</strong> Enable us to show relevant ads (Google AdSense) - Optional</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-2 text-blue-400">10.2 Your Cookie Choices</h3>
              <p className="text-gray-300 mb-4">
                You can manage your cookie preferences through our cookie consent banner that appears when you first visit our site.
                You can choose to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Accept all cookies</li>
                <li>Reject all optional cookies</li>
                <li>Customize your preferences for each cookie category</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-2 text-blue-400">10.3 Third-Party Services</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics (only with your consent)</li>
                <li><strong>Google AdSense:</strong> Advertising services (only with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify users of any material changes by
                updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-gray-300 mb-2">
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <div className="flex items-center gap-2 text-blue-400">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:arya119000@gmail.com" className="underline">arya119000@gmail.com</a>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  GitHub: <a href="https://github.com/Arya182-ui/End2end-Chat" className="text-blue-400 underline">Arya182-ui/End2end-Chat</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
