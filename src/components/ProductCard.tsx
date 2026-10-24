import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, Truck, ShoppingCart, ImageOff, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart } = useShop();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const formatSoldCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-orange-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1 text-slate-300" />
            <span className="text-[11px] font-medium text-slate-500 line-clamp-1">{product.title}</span>
          </div>
        )}

        {/* Mall / Official Badge */}
        {product.isMall && (
          <div className="absolute top-2 left-2 bg-[#d0011b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
            Mall
          </div>
        )}

        {/* Discount Flag Top Right */}
        {product.discountPercent > 0 && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-[#ee4d2d] text-[11px] font-extrabold px-1.5 py-1 rounded-bl-lg shadow-xs leading-none">
            -{product.discountPercent}%
          </div>
        )}

        {/* Free Shipping Tag */}
        {product.isFreeShipping && (
          <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <Truck className="w-3 h-3" />
            <span>ส่งฟรี</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtle Category & Tags */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
            <span className="truncate">{product.categoryName}</span>
            {product.isNewArrival && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-orange-600 font-medium">มาใหม่</span>
              </>
            )}
            {product.isBestSeller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-600 font-medium">ขายดี</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-[#ee4d2d] transition-colors mb-2">
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price & Original Price */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-base sm:text-lg font-bold text-[#ee4d2d] tabular-nums">
              ฿{formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ฿{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating, Sold Count & Quick Add */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-500 font-medium">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                <span className="tabular-nums">{product.rating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 tabular-nums">
                ขายแล้ว {formatSoldCount(product.soldCount)}
              </span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              title={product.stock > 0 ? 'เพิ่มลงรถเข็นทันที' : 'สินค้าหมด'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-50 text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white'
              }`}
            >
              {justAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
