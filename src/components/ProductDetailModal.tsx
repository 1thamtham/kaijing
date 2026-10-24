import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  ShoppingCart,
  Zap,
  Store,
  CheckCircle,
  Plus,
  Minus,
  MessageCircle,
} from 'lucide-react';
import { INITIAL_REVIEWS } from '../mockData';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCheckoutOpen,
    setIsCartOpen,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  if (!selectedProduct) return null;

  const reviews = INITIAL_REVIEWS.filter(
    (r) => r.productId === selectedProduct.id
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-200">
            {/* Left: Product Image */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {selectedProduct.discountPercent > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-[#ee4d2d] font-black text-xs px-2 py-1 rounded-md shadow-xs">
                    ลด {selectedProduct.discountPercent}%
                  </div>
                )}
                {selectedProduct.isMall && (
                  <div className="absolute top-2 left-2 bg-[#d0011b] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                    Mall Official
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>รับประกันแท้ 100%</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>จัดส่งฟรี ทั่วประเทศ</span>
                </div>
              </div>
            </div>

            {/* Right: Purchase Module */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category & Status */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span className="font-medium text-[#ee4d2d]">
                    {selectedProduct.categoryName}
                  </span>
                  <span>·</span>
                  <span>รหัสสินค้า: {selectedProduct.id}</span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
                  {selectedProduct.title}
                </h1>

                {/* Rating & Sold Bar */}
                <div className="flex items-center gap-4 text-xs text-slate-600 pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center text-amber-500 font-bold">
                    <span className="underline mr-1 tabular-nums">
                      {selectedProduct.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="tabular-nums">
                    {selectedProduct.reviewCount || 120} การให้คะแนน
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="tabular-nums font-medium text-slate-700">
                    ขายแล้ว {selectedProduct.soldCount} ชิ้น
                  </span>
                </div>

                {/* Price Display Banner */}
                <div className="bg-orange-50/70 p-4 rounded-xl mb-4 border border-orange-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#ee4d2d] tabular-nums">
                      ฿{formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-sm text-slate-400 line-through tabular-nums">
                        ฿{formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                    {selectedProduct.discountPercent > 0 && (
                      <span className="text-xs bg-[#ee4d2d] text-white px-2 py-0.5 rounded font-bold">
                        ลด {selectedProduct.discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-orange-700 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-orange-500 text-orange-500" />
                    โค้ดส่วนลดและเหรียญ Coins สามารถใช้ได้ในขั้นตอนชำระเงิน
                  </p>
                </div>

                {/* Store Profile Card */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        {selectedProduct.sellerName}
                        {selectedProduct.sellerVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        คะแนนร้านค้า 4.9 · ตอบกลับแชทภายในไม่กี่ชั่วโมง
                      </p>
                    </div>
                  </div>
                  <button className="text-xs border border-[#ee4d2d] text-[#ee4d2d] hover:bg-orange-50 px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>แชทร้านค้า</span>
                  </button>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-semibold text-slate-700">
                    จำนวน:
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedProduct.stock, quantity + 1)
                        )
                      }
                      className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums">
                    (มีสินค้าทั้งหมด {selectedProduct.stock} ชิ้น)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock <= 0}
                  className="flex-1 py-3 px-4 bg-orange-100 hover:bg-orange-200 text-[#ee4d2d] border border-orange-300 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>เพิ่มไปยังรถเข็น</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedProduct.stock <= 0}
                  className="flex-1 py-3 px-4 bg-[#ee4d2d] hover:bg-[#d73f20] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>ซื้อสินค้าทันที</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description & Reviews */}
          <div className="mt-6">
            <div className="flex items-center gap-6 border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                รายละเอียดสินค้า
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                คะแนนและความคิดเห็น ({reviews.length > 0 ? reviews.length : selectedProduct.reviewCount || 1})
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="prose prose-sm text-slate-600 leading-relaxed max-w-none">
                <p>{selectedProduct.description}</p>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">หมวดหมู่:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedProduct.categoryName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">การจัดส่ง:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedProduct.isFreeShipping ? 'ส่งฟรี (Kerry / SPX)' : 'ค่าจัดส่ง ฿40'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">คลังสินค้า:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedProduct.stock} ชิ้น
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">วันที่ลงขาย:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedProduct.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">
                              {rev.userName}
                            </h5>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-amber-400 text-amber-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>
                      {rev.variant && (
                        <span className="inline-block mt-2 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                          ตัวเลือก: {rev.variant}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่ให้คะแนน!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
