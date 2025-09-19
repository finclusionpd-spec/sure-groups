import React from 'react';
import { AssociationRegistrationList } from './AssociationRegistrationList';

interface AssociationRegistrationProps {
  groupId?: string;
  groupName?: string;
}

export const AssociationRegistrationPage: React.FC<AssociationRegistrationProps> = ({ 
  groupId = 'group-1', 
  groupName = 'Sample Group' 
}) => {
  return (
    <AssociationRegistrationList 
      groupId={groupId} 
      groupName={groupName} 
    />
  );
};
