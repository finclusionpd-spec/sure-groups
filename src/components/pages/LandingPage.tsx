import React from 'react';
import { 
  Users,
  MessageSquare,
  ShoppingCart,
  Settings,
  Building,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SureGroupsLogo } from '../common/SureGroupsLogo';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-dark border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <SureGroupsLogo size="lg" showText={true} />
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/demo" className="btn-primary">
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-brand-bold text-brand-dark mb-8 leading-tight">
            Digital Platform for Organized Groups
          </h1>
          <p className="text-lg md:text-xl text-brand-body mb-12 max-w-4xl mx-auto leading-relaxed">
            Unite your church, union, association, or community with powerful group management tools, integrated messaging, exclusive marketplace benefits, and professional-grade administration features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/demo" className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl">
              Explore Demo Platform
            </Link>
            <button className="btn-secondary px-8 py-4 text-lg shadow-sm hover:shadow-md">
              Schedule Demo Call
            </button>
          </div>

          {/* Community Image Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/Groupimage.jpeg"
                alt="Vibrant community gathering of women in traditional African attire, representing the diverse and engaged community that SureGroups serves"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl md:text-3xl font-brand-bold text-white mb-2">
                  Building Stronger Communities Together
                </h3>
                <p className="text-white/90 text-lg font-brand-regular">
                  Join thousands of organizations creating meaningful connections and driving positive change
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-12">
              <Link to="/signup" className="btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3 text-lg shadow-sm hover:shadow-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-brand-bold text-brand-dark mb-4">Core Features</h2>
            <p className="text-lg text-brand-body">Everything you need to manage your organization effectively</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-brand text-center hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-brand-bold text-brand-dark mb-2">Messaging</h3>
              <p className="text-brand-body text-sm">Seamless communication tools for your community</p>
            </div>
            <div className="card-brand text-center hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-brand-bold text-brand-dark mb-2">Marketplace</h3>
              <p className="text-brand-body text-sm">Built-in marketplace for community commerce</p>
            </div>
            <div className="card-brand text-center hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-brand-bold text-brand-dark mb-2">Group Management</h3>
              <p className="text-brand-body text-sm">Comprehensive tools for organizing and managing groups</p>
            </div>
            <div className="card-brand text-center hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-brand-bold text-brand-dark mb-2">Administration</h3>
              <p className="text-brand-body text-sm">Powerful admin tools for complete control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SureGroups?</h2>
            <p className="text-lg text-gray-600">Built for organizations that demand excellence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for users of all technical levels</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Grade</h3>
              <p className="text-gray-600">Enterprise-level security and reliability you can trust</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Platform</h3>
              <p className="text-gray-600">Thousands of organizations rely on SureGroups daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">SureGroups</span>
              </div>
              <p className="text-gray-400">
                Empowering organizations with comprehensive group management solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 SureGroups. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};