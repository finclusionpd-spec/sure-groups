import React, { useMemo, useState } from 'react';
import { Search, Filter, Tag, ShoppingCart, ChevronRight } from 'lucide-react';
import { listAll, listDiscounts, listServices, MarketplaceItem } from '../../services/marketplace';

type Tab = 'overall' | 'discounts' | 'services';

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overall');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MarketplaceItem | null>(null);

  const data = useMemo(() => {
    switch (activeTab) {
      case 'discounts':
        return listDiscounts();
      case 'services':
        return listServices();
      default:
        return listAll();
    }
  }, [activeTab]);

  const filtered = data.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.vendorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketplace</h1>
          <p className="text-gray-600">Browse items, discounts, and professional services</p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <button onClick={() => setActiveTab('overall')} className={`px-3 py-1.5 rounded-lg text-sm ${activeTab==='overall'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Overall</button>
          <button onClick={() => setActiveTab('discounts')} className={`px-3 py-1.5 rounded-lg text-sm ${activeTab==='discounts'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Discounts & Offers</button>
          <button onClick={() => setActiveTab('services')} className={`px-3 py-1.5 rounded-lg text-sm ${activeTab==='services'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>Professional Services</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search the marketplace..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{filtered.length} results</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <img src={item.images[0]} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.discountPercent ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                    <Tag className="w-3 h-3 mr-1" />{item.discountPercent}% Off
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-gray-600 mt-1 flex-1">{item.description}</p>
              {item.discountValidUntil && (
                <p className="text-xs text-gray-500 mt-1">Valid until {new Date(item.discountValidUntil).toLocaleDateString()}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-gray-900 font-bold">{item.currency} {item.price.toFixed(2)}</div>
                <button onClick={()=>setSelected(item)} className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center">View <ChevronRight className="w-4 h-4 ml-1" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mt-6">
          <p className="text-gray-600">No items match your search.</p>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selected.name}</h3>
              <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <img src={selected.images[0]} alt={selected.name} className="w-full h-56 object-cover rounded-lg" />
              <div>
                <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
                <p className="text-sm text-gray-500 mb-2">Vendor: <span className="font-medium text-gray-700">{selected.vendorName}</span></p>
                {selected.discountPercent && (
                  <p className="text-sm text-red-700 mb-2">Discount: {selected.discountPercent}% (valid until {selected.discountValidUntil && new Date(selected.discountValidUntil).toLocaleDateString()})</p>
                )}
                <p className="text-xl font-bold text-gray-900 mb-3">{selected.currency} {selected.price.toFixed(2)}</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center"><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</button>
                  {selected.category === 'service' && (
                    <button className="px-4 py-2 border border-gray-300 rounded-lg">Request Service</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

