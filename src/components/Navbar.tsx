import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Store,
  ShieldCheck,
  Package,
  User,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchUser,
    users,
    cart,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setActiveFilter,
    setSelectedCategoryId,
    setIsAuthModalOpen,
    logout,
  } = useShop();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('marketplace');
  };

  const trendingKeywords = ['หูฟังไร้สาย ANC', 'เซรั่ม Botanica', 'รองเท้าผ้าใบ 2026', 'โคมไฟมินิมอล', 'ชาไทยพรีเมียม'];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-[#ee4d2d] text-white/90 text-xs py-1.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">ศูนย์ช่วยเหลือ</span>
            <span className="text-white/40">|</span>
            <span className="hover:text-white transition-colors cursor-pointer">ดาวน์โหลดแอป SiamShop</span>
            <span className="text-white/40">|</span>
            <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              ช้อปคุ้ม ส่งฟรี 0 บาททุกออเดอร์
            </span>
          </div>

          {/* Quick Role & Account Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-black/20 hover:bg-black/30 rounded text-white font-medium transition-all"
                title="คลิกเพื่อสลับบทบาทหรือสลับบัญชีผู้ใช้"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  บทบาท: {currentUser.role === 'admin' ? '🛡️ ผู้ดูแลระบบ (Admin)' : currentUser.role === 'seller' ? '🏪 ร้านค้า (Seller)' : '👤 ผู้ซื้อ (Buyer)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {/* Role Dropdown */}
              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 text-xs"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500">
                    เลือกสลับบัญชีทดสอบระบบ:
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => switchUser(u.id)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-orange-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-orange-50 text-[#ee4d2d] font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <div className="truncate">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-500 capitalize">
                            {u.role === 'admin' ? 'แอดมินระบบ' : u.role === 'seller' ? 'ร้านค้าผู้ขาย' : 'ผู้ซื้อทั่วไป'}
                          </p>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="text-[10px] bg-orange-100 text-[#ee4d2d] px-1.5 py-0.5 rounded font-medium">
                          ใช้งานอยู่
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-white/40">|</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-800 rounded font-semibold transition-all shadow-xs cursor-pointer"
              title="เข้าสู่ระบบด้วยบัญชี Google / Gmail"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{currentUser.email.includes('@') ? currentUser.email : 'เข้าสู่ระบบด้วย Gmail'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <button
            onClick={() => {
              setCurrentView('marketplace');
              setSelectedCategoryId(null);
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="flex items-center gap-2 group text-left shrink-0"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#ee4d2d] shadow-sm group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight block leading-none">
                SiamShop
              </span>
              <span className="text-[10px] tracking-wider text-orange-100 uppercase font-medium">
                ตลาดออนไลน์ครบวงจร
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="w-full flex bg-white rounded-md p-1 shadow-sm focus-within:ring-2 focus-within:ring-orange-300">
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า เช่น หูฟัง, เสื้อผ้า, สกินแคร์, อุปกรณ์ไอที..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#ee4d2d] hover:bg-[#d73f20] text-white px-6 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-center shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trending Tags below search */}
            <div className="hidden md:flex items-center gap-3 mt-1.5 text-xs text-white/80">
              <span className="text-white/60">ยอดนิยม:</span>
              {trendingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setSearchQuery(kw);
                    setCurrentView('marketplace');
                  }}
                  className="hover:text-white hover:underline transition-colors truncate max-w-[120px]"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Action Links & Cart */}
          <div className="flex items-center gap-4 shrink-0">
            {/* My Orders Button */}
            <button
              onClick={() => setCurrentView('my_orders')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                currentView === 'my_orders'
                  ? 'bg-white text-[#ee4d2d] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>คำสั่งซื้อของฉัน</span>
            </button>

            {/* Seller Centre Button */}
            <button
              onClick={() => setCurrentView('seller_centre')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                currentView === 'seller_centre'
                  ? 'bg-white text-[#ee4d2d] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>ศูนย์ผู้ขาย</span>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={() => setCurrentView('admin_centre')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                currentView === 'admin_centre'
                  ? 'bg-white text-[#ee4d2d] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>จัดการระบบ (Admin)</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-white"
              title="เปิดรถเข็นสินค้า"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#ee4d2d] shadow-sm tabular-nums">
                  {cartTotalCount > 99 ? '99+' : cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
