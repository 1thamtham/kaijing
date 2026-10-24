import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Store,
  Package,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Truck,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  ArrowLeft,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

export const SellerPortal: React.FC = () => {
  const {
    currentUser,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    setCurrentView,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'orders' | 'finance'>('products');

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || 'cat-gadgets');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/product_gadget_headphones_1792829043321.jpg');
  const [newIsFreeShipping, setNewIsFreeShipping] = useState(true);
  const [newIsNewArrival, setNewIsNewArrival] = useState(true);

  // Edit Product Modal State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Tracking number input state
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Preset images for sellers to choose conveniently
  const presetImages = [
    { label: 'หูฟัง ANC พรีเมียม', url: '/src/assets/images/product_gadget_headphones_1792829043321.jpg' },
    { label: 'เซรั่มสกินแคร์ Botanica', url: '/src/assets/images/product_beauty_skincare_1792829044670.jpg' },
    { label: 'รองเท้าผ้าใบสนีกเกอร์', url: '/src/assets/images/product_fashion_sneaker_1792829044753.jpg' },
    { label: 'โคมไฟตั้งโต๊ะมินิมอล', url: '/src/assets/images/product_home_lamp_1792829045246.jpg' },
    { label: 'ชาไทยโบราณคัดพิเศษ', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
    { label: 'เมาส์เกมมิ่ง Ultralight', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80' },
  ];

  // Filter products by seller
  const sellerProducts = products.filter(
    (p) => p.sellerId === currentUser.id || currentUser.role === 'seller'
  );

  // Calculate seller metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = sellerProducts.reduce((sum, p) => sum + p.soldCount, 0);
  const pendingOrdersCount = orders.filter((o) => o.shippingStatus === 'processing' || o.shippingStatus === 'pending').length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newImageUrl) return;

    const categoryObj = categories.find((c) => c.id === newCategoryId);
    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : priceNum;
    const discountPercent =
      origPriceNum > priceNum
        ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
        : 0;

    addProduct({
      title: newTitle,
      categoryId: newCategoryId,
      categoryName: categoryObj ? categoryObj.name : 'สินค้าทั่วไป',
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent,
      stock: parseInt(newStock) || 10,
      description: newDescription || 'รายละเอียดสินค้าคุณภาพจากร้านค้า SiamShop',
      image: newImageUrl,
      gallery: [newImageUrl],
      sellerId: currentUser.id,
      sellerName: currentUser.shopName || currentUser.name,
      sellerVerified: true,
      isMall: false,
      isFreeShipping: newIsFreeShipping,
      isNewArrival: newIsNewArrival,
      isBestSeller: false,
    });

    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
    setActiveTab('products');
  };

  const handleSaveEdit = (productId: string) => {
    const updates: any = {};
    if (editPrice) updates.price = parseFloat(editPrice);
    if (editStock) updates.stock = parseInt(editStock);
    updateProduct(productId, updates);
    setEditingProductId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner / Store Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="กลับไปหน้าตลาดมาร์เก็ตเพลส"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                {currentUser.shopName || `ศูนย์ผู้ขายของ ${currentUser.name}`}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ร้านค้าได้รับการรับรอง
              </span>
            </div>
            <p className="text-xs text-slate-500">
              SiamShop Seller Centre — ระบบจัดการร้านค้า ลงขาย และคำสั่งซื้อ
            </p>
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#ee4d2d] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            สินค้าของฉัน ({sellerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'add'
                ? 'bg-[#ee4d2d] text-white'
                : 'bg-orange-50 text-[#ee4d2d] hover:bg-orange-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ เพิ่มสินค้าใหม่</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#ee4d2d] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            คำสั่งซื้อ ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-[#ee4d2d] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            รายได้ & กระเป๋าเงิน
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ยอดขายรวมทั้งหมด</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            ฿{formatPrice(totalSalesRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            +18.4% จากเดือนที่แล้ว
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">คำสั่งซื้อรอดำเนินการ</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {pendingOrdersCount} รายการ
          </p>
          <span className="text-[11px] text-orange-600 font-medium">
            ต้องจัดส่งภายใน 24 ชม.
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">สินค้าทั้งหมดในร้าน</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {sellerProducts.length} รายการ
          </p>
          <span className="text-[11px] text-slate-400">สถานะพร้อมขายทุกชิ้น</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">จำนวนชิ้นที่ขายแล้ว</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {totalItemsSold} ชิ้น
          </p>
          <span className="text-[11px] text-slate-400">คะแนนร้านค้า 4.9 ดาว</span>
        </div>
      </div>

      {/* Tab 1: My Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              รายการสินค้าของร้าน ({sellerProducts.length})
            </h3>
            <button
              onClick={() => setActiveTab('add')}
              className="text-xs bg-[#ee4d2d] hover:bg-[#d73f20] text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>เพิ่มสินค้าใหม่</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">สินค้า</th>
                  <th className="p-3">หมวดหมู่</th>
                  <th className="p-3">ราคาขาย</th>
                  <th className="p-3">คลังสินค้า</th>
                  <th className="p-3">ยอดขายแล้ว</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellerProducts.map((p) => {
                  const isEditing = editingProductId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5 max-w-xs">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <span className="font-semibold text-slate-800 line-clamp-2">
                            {p.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">{p.categoryName}</td>
                      <td className="p-3 whitespace-nowrap font-bold text-[#ee4d2d] tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            placeholder={p.price.toString()}
                            className="w-20 p-1 border border-orange-300 rounded text-xs bg-white"
                          />
                        ) : (
                          `฿${formatPrice(p.price)}`
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            placeholder={p.stock.toString()}
                            className="w-16 p-1 border border-orange-300 rounded text-xs bg-white"
                          />
                        ) : (
                          `${p.stock} ชิ้น`
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap tabular-nums">
                        {p.soldCount} ชิ้น
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-medium">
                          อนุมัติแล้ว
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              title="บันทึก"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                              title="ยกเลิก"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProductId(p.id);
                                setEditPrice(p.price.toString());
                                setEditStock(p.stock.toString());
                              }}
                              className="text-slate-500 hover:text-blue-600 p-1"
                              title="แก้ไขราคาและจำนวนสต็อก"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-slate-500 hover:text-red-600 p-1"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Add New Product Form */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl">
          <div className="pb-4 mb-6 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-800">
              ลงขายสินค้าใหม่ (Create Product Listing)
            </h3>
            <p className="text-xs text-slate-500">
              กรอกข้อมูลสินค้าเพื่อเริ่มเปิดขายใน SiamShop Marketplace ได้ทันที
            </p>
          </div>

          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ชื่อสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ระบุชื่อสินค้า แบรนด์ รุ่น คุณสมบัติเด่น..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  หมวดหมู่สินค้า <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  จำนวนในคลังสินค้า (Stock) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Price & Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ราคาขาย (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="เช่น 890"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 font-bold text-[#ee4d2d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ราคาเต็มก่อนลด (บาท)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="เช่น 1290 (สำหรับแสดงส่วนลด %)"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Product Image Selection */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                รูปภาพสินค้า <span className="text-red-500">*</span>
              </label>
              <div className="mb-2">
                <span className="text-[11px] text-slate-500 block mb-1.5">
                  เลือกจากรูปภาพสตูดิโอคุณภาพสูง (Generated Studio Images):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presetImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewImageUrl(img.url)}
                      className={`p-1.5 rounded-lg border flex items-center gap-2 text-left transition-all ${
                        newImageUrl === img.url
                          ? 'border-[#ee4d2d] bg-orange-50 ring-1 ring-[#ee4d2d]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-9 h-9 rounded object-cover shrink-0"
                      />
                      <span className="text-[11px] font-medium truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="หรือใส่ลิงก์รูปภาพ URL เอง"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                รายละเอียดสินค้า
              </label>
              <textarea
                rows={3}
                placeholder="ระบุจุดเด่น วิธีการใช้งาน การรับประกันสินค้า..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={newIsFreeShipping}
                  onChange={(e) => setNewIsFreeShipping(e.target.checked)}
                  className="w-4 h-4 text-[#ee4d2d] rounded accent-[#ee4d2d]"
                />
                <span>ร่วมแคมเปญส่งฟรี 0 บาท</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={newIsNewArrival}
                  onChange={(e) => setNewIsNewArrival(e.target.checked)}
                  className="w-4 h-4 text-[#ee4d2d] rounded accent-[#ee4d2d]"
                />
                <span>ติดป้าย "สินค้ามาใหม่"</span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#ee4d2d] hover:bg-[#d73f20] text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                บันทึกและลงขายทันที
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Order Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">
              คำสั่งซื้อของลูกค้า ({orders.length})
            </h3>
            <p className="text-xs text-slate-500">
              อัปเดตสถานะและกรอกเลขพัสดุจัดส่งเพื่อให้ลูกค้าตรวจสอบได้แบบเรียลไทม์
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-800">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{ord.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        ord.shippingStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.shippingStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {ord.shippingStatus === 'delivered'
                        ? 'จัดส่งสำเร็จแล้ว'
                        : ord.shippingStatus === 'shipped'
                        ? 'ส่งออกแล้ว'
                        : 'รอดำเนินการจัดส่ง'}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                      {ord.paymentMethod.toUpperCase()} (
                      {ord.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'})
                    </span>
                  </div>
                </div>

                {/* Items & Buyer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      สินค้าในออเดอร์:
                    </span>
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-0.5">
                        <img
                          src={item.productImage}
                          alt=""
                          className="w-8 h-8 rounded object-cover border"
                        />
                        <span className="font-medium text-slate-800 truncate">
                          {item.productTitle} x {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      ผู้รับและสถานที่จัดส่ง:
                    </span>
                    <p className="font-semibold text-slate-700">
                      {ord.buyerName} ({ord.buyerPhone})
                    </p>
                    <p className="text-slate-500 truncate">{ord.buyerAddress}</p>
                    <p className="text-slate-900 font-bold mt-1">
                      ยอดชำระ: ฿{formatPrice(ord.total)}
                    </p>
                  </div>
                </div>

                {/* Tracking & Status Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">เลขพัสดุ:</span>
                    <input
                      type="text"
                      placeholder="ใส่เลขแทรคกิ้ง เช่น SPXTH9982..."
                      value={
                        trackingInputs[ord.id] !== undefined
                          ? trackingInputs[ord.id]
                          : ord.trackingNumber || ''
                      }
                      onChange={(e) =>
                        setTrackingInputs({
                          ...trackingInputs,
                          [ord.id]: e.target.value,
                        })
                      }
                      className="p-1 px-2 bg-white border border-slate-300 rounded font-mono text-xs w-48"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {ord.shippingStatus === 'processing' && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            ord.id,
                            'shipped',
                            trackingInputs[ord.id] || ord.trackingNumber
                          )
                        }
                        className="px-3 py-1 bg-[#ee4d2d] text-white rounded font-bold hover:bg-[#d73f20] transition-colors cursor-pointer"
                      >
                        ยืนยันจัดส่งพัสดุแล้ว
                      </button>
                    )}
                    {ord.shippingStatus === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'delivered')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        ทำเครื่องหมายว่าส่งสำเร็จ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Finance & Wallet */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-800 mb-1">
            กระเป๋าเงินและรายได้ร้านค้า (Shop Wallet)
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            ตรวจสอบยอดคงเหลือ และรายรับจากการขายสินค้า
          </p>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-6">
            <span className="text-xs text-slate-400 block mb-1">
              ยอดเงินที่ถอนได้ (Available Balance)
            </span>
            <div className="text-3xl font-extrabold text-orange-400 mb-4 tabular-nums">
              ฿{formatPrice(currentUser.walletBalance)}
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#ee4d2d] hover:bg-[#d73f20] rounded-lg text-xs font-bold text-white transition-colors cursor-pointer">
                ถอนเงินเข้าบัญชีธนาคาร
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer">
                ดูประวัติรายการเดินบัญชี
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-700">รอบการโอนเงินอัตโนมัติ</h4>
            <p className="text-slate-500">
              เงินจะถูกโอนเข้าบัญชี PromptPay หรือธนาคารที่ผูกไว้ ทุกวันพุธและวันศุกร์
              โดยไม่มีค่าธรรมเนียมการโอน
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
