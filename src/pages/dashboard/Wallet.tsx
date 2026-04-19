import React, { useState } from "react";
import { useAuth } from "../../App";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building, 
  CreditCard, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  TrendingUp,
  History,
  Info,
  CheckCircle2,
  X
} from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../../lib/firebase";
import { doc, updateDoc, collection, addDoc, increment } from "firebase/firestore";

export default function Wallet() {
  const { profile, user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [method, setMethod] = useState<'bank' | 'upi'>('bank');

  const handleWithdraw = async () => {
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount < 500) {
      alert("Minimum withdrawal is ₹500");
      return;
    }
    if (withdrawalAmount > (profile?.walletBalance || 0)) {
      alert("Insufficient balance");
      return;
    }

    setIsWithdrawing(true);
    try {
      if (!user) return;
      
      // Update balance
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        walletBalance: increment(-withdrawalAmount)
      });

      // Record transaction
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        amount: -withdrawalAmount,
        type: "Withdrawal",
        method,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      setShowSuccess(true);
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[4rem] p-16 max-w-lg w-full text-center relative shadow-3xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black font-display tracking-tight uppercase mb-4">Transfer <span className="text-emerald-500">Initialized</span></h2>
              <p className="text-slate-400 font-medium mb-12">Your withdrawal request is being processed through our secure banking gateways. ETA: 24-48 Hours.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="btn-premium bg-slate-950 text-white w-full py-6 rounded-3xl font-black uppercase tracking-widest"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">TREASURY</h1>
           <p className="text-slate-400 font-medium">Command your royalty streams and global wealth flow.</p>
        </div>
        <div className="px-6 py-2 bg-emerald-500/10 rounded-full flex items-center gap-3 border border-emerald-500/20">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Banking Interface Live</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Main Balance & Analytics */}
         <div className="lg:col-span-2 space-y-12">
            <div className="bg-slate-950 text-white p-14 rounded-[4rem] relative overflow-hidden shadow-2xl group border border-white/5">
               <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-brand-blue/30 blur-[180px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-purple/20 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
               
               <div className="relative z-10 space-y-16">
                  <div className="flex items-start justify-between">
                     <div>
                        <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-4">Master Net Balance</p>
                        <h2 className="text-8xl font-black font-display tracking-tighter group-hover:scale-105 transition-all duration-1000 origin-left ease-out">
                           {formatCurrency(profile?.walletBalance || 0)}
                        </h2>
                     </div>
                     <div className="w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl">
                        <WalletIcon className="w-10 h-10 text-brand-blue" />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 flex flex-col gap-6 group/item hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between">
                           <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                              <TrendingUp className="text-emerald-400 w-6 h-6" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">MONTHLY REVENUE</span>
                        </div>
                        <div>
                           <h4 className="text-4xl font-black font-display tracking-tight group-hover/item:text-emerald-400 transition-colors">₹84,200.50</h4>
                           <p className="text-[10px] text-emerald-400 font-black mt-2 uppercase tracking-widest">+18.4% VS LAST MONTH</p>
                        </div>
                     </div>
                     <div className="p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 flex flex-col gap-6 group/item hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between">
                           <div className="w-12 h-12 bg-brand-purple/20 rounded-2xl flex items-center justify-center">
                              <History className="text-brand-purple w-6 h-6" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">TOTAL DISTRIBUTED</span>
                        </div>
                        <div>
                           <h4 className="text-4xl font-black font-display tracking-tight group-hover/item:text-brand-purple transition-colors">₹3,42,800</h4>
                           <p className="text-[10px] text-white/40 font-black mt-2 uppercase tracking-widest">SINCE ACCOUNT GENESIS</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Recent Ledger */}
            <div className="bg-white rounded-[4.5rem] shadow-sm border border-slate-50 p-14 relative overflow-hidden">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black font-display tracking-tight flex items-center gap-6 uppercase">
                     <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                        <Clock className="w-6 h-6" />
                     </div>
                     Transmission Ledger
                  </h3>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue hover:underline">Full Statement</button>
               </div>

               <div className="space-y-8">
                  {[
                    { type: 'Direct Deposit', amount: 12450, date: 'Oct 18, 2023', status: 'Completed', provider: 'Spotify HQ' },
                    { type: 'Royalty Credit', amount: 8900, date: 'Oct 16, 2023', status: 'Completed', provider: 'YouTube CMS' },
                    { type: 'Withdrawal', amount: -15000, date: 'Oct 14, 2023', status: 'Processing', provider: 'HDFC Bank' },
                    { type: 'Market Bonus', amount: 500, date: 'Oct 12, 2023', status: 'Completed', provider: 'IND Bonus' },
                  ].map((t, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[3rem] border border-transparent hover:border-slate-100 transition-all group lg:pr-12"
                    >
                       <div className="flex items-center gap-8">
                          <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-xl",
                            t.amount > 0 ? "bg-emerald-100 text-emerald-600 group-hover:rotate-6" : "bg-slate-900 text-white group-hover:-rotate-6"
                          )}>
                             {t.amount > 0 ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
                          </div>
                          <div>
                             <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{t.type}</p>
                             <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.provider}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="text-[9px] font-black text-brand-blue/50 uppercase tracking-widest">{t.date}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={cn("text-2xl font-black font-display tracking-tight", t.amount > 0 ? "text-emerald-600" : "text-slate-800")}>
                             {t.amount > 0 ? "+" : ""}{formatCurrency(t.amount)}
                          </p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                             <div className={cn("w-1 h-1 rounded-full", t.status === 'Completed' ? "bg-emerald-500" : "bg-brand-blue")}></div>
                             <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                t.status === 'Completed' ? "text-emerald-500" : "text-brand-blue"
                             )}>
                                {t.status}
                             </span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>

         {/* Elite Withdrawal Sidebar */}
         <div className="space-y-12">
            <div className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-50 space-y-10 sticky top-10">
               <div>
                  <h3 className="text-3xl font-black font-display tracking-tight uppercase mb-2">Payout <span className="text-brand-blue">Port</span></h3>
                  <p className="text-slate-400 text-xs font-medium">Transmit funds to your verified bank account.</p>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between px-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount to Liquidate</label>
                    <button onClick={() => setAmount(profile?.walletBalance?.toString() || "")} className="text-[10px] font-black text-brand-blue uppercase overflow-hidden">Withdraw All</button>
                  </div>
                  <div className="relative group">
                     <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-brand-blue">₹</span>
                     <input 
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="Min. 500"
                       className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] p-8 pl-18 text-4xl font-black font-display focus:border-brand-blue/20 focus:bg-white transition-all placeholder:text-slate-200"
                     />
                  </div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">Current Vault: {formatCurrency(profile?.walletBalance || 0)}</p>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Gateway Selection</label>
                  <div className="grid grid-cols-2 gap-6">
                     <button 
                       onClick={() => setMethod('bank')}
                       className={cn(
                         "p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all transform active:scale-95",
                         method === 'bank' ? "border-brand-blue bg-brand-blue/5 shadow-xl" : "border-slate-50 bg-slate-50 text-slate-300"
                       )}
                     >
                        <Building className={cn("w-7 h-7", method === 'bank' ? "text-brand-blue" : "text-slate-200")} />
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", method === 'bank' ? "text-brand-blue" : "text-slate-300")}>NEFT / IMPS</span>
                     </button>
                     <button 
                       onClick={() => setMethod('upi')}
                       className={cn(
                         "p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all transform active:scale-95",
                         method === 'upi' ? "border-brand-purple bg-brand-purple/5 shadow-xl" : "border-slate-50 bg-slate-50 text-slate-300"
                       )}
                     >
                        <CreditCard className={cn("w-7 h-7", method === 'upi' ? "text-brand-purple" : "text-slate-200")} />
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", method === 'upi' ? "text-brand-purple" : "text-slate-300")}>UPI VPA</span>
                     </button>
                  </div>
               </div>

               <button 
                 onClick={handleWithdraw}
                 disabled={isWithdrawing || !amount || parseFloat(amount) < 500}
                 className="w-full btn-premium btn-glow py-6 text-sm uppercase tracking-[0.2em] font-black shadow-2xl disabled:opacity-50 disabled:grayscale transition-all"
               >
                 {isWithdrawing ? "Processing Encryption..." : "Execute Payout"}
               </button>
               
               <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <ShieldCheck className="w-6 h-6" />
                     </div>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        End-to-End bank encryption active. Your treasury is protected by IND Multi-Vault tech.
                     </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                     <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wide leading-tight">Minimum Withdrawal: ₹500 • Maximum Weekly: No Limit</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-brand-blue/10 rounded-[3rem] border-2 border-brand-blue/20 flex items-center gap-6 group hover:bg-brand-blue/20 transition-all cursor-pointer">
               <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                  <TrendingUp className="w-7 h-7" />
               </div>
               <div>
                  <h4 className="font-black text-brand-blue text-xs uppercase tracking-widest">Growth Accelerate</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">Re-invest in Marketing</p>
               </div>
               <ChevronRight className="w-5 h-5 ml-auto text-brand-blue/30" />
            </div>
         </div>
      </div>
    </div>
  );
}
