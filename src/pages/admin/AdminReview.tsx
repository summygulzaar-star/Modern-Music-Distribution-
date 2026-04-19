import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { 
  Check, 
  X, 
  RotateCcw, 
  Play, 
  Pause, 
  Download, 
  Edit, 
  Save,
  Music,
  FileText,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Globe
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function AdminReview() {
  const { releaseId } = useParams();
  const navigate = useNavigate();
  const [release, setRelease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isrc, setIsrc] = useState("");
  const [upc, setUpc] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [links, setLinks] = useState<any>({});

  const platforms = [
    { id: 'spotify', name: 'Spotify' },
    { id: 'apple', name: 'Apple Music' },
    { id: 'yt', name: 'YouTube Music' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'jio', name: 'JioSaavn' },
    { id: 'gaana', name: 'Gaana' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'snapchat', name: 'Snapchat' },
    { id: 'amazon', name: 'Amazon Music' },
    { id: 'wynk', name: 'Wynk Music' }
  ];

  useEffect(() => {
    const fetchRelease = async () => {
      if (!releaseId) return;
      const d = await getDoc(doc(db, "releases", releaseId));
      if (d.exists()) {
        const data = d.data();
        setRelease({ id: d.id, ...data });
        setFormData(data);
        setIsrc(data.isrc || "");
        setUpc(data.upc || "");
        setLinks(data.platformLinks || {});
      }
      setLoading(false);
    };
    fetchRelease();
  }, [releaseId]);

  const handleUpdate = async (newStatus: string) => {
    if (!releaseId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "releases", releaseId), {
        ...formData,
        status: newStatus,
        isrc: isrc || null,
        upc: upc || null,
        platformLinks: links,
        adminNotes: rejectionReason,
        reviewedAt: new Date().toISOString()
      });
      navigate("/admin");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white animate-pulse">Initializing Master Reviewer...</div>;
  if (!release) return <div className="p-10 text-white">Release not found.</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button onClick={() => navigate("/admin")} className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
               <RotateCcw className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-black font-display tracking-tight uppercase">REVIEW: <span className="text-brand-blue">{release.title}</span></h1>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => handleUpdate("approved")}
              disabled={saving}
              className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40"
            >
               <Check className="w-5 h-5" /> APPROVE
            </button>
            <button 
              onClick={() => setShowRejectionModal(true)}
              disabled={saving}
              className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40"
            >
               <X className="w-5 h-5" /> REJECT
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Media Center */}
         <div className="space-y-8">
            <div className="bg-[#1E293B] p-8 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
               <img src={release.coverUrl} className="w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
               <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between">
                  <div className="p-2 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center gap-4">
                     <button className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-white" />
                     </button>
                     <div className="pr-4">
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/60">Audio Quality</p>
                        <p className="text-sm font-bold text-white">HI-FI MASTERED</p>
                     </div>
                  </div>
                  <a href={release.audioUrl} download className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                     <Download className="w-5 h-5" />
                  </a>
               </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center gap-6">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                <div>
                   <h4 className="font-bold text-emerald-500">ASSET VERIFICATION</h4>
                   <p className="text-xs text-slate-400 font-medium">3000x3000px Cover • WAV Master • Original IP</p>
                </div>
            </div>
         </div>

         {/* Metadata Control */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1E293B] rounded-[3.5rem] border border-slate-800 p-12">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black font-display tracking-tight flex items-center gap-4 uppercase">
                     <FileText className="text-brand-blue w-8 h-8" /> METADATA TABLE
                  </h3>
                  <button 
                    onClick={() => setEditMode(!editMode)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      editMode ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    )}
                  >
                     {editMode ? <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Snapshot</span> : <span className="flex items-center gap-2"><Edit className="w-4 h-4" /> Unlock Table</span>}
                  </button>
               </div>

               <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "Track Title", key: "songName" },
                    { label: "Primary Artist", key: "singerName" },
                    { label: "Lyricist", key: "lyricist" },
                    { label: "Composer", key: "composer" },
                    { label: "Producer", key: "producer" },
                    { label: "Label", key: "labelName" },
                    { label: "Primary Genre", key: "primaryGenre" },
                    { label: "Secondary Genre", key: "secondaryGenre" },
                    { label: "Language", key: "language" },
                    { label: "Copyright", key: "copyright" },
                    { label: "Publisher", key: "publisher" },
                    { label: "Release Date", key: "releaseDate" },
                    { label: "Instagram ID", key: "instagramId" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-3">
                       <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-2">{field.label}</label>
                       {editMode ? (
                         <input 
                           value={formData[field.key] || ""}
                           onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                           className="w-full bg-slate-900 border-none rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-brand-blue/30 transition-all font-medium"
                         />
                       ) : (
                         <div className="w-full bg-slate-800/50 rounded-2xl p-4 text-sm font-bold text-slate-300 border border-slate-700/50">
                            {release[field.key] || "---"}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* Post-Approval Section */}
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-[3.5rem] p-12">
               <h3 className="text-2xl font-black font-display tracking-tight mb-10 uppercase flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue border border-brand-blue/30 font-bold text-xs italic">i</span>
                  Post-Approval Identifiers
               </h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 ml-2">Assigned ISRC</label>
                     <input 
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value.toUpperCase())}
                        placeholder="IN-XXX-00-00000"
                        className="w-full bg-slate-900 border-brand-blue/20 rounded-2xl p-5 font-mono text-sm tracking-widest text-brand-blue focus:ring-2 focus:ring-brand-blue/40"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 ml-2">UPC Code</label>
                     <input 
                        value={upc}
                        onChange={(e) => setUpc(e.target.value)}
                        placeholder="1900000000000"
                        className="w-full bg-slate-900 border-brand-blue/20 rounded-2xl p-5 font-mono text-sm tracking-widest text-brand-blue focus:ring-2 focus:ring-brand-blue/40"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 mt-8">
               <h3 className="text-2xl font-black font-display tracking-tight mb-10 uppercase flex items-center gap-4">
                  <Globe className="text-emerald-500 w-8 h-8" /> Live Platform URIs
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                  {platforms.map(p => (
                    <div key={p.id} className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{p.name} URL</label>
                       <div className="relative">
                          <input 
                            value={links[p.id] || ""}
                            onChange={(e) => setLinks({...links, [p.id]: e.target.value})}
                            placeholder={`https://${p.id}.com/...`}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-[11px] font-medium text-slate-300 focus:border-brand-blue outline-none transition-all"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700">
                             <ExternalLink className="w-4 h-4" />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button 
                 onClick={() => handleUpdate("live")}
                 className="w-full mt-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all"
               >
                  Finalize & Mark as Live
               </button>
            </div>
         </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-xl w-full bg-[#1E293B] rounded-[4rem] border border-slate-700 p-12 space-y-8"
           >
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white rotate-6 shadow-2xl shadow-rose-900/40">
                    <AlertCircle className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black font-display uppercase tracking-tight">Set Rejection Logic</h3>
                    <p className="text-slate-500 font-medium">Explain why this asset was terminated.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Detailed Reason (Sent to Artist)</label>
                 <textarea 
                   value={rejectionReason}
                   onChange={(e) => setRejectionReason(e.target.value)}
                   rows={6}
                   className="w-full bg-slate-900 border-none rounded-3xl p-8 text-white focus:ring-2 focus:ring-rose-500/30 transition-all font-medium"
                   placeholder="e.g. Artwork contains watermark, Audio quality too low, Invalid metadata..."
                 />
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowRejectionModal(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Cancel</button>
                 <button 
                   onClick={() => handleUpdate("rejected")}
                   disabled={!rejectionReason || saving}
                   className="flex-1 py-4 bg-rose-500 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-rose-900/40"
                 >
                   Confirm Rejection
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
