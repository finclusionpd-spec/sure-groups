import React, { Suspense, lazy } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { UserRole } from '../../types';

const SuperAdminDashboard = lazy(() => 
  import('../dashboards/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard }))
);
const ProductAdminDashboard = lazy(() => 
  import('../dashboards/ProductAdminDashboard').then(m => ({ default: m.ProductAdminDashboard }))
);
const GroupAdminDashboard = lazy(() => 
  import('../dashboards/GroupAdminDashboard').then(m => ({ default: m.GroupAdminDashboard }))
);
const MemberDashboard = lazy(() => 
  import('../dashboards/MemberDashboard').then(m => ({ default: m.MemberDashboard }))
);
const VendorDashboard = lazy(() => 
  import('../dashboards/VendorDashboard').then(m => ({ default: m.VendorDashboard }))
);
const DeveloperDashboard = lazy(() => 
  import('../dashboards/DeveloperDashboard').then(m => ({ default: m.DeveloperDashboard }))
);

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const override = params.get('role') as UserRole | null;
  const allowed: UserRole[] = ['super-admin','product-admin','group-admin','member','vendor','developer'];
  const role = (override && allowed.includes(override)) ? override : user?.role;

  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      {(() => {
        switch (role) {
          case 'super-admin':
            return <SuperAdminDashboard />;
          case 'product-admin':
            return <ProductAdminDashboard />;
          case 'group-admin':
            return <GroupAdminDashboard />;
          case 'member':
            return <MemberDashboard />;
          case 'vendor':
            return <VendorDashboard />;
          case 'developer':
            return <DeveloperDashboard />;
          default:
            return <MemberDashboard />;
        }
      })()}
    </Suspense>
  );
};