import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
export default function TaskDetail(){const {id}=useParams();const {user}=useAuth();const [task,setTask]=useState(null);const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 const load=()=>api.get(`/tasks/${id}`).then(r=>setTask(r.data.task)).catch(e=>setError(e.response?.data?.message||"Unable to load task."));useEffect(()=>{load();},[id]);
 const update=async status=>{setBusy(true);setError("");try{await api.patch(`/tasks/${id}/status`,{status});await load();}catch(e){setError(e.response?.data?.message||"Status update failed.");}finally{setBusy(false);}};
 if(!task&&!error)return <Loader/>;if(error&&!task)return <Alert message={error}/>;
 const isAssignee=String(task.assignedUser?._id)===String(user.id||user._id);
 return <><Link to="/tasks" className="text-sm font-semibold text-brand">← Back to tasks</Link><div className="card mt-5 p-7"><Alert message={error}/><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-3xl font-semibold">{task.title}</h2><p className="mt-2 text-slate-400">{task.project?.name}</p></div><span className="rounded-full bg-violet-50 px-4 py-2 text-sm text-brand">{task.status}</span></div><p className="mt-7 whitespace-pre-wrap text-slate-600">{task.description||"No description."}</p><div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3"><div><p className="text-xs text-slate-400">Assigned to</p><b>{task.assignedUser?.firstName} {task.assignedUser?.lastName}</b></div><div><p className="text-xs text-slate-400">Priority</p><b>{task.priority}</b></div><div><p className="text-xs text-slate-400">Due date</p><b>{new Date(task.dueDate).toLocaleDateString()}</b></div></div><div className="mt-8 max-w-sm"><label className="field-label">Update task status</label><select disabled={busy} className="auth-input" value={task.status} onChange={e=>update(e.target.value)}>{["To Do","In Progress","Completed","Blocked"].map(x=><option>{x}</option>)}</select><p className="mt-2 text-xs text-slate-400">The assigned user can change only the task status. The project owner can manage all task fields.</p></div></div></>;
}
