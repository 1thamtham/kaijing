import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const { orders, currentUser, setCurrentView } = useShop();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Filter orders for current buyer (or show all if buyer placed multiple)
  const myOrders = orders.filter(
    (o) => o.buyerId === currentUser.id || currentUser.role === 'buyer'
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const copyTracking = (num: string, id: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="กลับไปหน้าหลัก"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              คำสั่งซื้อของฉัน (My Orders)
            </h1>
            <p className="text-xs text-slate-500">
              ติดตามสถานะการจัดส่ง ตรวจสอบเลขพัสดุ และประวัติการสั่งซื้อ
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('marketplace')}
          className="text-xs font-semibold text-[#ee4d2d] hover:underline cursor-pointer flex items-center gap-1"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ช้อปสินค้าต่อ</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-3 text-slate-300 stroke-1" />
            <h3 className="text-sm font-bold text-slate-700">ยังไม่มีคำสั่งซื้อ</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              คุณยังไม่ได้ทำการสั่งซื้อสินค้าในขณะนี้
            </p>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="px-6 py-2.5 bg-[#ee4d2d] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#d73f20] transition-colors cursor-pointer"
            >
              เลือกซื้อสินค้าเลย
            </button>
          </div>
        ) : (
          myOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs"
            >
              {/* Top Order Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">
                    เลขคำสั่งซื้อ: #{ord.orderNumber}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">{ord.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded font-medium text-[11px]">
                    ร้านค้า: {ord.sellerName}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      ord.shippingStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.shippingStatus === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {ord.shippingStatus === 'delivered'
                      ? '✓ จัดส่งสำเร็จแล้ว'
                      : ord.shippingStatus === 'shipped'
                      ? '🚚 อยู่ระหว่างขนส่ง'
                      : '📦 ร้านค้ากำลังเตรียมพัสดุ'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {ord.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.productImage}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.productTitle}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          จำนวน: {item.quantity} ชิ้น · ฿{formatPrice(item.price)}/ชิ้น
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums shrink-0">
                      ฿{formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tracking Timeline Bar */}
              <div className="p-3 bg-orange-50/40 rounded-xl border border-orange-100">
                <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#ee4d2d]" />
                    <span>ข้อมูลการขนส่ง: Siam Express / SPX Thailand</span>
                  </span>
                  {ord.trackingNumber && (
                    <div className="flex items-center gap-1 font-mono text-slate-700">
                      <span>เลขพัสดุ: {ord.trackingNumber}</span>
                      <button
                        onClick={() => copyTracking(ord.trackingNumber!, ord.id)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                        title="คัดลอกเลขพัสดุ"
                      >
                        {copiedId === ord.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Step indicator */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                    1. ชำระเงินแล้ว
                  </div>
                  <div
                    className={`p-1 rounded font-bold ${
                      ord.shippingStatus !== 'pending'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    2. กำลังเตรียมของ
                  </div>
                  <div
                    className={`p-1 rounded font-bold ${
                      ord.shippingStatus === 'shipped' || ord.shippingStatus === 'delivered'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    3. อยู่ระหว่างขนส่ง
                  </div>
                  <div
                    className={`p-1 rounded font-bold ${
                      ord.shippingStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    4. จัดส่งสำเร็จ
                  </div>
                </div>
              </div>

              {/* Order Footer & Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-2">
                <div className="text-[11px] text-slate-500">
                  <span>ชำระผ่าน: </span>
                  <span className="font-semibold text-slate-700 uppercase">
                    {ord.paymentMethod === 'promptpay'
                      ? 'สแกนพร้อมเพย์ (QR)'
                      : ord.paymentMethod === 'shopeepay'
                      ? 'ShopeePay Wallet'
                      : ord.paymentMethod === 'card'
                      ? 'บัตรเครดิต/เดบิต'
                      : 'เก็บเงินปลายทาง (COD)'}
                  </span>
                  <span> · ที่อยู่: {ord.buyerAddress}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[11px] mr-2">ยอดสุทธิ:</span>
                  <span className="text-base font-extrabold text-[#ee4d2d] tabular-nums">
                    ฿{formatPrice(ord.total)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
