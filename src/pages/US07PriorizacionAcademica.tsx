import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AcademicPriority } from '../features/academic-priority';

const US07PriorizacionAcademica: React.FC = () => {
  return (
    <DashboardLayout 
      activeSection="priority" 
      onNavigate={(id) => console.log('Navigating to:', id)} 
      onLogout={() => console.log('Logout')}
    >
      <AcademicPriority />
    </DashboardLayout>
  );
};

export default US07PriorizacionAcademica;
