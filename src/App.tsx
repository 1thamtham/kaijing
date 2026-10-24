import React, { useState, useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { SectionTabs } from './components/SectionTabs';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { SellerPortal } from './components/SellerPortal';
import { AdminPortal } from './components/AdminPortal';
import { MyOrdersView } from './components/MyOrdersView';
import { ToastContainer } from './components/ToastContainer';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  QrCode,
  Wallet,
} from 'lucide-react';

const MarketplaceContent: React.FC = () => {
  const {
    currentView,
    products,
    selectedCategoryId,
    searchQuery,
    activeFilter,
    setSelectedCategoryId,
    setSearchQuery,
  } = useShop();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === 'approved');

    // Category filter
    if (selectedCategoryId) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
      );
    }

    // Section Tabs filter
    if (activeFilter === 'best_seller') {
      result = result.filter((p) => p.isBestSeller);
    } else if (activeFilter === 'new_arrival') {
      result = result.filter((p) => p.isNewArrival);
    } else if (activeFilter === 'flash_deal') {
      result = result.filter((p) => p.discountPercent >= 40);
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return b.soldCount - a.soldCount;
    });
  }, [products, selectedCategoryId, searchQuery, activeFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Promotional Campaign Hero */}
            <HeroBanner />

            {/* Folder-styled Category Selection */}
            <CategoryBar />

            {/* Products Filter Tabs (สินค้าขายดี, สินค้ามาใหม่, ดีลเด็ดลดแรง) */}
            <SectionTabs sortBy={sortBy} setSortBy={setSortBy} />

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 mb-10">
                <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-slate-300 stroke-1" />
                <h3 className="text-base font-bold text-slate-800">
                  ไม่พบสินค้าที่ตรงกับการค้นหา
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นดูนะ
                </p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 bg-[#ee4d2d] text-white rounded-xl text-xs font-bold hover:bg-[#d73f20] transition-colors cursor-pointer"
                >
                  ดูสินค้าทั้งหมดในระบบ
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'seller_centre' && <SellerPortal />}

        {currentView === 'admin_centre' && <AdminPortal />}

        {currentView === 'my_orders' && <MyOrdersView />}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <ToastContainer />

      {/* Thai Marketplace Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
            {/* Col 1 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                ศูนย์ช่วยเหลือ & ข้อมูล
              </h4>
              <ul className="space-y-2 text-slate-500">
                <li className="hover:text-[#ee4d2d] cursor-pointer">คำถามที่พบบ่อย (FAQ)</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">วิธีการสั่งซื้อสินค้า</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">วิธีการชำระเงิน พร้อมเพย์</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">การคืนเงินและคืนสินค้า</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">ติดต่อฝ่ายสนับสนุนลูกค้า</li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                เกี่ยวกับ SiamShop
              </h4>
              <ul className="space-y-2 text-slate-500">
                <li className="hover:text-[#ee4d2d] cursor-pointer">เกี่ยวกับเรา</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">นโยบายความเป็นส่วนตัว</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">ข้อกำหนดการใช้งาน</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">ร่วมงานกับเรา</li>
                <li className="hover:text-[#ee4d2d] cursor-pointer">SiamMall ร้านค้าทางการ</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                วิธีการชำระเงินที่รองรับ
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 bg-slate-50">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>พร้อมเพย์</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 bg-slate-50">
                  <Wallet className="w-4 h-4 text-orange-600" />
                  <span>ShopeePay</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 bg-slate-50">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Visa / บัตรเครดิต</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 bg-slate-50">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>เก็บเงินปลายทาง</span>
                </div>
              </div>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                บริการจัดส่งพัสดุ
              </h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                ร่วมมือกับผู้ให้บริการจัดส่งชั้นนำทั่วประเทศไทย เช่น SPX Express, Flash Express, Kerry Express เพื่อส่งสินค้าถึงมือคุณอย่างรวดเร็วและปลอดภัย
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  คุ้มครองผู้ซื้อ 100%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <p>© 2026 SiamShop Marketplace Thailand. สงวนลิขสิทธิ์ทั้งหมด.</p>
            <div className="flex items-center gap-4">
              <span>ประเทศไทย (TH)</span>
              <span>·</span>
              <span>ภาษาไทย</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MarketplaceContent />
    </ShopProvider>
  );
}
