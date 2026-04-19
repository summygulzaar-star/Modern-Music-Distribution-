import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../App";
import { Link } from "react-router-dom";
import { 
  User, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Music, 
  CheckCircle2, 
  X, 
  Search, 
  MoreVertical,
  Youtube,
  Facebook,
  Music2,
  MapPin,
  Mic2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function Artists() {
  const { user } = useAuth();
  const [artists, setArtists] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArtists = async () => {
    if (!user) return;
    const q = query(collection(db, "artists"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setArtists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchArtists();
  }, [user]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", whatsapp: "", website: "", gender: "Male",
    youtube: "", instagram: "", facebook: "", spotify: "", apple: "",
    country: "India", genre: "", language: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "artists"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      fetchArtists();
    } catch (err) {
      alert("Error adding artist");
    }
  };

  const filteredArtists = artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Artist Roster</h1>
           <p className="text-slate-400 font-medium">Manage your portfolio of global talent and creative minds.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-2 pl-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                placeholder="Search artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold min-w-[200px]"
              />
           </div>
           <button 
             onClick={() => setShowForm(true)}
             className="btn-premium btn-glow flex items-center gap-3 px-8 py-4"
           >
              Deploy Artist <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {filteredArtists.map((artist, i) => (
            <motion.div 
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-3xl transition-all duration-700"
            >
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-blue/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                     <div className="w-20 h-20 bg-linear-to-br from-brand-blue to-brand-purple rounded-[2rem] flex items-center justify-center text-white text-3xl font-black font-display shadow-2xl group-hover:rotate-6 transition-transform">
                        {artist.name[0]}
                     </div>
                     <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-brand-blue transition-colors">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>

                  <div>
                     <h3 className="text-3xl font-black font-display tracking-tight text-slate-800 line-clamp-1 group-hover:text-brand-blue transition-colors">{artist.name}</h3>
                     <div className="flex items-center gap-3 mt-2">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{artist.country}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <Mic2 className="w-3 h-3 text-brand-blue/40" />
                        <span className="text-[10px] font-black text-brand-blue/60 uppercase tracking-widest truncate max-w-[100px]">{artist.genre}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                     {[
                       { icon: Instagram, url: artist.instagram, color: "hover:bg-pink-500" },
                       { icon: Youtube, url: artist.youtube, color: "hover:bg-red-600" },
                       { icon: Music2, url: artist.spotify, color: "hover:bg-emerald-500" },
                       { icon: Globe, url: artist.website, color: "hover:bg-brand-blue" },
                     ].map((social, idx) => (
                       <a 
                         key={idx} 
                         href={social.url} 
                         target="_blank" 
                         rel="noreferrer"
                         className={cn(
                           "aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 transition-all hover:text-white hover:scale-110",
                           social.color
                         )}
                       >
                          <social.icon className="w-5 h-5" />
                       </a>
                     ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                     <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Primary Language</p>
                        <p className="text-xs font-bold text-slate-600">{artist.language || "Not Specified"}</p>
                     </div>
                     <Link to={`/dashboard/artists/${artist.id}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-blue transition-all shadow-lg">
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {artists.length === 0 && !loading && (
           <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50 text-center mx-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 border-2 border-slate-100">
                 <User className="w-12 h-12" />
              </div>
              <h3 className="font-black font-display text-4xl uppercase tracking-tighter mb-4 text-slate-800">Void Roster</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-10">You haven't initialized any talent assets. Create an artist profile to start distributing music across global stores.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="btn-premium btn-glow flex items-center gap-3 py-4 px-10"
              >
                 Initialize Artist Profile <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        )}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="max-w-5xl w-full bg-white rounded-[4.5rem] p-16 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] my-10"
            >
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-12 right-12 w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 hover:text-brand-blue hover:bg-white hover:shadow-xl transition-all"
              >
                 <X className="w-7 h-7" />
              </button>

              <div className="flex items-center gap-8 mb-16">
                 <div className="w-20 h-20 bg-brand-blue text-white rounded-[2rem] flex items-center justify-center rotate-6 shadow-2xl shadow-blue-500/30">
                    <Mic2 className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-5xl font-black font-display tracking-tight uppercase">Artist <span className="text-brand-blue">Nexus</span></h2>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Establish the professional signature for your talent asset.</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                 <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Stage Name</label>
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 transition-all" placeholder="Legal or Stage Name" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Professional Email</label>
                       <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="artist@hq.com" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Phone / WhatsApp</label>
                       <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="+XX-XXXXXXXXXX" />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Website / Portfolio</label>
                       <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="https://..." />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Identity Gender</label>
                       <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold appearance-none">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other / Non-Binary</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Country Residence</label>
                       <input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="Country" />
                    </div>
                 </div>

                 <div className="bg-slate-50 p-12 rounded-[3.5rem] space-y-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Social Connectivity Gate</p>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="relative">
                          <Youtube className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                          <input value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} className="w-full p-5 pl-16 bg-white border-none rounded-3xl text-sm font-bold shadow-sm" placeholder="YouTube Channel Link" />
                       </div>
                       <div className="relative">
                          <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                          <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full p-5 pl-16 bg-white border-none rounded-3xl text-sm font-bold shadow-sm" placeholder="Instagram Profile Link" />
                       </div>
                       <div className="relative">
                          <Music2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          <input value={formData.spotify} onChange={e => setFormData({...formData, spotify: e.target.value})} className="w-full p-5 pl-16 bg-white border-none rounded-3xl text-sm font-bold shadow-sm" placeholder="Spotify Artist Link" />
                       </div>
                       <div className="relative">
                          <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                          <input value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full p-5 pl-16 bg-white border-none rounded-3xl text-sm font-bold shadow-sm" placeholder="Facebook Fan Page" />
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Musical Genre Focus</label>
                       <input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="e.g. Pop, Indian Classical, EDM" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Primary Expression Language</label>
                       <input value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-bold" placeholder="e.g. Hindi, English, Bengali" />
                    </div>
                 </div>

                 <div className="pt-10">
                   <button type="submit" className="w-full btn-premium btn-glow py-6 text-lg uppercase tracking-[0.2em] font-black shadow-3xl flex items-center justify-center gap-4">
                     Deploy Artist Nexus <CheckCircle2 className="w-7 h-7" />
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
