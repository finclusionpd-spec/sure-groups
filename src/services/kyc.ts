export const kycService = {
  async verifyBVN(bvn: string) {
    await new Promise(r => setTimeout(r, 600));
    if (!/^\d{11}$/.test(bvn)) throw new Error('Invalid BVN. It should be 11 digits.');
    return { matched: true, name: 'Demo User', dob: '1990-01-01' };
  },
  async verifyNIN(nin: string) {
    await new Promise(r => setTimeout(r, 600));
    if (!/^\d{11}$/.test(nin)) throw new Error('Invalid NIN. It should be 11 digits.');
    return { matched: true };
  },
  async verifyCAC(cac: string) {
    await new Promise(r => setTimeout(r, 600));
    if (!/^[A-Z0-9-]{5,}$/.test(cac)) throw new Error('Invalid CAC number.');
    return { businessName: 'Demo Ventures Ltd', status: 'ACTIVE' };
  },
};

