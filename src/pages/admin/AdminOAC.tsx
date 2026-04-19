import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Youtube, Search, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

export default function AdminOAC() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, "oac_requests"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchRequests();
  }, []);

  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-5xl font-black font-display tracking-tight uppercase">OAC Portal</h1>
         <p className="text-slate-400 font-medium">Verify and transmit YouTube Official Artist Channel applications.</p>
      </div>

      <div className="bg-[#1E293B] rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-2xl">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-12 py-8">Artist Entity</th>
                  <th className="px-6 py-8">Channel Details</th>
                  <th className="px-6 py-8">Topic Channel</th>
                  <th className="px-6 py-8">Status</th>
                  <th className="px-12 py-8 text-right">Review</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               {requests.map((r, i) => (
                 <tr key={i} className="group hover:bg-slate-800/50 transition-colors">
                    <td className="px-12 py-8">
                       <p className="font-bold text-white uppercase text-sm tracking-tight">{r.artistName}</p>
                       <p className="text-[10px] text-slate-500 uppercase mt-1">{r.email}</p>
                    </td>
                    <td className="px-6 py-8">
                       <a href={r.channelLink} target="_blank" className="flex items-center gap-2 text-brand-blue hover:underline text-xs font-bold uppercase tracking-widest">
                          View Channel <ExternalLink className="w-3 h-3" />
                       </a>
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{r.topicChannel || "---"}</p>
                    </td>
                    <td className="px-6 py-8">
                       <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          r.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-12 py-8 text-right">
                       <button className="px-6 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest">Manage Request</button>
                    </td>
                 </tr>
               ))}
               {requests.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-12 py-24 text-center">
                       <Youtube className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-20" />
                       <p className="text-slate-500 font-bold uppercase tracking-widest">No OAC requests in transmission.</p>
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
