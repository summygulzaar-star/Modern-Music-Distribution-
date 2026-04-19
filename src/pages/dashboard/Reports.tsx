import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../App";
import { 
  FileText, 
  Download, 
  Filter, 
  FileSpreadsheet, 
  FileJson, 
  FileType, 
  Search,
  Calendar,
  MoreVertical,
  History,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  List
} from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
      try {
        const snap = await getDocs(q);
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("No reports collection yet or permission error");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const mockReports = [
    { period: "Q3 - 2023 Consolidated", amount: 42560, format: "PDF", createdAt: "2023-10-01", status: "Available" },
    { period: "September 2023 Stream Data", amount: 12400, format: "CSV", createdAt: "2023-09-30", status: "Available" },
    { period: "Q2 - 2023 Financial Audit", amount: 38900, format: "XLSX", createdAt: "2023-07-15", status: "Archived" },
    { period: "August 2023 Market Trends", amount: 8900, format: "PDF", createdAt: "2023-08-31", status: "Available" },
  ];

  const allReports = [...reports, ...mockReports].filter(r => 
    r.period.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Royalty Ledger</h1>
           <p className="text-slate-400 font-medium">Deep dive into your global revenue streams and payout reports.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="bg-white p-2 pl-6 rounded-full shadow-xl border border-slate-50 flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                placeholder="Search statements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold min-w-[200px]"
              />
           </div>
           <div className="flex bg-white p-2 rounded-full shadow-xl border border-slate-50">
              <button 
                onClick={() => setView('table')}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  view === 'table' ? "bg-slate-950 text-white shadow-lg" : "text-slate-300"
                )}
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setView('grid')}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  view === 'grid' ? "bg-slate-950 text-white shadow-lg" : "text-slate-300"
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
           </div>
           <button className="btn-premium bg-brand-blue/5 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue hover:text-white px-8 py-3 rounded-full flex items-center gap-3">
              Generate Custom <Download className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid md:grid-cols-4 gap-8">
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col gap-4 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Statements</p>
               <h3 className="text-3xl font-black font-display tracking-tight text-slate-800">24</h3>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col gap-4 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
               <History className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Gross</p>
               <h3 className="text-3xl font-black font-display tracking-tight text-slate-800">₹3.4M</h3>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col gap-4 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-2xl flex items-center justify-center">
               <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Audit</p>
               <h3 className="text-3xl font-black font-display tracking-tight text-slate-800">₹12,400</h3>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col gap-4 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
               <h3 className="text-3xl font-black font-display tracking-tight text-emerald-500 uppercase">Verified</h3>
            </div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'table' ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[4rem] shadow-3xl border border-slate-50 overflow-hidden"
          >
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statement Period</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Royalty</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Format</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security</th>
                      <th className="px-12 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Export</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {allReports.map((r, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors duration-500">
                         <td className="px-12 py-8">
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:rotate-3">
                                  <FileText className="w-7 h-7" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{r.period}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Generated: {r.createdAt}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <p className="font-black font-display text-2xl text-slate-800 tracking-tight">{formatCurrency(r.amount)}</p>
                         </td>
                         <td className="px-8 py-8">
                            <div className="flex items-center gap-3">
                               <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 r.format === 'PDF' ? "bg-rose-500" : r.format === 'CSV' ? "bg-emerald-500" : "bg-amber-500"
                               )}></div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{r.format} Asset</span>
                            </div>
                         </td>
                         <td className="px-8 py-8">
                            <span className={cn(
                               "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em]",
                               r.status === 'Available' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}>
                               {r.status}
                            </span>
                         </td>
                         <td className="px-12 py-8 text-right">
                            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-blue border border-slate-100 hover:bg-brand-blue hover:text-white transition-all transform hover:scale-110 active:scale-95 group-hover:shadow-brand-blue/20">
                               <Download className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
             {allReports.map((r, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-3xl transition-all duration-700"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-start justify-between">
                         <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                            <FileText className="w-8 h-8" />
                         </div>
                         <div className={cn(
                           "px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest",
                           r.status === 'Available' ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-400"
                         )}>
                           {r.status}
                         </div>
                      </div>

                      <div>
                         <h3 className="text-2xl font-black font-display tracking-tight text-slate-800 uppercase leading-snug group-hover:text-brand-blue transition-colors truncate">{r.period}</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{r.createdAt}</p>
                      </div>

                      <div className="flex items-center justify-between py-6 border-y border-slate-50">
                         <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Royalty</p>
                            <p className="text-2xl font-black font-display text-slate-800">{formatCurrency(r.amount)}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Format</p>
                            <p className="text-xs font-black text-brand-blue">{r.format}</p>
                         </div>
                      </div>

                      <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-3">
                         Download Statement <Download className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
