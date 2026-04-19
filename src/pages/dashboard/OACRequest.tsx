import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../App";
import { 
  Youtube, 
  Music, 
  User, 
  Globe, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Video, 
  Link as LinkIcon, 
  ArrowRight,
  ShieldCheck,
  Building,
  Mic2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function OACRequest() {
  const { user } = useAuth();
  const [artists, setArtists] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    artistId: "", ownedChannel: "", topicChannel: "", labelId: "",
    video1: "", video2: "", video3: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const artistSnap = await getDocs(query(collection(db, "artists"), where("userId", "==", user.uid)));
      setArtists(artistSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const labelSnap = await getDocs(query(collection(db, "labels"), where("userId", "==", user.uid)));
      setLabels(labelSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const reqSnap = await getDocs(query(collection(db, "oacRequests"), where("userId", "==", user.uid), orderBy("createdAt", "desc")));
      setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.artistId || !formData.ownedChannel) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "oacRequests"), {
        ...formData,
        userId: user.uid,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setShowSuccess(true);
      setFormData({ artistId: "", ownedChannel: "", topicChannel: "", labelId: "", video1: "", video2: "", video3: "" });
      
      // Refresh
      const reqSnap = await getDocs(query(collection(db, "oacRequests"), where("userId", "==", user.uid), orderBy("createdAt", "desc")));
      setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
       console.error(err);
       alert("Error submitting OAC request");
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
              <div className="w-24 h-24 bg-brand-blue/10 text-brand-blue rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                 <Youtube className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black font-display tracking-tight uppercase mb-4">Transmission <span className="text-brand-blue">Active</span></h2>
              <p className="text-slate-400 font-medium mb-12">Your OAC request has been transmitted to the YouTube Global Partner network. Verification usually completes within 3-7 business days.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="btn-premium bg-slate-950 text-white w-full py-6 rounded-3xl font-black uppercase tracking-widest"
              >
                Return to Mission
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Official Artist Channel</h1>
           <p className="text-slate-400 font-medium leading-relaxed">Synthesize your identity across YouTube properties for a unified partner experience.</p>
        </div>
        <div className="px-6 py-2 bg-brand-blue/10 rounded-full flex items-center gap-3 border border-brand-blue/20">
           <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Partner Gateway Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Request Protocol Form */}
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-14 rounded-[4.5rem] shadow-sm border border-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="flex items-center gap-8 mb-16 relative z-10">
                  <div className="w-20 h-20 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center -rotate-6 shadow-3xl transition-transform hover:rotate-0 duration-500">
                     <Youtube className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black font-display tracking-tight uppercase">OAC VERIFICATION PROTOCOL</h3>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Direct Partner Merging Entry</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Target Artist Profile</label>
                     <div className="relative">
                        <Mic2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <select 
                          value={formData.artistId} 
                          onChange={e => setFormData({...formData, artistId: e.target.value})} 
                          className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold appearance-none focus:ring-4 focus:ring-brand-blue/10 transition-all"
                        >
                           <option value="">Select artist roster</option>
                           {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Executive Music Label</label>
                     <div className="relative">
                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <select 
                          value={formData.labelId} 
                          onChange={e => setFormData({...formData, labelId: e.target.value})} 
                          className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold appearance-none focus:ring-4 focus:ring-brand-blue/10 transition-all"
                        >
                           <option value="">Select registered label</option>
                           {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Master Channel Link</label>
                     <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                          value={formData.ownedChannel} 
                          onChange={e => setFormData({...formData, ownedChannel: e.target.value})} 
                          className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold placeholder:text-slate-200" 
                          placeholder="https://youtube.com/c/UserChannel" 
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">System Topic Channel Link</label>
                     <div className="relative">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                          value={formData.topicChannel} 
                          onChange={e => setFormData({...formData, topicChannel: e.target.value})} 
                          className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold placeholder:text-slate-200" 
                          placeholder="https://youtube.com/channel/..." 
                        />
                     </div>
                  </div>

                  <div className="col-span-2 space-y-8">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue ml-4">Official Catalog Verification (3 Videos Required)</label>
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                     </div>
                     <div className="grid gap-6">
                        <div className="relative group">
                          <Video className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                          <input 
                            value={formData.video1} 
                            onChange={e => setFormData({...formData, video1: e.target.value})} 
                            className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                            placeholder="Official Music Video 1 URL" 
                          />
                        </div>
                        <div className="relative group">
                          <Video className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <input value={formData.video2} onChange={e => setFormData({...formData, video2: e.target.value})} className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="Official Music Video 2 URL" />
                        </div>
                        <div className="relative group">
                          <Video className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <input value={formData.video3} onChange={e => setFormData({...formData, video3: e.target.value})} className="w-full p-6 pl-16 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="Official Music Video 3 URL" />
                        </div>
                     </div>
                  </div>

                  <div className="col-span-2 pt-10">
                     <button 
                       disabled={isSubmitting || !formData.artistId || !formData.ownedChannel}
                       className="w-full btn-premium py-7 text-sm uppercase tracking-[0.2em] font-black shadow-3xl bg-slate-950 text-white flex items-center justify-center gap-6 hover:bg-brand-blue transition-all disabled:opacity-50"
                     >
                        {isSubmitting ? "TRANSMITTING SIGNALS..." : "INITIALIZE OAC DEPLOYMENT"} <ArrowRight className="w-6 h-6" />
                     </button>
                  </div>
               </form>
            </div>
         </div>

         {/* Deployment Status Ledger */}
         <div className="space-y-10">
            <div className="flex items-center justify-between">
               <h3 className="text-3xl font-black font-display tracking-tight uppercase flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
                     <Globe className="w-6 h-6" />
                  </div>
                  Status
               </h3>
               <span className="text-[10px] font-black text-brand-blue px-4 py-2 bg-brand-blue/5 rounded-full uppercase tracking-widest">{requests.length} Requests</span>
            </div>
            
            <div className="space-y-6">
               <AnimatePresence>
                  {requests.map((r, i) => (
                     <motion.div 
                       key={r.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all duration-700"
                     >
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-brand-blue/5 group-hover:text-brand-blue transition-all duration-500">
                              <Youtube className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="font-black text-slate-800 text-lg uppercase tracking-tight">OAC-TXN #{r.id.slice(-6).toUpperCase()}</p>
                              <div className="flex items-center gap-3 mt-1.5 font-black">
                                 <span className="text-[9px] text-slate-300 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                           <span className={cn(
                              "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                              r.status === 'pending' && "bg-amber-100 text-amber-600",
                              r.status === 'submitted' && "bg-brand-blue/10 text-brand-blue",
                              r.status === 'approved' && "bg-emerald-100 text-emerald-600",
                              r.status === 'rejected' && "bg-rose-100 text-rose-600",
                              r.status === 'completed' && "bg-slate-900 text-white"
                           )}>
                              {r.status}
                           </span>
                           <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-100 hover:text-brand-blue transition-colors">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
               {requests.length === 0 && (
                  <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50 mx-6 bg-slate-50/50">
                     <ShieldCheck className="w-20 h-20 mx-auto mb-6 text-slate-100" />
                     <p className="font-display font-black text-2xl uppercase tracking-widest text-slate-100 select-none">No Active Signal</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
