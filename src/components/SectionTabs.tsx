import React from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, Sparkles, Zap, Grid, ArrowUpDown } from 'lucide-react';

interface SectionTabsProps {
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price_asc' | 'price_desc' | 'rating') => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({ sortBy, setSortBy }) => {
  const { activeFilter, setActiveFilter, products } = useShop();

  const bestSellerCount = products.filter((p) => p.isBestSeller && p.status === 'approved').length;
  const newArrivalCount = products.filter((p) => p.isNewArrival && p.status === 'approved').length;
  const flashDealCount = products.filter((p) => p.discountPercent >= 40 && p.status === 'approved').length;

  return (
    <div id="products-section" className="bg-white rounded-xl border border-slate-200/80 p-3 mb-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>สินค้าทั้งหมด</span>
            <span className="opacity-80 tabular-nums">({products.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('best_seller')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'best_seller'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>สินค้าขายดี</span>
            <span className="opacity-80 tabular-nums">({bestSellerCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('new_arrival')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'new_arrival'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>สินค้ามาใหม่</span>
            <span className="opacity-80 tabular-nums">({newArrivalCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('flash_deal')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'flash_deal'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span>ดีลเด็ดลดแรง 40%+</span>
            <span className="opacity-80 tabular-nums">({flashDealCount})</span>
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            เรียงตาม:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
          >
            <option value="popular">ความนิยมสูงสุด</option>
            <option value="price_asc">ราคา: ต่ำไปสูง</option>
            <option value="price_desc">ราคา: สูงไปต่ำ</option>
            <option value="rating">คะแนนรีวิวสูงสุด</option>
          </select>
        </div>
      </div>
    </div>
  );
};
