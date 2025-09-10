export type MarketplaceCategory = 'overall' | 'discount' | 'service';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: MarketplaceCategory;
  images: string[];
  vendorName: string;
  discountPercent?: number;
  discountValidUntil?: string;
}

const CATALOG_KEY = 'sure-marketplace-catalog';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedCatalog(): MarketplaceItem[] {
  const existing = readJSON<MarketplaceItem[] | null>(CATALOG_KEY, null);
  if (existing && existing.length) return existing;
  const sample: MarketplaceItem[] = [
    {
      id: 'mp-001',
      name: 'Organic Honey - 500ml',
      description: 'Pure, locally sourced organic honey in a glass jar.',
      price: 25.99,
      currency: 'USD',
      category: 'overall',
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'Local Farmers Co-op',
      discountPercent: 10,
      discountValidUntil: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'mp-002',
      name: 'Handmade Crafts Set',
      description: 'Beautiful artisan crafts set made by community members.',
      price: 45.0,
      currency: 'USD',
      category: 'overall',
      images: [
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'Community Artisans',
    },
    {
      id: 'mp-003',
      name: 'Health Screening Package',
      description: 'Comprehensive health screening including blood tests and consultation.',
      price: 125.0,
      currency: 'USD',
      category: 'service',
      images: [
        'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'HealthCare Plus',
    },
    {
      id: 'mp-004',
      name: 'Digital Marketing Course',
      description: 'Hands-on course to master digital marketing fundamentals and tools.',
      price: 149.0,
      currency: 'USD',
      category: 'service',
      images: [
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'SkillUp Academy',
    },
    {
      id: 'mp-005',
      name: 'Community Savings Loan',
      description: 'Low-interest micro loan exclusively for group members.',
      price: 0,
      currency: 'USD',
      category: 'service',
      images: [
        'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'SureBanker Loans',
    },
    {
      id: 'mp-006',
      name: 'Member Discount Coupon - 20% Off',
      description: 'Limited-time coupon for selected marketplace items.',
      price: 0,
      currency: 'USD',
      category: 'discount',
      images: [
        'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=640',
      ],
      vendorName: 'SureGroups Marketplace',
      discountPercent: 20,
      discountValidUntil: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    },
  ];
  writeJSON(CATALOG_KEY, sample);
  return sample;
}

export function listAll(): MarketplaceItem[] {
  return seedCatalog();
}

export function listDiscounts(): MarketplaceItem[] {
  return seedCatalog().filter(i => i.category === 'discount' || (i.discountPercent && i.discountPercent > 0));
}

export function listServices(): MarketplaceItem[] {
  return seedCatalog().filter(i => i.category === 'service');
}

export function getItemById(id: string): MarketplaceItem | undefined {
  return seedCatalog().find(i => i.id === id);
}

