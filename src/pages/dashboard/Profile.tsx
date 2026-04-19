import React, { useRef, useState } from "react";
import { useAuth } from "../../App";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  User, 
  Mail, 
  Shield, 
  Smartphone, 
  Globe, 
  PenLine, 
  Settings, 
  Music, 
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award,
  Bell,
  Eye,
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUpdating(true);
    try {
      const ext = file.name.split('.').pop();
      const photoRef = ref(storage, `${user.uid}/profile-pic.${ext}`);
      
      await uploadBytes(photoRef, file);
      const publicUrl = await getDownloadURL(photoRef);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: publicUrl
      });
      
      window.location.reload(); // Simple way to refresh for now
    } catch (err: any) {
      console.error(err);
      alert("Error updating profile photo: " + (err.message || "Unknown error"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">Artist profile</h1>
           <p className="text-slate-400 font-medium">Command your personal and professional identity across the network.</p>
        </div>
        <button 
          onClick={logout}
          className="bg-rose-50 text-rose-500 p-4 px-10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10"
        >
           Terminate Session <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Identity Hub */}
         <div className="space-y-12">
            <div className="bg-white p-12 rounded-[4.5rem] shadow-sm border border-slate-50 flex flex-col items-center text-center gap-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-blue/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="relative group">
                  <div className="w-48 h-48 rounded-[3.5rem] bg-slate-900 border-8 border-slate-50 flex items-center justify-center text-white text-7xl font-black font-display shadow-3xl group-hover:rotate-6 transition-transform duration-700 overflow-hidden">
                     {isUpdating ? (
                       <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                     ) : profile?.photoURL ? (
                       <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-linear-to-br from-brand-blue to-brand-purple bg-clip-text text-transparent">
                          {profile?.displayName?.[0] || 'A'}
                       </span>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUpdating}
                    className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-[1.5rem] shadow-3xl flex items-center justify-center text-brand-blue border-4 border-slate-50 hover:scale-110 transition-all hover:bg-slate-950 hover:text-white disabled:opacity-50"
                  >
                     <Camera className="w-6 h-6" />
                  </button>
               </div>

               <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                     <h3 className="text-4xl font-black font-display tracking-tight uppercase text-slate-800">{profile?.displayName}</h3>
                     <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Verified IND Artist Entity</p>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-6 bg-slate-50 rounded-[2.5rem] text-center group hover:bg-slate-950 transition-all duration-500">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500">Master Assets</p>
                     <p className="text-3xl font-black font-display text-slate-800 group-hover:text-white">12</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[2.5rem] text-center group hover:bg-brand-blue transition-all duration-500">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-white/50">Engagement</p>
                     <p className="text-3xl font-black font-display text-slate-800 group-hover:text-white">4.2k</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-950 p-12 rounded-[4.5rem] shadow-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-blue/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <h3 className="text-2xl font-black font-display text-white uppercase mb-4 flex items-center gap-4">
                  <Award className="w-7 h-7 text-brand-blue" />
                  OAC Verification
               </h3>
               <p className="text-blue-100/50 text-sm font-medium leading-relaxed mb-10">Ascend to the elite tier with an Official Artist Channel badge. Direct YouTube partnership synthesis.</p>
               <button className="w-full py-5 bg-white text-slate-950 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-brand-blue hover:text-white transition-all transform hover:scale-105">Initialize Application</button>
            </div>
         </div>

         {/* Configuration Center */}
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-14 rounded-[5rem] shadow-sm border border-slate-50 space-y-16">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl">
                        <Settings className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black font-display tracking-tight uppercase">Protocol Settings</h3>
                        <p className="text-slate-400 font-medium">Enterprise account configuration.</p>
                     </div>
                  </div>
                  <button className="p-5 bg-slate-50 text-slate-300 rounded-2xl hover:text-brand-blue hover:bg-white hover:shadow-xl transition-all">
                     <PenLine className="w-6 h-6" />
                  </button>
               </div>

               <div className="grid md:grid-cols-2 gap-12">
                  {[
                    { label: "Legal Identity", val: profile?.displayName || "-----------", icon: User },
                    { label: "Transmission Email", val: profile?.email || "-----------", icon: Mail },
                    { label: "Verified Phone", val: "+91 ••••••••••", icon: Smartphone },
                    { label: "Clearance Tier", val: profile?.role?.toUpperCase() || "ARTIST", icon: Award },
                    { label: "Primary Grid", val: "ASIA-PACIFIC (IN)", icon: Globe },
                    { label: "Default Publisher", val: "IND RECORDS GROUP", icon: Music },
                  ].map((f, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex gap-8 items-start group"
                    >
                       <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:rotate-6">
                          <f.icon className="w-7 h-7" />
                       </div>
                       <div className="pt-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{f.label}</p>
                          <p className="text-xl font-bold text-slate-800 tracking-tight">{f.val}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-emerald-500 p-12 rounded-[4rem] text-white space-y-8 shadow-3xl shadow-emerald-500/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-[2rem] flex items-center justify-center text-white rotate-6 group-hover:rotate-0 transition-transform">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black font-display uppercase tracking-tight">Security Shield</h3>
                         <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">Multi-Factor Active</p>
                      </div>
                   </div>
                   <button className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Manage Encryption</button>
               </div>

               <div className="bg-brand-purple p-12 rounded-[4rem] text-white space-y-8 shadow-3xl shadow-purple-500/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-[2rem] flex items-center justify-center text-white -rotate-6 group-hover:rotate-0 transition-transform">
                         <Bell className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black font-display uppercase tracking-tight">Comms Center</h3>
                         <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">Push System: Active</p>
                      </div>
                   </div>
                   <button className="w-full py-5 bg-white text-brand-purple rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Alert Protocol</button>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-50 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-all">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                     <Lock className="w-7 h-7" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black font-display uppercase tracking-tight text-slate-800">Authorization Logs</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">View the history of your session access.</p>
                  </div>
               </div>
               <ChevronRight className="w-8 h-8 text-slate-200 group-hover:text-slate-900 transition-colors" />
            </div>
         </div>
      </div>
    </div>
  );
}
