import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../App";
import { 
  ShieldAlert, 
  Youtube, 
  Link as LinkIcon, 
  Building2, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Fingerprint,
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Music
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function ContentID() {
  const { user } = useAuth();
  const [liveSongs, setLiveSongs] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    songId: "", youtubeLink: "", labelId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const songsSnap = await getDocs(query(collection(db, "releases"), where("userId", "==", user.uid), where("status", "==", "live")));
      setLiveSongs(songsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const labelsSnap = await getDocs(query(collection(db, "labels"), where("userId", "==", user.uid)));
      setLabels(labelsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const requestsSnap = await getDocs(query(collection(db, "contentIdRequests"), where("userId", "==", user.uid), orderBy("createdAt", "desc")));
      setRequests(requestsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.songId || !formData.youtubeLink) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contentIdRequests"), {
        ...formData,
        userId: user.uid,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setShowSuccess(true);
      setFormData({ songId: "", youtubeLink: "", labelId: "" });
      
      // Refresh requests
      const requestsSnap = await getDocs(query(collection(db, "contentIdRequests"), where("userId", "==", user.uid), orderBy("createdAt", "desc")));
      setRequests(requestsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    } finally {
      setIsSubmitting(false);
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[4rem] p-16 max-w-lg w-full text-center relative shadow-3xl"
            >
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                 <ShieldCheck className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black font-display tracking-tight uppercase mb-4">Nexus <span className="text-rose-500">Cleared</span></h2>
              <p className="text-slate-400 font-medium mb-12">Your CID clearance request has been queued. Automated whitelisting will take effect within 12-24 hours.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="btn-premium bg-slate-950 text-white w-full py-6 rounded-3xl font-black uppercase tracking-widest"
              >
                Return to Command
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">CID CLEARANCE</h1>
           <p className="text-slate-400 font-medium">Whitelisting official creative assets from YouTube fingerprint engines.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 px-6 rounded-full shadow-xl border border-slate-50">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Security Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
         {/* Request Form */}
         <div className="bg-white p-14 rounded-[4.5rem] shadow-sm border border-slate-50 space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex items-center gap-8 relative z-10">
               <div className="w-20 h-20 bg-rose-500 text-white rounded-[2.5rem] flex items-center justify-center rotate-6 shadow-2xl shadow-rose-500/30 transition-transform hover:rotate-0 duration-500">
                  <Fingerprint className="w-10 h-10" />
               </div>
               <div>
                  <h3 className="text-3xl font-black font-display tracking-tight uppercase">Manual Protocol</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Direct API Clearance Entry</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Target Release (Verified Assets)</label>
                  <div className="relative">
                     <Music className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                     <select 
                       value={formData.songId}
                       onChange={e => setFormData({...formData, songId: e.target.value})}
                       className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold appearance-none focus:ring-4 focus:ring-rose-500/10 transition-all"
                     >
                       <option value="">Select an active master</option>
                       {liveSongs.map(s => <option key={s.id} value={s.id}>{s.songName || s.title}</option>)}
                     </select>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">YouTube Destination Link</label>
                  <div className="relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"><Youtube className="w-5 h-5 text-rose-500" /></div>
                     <input 
                        value={formData.youtubeLink}
                        onChange={e => setFormData({...formData, youtubeLink: e.target.value})}
                        className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold placeholder:text-slate-300"
                        placeholder="https://youtube.com/watch?v=..."
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Associated Corporate Label</label>
                  <div className="relative">
                     <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                     <select 
                        value={formData.labelId}
                        onChange={e => setFormData({...formData, labelId: e.target.value})}
                        className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold appearance-none"
                     >
                       <option value="">Select registered label</option>
                       {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                     </select>
                  </div>
               </div>

               <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex gap-4">
                  <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-rose-700 font-bold uppercase tracking-widest leading-relaxed">
                     Execution of this protocol will whitelist the provided destination from automated content ID monetary claims for this specific asset.
                  </p>
               </div>

               <button 
                 disabled={isSubmitting || !formData.songId || !formData.youtubeLink}
                 className="w-full btn-premium py-6 uppercase tracking-[0.2em] font-black shadow-2xl shadow-rose-500/20 bg-slate-950 text-white flex items-center justify-center gap-4 hover:bg-rose-600 transition-all disabled:opacity-50"
               >
                  {isSubmitting ? "Encrypting Signal..." : "Execute Whitelist"} <ArrowRight className="w-5 h-5" />
               </button>
            </form>
         </div>

         {/* Tracking Queue */}
         <div className="space-y-10">
            <div className="flex items-center justify-between">
               <h3 className="text-3xl font-black font-display tracking-tight uppercase flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
                     <Clock className="w-6 h-6" />
                  </div>
                  System Queue
               </h3>
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-4 py-1.5 bg-rose-50 rounded-full">{requests.length} ACTIVE</span>
            </div>
            
            <div className="space-y-6">
               <AnimatePresence>
                  {requests.map((r, i) => (
                     <motion.div 
                       key={r.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all duration-500"
                     >
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                              <Youtube className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Signal #{r.id.slice(-6).toUpperCase()}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                 <LinkIcon className="w-3 h-3 text-slate-300" />
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate max-w-[150px]">{r.youtubeLink}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                           <div className={cn(
                              "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                              r.status === 'pending' && "bg-amber-100 text-amber-600",
                              r.status === 'completed' && "bg-emerald-100 text-emerald-600",
                              r.status === 'rejected' && "bg-rose-100 text-rose-600"
                           )}>
                              {r.status === 'pending' && <Clock className="w-3 h-3 animate-spin duration-[4s]" />}
                              {r.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                              {r.status === 'rejected' && <AlertTriangle className="w-3 h-3" />}
                              {r.status}
                           </div>
                           <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-200 hover:text-brand-blue transition-colors">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
               {requests.length === 0 && (
                  <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50 mx-6">
                     <Fingerprint className="w-20 h-20 mx-auto mb-6 text-slate-100" />
                     <p className="font-display font-black text-2xl uppercase tracking-widest text-slate-100 select-none">Void Queue</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
