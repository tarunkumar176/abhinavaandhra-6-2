import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
          <div className="card p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">1. Introduction & Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using the ABHINAVA ANDHRA ePaper Portal ("Website", "Platform", "Digital Services"), you ("User") agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please discontinue use of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">2. Scope of Services</h2>
          <p className="text-gray-700 leading-relaxed">
            The Platform provides access to ABHINAVA ANDHRA ePaper editions, archives, news content, and related digital services. Some services are free, others require a paid subscription. All content is provided "as is" without any warranties regarding accuracy or availability.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">3. Acceptance of Updated Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms represent the full agreement between the User and ABHINAVA ANDHRA. We may revise these Terms at any time. Continued use of the Platform signifies acceptance of updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">4. Modification of Services</h2>
          <p className="text-gray-700 leading-relaxed">
            ABHINAVA ANDHRA may modify, suspend, or discontinue any feature or service at any time without notice. We are not liable for such changes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">5. User Registration Requirements</h2>
          <p className="text-gray-700 leading-relaxed">
            Users must provide accurate and updated information. Incorrect or incomplete details may lead to suspension. By registering, you consent to the use of your data for service delivery, communication, and sharing with authorized third-party partners.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">6. Subscription, Renewal & Payment Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Some services require paid subscriptions. All subscription payments are strictly non-refundable. Refunds are provided only for failed or duplicate transactions and credited back to the original payment method.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Subscriptions expire automatically unless renewed. ABHINAVA ANDHRA is not responsible for payment gateway charges, currency conversion fees, or refund delays caused by third parties.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">7. User Behaviour & Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Users must not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Upload abusive, defamatory, illegal, or harmful content</li>
            <li>Violate intellectual property rights</li>
            <li>Spread malware</li>
            <li>Impersonate others</li>
            <li>Attempt unauthorized access</li>
            <li>Misuse the Platform</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Illegal sharing or distribution of ePaper PDFs will result in immediate termination, permanent ban, and no refund.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-telugu-primary mb-4">8. Advertisements & Promotional Messages</h2>
          <p className="text-gray-700 leading-relaxed">
            The Platform may display advertisements and send newsletters or promotional emails. Users may opt out anytime.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-telugu-primary mb-3">Contact & Support</h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Support Email:</span>{' '}
            <a href="mailto:abhinava.andhra.news@gmail.com" className="text-telugu-primary hover:text-telugu-secondary">
              abhinava.andhra.news@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-telugu-primary/5 p-6 rounded-lg border-l-4 border-telugu-primary">
          <h2 className="text-xl font-bold text-telugu-primary mb-3">10. Grievance Redressal</h2>
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

export default TermsConditions;