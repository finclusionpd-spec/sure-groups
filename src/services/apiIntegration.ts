import { APIKey } from '../types';

export interface APIIntegration {
  id: string;
  name: string;
  endpoint: string;
  method: 'REST' | 'GraphQL' | 'WebSocket';
  status: 'Active' | 'Inactive' | 'Error';
  requests: number;
  lastUsed: string;
  description?: string;
  apiKey?: string;
  rateLimit?: number;
  timeout?: number;
  retryAttempts?: number;
  environment: 'production' | 'staging' | 'development';
  createdAt: string;
  updatedAt: string;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: 'Payment' | 'Communication' | 'Storage' | 'Analytics' | 'Authentication' | 'Notification' | 'Other';
  status: 'Active' | 'Inactive' | 'Error';
  lastSync: string;
  description: string;
  provider: string;
  apiKey?: string;
  webhookUrl?: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  requestCount: number;
  errorCount: number;
  uptime: number;
  features: {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
  }[];
  configuration: {
    environment: 'production' | 'staging' | 'development';
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data for development
let apiIntegrations: APIIntegration[] = [
  {
    id: '1',
    name: 'User Management API',
    endpoint: '/api/users',
    method: 'REST',
    status: 'Active',
    requests: 12500,
    lastUsed: '2024-01-15 14:30:00',
    description: 'API for managing user accounts and profiles',
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
    environment: 'production',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Payment Processing API',
    endpoint: '/api/payments',
    method: 'REST',
    status: 'Active',
    requests: 8500,
    lastUsed: '2024-01-15 12:00:00',
    description: 'API for processing payments and transactions',
    rateLimit: 500,
    timeout: 60,
    retryAttempts: 5,
    environment: 'production',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '3',
    name: 'Analytics API',
    endpoint: '/api/analytics',
    method: 'GraphQL',
    status: 'Inactive',
    requests: 0,
    lastUsed: '2024-01-10 09:15:00',
    description: 'API for analytics and reporting',
    rateLimit: 200,
    timeout: 45,
    retryAttempts: 2,
    environment: 'staging',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  }
];

let thirdPartyIntegrations: ThirdPartyIntegration[] = [
  {
    id: '1',
    name: 'Stripe Payment Gateway',
    type: 'Payment',
    status: 'Active',
    lastSync: '2024-01-15 14:30:00',
    description: 'Payment processing integration',
    provider: 'Stripe',
    healthStatus: 'healthy',
    requestCount: 8500,
    errorCount: 12,
    uptime: 99.8,
    features: [
      { id: '1', name: 'Card Payments', enabled: true, description: 'Process credit card payments' },
      { id: '2', name: 'Bank Transfers', enabled: true, description: 'Process bank transfers' },
      { id: '3', name: 'Refunds', enabled: true, description: 'Process refunds' }
    ],
    configuration: {
      environment: 'production',
      rateLimit: 100,
      timeout: 30,
      retryAttempts: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'SendGrid Email Service',
    type: 'Communication',
    status: 'Active',
    lastSync: '2024-01-15 12:00:00',
    description: 'Email delivery service',
    provider: 'SendGrid',
    healthStatus: 'healthy',
    requestCount: 15000,
    errorCount: 5,
    uptime: 99.9,
    features: [
      { id: '1', name: 'Transactional Emails', enabled: true, description: 'Send transactional emails' },
      { id: '2', name: 'Marketing Emails', enabled: true, description: 'Send marketing campaigns' },
      { id: '3', name: 'Email Templates', enabled: true, description: 'Use email templates' }
    ],
    configuration: {
      environment: 'production',
      rateLimit: 600,
      timeout: 10,
      retryAttempts: 2
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '3',
    name: 'AWS S3 Storage',
    type: 'Storage',
    status: 'Inactive',
    lastSync: '2024-01-10 09:15:00',
    description: 'Cloud storage integration',
    provider: 'AWS',
    healthStatus: 'warning',
    requestCount: 0,
    errorCount: 0,
    uptime: 0,
    features: [
      { id: '1', name: 'File Upload', enabled: false, description: 'Upload files to S3' },
      { id: '2', name: 'File Download', enabled: false, description: 'Download files from S3' },
      { id: '3', name: 'File Management', enabled: false, description: 'Manage files in S3' }
    ],
    configuration: {
      environment: 'development',
      rateLimit: 1000,
      timeout: 60,
      retryAttempts: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiIntegrationService = {
  // API Integration Management
  async getAPIIntegrations(): Promise<APIIntegration[]> {
    await delay(500);
    return [...apiIntegrations];
  },

  async getAPIIntegration(id: string): Promise<APIIntegration | null> {
    await delay(300);
    return apiIntegrations.find(api => api.id === id) || null;
  },

  async createAPIIntegration(integration: Omit<APIIntegration, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIIntegration> {
    await delay(800);
    const newIntegration: APIIntegration = {
      ...integration,
      id: `api-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    apiIntegrations.push(newIntegration);
    return newIntegration;
  },

  async updateAPIIntegration(id: string, updates: Partial<APIIntegration>): Promise<APIIntegration | null> {
    await delay(600);
    const index = apiIntegrations.findIndex(api => api.id === id);
    if (index === -1) return null;
    
    apiIntegrations[index] = {
      ...apiIntegrations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return apiIntegrations[index];
  },

  async deleteAPIIntegration(id: string): Promise<boolean> {
    await delay(400);
    const index = apiIntegrations.findIndex(api => api.id === id);
    if (index === -1) return false;
    
    apiIntegrations.splice(index, 1);
    return true;
  },

  // Third Party Integration Management
  async getThirdPartyIntegrations(): Promise<ThirdPartyIntegration[]> {
    await delay(500);
    return [...thirdPartyIntegrations];
  },

  async getThirdPartyIntegration(id: string): Promise<ThirdPartyIntegration | null> {
    await delay(300);
    return thirdPartyIntegrations.find(integration => integration.id === id) || null;
  },

  async createThirdPartyIntegration(integration: Omit<ThirdPartyIntegration, 'id' | 'createdAt' | 'updatedAt'>): Promise<ThirdPartyIntegration> {
    await delay(800);
    const newIntegration: ThirdPartyIntegration = {
      ...integration,
      id: `tpi-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    thirdPartyIntegrations.push(newIntegration);
    return newIntegration;
  },

  async updateThirdPartyIntegration(id: string, updates: Partial<ThirdPartyIntegration>): Promise<ThirdPartyIntegration | null> {
    await delay(600);
    const index = thirdPartyIntegrations.findIndex(integration => integration.id === id);
    if (index === -1) return null;
    
    thirdPartyIntegrations[index] = {
      ...thirdPartyIntegrations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return thirdPartyIntegrations[index];
  },

  async deleteThirdPartyIntegration(id: string): Promise<boolean> {
    await delay(400);
    const index = thirdPartyIntegrations.findIndex(integration => integration.id === id);
    if (index === -1) return false;
    
    thirdPartyIntegrations.splice(index, 1);
    return true;
  },

  async testIntegration(id: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    await delay(1000);
    // Simulate test results
    const success = Math.random() > 0.2; // 80% success rate
    return {
      success,
      message: success ? 'Integration test successful' : 'Integration test failed',
      responseTime: Math.floor(Math.random() * 500) + 100
    };
  },

  async syncIntegration(id: string): Promise<{ success: boolean; message: string; lastSync: string }> {
    await delay(2000);
    const integration = thirdPartyIntegrations.find(i => i.id === id);
    if (!integration) {
      return { success: false, message: 'Integration not found', lastSync: '' };
    }

    const success = Math.random() > 0.1; // 90% success rate
    const lastSync = new Date().toISOString();
    
    if (success) {
      integration.lastSync = lastSync;
      integration.updatedAt = lastSync;
    }

    return {
      success,
      message: success ? 'Integration synced successfully' : 'Sync failed',
      lastSync: success ? lastSync : integration.lastSync
    };
  }
};



