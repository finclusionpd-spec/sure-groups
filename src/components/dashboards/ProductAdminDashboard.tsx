import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../common/Header';
import { KycBanner } from '../common/KycBanner';
import { Sidebar } from '../common/Sidebar';
import { FeatureRouter } from '../common/FeatureRouter';
import { getProductAdminNavigation } from '../../config/navigation';

export const ProductAdminDashboard: React.FC = () => {
  const navigation = getProductAdminNavigation();
  const [searchParams] = useSearchParams();
  const [activeFeature, setActiveFeature] = useState<string | null>('platform-overview');

  useEffect(() => {
    const feature = searchParams.get('feature');
    if (feature) {
      setActiveFeature(feature);
    }
  }, [searchParams]);

  const handleFeatureSelect = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const handleBackToDashboard = () => {
    setActiveFeature('platform-overview');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        groups={navigation} 
        onFeatureSelect={handleFeatureSelect}
        activeFeature={activeFeature || undefined}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header title={activeFeature ? "Product Management" : "Product Overview"} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <KycBanner />
          {activeFeature ? (
            <div>
              <button
                onClick={handleBackToDashboard}
                className="mb-4 text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                ← Back to Dashboard
              </button>
              <FeatureRouter featureId={activeFeature} />
            </div>
          ) : (
            <FeatureRouter featureId="platform-overview" onNavigate={handleFeatureSelect} />
          )}
        </main>
      </div>
    </div>
  );
};