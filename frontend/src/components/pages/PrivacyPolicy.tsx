import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="card p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains how ABHINAVA ANDHRA ePaper ("Platform", "Service", "We") collects, uses, shares, and safeguards user information. By using our Website or ePaper services, you agree to the practices described in this Policy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">2. Information We Collect</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">A. Information You Provide:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Mobile number</li>
                <li>Billing details for subscriptions</li>
                <li>Registration information</li>
                <li>Support queries or communication</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">B. Information Collected Automatically:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>IP address</li>
                <li>Device details</li>
                <li>Browser type</li>
                <li>Usage analytics</li>
                <li>Cookies and tracking data</li>
                <li>Approximate location</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">C. Third-Party Information:</h3>
              <p className="text-gray-700 leading-relaxed ml-4">
                We may receive information from payment gateways, analytics partners, and service providers.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Your information may be used to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide access to the ePaper and account services</li>
            <li>Process subscription payments</li>
            <li>Send transactional emails, alerts, and updates</li>
            <li>Personalize user experience and content</li>
            <li>Improve platform performance</li>
            <li>Prevent fraud or unauthorized access</li>
            <li>Display advertisements</li>
            <li>Comply with legal requirements</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">4. Sharing of Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We may share necessary information with:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Authorized payment gateways</li>
            <li>Analytics and advertising partners</li>
            <li>Technical service providers (hosting, email, security)</li>
            <li>Legal authorities if required by law</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            We do not store sensitive personal data such as medical or sexual orientation information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">5. Cookies & Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We use cookies, web beacons, and similar technologies to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Maintain login sessions</li>
            <li>Improve user experience</li>
            <li>Analyze platform usage</li>
            <li>Display relevant ads</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Users may manage or disable cookies through browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">6. Advertising & Opt-Out</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            The Platform displays contextual and targeted ads.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Users may opt out of promotional emails through the unsubscribe link.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">7. Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We implement standard security measures to protect user data.
          </p>
          <p className="text-gray-700 leading-relaxed">
            However, no online platform can guarantee 100% security; the Platform is not liable for breaches beyond reasonable control.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">8. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed mb-3">We retain user data only as long as required for:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Service delivery</li>
            <li>Legal compliance</li>
            <li>Security and audits</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Users may request data deletion, subject to applicable laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">9. Third-Party Links</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            External links on our Website may lead to sites not operated by us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are not responsible for their privacy practices or content.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">10. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            The Platform is not intended for children under 13 years.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We do not knowingly collect information from minors.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">11. User Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Users may request:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Access to their personal data</li>
            <li>Updates or corrections</li>
            <li>Account deletion</li>
            <li>Opt-out from marketing</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            <span className="font-semibold">Email:</span>{' '}
            <a href="mailto:abhinava.andhra.news@gmail.com" className="text-telugu-primary hover:text-telugu-secondary">
              abhinava.andhra.news@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">12. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We may update this Privacy Policy periodically.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Revised versions will be posted with the updated effective date.
          </p>
        </div>

        <div className="bg-telugu-primary/5 p-6 rounded-lg border-l-4 border-telugu-primary">
          <h2 className="text-xl font-bold text-telugu-primary mb-3">13. Contact for Privacy Concerns</h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Abhinava Andhra Management</span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span>{' '}
            <a href="mailto:abhinava.andhra.news@gmail.com" className="text-telugu-primary hover:text-telugu-secondary">
              abhinava.andhra.news@gmail.com
            </a>
          </p>
        </div>
      </div>
  );
};

export default PrivacyPolicy;