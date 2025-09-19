import { 
  AssociationRegistration, 
  AssociationRegistrationFormData, 
  AssociationDocument,
  RegistrationStatus 
} from '../types';

// Mock data for development - replace with actual API calls
const mockAssociationRegistrations: AssociationRegistration[] = [
  {
    id: '1',
    groupId: 'group-1',
    groupName: 'Youth Ministry Group',
    adminId: 'admin-1',
    adminName: 'John Doe',
    associationName: 'Youth Ministry Association',
    associationType: 'Religious Organization',
    registrationOption: 'Religious Organization Registration',
    description: 'A religious organization focused on youth development and spiritual growth.',
    contactPersonName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+234-801-234-5678',
    address: '123 Church Street, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    documents: [
      {
        id: 'doc-1',
        fileName: 'constitution.pdf',
        fileType: 'application/pdf',
        fileSize: 1024000,
        fileUrl: '/documents/constitution.pdf',
        documentType: 'constitution',
        uploadedAt: '2024-01-15T10:30:00Z',
        description: 'Association Constitution'
      }
    ],
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    groupId: 'group-1',
    groupName: 'Youth Ministry Group',
    adminId: 'admin-1',
    adminName: 'John Doe',
    associationName: 'Community Development Initiative',
    associationType: 'NGO',
    registrationOption: 'CAC Registration',
    description: 'A non-governmental organization focused on community development and social welfare.',
    contactPersonName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+234-801-234-5678',
    address: '123 Church Street, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    documents: [],
    status: 'approved',
    submittedAt: '2024-01-10T09:15:00Z',
    reviewedAt: '2024-01-12T14:30:00Z',
    reviewedBy: 'admin-reviewer',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    groupId: 'group-1',
    groupName: 'Youth Ministry Group',
    adminId: 'admin-1',
    adminName: 'John Doe',
    associationName: 'Professional Teachers Association',
    associationType: 'Professional Body',
    registrationOption: 'Professional Body Registration',
    description: 'A professional body for teachers and educators.',
    contactPersonName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+234-801-234-5678',
    address: '123 Church Street, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    documents: [],
    status: 'rejected',
    submittedAt: '2024-01-05T11:20:00Z',
    reviewedAt: '2024-01-08T16:45:00Z',
    reviewedBy: 'admin-reviewer',
    rejectionReason: 'Incomplete documentation. Please provide constitution and financial statements.',
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-08T16:45:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const associationRegistrationService = {
  // Get association registration by group ID
  async getAssociationRegistration(groupId: string): Promise<AssociationRegistration | null> {
    await delay(500);
    return mockAssociationRegistrations.find(reg => reg.groupId === groupId) || null;
  },

  // Get all association registrations for an admin
  async getAssociationRegistrations(adminId: string): Promise<AssociationRegistration[]> {
    await delay(500);
    return mockAssociationRegistrations.filter(reg => reg.adminId === adminId);
  },

  // Create new association registration with files
  async createAssociationRegistration(
    groupId: string,
    groupName: string,
    adminId: string,
    adminName: string,
    formData: AssociationRegistrationFormData,
    files: File[] = []
  ): Promise<AssociationRegistration> {
    await delay(1000);
    
    // Process uploaded files
    const documents: AssociationDocument[] = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file), // In real app, this would be uploaded to cloud storage
      documentType: 'other' as AssociationDocument['documentType'],
      uploadedAt: new Date().toISOString(),
      description: `Uploaded file: ${file.name}`
    }));
    
    const newRegistration: AssociationRegistration = {
      id: `reg-${Date.now()}`,
      groupId,
      groupName,
      adminId,
      adminName,
      associationName: formData.associationName,
      associationType: formData.associationType,
      registrationOption: formData.registrationOption,
      description: formData.description,
      contactPersonName: formData.contactPersonName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      documents,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockAssociationRegistrations.push(newRegistration);
    return newRegistration;
  },

  // Create and submit registration in one action
  async createAndSubmitRegistration(
    groupId: string,
    groupName: string,
    adminId: string,
    adminName: string,
    formData: AssociationRegistrationFormData,
    files: File[] = []
  ): Promise<AssociationRegistration> {
    await delay(1500);
    
    // Process uploaded files
    const documents: AssociationDocument[] = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file), // In real app, this would be uploaded to cloud storage
      documentType: 'other' as AssociationDocument['documentType'],
      uploadedAt: new Date().toISOString(),
      description: `Uploaded file: ${file.name}`
    }));
    
    const newRegistration: AssociationRegistration = {
      id: `reg-${Date.now()}`,
      groupId,
      groupName,
      adminId,
      adminName,
      associationName: formData.associationName,
      associationType: formData.associationType,
      registrationOption: formData.registrationOption,
      description: formData.description,
      contactPersonName: formData.contactPersonName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      documents,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockAssociationRegistrations.push(newRegistration);
    return newRegistration;
  },

  // Update association registration
  async updateAssociationRegistration(
    registrationId: string,
    formData: Partial<AssociationRegistrationFormData>
  ): Promise<AssociationRegistration> {
    await delay(500);
    
    const index = mockAssociationRegistrations.findIndex(reg => reg.id === registrationId);
    if (index === -1) {
      throw new Error('Association registration not found');
    }

    const updatedRegistration = {
      ...mockAssociationRegistrations[index],
      ...formData,
      updatedAt: new Date().toISOString()
    };

    mockAssociationRegistrations[index] = updatedRegistration;
    return updatedRegistration;
  },

  // Submit association registration for review
  async submitAssociationRegistration(registrationId: string): Promise<AssociationRegistration> {
    await delay(500);
    
    const index = mockAssociationRegistrations.findIndex(reg => reg.id === registrationId);
    if (index === -1) {
      throw new Error('Association registration not found');
    }

    const updatedRegistration = {
      ...mockAssociationRegistrations[index],
      status: 'pending' as RegistrationStatus,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockAssociationRegistrations[index] = updatedRegistration;
    return updatedRegistration;
  },

  // Upload document
  async uploadDocument(
    registrationId: string,
    file: File,
    documentType: AssociationDocument['documentType'],
    description?: string
  ): Promise<AssociationDocument> {
    await delay(1000);
    
    const newDocument: AssociationDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file), // In real app, this would be uploaded to cloud storage
      documentType,
      uploadedAt: new Date().toISOString(),
      description
    };

    const index = mockAssociationRegistrations.findIndex(reg => reg.id === registrationId);
    if (index !== -1) {
      mockAssociationRegistrations[index].documents.push(newDocument);
      mockAssociationRegistrations[index].updatedAt = new Date().toISOString();
    }

    return newDocument;
  },

  // Delete document
  async deleteDocument(registrationId: string, documentId: string): Promise<void> {
    await delay(300);
    
    const index = mockAssociationRegistrations.findIndex(reg => reg.id === registrationId);
    if (index !== -1) {
      mockAssociationRegistrations[index].documents = mockAssociationRegistrations[index].documents.filter(
        doc => doc.id !== documentId
      );
      mockAssociationRegistrations[index].updatedAt = new Date().toISOString();
    }
  },

  // Update registration status (admin function)
  async updateRegistrationStatus(
    registrationId: string,
    status: RegistrationStatus,
    reviewedBy: string,
    rejectionReason?: string,
    notes?: string
  ): Promise<AssociationRegistration> {
    await delay(500);
    
    const index = mockAssociationRegistrations.findIndex(reg => reg.id === registrationId);
    if (index === -1) {
      throw new Error('Association registration not found');
    }

    const updatedRegistration = {
      ...mockAssociationRegistrations[index],
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      rejectionReason,
      notes,
      updatedAt: new Date().toISOString()
    };

    mockAssociationRegistrations[index] = updatedRegistration;
    return updatedRegistration;
  },

  // Super Admin functions
  // Get all association registrations (for Super Admin)
  async getAllAssociationRegistrations(): Promise<AssociationRegistration[]> {
    await delay(500);
    return [...mockAssociationRegistrations].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get association registration by ID (for Super Admin)
  async getAssociationRegistrationById(registrationId: string): Promise<AssociationRegistration | null> {
    await delay(300);
    return mockAssociationRegistrations.find(reg => reg.id === registrationId) || null;
  },

  // Filter registrations by status
  async getAssociationRegistrationsByStatus(status: RegistrationStatus): Promise<AssociationRegistration[]> {
    await delay(300);
    return mockAssociationRegistrations.filter(reg => reg.status === status);
  },

  // Filter registrations by date range
  async getAssociationRegistrationsByDateRange(
    startDate: string, 
    endDate: string
  ): Promise<AssociationRegistration[]> {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return mockAssociationRegistrations.filter(reg => {
      const regDate = new Date(reg.createdAt);
      return regDate >= start && regDate <= end;
    });
  },

  // Search registrations
  async searchAssociationRegistrations(query: string): Promise<AssociationRegistration[]> {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    
    return mockAssociationRegistrations.filter(reg => 
      reg.associationName.toLowerCase().includes(lowercaseQuery) ||
      reg.groupName.toLowerCase().includes(lowercaseQuery) ||
      reg.contactPersonName.toLowerCase().includes(lowercaseQuery) ||
      reg.contactEmail.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Export registrations to CSV
  async exportRegistrationsToCSV(registrations: AssociationRegistration[]): Promise<string> {
    await delay(1000);
    
    const headers = [
      'Association Name',
      'Group Name', 
      'Association Type',
      'Registration Option',
      'Contact Person',
      'Contact Email',
      'Contact Phone',
      'Status',
      'Date Submitted',
      'Date Reviewed',
      'Reviewed By',
      'Rejection Reason'
    ];

    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.associationName}"`,
        `"${reg.groupName}"`,
        `"${reg.associationType}"`,
        `"${reg.registrationOption}"`,
        `"${reg.contactPersonName}"`,
        `"${reg.contactEmail}"`,
        `"${reg.contactPhone}"`,
        `"${reg.status}"`,
        `"${reg.submittedAt || 'Not submitted'}"`,
        `"${reg.reviewedAt || 'Not reviewed'}"`,
        `"${reg.reviewedBy || 'N/A'}"`,
        `"${reg.rejectionReason || 'N/A'}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Send notification to Group Admin
  async sendNotificationToGroupAdmin(
    groupAdminId: string,
    registrationId: string,
    type: 'approved' | 'rejected',
    message: string
  ): Promise<void> {
    await delay(500);
    // In a real app, this would send email and in-app notifications
    console.log(`Notification sent to Group Admin ${groupAdminId}: ${message}`);
  }
};
