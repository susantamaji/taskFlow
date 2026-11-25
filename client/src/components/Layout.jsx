import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate(); const [open,setOpen] = useState(false);
  const links = [{to:"/dashboard",label:"Dashboard",icon:LayoutDashboard},{to:"/projects",label:"Projects",icon:FolderKanban},{to:"/tasks",label:"Tasks",icon:ListTodo}];
  const signOut = () => { logout(); navigate("/login"); };
  return <div className="min-h-screen bg-[#f4f6fb] lg:flex">
    <button className="fixed left-4 top-4 z-50 rounded-lg bg-navy p-2 text-white lg:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111c39] px-5 py-7 text-white transition-transform lg:static lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
      <div className="mb-16 flex items-center gap-3 rounded-2xl bg-[#202f59] px-4 py-3 text-2xl font-semibold"><span className="h-8 w-8 rounded-full bg-brand"/>TaskFlow</div>
      <nav className="space-y-3">{links.map(({to,label,icon:Icon},i)=><NavLink onClick={()=>setOpen(false)} key={to} to={to} className={({isActive})=>`flex items-center gap-4 rounded-xl px-4 py-4 font-medium transition ${isActive?"bg-brand text-white":"text-indigo-100/70 hover:bg-white/10"}`}><Icon size={19}/><span className="text-xs opacity-70">0{i+1}</span>{label}</NavLink>)}</nav>
      <button onClick={signOut} className="mt-auto flex items-center gap-3 border-t border-indigo-200/20 px-4 pt-8 text-indigo-100/80 hover:text-white"><LogOut size={19}/>Log out</button>
    </aside>
    <section className="min-w-0 flex-1 lg:ml-0">
      <header className="flex h-[98px] items-center justify-between bg-white px-8 pl-20 shadow-sm lg:px-11"><h1 className="text-2xl font-semibold">TaskFlow</h1><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 text-sm font-bold text-brand">{user?.firstName?.[0]}{user?.lastName?.[0]}</div><div><p className="font-semibold">{user?.firstName} {user?.lastName}</p><p className="text-xs text-slate-400">Student account</p></div></div></header>
      <main className="mx-auto max-w-[1500px] p-5 sm:p-8 lg:p-11"><Outlet/></main>
    </section>
  </div>;
}
