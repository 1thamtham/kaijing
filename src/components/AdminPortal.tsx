import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Users,
  Package,
  DollarSign,
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Sparkles,
  Flame,
  Search,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    users,
    updateUserRole,
    toggleUserBlock,
    products,
    updateProduct,
    toggleProductStatus,
    deleteProduct,
    orders,
    setCurrentView,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'transactions'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Platform metrics
  const platformGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSellers = users.filter((u) => u.role === 'seller').length;
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.shopName && u.shopName.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="กลับไปหน้าตลาดมาร์เก็ตเพลส"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                ศูนย์ควบคุมผู้ดูแลระบบ (SiamShop Admin Console)
              </h1>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Super Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-500">
              กำหนดสิทธิ์บัญชีผู้ใช้ อนุมัติสินค้า ตรวจสอบธุรกรรมและการทำงานของระบบ
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            จัดการบัญชี & สิทธิ์ ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ตรวจสอบสินค้า ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-[#ee4d2d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ธุรกรรมทั้งระบบ ({orders.length})
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ยอดหมุนเวียนรวม (GMV)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            ฿{formatPrice(platformGMV)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            ธุรกรรมสำเร็จทั้งหมด {orders.length} รายการ
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ผู้ใช้งานทั้งหมดในระบบ</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {users.length} บัญชี
          </p>
          <span className="text-[11px] text-slate-500">
            ผู้ซื้อ {totalBuyers} · ร้านค้า {totalSellers}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">สินค้าที่วางขาย</span>
            <Package className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {products.length} รายการ
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            พร้อมจำหน่ายในตลาด
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">สถานะความปลอดภัย</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600">ปกติ 100%</p>
          <span className="text-[11px] text-slate-400">ระบบตรวจสอบอัตโนมัติ</span>
        </div>
      </div>

      {/* Tab 1: User Accounts & Role Permissions */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                จัดการบัญชีผู้ใช้และกำหนดสิทธิ์ (User Role & Permissions)
              </h3>
              <p className="text-xs text-slate-500">
                สามารถเปลี่ยนสิทธิ์ผู้ใช้เป็น ผู้ซื้อ, ร้านค้า หรือ แอดมิน รวมถึงการระงับ/ปลดล็อคบัญชี
              </p>
            </div>

            {/* User Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ใช้, อีเมล..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">ผู้ใช้งาน</th>
                  <th className="p-3">ข้อมูลติดต่อ</th>
                  <th className="p-3">วันที่ลงทะเบียน</th>
                  <th className="p-3">กำหนดสิทธิ์ (Role)</th>
                  <th className="p-3">สถานะบัญชี</th>
                  <th className="p-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          {u.shopName && (
                            <p className="text-[10px] text-orange-600 font-medium">
                              🏪 {u.shopName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="text-slate-700">{u.email}</p>
                      <p className="text-[11px] text-slate-400">{u.phone}</p>
                    </td>

                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {u.registeredAt}
                    </td>

                    {/* Role Permission Selector */}
                    <td className="p-3 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateUserRole(u.id, e.target.value as UserRole)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'seller'
                            ? 'bg-orange-50 text-[#ee4d2d] border-orange-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="buyer">👤 ผู้ซื้อ (Buyer)</option>
                        <option value="seller">🏪 ร้านค้า (Seller)</option>
                        <option value="admin">🛡️ ผู้ดูแลระบบ (Admin)</option>
                      </select>
                    </td>

                    {/* Account Status */}
                    <td className="p-3 whitespace-nowrap">
                      {u.isBlocked ? (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          ระงับการใช้งาน
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          ปกติ (Active)
                        </span>
                      )}
                    </td>

                    {/* Actions: Ban/Unban */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => toggleUserBlock(u.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 ml-auto cursor-pointer ${
                          u.isBlocked
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {u.isBlocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>ปลดล็อค</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>ระงับบัญชี</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Product Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                ตรวจสอบและดูแลสินค้าในมาร์เก็ตเพลส (Product Moderation)
              </h3>
              <p className="text-xs text-slate-500">
                อนุมัติสินค้า ติดดาวสินค้าแนะนำ และตรวจสอบสินค้าที่วางขาย
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า, ร้านค้า..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">สินค้า</th>
                  <th className="p-3">ร้านค้า</th>
                  <th className="p-3">ราคา</th>
                  <th className="p-3">สถานะอนุมัติ</th>
                  <th className="p-3">แท็กพิเศษ</th>
                  <th className="p-3 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <img
                          src={p.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.categoryName} · สต็อก {p.stock} ชิ้น
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap text-slate-700 font-medium">
                      {p.sellerName}
                    </td>

                    <td className="p-3 whitespace-nowrap font-bold text-[#ee4d2d] tabular-nums">
                      ฿{formatPrice(p.price)}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {p.status === 'approved' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          ✓ อนุมัติแล้ว
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          รอการตรวจสอบ
                        </span>
                      )}
                    </td>

                    {/* Special Flags Toggle */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateProduct(p.id, { isBestSeller: !p.isBestSeller })
                          }
                          className={`p-1 rounded text-[10px] font-semibold flex items-center gap-1 border transition-colors ${
                            p.isBestSeller
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="สลับสถานะสินค้าขายดี"
                        >
                          <Flame className="w-3 h-3" />
                          <span>ขายดี</span>
                        </button>

                        <button
                          onClick={() =>
                            updateProduct(p.id, { isNewArrival: !p.isNewArrival })
                          }
                          className={`p-1 rounded text-[10px] font-semibold flex items-center gap-1 border transition-colors ${
                            p.isNewArrival
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="สลับสถานะสินค้ามาใหม่"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>มาใหม่</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== 'approved' ? (
                          <button
                            onClick={() => toggleProductStatus(p.id, 'approved')}
                            className="p-1.5 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200"
                            title="อนุมัติสินค้า"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleProductStatus(p.id, 'rejected')}
                            className="p-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                            title="ระงับการขาย"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          title="ลบออกจากระบบถาวร"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">
              บันทึกธุรกรรมและการชำระเงินทั้งแพลตฟอร์ม (Platform Financial Records)
            </h3>
            <p className="text-xs text-slate-500">
              ตรวจสอบข้อมูลการจ่ายเงิน บัญชีผู้ซื้อ ร้านค้า และสถานะจัดส่ง
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-800">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{ord.createdAt}</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase font-mono font-bold text-[10px]">
                      {ord.paymentMethod}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    ผู้ซื้อ: <span className="font-semibold">{ord.buyerName}</span> ·
                    ร้านค้า: <span className="font-semibold">{ord.sellerName}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] truncate">
                    สินค้า: {ord.items.map((i) => `${i.productTitle} (${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="text-right sm:shrink-0">
                  <p className="text-base font-extrabold text-[#ee4d2d] tabular-nums">
                    ฿{formatPrice(ord.total)}
                  </p>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    ชำระเงินสำเร็จ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
