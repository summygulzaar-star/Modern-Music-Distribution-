import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, FileText, Plus, Search } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function AdminFinance() {
  const [stats, setStats] = useState({
    totalRevenue: 4500000,
    totalPayouts: 2100000,
    pendingWithdrawals: 15,
    lastMonthGrowth: 18.5
  });

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-5xl font-black font-display tracking-tight uppercase">Finance Treasury</h1>
            <p className="text-slate-400 font-medium">Global royalty oversight, payout processing, and financial forensics.</p>
         </div>
         <button className="btn-premium bg-emerald-500 text-white py-4 px-10 flex items-center gap-3 shadow-emerald-900/40">
            <Plus className="w-5 h-5" /> BULK ROYALTY IMPORT
         </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
         {[
           { label: "Gross Platform Revenue", val: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Artist Payouts Distributed", val: formatCurrency(stats.totalPayouts), icon: ArrowUpRight, color: "text-brand-blue", bg: "bg-brand-blue/10" },
           { label: "In-Transit Liquidations", val: stats.pendingWithdrawals, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
           { label: "Quarterly Delta", val: "+" + stats.lastMonthGrowth + "%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
         ].map((s, i) => (
           <div key={i} className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-800 transition-all hover:bg-slate-800/50">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", s.bg)}>
               <s.icon className={cn("w-7 h-7", s.color)} />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{s.label}</p>
             <h3 className="text-3xl font-black font-display tracking-tighter text-white">{s.val}</h3>
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="bg-[#1E293B] rounded-[3.5rem] border border-slate-800 p-12 space-y-8 shadow-2xl">
            <h3 className="text-2xl font-black font-display tracking-tight flex items-center gap-4 uppercase">
               <ArrowDownLeft className="text-amber-500 w-8 h-8" /> Pending Liquidations
            </h3>
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs">U{i}</div>
                       <div>
                          <p className="font-bold text-white uppercase text-xs tracking-wider">Withdrawal Request #{1000 + i}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase">UPI · user{i}@okicici</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black font-display text-white">₹2,450.00</p>
                       <button className="text-[9px] font-black text-brand-purple uppercase tracking-widest mt-2 hover:underline">PROCESS NOW</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#1E293B] rounded-[3.5rem] border border-slate-800 p-12 space-y-8 shadow-2xl">
            <h3 className="text-2xl font-black font-display tracking-tight flex items-center gap-4 uppercase">
               <FileText className="text-brand-blue w-8 h-8" /> Recent Transactions
            </h3>
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="px-6 py-4 rounded-2xl border-b border-white/5 flex items-center justify-between last:border-0 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                       <span className="text-emerald-500">CREDIT</span>
                       <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                       <span>ROYALTY_UPLOAD_APR_24</span>
                    </div>
                    <span className="text-sm font-black text-white">+₹12,400</span>
                 </div>
               ))}
            </div>
            <button className="w-full py-5 bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-700 transition-colors">View All Ledger Logs</button>
         </div>
      </div>
    </div>
  );
}
