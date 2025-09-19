import React from 'react';

export const TourPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome Tour</h1>
        <p className="text-gray-600 mb-4">Learn key features of Sure Groups.</p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-800">
          <li>Dashboard overview and quick actions</li>
          <li>Groups and membership</li>
          <li>Events and RSVPs</li>
          <li>Marketplace and vendors</li>
          <li>Wallet and payouts</li>
        </ol>
      </div>
    </div>
  );
};

export default TourPage;

