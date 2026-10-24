import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod, Order } from '../types';
import {
  X,
  MapPin,
  QrCode,
  Wallet,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  Copy,
  Check,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    appliedVoucher,
    useCoins,
    currentUser,
    placeOrder,
    setCurrentView,
  } = useShop();

  const [address, setAddress] = useState(
    '99/12 หมู่ 4 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110'
  );
  const [phone, setPhone] = useState(currentUser.phone || '089-123-4567');
  const [recipientName, setRecipientName] = useState(currentUser.name);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Credit Card Form state
  const [cardNumber, setCardNumber] = useState('4123 4567 8901 2345');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Copy tracking / ref helper
  const [copied, setCopied] = useState(false);

  if (!isCheckoutOpen) return null;

  const selectedItems = cart.filter((i) => i.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  let shippingFee = 40;

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

  if (selectedItems.some((item) => item.product.isFreeShipping)) {
    shippingFee = 0;
  }

  const coinsDiscount = useCoins ? Math.min(50, subtotal * 0.2) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee - coinsDiscount);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const handleConfirmPayment = () => {
    const fullAddressString = `${recipientName} | ${phone} | ${address}`;
    const order = placeOrder(fullAddressString, phone, paymentMethod);
    if (order) {
      setCompletedOrder(order);
    }
  };

  const handleFinish = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setCurrentView('my_orders');
  };

  const copyRef = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ee4d2d]" />
            <h2 className="text-base font-bold text-slate-800">
              {completedOrder ? 'ชำระเงินสำเร็จแล้ว' : 'ทำการสั่งซื้อและชำระเงิน (Checkout)'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedOrder(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {!completedOrder ? (
            <>
              {/* Shipping Address Section */}
              <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#ee4d2d] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#ee4d2d] uppercase tracking-wider mb-1">
                        ที่อยู่ในการจัดส่งสินค้า
                      </h4>
                      {isEditingAddress ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="ชื่อผู้รับ"
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded"
                          />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="เบอร์โทรศัพท์"
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded"
                          />
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="ที่อยู่ บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                            rows={2}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded"
                          />
                          <button
                            onClick={() => setIsEditingAddress(false)}
                            className="px-3 py-1 bg-[#ee4d2d] text-white rounded text-xs font-semibold"
                          >
                            บันทึกที่อยู่
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-700">
                          <p className="font-bold">
                            {recipientName} ({phone})
                          </p>
                          <p className="text-slate-500 mt-0.5">{address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-[#ee4d2d] font-semibold hover:underline shrink-0 ml-2"
                    >
                      เปลี่ยนที่อยู่
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  สินค้าที่สั่งซื้อ ({selectedItems.length} รายการ)
                </h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            จำนวน: {item.quantity} ชิ้น
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 tabular-nums shrink-0">
                        ฿{formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span>เลือกช่องทางการชำระเงิน</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (ระบบชำระเงินมาตรฐานปลอดภัยสูง)
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* PromptPay QR */}
                  <label
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'border-[#ee4d2d] bg-orange-50/40 text-slate-900 ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'promptpay'}
                      onChange={() => setPaymentMethod('promptpay')}
                      className="text-[#ee4d2d] accent-[#ee4d2d]"
                    />
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">สแกนพร้อมเพย์ (PromptPay)</p>
                      <p className="text-[11px] text-slate-400">QR Code จ่ายฟรีค่าธรรมเนียม</p>
                    </div>
                  </label>

                  {/* ShopeePay Wallet */}
                  <label
                    onClick={() => setPaymentMethod('shopeepay')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'shopeepay'
                        ? 'border-[#ee4d2d] bg-orange-50/40 text-slate-900 ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'shopeepay'}
                      onChange={() => setPaymentMethod('shopeepay')}
                      className="text-[#ee4d2d] accent-[#ee4d2d]"
                    />
                    <div className="p-2 bg-orange-50 text-[#ee4d2d] rounded-lg shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">ShopeePay / SiamWallet</p>
                      <p className="text-[11px] text-slate-400">
                        คงเหลือ ฿{formatPrice(currentUser.walletBalance)}
                      </p>
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#ee4d2d] bg-orange-50/40 text-slate-900 ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#ee4d2d] accent-[#ee4d2d]"
                    />
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">บัตรเครดิต / เดบิต</p>
                      <p className="text-[11px] text-slate-400">Visa, Mastercard, JCB</p>
                    </div>
                  </label>

                  {/* Cash on Delivery COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#ee4d2d] bg-orange-50/40 text-slate-900 ring-1 ring-[#ee4d2d]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#ee4d2d] accent-[#ee4d2d]"
                    />
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">เก็บเงินปลายทาง (COD)</p>
                      <p className="text-[11px] text-slate-400">จ่ายเงินเมื่อพัสดุถึงมือ</p>
                    </div>
                  </label>
                </div>

                {/* Extra fields based on selected method */}
                {paymentMethod === 'promptpay' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                    <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      {/* Stylized QR representation */}
                      <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-3 h-3 bg-white rounded-xs"></div>
                          <div className="w-3 h-3 bg-white rounded-xs"></div>
                        </div>
                        <div className="flex justify-center items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-xs"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-3 h-3 bg-white rounded-xs"></div>
                          <div className="w-2 h-2 bg-white rounded-xs"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-800">
                        พร้อมเพย์: บัญชี SiamShop Marketplace
                      </p>
                      <p className="text-slate-500">
                        รหัสอ้างอิง: <span className="font-mono font-bold text-slate-700">REF-{Date.now().toString().slice(-6)}</span>
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ระบบจะยืนยันยอดเงินให้อัตโนมัติทันทีที่กดยืนยันชำระ
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">
                        หมายเลขบัตรเครดิต / เดบิต
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">
                          วันหมดอายุ (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">
                          รหัสหลังบัตร (CVV)
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="w-full p-2 bg-white border border-slate-300 rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Breakdown Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>ยอดรวมสินค้า:</span>
                  <span className="tabular-nums">฿{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ค่าบริการจัดส่ง:</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'ส่งฟรี ฿0' : `฿${formatPrice(shippingFee)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#ee4d2d] font-semibold">
                    <span>ส่วนลดโค้ด ({appliedVoucher?.code}):</span>
                    <span className="tabular-nums">-฿{formatPrice(discount)}</span>
                  </div>
                )}
                {coinsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 font-semibold">
                    <span>ส่วนลดเหรียญ Coins:</span>
                    <span className="tabular-nums">-฿{formatPrice(coinsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>ยอดสุทธิที่ต้องชำระ:</span>
                  <span className="text-xl font-extrabold text-[#ee4d2d] tabular-nums">
                    ฿{formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Confirm Pay Button */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 px-4 bg-[#ee4d2d] hover:bg-[#d73f20] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>ยืนยันการสั่งซื้อและชำระเงิน</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Order Success View */
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                  คำสั่งซื้อสำเร็จและบันทึกข้อมูลแล้ว!
                </h3>
                <p className="text-xs text-slate-500">
                  ระบบได้ส่งข้อมูลคำสั่งซื้อไปยังร้านค้าเพื่อเตรียมการจัดส่งพัสดุเรียบร้อย
                </p>
              </div>

              {/* Order Info Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">หมายเลขคำสั่งซื้อ:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                    <span>{completedOrder.orderNumber}</span>
                    <button
                      onClick={() => copyRef(completedOrder.orderNumber)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="คัดลอกเลขคำสั่งซื้อ"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">วิธีการชำระเงิน:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {completedOrder.paymentMethod === 'promptpay'
                      ? 'สแกนพร้อมเพย์ (ชำระแล้ว)'
                      : completedOrder.paymentMethod === 'shopeepay'
                      ? 'ShopeePay (หักยอดแล้ว)'
                      : completedOrder.paymentMethod === 'card'
                      ? 'บัตรเครดิต (อนุมัติแล้ว)'
                      : 'เก็บเงินปลายทาง (รอชำระเมื่อส่งถึง)'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">หมายเลขพัสดุจำลอง:</span>
                  <span className="font-mono font-semibold text-orange-600">
                    {completedOrder.trackingNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">ยอดเงินชำระรวม:</span>
                  <span className="font-bold text-[#ee4d2d] text-base tabular-nums">
                    ฿{formatPrice(completedOrder.total)}
                  </span>
                </div>

                {/* Timeline status */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-600 mb-2">
                    สถานะการจัดส่ง:
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-emerald-600 font-bold">1. สั่งซื้อสำเร็จ</span>
                    <span>→</span>
                    <span className="text-orange-600 font-bold">2. ร้านค้าเตรียมพัสดุ</span>
                    <span>→</span>
                    <span>3. อยู่ระหว่างขนส่ง</span>
                    <span>→</span>
                    <span>4. ได้รับสินค้า</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 px-4 bg-[#ee4d2d] hover:bg-[#d73f20] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>ดูสถานะในคำสั่งซื้อของฉัน</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
