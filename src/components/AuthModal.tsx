import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, ShieldCheck, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, currentUser } = useShop();

  const [customEmail, setCustomEmail] = useState('goldenrivercity@gmail.com');
  const [customName, setCustomName] = useState('Golden River City');

  if (!isAuthModalOpen) return null;

  const handleGoogleQuickLogin = (email: string, name: string) => {
    loginWithGoogle(email, name);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    loginWithGoogle(customEmail.trim(), name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
              G
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              เข้าสู่ระบบด้วย Google (Gmail)
            </h2>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Brand & Note */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            </div>
            <h3 className="text-base font-bold text-slate-800">
              ลงชื่อเข้าใช้ด้วยบัญชี Google
            </h3>
            <p className="text-slate-500">
              เลือกบัญชี Gmail เพื่อเริ่มช้อปปิ้ง เปิดร้านค้า หรือจัดการระบบ
            </p>
          </div>

          {/* 1-Click Prompt with User Email */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 block">
              บัญชีที่แนะนำ (One-Click Sign-In):
            </span>
            <button
              onClick={() =>
                handleGoogleQuickLogin(
                  'goldenrivercity@gmail.com',
                  'Golden River City'
                )
              }
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/40 flex items-center justify-between text-left transition-all shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm">
                  G
                </div>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-[#ee4d2d]">
                    goldenrivercity@gmail.com
                  </p>
                  <p className="text-[11px] text-slate-400">Golden River City (เจ้าของบัญชี)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#ee4d2d] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[11px] text-slate-400 font-medium">หรือระบุ Gmail อื่น</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Custom Gmail Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                อีเมล Gmail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ชื่อที่ต้องการแสดง (Display Name)
              </label>
              <input
                type="text"
                placeholder="ชื่อ-นามสกุล หรือชื่อเล่น"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#ee4d2d] hover:bg-[#d73f20] text-white rounded-xl font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>เข้าสู่ระบบด้วยบัญชีนี้</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>เข้าสู่ระบบปลอดภัย ข้อมูลได้รับการเข้ารหัสและเก็บรักษาในระบบมาตรฐาน</span>
          </div>
        </div>
      </div>
    </div>
  );
};
