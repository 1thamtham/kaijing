import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Category,
  CartItem,
  Order,
  Voucher,
  UserRole,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_VOUCHERS,
  INITIAL_ORDERS,
} from '../mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  // Navigation & View
  currentView: 'marketplace' | 'seller_centre' | 'admin_centre' | 'my_orders';
  setCurrentView: (view: 'marketplace' | 'seller_centre' | 'admin_centre' | 'my_orders') => void;

  // Active User / Role
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserBlock: (userId: string) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'soldCount' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStatus: (productId: string, status: 'approved' | 'rejected') => void;

  // Categories & Filtering
  categories: Category[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: 'all' | 'best_seller' | 'new_arrival' | 'flash_deal';
  setActiveFilter: (filter: 'all' | 'best_seller' | 'new_arrival' | 'flash_deal') => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleCartSelect: (productId: string) => void;
  toggleSelectAllCart: (select: boolean) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Checkout & Vouchers
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher | null) => void;
  useCoins: boolean;
  setUseCoins: (use: boolean) => void;
  placeOrder: (shippingAddress: string, phone: string, paymentMethod: PaymentMethod) => Order | null;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, shippingStatus: Order['shippingStatus'], trackingNumber?: string) => void;

  // Authentication with Google
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (email: string, name: string) => void;
  logout: () => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from LocalStorage or fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('siamshop_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users[0] || INITIAL_USERS[0];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('siamshop_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('siamshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('siamshop_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [vouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [useCoins, setUseCoins] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<'marketplace' | 'seller_centre' | 'admin_centre' | 'my_orders'>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'best_seller' | 'new_arrival' | 'flash_deal'>('all');

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('siamshop_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('siamshop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('siamshop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('siamshop_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User actions
  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`สลับบัญชีผู้ใช้เป็น: ${found.name} (${found.role === 'admin' ? 'แอดมิน' : found.role === 'seller' ? 'ร้านค้า' : 'ผู้ซื้อ'})`, 'info');
      // If switching to seller, navigate to seller center if preferred or stay
      if (found.role === 'seller') {
        setCurrentView('seller_centre');
      } else if (found.role === 'admin') {
        setCurrentView('admin_centre');
      } else {
        setCurrentView('marketplace');
      }
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            role: newRole,
            shopName: newRole === 'seller' ? (u.shopName || `ร้านค้าของ ${u.name}`) : u.shopName,
          };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('อัปเดตสิทธิ์การใช้งานบัญชีสำเร็จ', 'success');
  };

  const toggleUserBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isBlocked = !u.isBlocked;
          const updated = { ...u, isBlocked };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('เปลี่ยนแปลงสถานะบัญชีผู้ใช้งานแล้ว', 'info');
  };

  // Product actions
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'soldCount' | 'rating' | 'reviewCount'>
  ) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      soldCount: 0,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('ลงขายสินค้าใหม่สำเร็จแล้ว สินค้าพร้อมจำหน่ายทันที!', 'success');
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('บันทึกการแก้ไขข้อมูลสินค้าเรียบร้อย', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('ลบสินค้าออกจากระบบแล้ว', 'info');
  };

  const toggleProductStatus = (productId: string, status: 'approved' | 'rejected') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
    showToast(`อัปเดตสถานะการอนุมัติสินค้า: ${status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}`, 'info');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity, selected: true }];
    });
    showToast(`เพิ่ม "${product.title.slice(0, 24)}..." ลงในรถเข็นแล้ว!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('นำสินค้าออกจากรถเข็นแล้ว', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleCartSelect = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAllCart = (select: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyVoucher = (voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
    if (voucher) {
      showToast(`ใช้โค้ดส่วนลด "${voucher.code}" สำเร็จ!`, 'success');
    } else {
      showToast('ยกเลิกโค้ดส่วนลดแล้ว', 'info');
    }
  };

  // Checkout and Order Placement
  const placeOrder = (
    shippingAddress: string,
    phone: string,
    paymentMethod: PaymentMethod
  ): Order | null => {
    const selectedItems = cart.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      showToast('กรุณาเลือกสินค้าในรถเข็นอย่างน้อย 1 รายการ', 'error');
      return null;
    }

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

    // Has free shipping tag?
    const hasFreeShippingItem = selectedItems.some((item) => item.product.isFreeShipping);
    if (hasFreeShippingItem) {
      shippingFee = 0;
    }

    const coinsDeduction = useCoins ? Math.min(50, subtotal * 0.2) : 0;
    const finalTotal = Math.max(0, subtotal - discount + shippingFee - coinsDeduction);

    const firstProduct = selectedItems[0].product;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'TH' + Math.floor(1000000000 + Math.random() * 9000000000),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: phone,
      buyerAddress: shippingAddress,
      sellerId: firstProduct.sellerId,
      sellerName: firstProduct.sellerName,
      items: selectedItems.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      shippingFee,
      coinsUsed: coinsDeduction,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      shippingStatus: 'processing',
      trackingNumber: 'SPXTH' + Math.floor(1000000000 + Math.random() * 9000000000),
      createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
      paidAt: paymentMethod !== 'cod' ? new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
    };

    // Deduct stock and increment sold count
    setProducts((prev) =>
      prev.map((p) => {
        const bought = selectedItems.find((item) => item.productId === p.id);
        if (bought) {
          return {
            ...p,
            stock: Math.max(0, p.stock - bought.quantity),
            soldCount: p.soldCount + bought.quantity,
          };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Remove bought items from cart
    setCart((prev) => prev.filter((item) => !item.selected));
    setAppliedVoucher(null);
    setUseCoins(false);

    showToast('คำสั่งซื้อสำเร็จ! บันทึกข้อมูลและเริ่มเตรียมพัสดุเรียบร้อย', 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    shippingStatus: Order['shippingStatus'],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            shippingStatus,
            trackingNumber: trackingNumber || o.trackingNumber,
          };
        }
        return o;
      })
    );
    showToast('อัปเดตสถานะการจัดส่งคำสั่งซื้อเรียบร้อย', 'success');
  };

  const loginWithGoogle = (email: string, name: string) => {
    // Check if user already exists
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'usr-' + Date.now(),
        name,
        email,
        phone: '089-999-8888',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: 'buyer',
        registeredAt: new Date().toISOString().split('T')[0],
        walletBalance: 1000,
      };
      setUsers((prev) => [user!, ...prev]);
    }
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`ยินดีต้อนรับ! เข้าสู่ระบบสำเร็จด้วย Gmail: ${email}`, 'success');
  };

  const logout = () => {
    // Switch to first default buyer
    const fallbackUser = users[0] || INITIAL_USERS[0];
    setCurrentUser(fallbackUser);
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        switchUser,
        users,
        updateUserRole,
        toggleUserBlock,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleCartSelect,
        toggleSelectAllCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        logout,
        vouchers,
        appliedVoucher,
        applyVoucher,
        useCoins,
        setUseCoins,
        placeOrder,
        orders,
        updateOrderStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
