// Developer Tools & Sandbox Management Service

export interface Developer {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  accessScope: string[];
  createdDate: string;
  expiryDate: string;
  status: 'Active' | 'Revoked' | 'Expired';
  lastUsed: string;
  requestCount: number;
  permissions: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }[];
}

export interface SandboxAccount {
  id: string;
  developerName: string;
  developerEmail: string;
  environmentType: 'API' | 'Webhook' | 'SDK' | 'Database' | 'Frontend';
  createdDate: string;
  expiryDate: string;
  status: 'Active' | 'Suspended' | 'Pending' | 'Expired';
  lastUsed: string;
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
  requestCount: number;
  errorCount: number;
  uptime: number;
  configuration: {
    environment: 'production' | 'staging' | 'development';
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
  };
}

export interface APILog {
  id: string;
  developerId: string;
  developerName: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  requestSize: number;
  responseSize: number;
}

export interface SandboxRequest {
  id: string;
  developerName: string;
  developerEmail: string;
  environmentType: string;
  reason: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
}

// Mock data
let developers: Developer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    apiKey: 'sk_prod_1234567890abcdef',
    accessScope: ['users:read', 'groups:read', 'transactions:read'],
    createdDate: '2024-01-01T00:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    status: 'Active',
    lastUsed: '2024-01-15T14:30:00Z',
    requestCount: 12500,
    permissions: [
      { id: '1', name: 'Read Users', description: 'Access user data', enabled: true },
      { id: '2', name: 'Read Groups', description: 'Access group data', enabled: true },
      { id: '3', name: 'Read Transactions', description: 'Access transaction data', enabled: true }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    apiKey: 'sk_dev_abcdef1234567890',
    accessScope: ['users:read', 'groups:read'],
    createdDate: '2024-01-10T00:00:00Z',
    expiryDate: '2024-06-30T23:59:59Z',
    status: 'Active',
    lastUsed: '2024-01-14T08:15:00Z',
    requestCount: 8500,
    permissions: [
      { id: '1', name: 'Read Users', description: 'Access user data', enabled: true },
      { id: '2', name: 'Read Groups', description: 'Access group data', enabled: true }
    ]
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    apiKey: 'sk_test_revoked123456',
    accessScope: ['users:read'],
    createdDate: '2024-01-05T00:00:00Z',
    expiryDate: '2024-01-08T16:45:00Z',
    status: 'Revoked',
    lastUsed: '2024-01-08T16:45:00Z',
    requestCount: 1200,
    permissions: [
      { id: '1', name: 'Read Users', description: 'Access user data', enabled: false }
    ]
  }
];

let sandboxAccounts: SandboxAccount[] = [
  {
    id: '1',
    developerName: 'John Smith',
    developerEmail: 'john.smith@example.com',
    environmentType: 'API',
    createdDate: '2024-01-01T00:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    status: 'Active',
    lastUsed: '2024-01-15T14:30:00Z',
    healthStatus: 'Healthy',
    requestCount: 12500,
    errorCount: 12,
    uptime: 99.8,
    configuration: {
      environment: 'development',
      rateLimit: 1000,
      timeout: 30,
      retryAttempts: 3
    }
  },
  {
    id: '2',
    developerName: 'Sarah Johnson',
    developerEmail: 'sarah.johnson@example.com',
    environmentType: 'Webhook',
    createdDate: '2024-01-10T00:00:00Z',
    expiryDate: '2024-06-30T23:59:59Z',
    status: 'Active',
    lastUsed: '2024-01-14T08:15:00Z',
    healthStatus: 'Healthy',
    requestCount: 8500,
    errorCount: 5,
    uptime: 99.9,
    configuration: {
      environment: 'development',
      rateLimit: 500,
      timeout: 60,
      retryAttempts: 5
    }
  },
  {
    id: '3',
    developerName: 'Mike Wilson',
    developerEmail: 'mike.wilson@example.com',
    environmentType: 'SDK',
    createdDate: '2024-01-05T00:00:00Z',
    expiryDate: '2024-01-08T16:45:00Z',
    status: 'Suspended',
    lastUsed: '2024-01-08T16:45:00Z',
    healthStatus: 'Warning',
    requestCount: 1200,
    errorCount: 25,
    uptime: 95.5,
    configuration: {
      environment: 'development',
      rateLimit: 200,
      timeout: 45,
      retryAttempts: 2
    }
  }
];

