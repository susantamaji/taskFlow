import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [form,setForm]=useState({identifier:"",password:""}); const [show,setShow]=useState(false); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const {login}=useAuth(); const navigate=useNavigate();
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{await login(form.identifier,form.password);navigate("/dashboard");}catch(err){setError(err.response?.data?.message||"Unable to log in.");}finally{setBusy(false);}};
  return <AuthShell><h1 className="text-4xl font-semibold tracking-tight text-ink">Welcome back</h1><p className="mt-2 text-slate-400">Sign in to manage your projects.</p><form onSubmit={submit} className="mt-12 space-y-8"><Alert message={error}/><div><label className="field-label">Username or email *</label><input className="auth-input" required placeholder="Enter username or email" value={form.identifier} onChange={e=>setForm({...form,identifier:e.target.value})}/></div><div><label className="field-label">Password *</label><div className="relative"><input className="auth-input pr-16" required type={show?"text":"password"} placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-3 text-sm font-semibold text-slate-400">{show?"Hide":"Show"}</button></div></div><button disabled={busy} className="w-full btn-primary py-4">{busy?"Logging in…":"Log in"}</button></form><p className="mt-7 text-center text-slate-400">New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link></p></AuthShell>;
}
