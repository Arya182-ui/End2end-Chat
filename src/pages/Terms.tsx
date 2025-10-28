import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/Layout';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service - SecureChat | User Agreement</title>
        <meta name="description" content="SecureChat Terms of Service. Read our user agreement and terms of use for our encrypted messaging service." />
        <link rel="canonical" href="https://securechat.vercel.app/terms" />
      </Helmet>
      <div className="text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: October 26, 2025</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using SecureChat ("Service"), you accept and agree to be bound by these Terms of Service
                ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                SecureChat is an end-to-end encrypted messaging service that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Send encrypted text messages in two modes: <strong>Group Chat</strong> (broadcast) or <strong>Private Chat</strong> (1-to-1)</li>
                <li>Share encrypted files (images, videos, documents) up to 5MB</li>
                <li>Create temporary chat sessions without account registration</li>
                <li>Communicate anonymously with military-grade encryption</li>
              </ul>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                <p className="text-blue-300 font-semibold mb-2">📌 Session Limits</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• <strong>Group Mode:</strong> Unlimited members (4, 5, 10+)</li>
                  <li>• <strong>Private Mode:</strong> Maximum 2 members (creator + 1 joiner)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">3.1 Acceptable Use</h3>
              <p className="text-gray-300 mb-2">You agree to use the Service only for lawful purposes. You shall NOT:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>❌ Send spam, malware, or malicious content</li>
                <li>❌ Harass, threaten, or abuse other users</li>
                <li>❌ Share illegal content or engage in illegal activities</li>
                <li>❌ Impersonate others or provide false information</li>
                <li>❌ Attempt to hack, breach, or compromise the Service</li>
                <li>❌ Use the Service to distribute copyrighted material without permission</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-purple-400">3.2 Device Security</h3>
              <p className="text-gray-300">
                You are responsible for maintaining the security of your device. We recommend:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Using up-to-date browsers and operating systems</li>
                <li>Enabling device encryption</li>
                <li>Using strong device passwords</li>
                <li>Not using public or shared devices for sensitive communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Educational Purpose</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold mb-2">⚠️ Important Notice</p>
                <p className="text-gray-300">
                  SecureChat is provided primarily for <strong>educational and demonstration purposes</strong>. While we
                  implement strong encryption, this Service is NOT intended for:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>Highly sensitive government communications</li>
                  <li>Medical or healthcare information (HIPAA compliance)</li>
                  <li>Financial transactions or banking</li>
                  <li>Legal proceedings requiring certified communication</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                SecureChat is open-source software licensed under the MIT License. The source code is available on
                <a href="https://github.com/Arya182-ui/End2end-Chat" className="text-purple-400 underline ml-1">GitHub</a>.
              </p>
              <p className="text-gray-300">
                You are free to use, modify, and distribute the code according to the MIT License terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Privacy & Data</h2>
              <p className="text-gray-300 mb-2">
                We respect your privacy. Key points:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>✅ Messages are end-to-end encrypted</li>
                <li>✅ No persistent storage - data deleted when session ends</li>
                <li>✅ No account creation or personal information required</li>
                <li>✅ Server cannot decrypt your messages</li>
              </ul>
              <p className="text-gray-300 mt-4">
                See our <a href="/privacy" className="text-purple-400 underline">Privacy Policy</a> for full details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-gray-300">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  WE DO NOT WARRANT THAT:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                  <li>The Service will be uninterrupted or error-free</li>
                  <li>The Service is completely secure from all threats</li>
                  <li>Messages will always be delivered</li>
                  <li>The encryption will never be compromised</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-300">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data, revenue, or profits</li>
                <li>Security breaches or unauthorized access</li>
                <li>Service interruptions or downtime</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Content Moderation</h2>
              <p className="text-gray-300 mb-4">
                Due to end-to-end encryption, we <strong>cannot</strong> monitor message content. However:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>We may suspend sessions if abuse is reported</li>
                <li>We comply with legal requests when required</li>
                <li>Users found violating Terms may be banned from the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Third-Party Services</h2>
              <p className="text-gray-300">
                We may use third-party services for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Analytics (Google Analytics)</li>
                <li>Advertising (Google AdSense)</li>
                <li>Hosting and infrastructure</li>
              </ul>
              <p className="text-gray-300 mt-4">
                These services have their own terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
              <p className="text-gray-300">
                We reserve the right to terminate or suspend access to the Service at any time, without notice, for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li>Violation of these Terms</li>
                <li>Suspected fraudulent or illegal activity</li>
                <li>Technical or security reasons</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
              <p className="text-gray-300">
                We may modify these Terms at any time. Continued use of the Service after changes constitutes
                acceptance of the new Terms. We will update the "Last updated" date above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <p className="text-gray-300">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard
                to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-300 mb-2">
                  Questions about these Terms? Contact us:
                </p>
                <p className="text-purple-400">
                  Email: <a href="mailto:arya119000@gmail.com" className="underline">arya119000@gmail.com</a>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  GitHub: <a href="https://github.com/Arya182-ui/End2end-Chat/issues" className="text-purple-400 underline">Report an Issue</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Severability</h2>
              <p className="text-gray-300">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will
                continue in full force and effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