let apiLogs: APILog[] = [
  {
    id: '1',
    developerId: '1',
    developerName: 'John Smith',
    endpoint: '/api/users',
    method: 'GET',
    statusCode: 200,
    responseTime: 150,
    timestamp: '2024-01-15T14:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestSize: 1024,
    responseSize: 2048
  },
  {
    id: '2',
    developerId: '2',
    developerName: 'Sarah Johnson',
    endpoint: '/api/groups',
    method: 'POST',
    statusCode: 201,
    responseTime: 300,
    timestamp: '2024-01-15T14:25:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'PostmanRuntime/7.28.4',
    requestSize: 2048,
    responseSize: 1024
  }
];

let sandboxRequests: SandboxRequest[] = [
  {
    id: '1',
    developerName: 'Alice Brown',
    developerEmail: 'alice.brown@example.com',
    environmentType: 'API',
    reason: 'Testing payment integration',
    requestedDate: '2024-01-15T10:00:00Z',
    status: 'Pending'
  },
  {
    id: '2',
    developerName: 'Bob Davis',
    developerEmail: 'bob.davis@example.com',
    environmentType: 'Webhook',
    reason: 'Webhook testing for notifications',
    requestedDate: '2024-01-14T15:30:00Z',
    status: 'Approved',
    reviewedBy: 'Admin User',
    reviewedDate: '2024-01-14T16:00:00Z',
    comments: 'Approved for webhook testing'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const developerToolsSandboxService = {
  // Developer Tools Management
  async getDevelopers(): Promise<Developer[]> {
    await delay(500);
    return [...developers];
  },

  async getDeveloper(id: string): Promise<Developer | null> {
    await delay(300);
    return developers.find(dev => dev.id === id) || null;
  },

  async createDeveloper(developer: Omit<Developer, 'id' | 'createdDate' | 'lastUsed' | 'requestCount'>): Promise<Developer> {
    await delay(800);
    const newDeveloper: Developer = {
      ...developer,
      id: `dev-${Date.now()}`,
      createdDate: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      requestCount: 0
    };
    developers.push(newDeveloper);
    return newDeveloper;
  },

  async updateDeveloper(id: string, updates: Partial<Developer>): Promise<Developer | null> {
    await delay(600);
    const index = developers.findIndex(dev => dev.id === id);
    if (index === -1) return null;
    
    developers[index] = { ...developers[index], ...updates };
    return developers[index];
  },

  async revokeDeveloper(id: string): Promise<boolean> {
    await delay(400);
    const index = developers.findIndex(dev => dev.id === id);
    if (index === -1) return false;
    
    developers[index].status = 'Revoked';
    return true;
  },

  async regenerateAPIKey(id: string): Promise<string | null> {
    await delay(600);
    const index = developers.findIndex(dev => dev.id === id);
    if (index === -1) return null;
    
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    developers[index].apiKey = newKey;
    developers[index].lastUsed = new Date().toISOString();
    return newKey;
  },

  async getAPILogs(developerId?: string, limit: number = 100): Promise<APILog[]> {
    await delay(500);
    let filteredLogs = [...apiLogs];
    if (developerId) {
      filteredLogs = filteredLogs.filter(log => log.developerId === developerId);
    }
    return filteredLogs.slice(0, limit);
  },

  async exportDeveloperData(format: 'csv' | 'excel' = 'csv'): Promise<string> {
    await delay(1000);
    // Simulate file generation
    return `developer_data_${new Date().toISOString().split('T')[0]}.${format}`;
  },

  // Sandbox Management
  async getSandboxAccounts(): Promise<SandboxAccount[]> {
    await delay(500);
    return [...sandboxAccounts];
  },

  async getSandboxAccount(id: string): Promise<SandboxAccount | null> {
    await delay(300);
    return sandboxAccounts.find(sandbox => sandbox.id === id) || null;
  },

  async createSandboxAccount(sandbox: Omit<SandboxAccount, 'id' | 'createdDate' | 'lastUsed' | 'requestCount' | 'errorCount' | 'uptime'>): Promise<SandboxAccount> {
    await delay(800);
    const newSandbox: SandboxAccount = {
      ...sandbox,
      id: `sandbox-${Date.now()}`,
      createdDate: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      requestCount: 0,
      errorCount: 0,
      uptime: 100
    };
    sandboxAccounts.push(newSandbox);
    return newSandbox;
  },

  async updateSandboxAccount(id: string, updates: Partial<SandboxAccount>): Promise<SandboxAccount | null> {
    await delay(600);
    const index = sandboxAccounts.findIndex(sandbox => sandbox.id === id);
    if (index === -1) return null;
    
    sandboxAccounts[index] = { ...sandboxAccounts[index], ...updates };
    return sandboxAccounts[index];
  },

  async resetSandbox(id: string): Promise<boolean> {
    await delay(2000);
    const index = sandboxAccounts.findIndex(sandbox => sandbox.id === id);
    if (index === -1) return false;
    
    sandboxAccounts[index].requestCount = 0;
    sandboxAccounts[index].errorCount = 0;
    sandboxAccounts[index].lastUsed = new Date().toISOString();
    sandboxAccounts[index].healthStatus = 'Healthy';
    return true;
  },

  async suspendSandbox(id: string): Promise<boolean> {
    await delay(400);
    const index = sandboxAccounts.findIndex(sandbox => sandbox.id === id);
    if (index === -1) return false;
    
    sandboxAccounts[index].status = 'Suspended';
    return true;
  },

  async deleteSandbox(id: string): Promise<boolean> {
    await delay(400);
    const index = sandboxAccounts.findIndex(sandbox => sandbox.id === id);
    if (index === -1) return false;
    
    sandboxAccounts.splice(index, 1);
    return true;
  },

  async getSandboxRequests(): Promise<SandboxRequest[]> {
    await delay(500);
    return [...sandboxRequests];
  },

  async approveSandboxRequest(id: string, reviewedBy: string, comments?: string): Promise<boolean> {
    await delay(600);
    const index = sandboxRequests.findIndex(req => req.id === id);
    if (index === -1) return false;
    
    sandboxRequests[index].status = 'Approved';
    sandboxRequests[index].reviewedBy = reviewedBy;
    sandboxRequests[index].reviewedDate = new Date().toISOString();
    if (comments) sandboxRequests[index].comments = comments;
    
    return true;
  },

  async rejectSandboxRequest(id: string, reviewedBy: string, comments?: string): Promise<boolean> {
    await delay(600);
    const index = sandboxRequests.findIndex(req => req.id === id);
    if (index === -1) return false;
    
    sandboxRequests[index].status = 'Rejected';
    sandboxRequests[index].reviewedBy = reviewedBy;
    sandboxRequests[index].reviewedDate = new Date().toISOString();
    if (comments) sandboxRequests[index].comments = comments;
    
    return true;
  },

  async exportSandboxData(format: 'csv' | 'excel' = 'csv'): Promise<string> {
    await delay(1000);
    // Simulate file generation
    return `sandbox_data_${new Date().toISOString().split('T')[0]}.${format}`;
  },

  // Statistics
  async getDeveloperStats() {
    await delay(300);
    const totalDevelopers = developers.length;
    const activeDevelopers = developers.filter(d => d.status === 'Active').length;
    const revokedKeys = developers.filter(d => d.status === 'Revoked').length;
    const totalRequests = developers.reduce((sum, d) => sum + d.requestCount, 0);
    
    return {
      totalDevelopers,
      activeDevelopers,
      revokedKeys,
      totalRequests
    };
  },

  async getSandboxStats() {
    await delay(300);
    const totalSandboxes = sandboxAccounts.length;
    const activeSessions = sandboxAccounts.filter(s => s.status === 'Active').length;
    const pendingRequests = sandboxRequests.filter(r => r.status === 'Pending').length;
    const healthySandboxes = sandboxAccounts.filter(s => s.healthStatus === 'Healthy').length;
    
    return {
      totalSandboxes,
      activeSessions,
      pendingRequests,
      healthySandboxes
    };
  }
};



