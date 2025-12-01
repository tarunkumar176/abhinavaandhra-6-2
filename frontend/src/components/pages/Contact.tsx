import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await contactAPI.submit(formData);
      if (response.success) {
        setIsSubmitted(true);
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/" className="text-telugu-primary hover:text-telugu-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        </div>

        <div className="card p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We have received your message and will get back to you within 24-48 hours.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-secondary"
            >
              Send Another Message
            </button>
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-telugu-primary hover:text-telugu-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-telugu-primary mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-telugu-primary/10 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-telugu-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">admin@teluguepaper.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-telugu-primary/10 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-telugu-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">+91 12345 67890</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-telugu-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-telugu-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600">
                    Telugu E-Paper Office<br />
                    Hyderabad, Telangana<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="input-field resize-none"
                placeholder="Enter your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;