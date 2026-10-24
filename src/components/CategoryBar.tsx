import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Folder,
  FolderOpen,
  Shirt,
  Smartphone,
  Laptop,
  Sparkles,
  Home,
  Utensils,
  Dumbbell,
  Car,
  LayoutGrid,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Shirt,
  Smartphone,
  Laptop,
  Sparkles,
  Home,
  Utensils,
  Dumbbell,
  Car,
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId, products } = useShop();

  const getCategoryCount = (catId: string) => {
    return products.filter((p) => p.categoryId === catId && p.status === 'approved').length;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs p-4 mb-6">
      {/* Category Section Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 text-[#ee4d2d] rounded-lg">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              หมวดหมู่สินค้า (Folder Categories)
            </h2>
            <p className="text-xs text-slate-500">
              เลือกดูสินค้าตามโฟลเดอร์หมวดหมู่ที่ต้องการ
            </p>
          </div>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => setSelectedCategoryId(null)}
            className="text-xs font-medium text-[#ee4d2d] hover:underline cursor-pointer"
          >
            ล้างตัวกรอง (แสดงทั้งหมด)
          </button>
        )}
      </div>

      {/* Folder & Text Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2.5">
        {/* All Categories Folder */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-orange-50/80 border-[#ee4d2d] text-[#ee4d2d] shadow-xs ring-1 ring-[#ee4d2d]/30'
              : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/70 hover:border-slate-300'
          }`}
        >
          <div className="relative mb-2">
            <LayoutGrid className="w-6 h-6 text-slate-600" />
          </div>
          <span className="text-xs font-semibold leading-tight line-clamp-1">
            หมวดหมู่ทั้งหมด
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
            {products.length} รายการ
          </span>
        </button>

        {/* Individual Folder Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const IconComp = iconMap[cat.iconName] || Folder;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
              className={`group flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-orange-50/80 border-[#ee4d2d] text-[#ee4d2d] shadow-xs ring-1 ring-[#ee4d2d]/30'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50/30 hover:border-orange-200'
              }`}
            >
              {/* Folder tab design accent */}
              <div
                className={`w-8 h-1 rounded-full mb-1.5 transition-colors ${
                  isSelected ? 'bg-[#ee4d2d]' : 'bg-slate-200 group-hover:bg-orange-300'
                }`}
              />

              <div className="flex items-center gap-1 mb-1.5">
                {isSelected ? (
                  <FolderOpen className="w-4 h-4 text-[#ee4d2d]" />
                ) : (
                  <Folder className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                )}
                <IconComp className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
              </div>

              <span className="text-xs font-medium leading-tight line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                {count} รายการ
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
