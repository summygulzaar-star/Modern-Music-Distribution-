import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../App";
import { 
  Globe, 
  Plus, 
  Mail, 
  Phone, 
  Music, 
  CheckCircle2, 
  X, 
  Share2, 
  Building, 
  Search, 
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function Labels() {
  const { user } = useAuth();
  const [labels, setLabels] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLabels = async () => {
    if (!user) return;
    const q = query(collection(db, "labels"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setLabels(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchLabels();
  }, [user]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", whatsapp: "", website: "", 
    socials: "", country: "India", genreFocus: "", languageFocus: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "labels"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      fetchLabels();
    } catch (err) {
      alert("Error adding label");
    }
  };

  const filteredLabels = labels.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Label Infrastructure</h1>
           <p className="text-slate-400 font-medium">Build your corporate presence and brand legacy in the industry.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-2 pl-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                placeholder="Search labels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold min-w-[200px]"
              />
           </div>
           <button 
             onClick={() => setShowForm(true)}
             className="btn-premium btn-glow flex items-center gap-3 px-8 py-4 bg-brand-purple shadow-purple-500/20"
           >
              Register Label <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {filteredLabels.map((label, i) => (
            <motion.div 
              key={label.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-3xl transition-all duration-700"
            >
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-purple/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                     <div className="w-20 h-20 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black font-display shadow-2xl group-hover:rotate-6 transition-transform">
                        {label.name[0]}
                     </div>
                     <div className="flex gap-2">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                           <Award className="w-5 h-5" />
                        </div>
                        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-brand-purple transition-colors">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-3xl font-black font-display tracking-tight text-slate-800 line-clamp-1 group-hover:text-brand-purple transition-colors">{label.name}</h3>
                     <div className="flex items-center gap-3 mt-2">
                        <Globe className="w-3 h-3 text-brand-purple opacity-40" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label.country}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <Building className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Office</span>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                     <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{label.genreFocus || "Multi-Genre"}</span>
                     <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{label.languageFocus || "Global"}</span>
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center">
                           <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Entity</span>
                     </div>
                     <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {labels.length === 0 && !loading && (
           <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50 text-center mx-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 border-2 border-slate-100">
                 <Building className="w-12 h-12" />
              </div>
              <h3 className="font-black font-display text-4xl uppercase tracking-tighter mb-4 text-slate-800">No Enterprise Found</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-10">Your enterprise portfolio is currently empty. Define your brand identity to streamline music distribution across the network.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="btn-premium btn-glow flex items-center gap-3 py-4 px-10 bg-brand-purple shadow-purple-500/20"
              >
                 Register Corporate Label <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        )}
      </div>

      {/* Corporate Registration Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="max-w-4xl w-full bg-white rounded-[4.5rem] p-16 relative shadow-3xl my-10"
            >
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-12 right-12 w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 hover:text-brand-purple hover:bg-white hover:shadow-xl transition-all"
              >
                 <X className="w-7 h-7" />
              </button>

              <div className="flex items-center gap-8 mb-16">
                 <div className="w-20 h-20 bg-brand-purple text-white rounded-[2rem] flex items-center justify-center -rotate-6 shadow-2xl shadow-purple-500/30">
                    <Award className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-5xl font-black font-display tracking-tight uppercase">Corporate <span className="text-brand-purple">Anchor</span></h2>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Establish your professional music enterprise.</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Legal Entity Name</label>
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-brand-purple/10 transition-all" placeholder="Label Music Group" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Corporate Email</label>
                       <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="ops@label.com" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Phone / WhatsApp</label>
                       <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="+XX-XXXXXXXXXX" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Official Website</label>
                       <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="https://..." />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Genre Specialization</label>
                       <input value={formData.genreFocus} onChange={e => setFormData({...formData, genreFocus: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="e.g. Pop, Rock, Classical" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Language Ecosystem</label>
                       <input value={formData.languageFocus} onChange={e => setFormData({...formData, languageFocus: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="e.g. Hindi, English" />
                    </div>
                 </div>

                 <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 flex items-center gap-6">
                    <ShieldCheck className="w-12 h-12 text-brand-purple/40" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                       Upon registration, this label will be available for selection during the release submission cycle. Ensure all contact details are verified for royalty distribution.
                    </p>
                 </div>

                 <div className="pt-10">
                   <button type="submit" className="w-full btn-premium btn-glow py-6 text-lg uppercase tracking-[0.2em] font-black shadow-3xl flex items-center justify-center gap-4 bg-brand-purple shadow-purple-500/20">
                     Establish Brand Identity <CheckCircle2 className="w-7 h-7" />
                   </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
