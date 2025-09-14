import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TourStep {
  id: string;
  title: string;
  description: string;
  feature: string;
  completed: boolean;
}

export const UserTourGuide: React.FC = () => {
  const { user } = useAuth();
  const isGroupAdmin = user?.role === 'group-admin';
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  const memberSteps: TourStep[] = [
    { id: 'm1', title: 'Welcome to SureGroups (Member)', description: 'Explore your dashboard, see updates, and quick actions built for members.', feature: 'Member Dashboard', completed: false },
    { id: 'm2', title: 'My Groups', description: 'Browse your groups, unread messages, and upcoming events. Discover new groups and manage invitations.', feature: 'My Groups', completed: false },
    { id: 'm3', title: 'Marketplace & Orders', description: 'Find deals and professional services. Review and track your orders.', feature: 'Marketplace, Orders', completed: false },
    { id: 'm4', title: 'Wallet & Donations', description: 'Check your SureBanker Wallet, donate to general causes or campaigns, and download receipts.', feature: 'Wallet, Donations', completed: false },
    { id: 'm5', title: 'Events & Calendar', description: 'View upcoming events in list or calendar view. RSVP and set reminders.', feature: 'Events', completed: false },
    { id: 'm6', title: 'Notifications & Chat', description: 'Stay on top of updates and chat with your groups. Enable notifications.', feature: 'Notifications, Chat', completed: false },
    { id: 'm7', title: 'Profile & Reviews', description: 'Manage your profile and leave ratings/reviews for services.', feature: 'Profile, Ratings & Reviews', completed: false },
  ];

  const adminSteps: TourStep[] = [
    { id: 'a1', title: 'Dashboard & Quick Actions', description: 'Get an overview of your group with key metrics and shortcuts.', feature: 'Group Admin Dashboard', completed: false },
    { id: 'a2', title: 'Group Setup', description: 'Configure group details, profile image, categories, and visibility.', feature: 'Group Setup', completed: false },
    { id: 'a3', title: 'Membership Management', description: 'Manage members, roles, invitations, and approvals.', feature: 'Membership Management', completed: false },
    { id: 'a4', title: 'Approval Workflow', description: 'Review pending requests: membership, content, events, marketplace, donations.', feature: 'Approval Workflow', completed: false },
    { id: 'a5', title: 'Events Management', description: 'Create events, upload banners, manage RSVPs, and send reminders.', feature: 'Events Management', completed: false },
    { id: 'a6', title: 'Voting Management', description: 'Create polls, manage visibility, monitor results, and close polls.', feature: 'Voting Management', completed: false },
    { id: 'a7', title: 'Marketplace Management', description: 'Approve listings, manage categories, add services, and track orders.', feature: 'Marketplace Management', completed: false },
    { id: 'a8', title: 'Donation Management', description: 'Create campaigns, track donations, and view analytics.', feature: 'Donation Management', completed: false },
    { id: 'a9', title: 'Wallet Management (SureBanker)', description: 'Send/receive funds, fund/withdraw with PIN, and filter transactions.', feature: 'Wallet Management', completed: false },
    { id: 'a10', title: 'Performance Tracking', description: 'View group KPIs, trends, and recent activity.', feature: 'Performance Tracking', completed: false },
    { id: 'a11', title: 'Ratings & Reviews', description: 'Monitor and respond to ratings and reviews across services.', feature: 'Ratings & Reviews', completed: false },
    { id: 'a12', title: 'Notifications & Chat', description: 'Receive alerts for approvals and updates. Communicate with members.', feature: 'Notifications, Chats', completed: false },
  ];

  const initialSteps = useMemo(() => (isGroupAdmin ? adminSteps : memberSteps), [isGroupAdmin]);
  const [steps, setSteps] = useState<TourStep[]>(initialSteps);

  useEffect(() => {
    // Reset tour when role context changes
    setSteps(initialSteps.map(s => ({ ...s, completed: false })));
    setCurrentStep(0);
  }, [initialSteps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const updatedSteps = steps.map((step, index) => 
      index <= currentStep ? { ...step, completed: true } : step
    );
    setSteps(updatedSteps);
    
    if (currentStep === steps.length - 1) {
      setShowTour(false);
    } else {
      handleNext();
    }
  };

  const startTour = () => {
    setShowTour(true);
    setCurrentStep(0);
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{isGroupAdmin ? 'Group Admin Tour Guide' : 'Member Tour Guide'}</h1>
        <p className="text-gray-600">{isGroupAdmin ? 'Walk through Group Admin features and workflows' : 'Get familiar with key member features and capabilities'}</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tour Progress</h2>
          <span className="text-sm text-gray-500">{completedSteps} of {steps.length} completed</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                step.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.feature}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={startTour}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Play className="w-4 h-4" />
            <span>{completedSteps === 0 ? 'Start Tour' : 'Continue Tour'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Step {currentStep + 1} of {steps.length}
              </h3>
              <button
                onClick={() => setShowTour(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h4>
              <p className="text-gray-600 mb-4">
                {steps[currentStep].description}
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Feature:</strong> {steps[currentStep].feature}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      {isGroupAdmin ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard & Approvals</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Quick Actions and recent group updates</li>
              <li>• Approval Workflow for pending requests</li>
              <li>• Navigate to Events, Voting, Marketplace</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Events & Voting</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Create events with banners and RSVP settings</li>
              <li>• Create polls, edit, and view results</li>
              <li>• Send reminders and announcements</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketplace & Donations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Approve/reject listings and add services</li>
              <li>• Create donation campaigns and track donors</li>
              <li>• View wallet balances and allocate funds</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Wallet & Performance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Send, receive, fund, and withdraw with PIN</li>
              <li>• Filter transactions and export summaries</li>
              <li>• Track group KPIs and trends</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Membership & Reviews</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Manage members and roles</li>
              <li>• Monitor ratings & reviews</li>
              <li>• Configure group settings</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notifications & Chat</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Approval and event notifications</li>
              <li>• Group announcements and messaging</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">My Groups</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Overview of your groups and unread messages</li>
              <li>• Discover and request to join new groups</li>
              <li>• Accept or decline invitations</li>
              <li>• Chat with group members</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketplace & Orders</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Browse products, discounts and professional services</li>
              <li>• Place orders and track delivery status</li>
              <li>• View and download receipts</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Wallet, Donations & Events</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Check wallet balance and transaction history</li>
              <li>• Donate to causes and download receipts</li>
              <li>• Switch between list and calendar views for events</li>
              <li>• RSVP and set reminders</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};