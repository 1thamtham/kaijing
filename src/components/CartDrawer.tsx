import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  Coins,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    toggleCartSelect,
    toggleSelectAllCart,
    vouchers,
    appliedVoucher,
    applyVoucher,
    useCoins,
    setUseCoins,
    setIsCheckoutOpen,
  } = useShop();

  if (!isCartOpen) return null;

  const allSelected = cart.length > 0 && cart.every((i) => i.selected);
  const selectedItems = cart.filter((i) => i.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  let shippingFee = selectedItems.length > 0 ? 40 : 0;

  if (appliedVoucher) {
    if (appliedVoucher.type === 'free_shipping') {
      shippingFee = 0;
    } else if (appliedVoucher.type === 'discount' && appliedVoucher.discountPercent) {
      discount = Math.min(
        (subtotal * appliedVoucher.discountPercent) / 100,
        appliedVoucher.maxDiscount || Infinity
      );
    } else if (appliedVoucher.discountAmount) {
      discount = appliedVoucher.discountAmount;
    }
  }

  // If any selected product has free shipping
  if (selectedItems.some((item) => item.product.isFreeShipping)) {
    shippingFee = 0;
  }

  const coinsDiscount = useCoins ? Math.min(50, subtotal * 0.2) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee - coinsDiscount);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ee4d2d]" />
            <h2 className="text-base font-bold text-slate-800">
              รถเข็นของคุณ ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
              <ShoppingBag className="w-16 h-16 mb-3 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-600">
                ไม่มีสินค้าในรถเข็น
              </p>
              <p className="text-xs text-slate-400 mt-1">
                เลือกสินค้าโดนใจแล้วเพิ่มลงในรถเข็นได้เลย
              </p>
            </div>
          ) : (
            <>
              {/* Select All Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleSelectAllCart(e.target.checked)}
                    className="w-4 h-4 text-[#ee4d2d] rounded accent-[#ee4d2d]"
                  />
                  <span>เลือกทั้งหมด ({cart.length})</span>
                </label>
                <span className="text-slate-400">
                  เลือก {selectedItems.length} ชิ้น
                </span>
              </div>

              {/* Items */}
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className={`p-3 rounded-xl border transition-all ${
                    item.selected
                      ? 'border-orange-200 bg-orange-50/20'
                      : 'border-slate-200 bg-white opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleCartSelect(item.productId)}
                      className="mt-1 w-4 h-4 text-[#ee4d2d] rounded accent-[#ee4d2d] cursor-pointer"
                    />

                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                        {item.product.title}
                      </h4>
                      <p className="text-xs font-bold text-[#ee4d2d] tabular-nums mb-2">
                        ฿{formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-md bg-white">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vouchers Section */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Tag className="w-4 h-4 text-[#ee4d2d]" />
                  <span>โค้ดส่วนลดของ SiamShop</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {vouchers.map((v) => {
                    const isApplied = appliedVoucher?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => applyVoucher(isApplied ? null : v)}
                        className={`w-full p-2 rounded-lg border text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isApplied
                            ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d] font-semibold'
                            : 'border-dashed border-slate-300 hover:border-orange-300 bg-white text-slate-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold uppercase tracking-wider block">
                            {v.code}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {v.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold">
                          {isApplied ? 'ยกเลิก' : 'ใช้โค้ด'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Coins Toggle */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>ใช้ 50 Coins เพื่อลด ฿50</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded accent-amber-500"
                  />
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า:</span>
                <span className="tabular-nums">฿{formatPrice(subtotal)}</span>
              </div>
              {shippingFee > 0 ? (
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง:</span>
                  <span className="tabular-nums">฿{formatPrice(shippingFee)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ค่าจัดส่ง:</span>
                  <span>ส่งฟรี ฿0</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[#ee4d2d] font-semibold">
                  <span>ส่วนลดจากโค้ด:</span>
                  <span className="tabular-nums">-฿{formatPrice(discount)}</span>
                </div>
              )}
              {coinsDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>ส่วนลดเหรียญ Coins:</span>
                  <span className="tabular-nums">-฿{formatPrice(coinsDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>ยอดชำระสุทธิ:</span>
                <span className="text-lg text-[#ee4d2d] tabular-nums">
                  ฿{formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedItems.length === 0}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                selectedItems.length > 0
                  ? 'bg-[#ee4d2d] hover:bg-[#d73f20] text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>สั่งซื้อสินค้า ({selectedItems.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
