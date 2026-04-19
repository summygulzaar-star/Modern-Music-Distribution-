import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Users, Search, MoreHorizontal, UserCheck, UserX, Wallet, Mail } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateDoc(doc(db, "users", userId), { status: nextStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-5xl font-black font-display tracking-tight uppercase">User Directory</h1>
           <p className="text-slate-400 font-medium">Manage artist access, wallet balances, and account status.</p>
        </div>
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
           <input 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Search by name or email..."
             className="bg-[#1E293B] border-slate-700 rounded-2xl py-4 pl-14 pr-8 text-sm focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium min-w-[300px]"
           />
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-2xl">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-12 py-8">User Identity</th>
                  <th className="px-6 py-8">Role</th>
                  <th className="px-6 py-8">Wallet Balance</th>
                  <th className="px-6 py-8">Join Date</th>
                  <th className="px-6 py-8">Status</th>
                  <th className="px-12 py-8 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               {filteredUsers.map((u, i) => (
                 <tr key={i} className="group hover:bg-slate-800/50 transition-colors">
                    <td className="px-12 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm">
                             {u.displayName?.[0] || 'U'}
                          </div>
                          <div>
                             <p className="font-bold text-white">{u.displayName}</p>
                             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                                <Mail className="w-3 h-3" /> {u.email}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-300 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg">
                          {u.role}
                       </span>
                    </td>
                    <td className="px-6 py-8">
                       <div className="flex items-center gap-2 text-emerald-400 font-black font-display text-lg">
                          <Wallet className="w-5 h-5 opacity-40" /> {formatCurrency(u.walletBalance || 0)}
                       </div>
                    </td>
                    <td className="px-6 py-8 text-[10px] font-bold text-slate-500 uppercase">
                       {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-8">
                       <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          u.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                       )}>
                          {u.status}
                       </span>
                    </td>
                    <td className="px-12 py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleStatus(u.id, u.status)}
                            className={cn(
                              "p-3 rounded-xl transition-all",
                              u.status === 'active' ? "text-slate-500 hover:bg-rose-500/10 hover:text-rose-500" : "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                            )}>
                             {u.status === 'active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </button>
                          <button className="p-3 text-slate-500 hover:text-white transition-colors">
                             <MoreHorizontal className="w-5 h-5" />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
               {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-12 py-24 text-center text-slate-500 font-medium uppercase tracking-[0.2em]">No Users Found.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
