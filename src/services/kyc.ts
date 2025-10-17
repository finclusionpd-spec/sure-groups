export const kycService = {
  async verifyBVN(bvn: string) {
    await new Promise(r => setTimeout(r, 2000));
    if (!/^\d{11}$/.test(bvn)) throw new Error('Invalid BVN. It should be 11 digits.');
    
    // Simulate CBN API response
    const mockBvnData = {
      matched: true,
      fullName: 'John Doe',
      dateOfBirth: '1990-01-15',
      phoneNumber: '+2348012345678',
      bankName: 'Access Bank',
      accountNumber: '1234567890'
    };
    
    return mockBvnData;
  },
  
  async verifyNIN(nin: string) {
    await new Promise(r => setTimeout(r, 2000));
    if (!/^\d{11}$/.test(nin)) throw new Error('Invalid NIN. It should be 11 digits.');
    
    // Simulate NIMC API response
    const mockNinData = {
      matched: true,
      fullName: 'John Doe',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      stateOfOrigin: 'Lagos',
      lga: 'Ikeja'
    };
    
    return mockNinData;
  },
  
  async verifyCAC(cac: string) {
    await new Promise(r => setTimeout(r, 2000));
    if (!/^[A-Z0-9-]{5,}$/.test(cac)) throw new Error('Invalid CAC number format.');
    
    // Simulate CAC API response
    const mockCacData = {
      businessName: 'Demo Ventures Ltd',
      status: 'ACTIVE',
      registrationDate: '2020-01-15',
      businessType: 'Limited Liability Company',
      address: '123 Business Street, Lagos'
    };
    
    return mockCacData;
  },

  async performLivenessCheck(photoData: string) {
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate face comparison with BVN photo
    const isMatch = Math.random() > 0.1; // 90% success rate for demo
    
    if (!isMatch) {
      throw new Error('Face comparison failed. Please ensure you are in a well-lit area and try again.');
    }
    
    return {
      verified: true,
      confidence: 0.95,
      message: 'Identity confirmed successfully!'
    };
  },

  async submitBusinessVerification(businessData: any) {
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate business verification process
    return {
      submitted: true,
      referenceId: `KYB-${Date.now()}`,
      status: 'pending',
      message: 'Business verification submitted successfully!'
    };
  }
};

