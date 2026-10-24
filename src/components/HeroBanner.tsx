import React from 'react';
import { useShop } from '../context/ShopContext';
import { Truck, ShieldCheck, Tag, CreditCard, ChevronRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setActiveFilter } = useShop();

  return (
    <div className="mb-6 space-y-4">
      {/* Main Campaign Hero Split */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[280px]">
          {/* Left Text / Action Content */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold w-fit mb-3">
              <span>🔥 มหกรรมช้อปปิ้งใหญ่ ประจำสัปดาห์</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              ลดสนั่นตลาด สูงสุด 50%
              <br />
              <span className="text-yellow-200">ส่งฟรีทุกออเดอร์ ไม่มีขั้นต่ำ</span>
            </h1>

            <p className="text-sm text-orange-100 max-w-lg mb-6 leading-relaxed">
              แหล่งรวมสินค้าคุณภาพจากผู้ขายทั่วประเทศ ช้อปมั่นใจ ปลอดภัยด้วยระบบชำระเงินพร้อมเพย์ และระบบคุ้มครองผู้ซื้อ 100%
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveFilter('flash_deal');
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-white text-[#ee4d2d] rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>ช้อปดีลเด็ดประจำวัน</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('seller_centre')}
                className="px-5 py-2.5 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white border border-white/30 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
              >
                เปิดร้านค้าลงขายฟรี
              </button>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-6 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_marketplace_sale_1792829042486.jpg"
              alt="SiamShop Mega Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-orange-600/70 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Feature Strip (4 Key Guarantees) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">ส่งฟรี 0 บาท</h4>
            <p className="text-[11px] text-slate-500">ไม่มีขั้นต่ำ ทั่วไทย</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">การันตีของแท้</h4>
            <p className="text-[11px] text-slate-500">คืนเงิน 2 เท่าหากไม่แท้</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">โค้ดลดสูงสุด 50%</h4>
            <p className="text-[11px] text-slate-500">เก็บโค้ดได้ทุกวัน</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">พร้อมเพย์ / COD</h4>
            <p className="text-[11px] text-slate-500">ชำระสะดวก ปลอดภัย 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
