import React,{useState,useEffect,useMemo,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {GraduationCap,LayoutDashboard,Users,BookOpen,ClipboardCheck,Wallet,Library,Bus,Building2,Bell,Settings,Shield,Menu,ChevronRight,LogOut,CalendarDays,Briefcase} from 'lucide-react';
import './style.css';
import './theme.css';
import {createApiClient,endpoints} from './lib/api';
import {navigation} from './lib/modules';
import {ReferenceProvider} from './components/References';
import {ErrorNotice,Loading,EmptyState} from './components/Feedback';
import ResourcePage from './features/resources/ResourcePage';
import Dashboard from './features/dashboard/Dashboard';
import Reports from './features/reporting/Reports';
import Audit from './features/reporting/Audit';
import SettingsPage from './features/accounts/SettingsPage';

function readRoute(){
  const [path,query='']=location.hash.replace(/^#\/?/,'').split('?');
  const [page='dashboard',id,action]=path.split('/');
  return {page:page||'dashboard',id:/^\d+$/.test(id||'')?Number(id):null,action:id==='new'?'new':action||'',params:new URLSearchParams(query),key:location.hash};
}
const icons={dashboard:LayoutDashboard,students:Users,parents:Users,enrollments:GraduationCap,admissions:GraduationCap,classes:BookOpen,attendance:ClipboardCheck,timetable:CalendarDays,fees:Wallet,payments:Wallet,books:Library,loans:Library,transport:Bus,transport_allocations:Bus,hostels:Building2,hostel_allocations:Building2,notices:Bell,messages:Bell,staff:Briefcase,payroll:Wallet,settings:Settings,school_settings:Settings,audit:Shield,reports:LayoutDashboard};
function Login({api,onLogin,message}) {
  const [error,setError]=useState(null),[busy,setBusy]=useState(false);
  async function submit(event){event.preventDefault();setBusy(true);setError(null);try{const result=await api(endpoints.login,'POST',Object.fromEntries(new FormData(event.currentTarget)));onLogin(result);}catch(error){setError(error);}finally{setBusy(false);}}
  return <div className="login"><div className="login-story"><GraduationCap size={44}/><h1>A little more connected.<br/>A lot more possible.</h1><p>One home for your school’s people, learning, and everyday operations.</p><span>Schoolhouse / School management, thoughtfully connected.</span></div><form onSubmit={submit} className="login-form"><div className="brand"><GraduationCap/> schoolhouse<span>ERP</span></div><h2>Welcome back</h2><p>Sign in to your school workspace.</p>{message&&<div className="info-notice" role="status">{message}</div>}<label>Email address<input name="email" type="email" autoComplete="username" required placeholder="admin@school.local"/></label><label>Password<input name="password" type="password" autoComplete="current-password" required/></label><ErrorNotice error={error}/><button className="primary" disabled={busy}>{busy?'Signing in…':'Sign in to workspace →'}</button><small>Your school data is loaded from the Django server.</small></form></div>;
}
function App(){
  const [token,setToken]=useState(()=>sessionStorage.getItem('erp-token')||''),[user,setUser]=useState(null),[catalog,setCatalog]=useState(null),[route,setRoute]=useState(readRoute),[nav,setNav]=useState(false),[error,setError]=useState(null),[message,setMessage]=useState(''),[toast,setToast]=useState(''),[revision,setRevision]=useState(0),[retry,setRetry]=useState(0),[school,setSchool]=useState(null),[year,setYear]=useState('');
  const signOut=useCallback((message='')=>{sessionStorage.removeItem('erp-token');setToken('');setUser(null);setCatalog(null);setMessage(message);setError(null);},[]);
  const api=useMemo(()=>createApiClient(token,()=>signOut('Your session expired. Please sign in again.')),[token,signOut]);
  const notify=useCallback(text=>setToast(text),[]);
  const onMutation=useCallback(()=>setRevision(value=>value+1),[]);
  const navigate=useCallback((path,params={})=>{const query=new URLSearchParams(params);location.hash='/'+path+(query.size?'?'+query:'');setNav(false);},[]);
  useEffect(()=>{const change=()=>setRoute(readRoute());window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),4000);return()=>clearTimeout(timer);},[toast]);
  useEffect(()=>{
    if(!token)return;const controller=new AbortController();setError(null);
    Promise.all([api(endpoints.me,'GET',undefined,{signal:controller.signal}),api(endpoints.catalog,'GET',undefined,{signal:controller.signal})]).then(([user,catalog])=>{setUser(user);setCatalog(catalog);}).catch(error=>{if(error.name!=='AbortError')setError(error);});
    return()=>controller.abort();
  },[token,api,retry]);
  useEffect(()=>{
    if(!catalog)return;let active=true;
    if(catalog.school_settings?.can_read)api(catalog.school_settings.endpoint+'?page_size=1').then(result=>{if(active)setSchool(result.results[0]||null);}).catch(()=>{});
    if(catalog.academic_years?.can_read)api(catalog.academic_years.endpoint+'?page_size=1').then(result=>{if(active)setYear(result.results[0]?.name||'');}).catch(()=>{});
    return()=>{active=false;};
  },[catalog,api,revision]);
  if(!token)return <Login api={api} message={message} onLogin={result=>{sessionStorage.setItem('erp-token',result.token);setToken(result.token);setUser(result.user);setMessage('');}}/>;
  if(!catalog||!user)return <div className="boot-screen"><div className="brand"><GraduationCap/>schoolhouse</div>{error?<><ErrorNotice error={error}/><button className="primary" onClick={()=>setRetry(value=>value+1)}>Retry connection</button><button className="outline" onClick={()=>signOut()}>Back to sign in</button></>:<Loading text="Connecting to your school workspace…"/>}</div>;
  const config=catalog[route.page];const allowed=config?.can_read!==false;
  const title=config?.label||{dashboard:'Overview',reports:'Reports & analytics',audit:'Audit log',settings:'Account settings'}[route.page]||'Page not found';
  const visible=page=>catalog[page]?catalog[page].can_read!==false:['dashboard','reports','settings'].includes(page)||(page==='audit'&&user.role==='admin');
  return <ReferenceProvider api={api} catalog={catalog} revision={revision} navigate={navigate}><div className="shell">
    {nav&&<button className="nav-backdrop" aria-label="Close navigation" onClick={()=>setNav(false)}/>}
    <aside className={nav?'open':''}><div className="brand"><GraduationCap size={28}/>schoolhouse<span>ERP</span></div><div className="school"><div className="school-icon">{school?.name?.[0]||'S'}</div><div><b>{school?.name||'School workspace'}</b><small>{year||'Connected school management'}</small></div></div>
      <nav aria-label="School modules">{navigation.map(([group,pages])=>{const items=pages.filter(visible);if(!items.length)return null;return <section key={group}><h6>{group}</h6>{items.map(page=>{const Icon=icons[page]||BookOpen;return <button key={page} className={route.page===page?'active':''} aria-current={route.page===page?'page':undefined} onClick={()=>navigate(page)}><Icon size={17}/>{catalog[page]?.label||{dashboard:'Overview',reports:'Reports & analytics',audit:'Audit log',settings:'Account settings'}[page]}</button>;})}</section>;})}</nav>
      <div className="sidebar-bottom"><div className="avatar">{user.name[0]}</div><div><b>{user.name}</b><small>{user.role}</small></div><button aria-label="Sign out" onClick={async()=>{try{await api(endpoints.logout,'POST');signOut('You have signed out.');}catch(error){setError(error);}}}><LogOut size={17}/></button></div>
    </aside>
    <main><header><button className="mobile" aria-label="Open navigation" onClick={()=>setNav(true)}><Menu/></button><div className="crumb"><button onClick={()=>navigate('dashboard')}>Workspace</button><ChevronRight size={14}/><b>{title}</b></div><div className="header-right"><span className="live-dot"/><span>School operations</span><span className="divider"/><button onClick={()=>navigate('notices')} aria-label="Open notices"><Bell size={19}/></button><button className="avatar" aria-label="Account settings" onClick={()=>navigate('settings')}>{user.name[0]}</button></div></header>
      <div className="content"><ErrorNotice error={error} onClose={()=>setError(null)}/>
        {config&&allowed?<ResourcePage key={route.page} module={route.page} config={config} api={api} user={user} route={route} navigate={navigate} notify={notify} onMutation={onMutation}/>:
          route.page==='dashboard'?<Dashboard api={api} catalog={catalog} user={user} navigate={navigate} revision={revision}/>:
          route.page==='reports'?<Reports api={api} catalog={catalog} navigate={navigate} revision={revision}/>:
          route.page==='audit'&&user.role==='admin'?<Audit api={api} revision={revision}/>:
          route.page==='settings'?<SettingsPage api={api} user={user} notify={notify} onSignedOut={signOut}/>:
          <EmptyState title={config?'Access unavailable':'Page not found'} description={config?'Your account does not have access to this module.':'Choose a module from the navigation.'}><button className="primary" onClick={()=>navigate('dashboard')}>Go to overview</button></EmptyState>}
        <footer><span>schoolhouse <b>·</b>A better school day, together.</span><span>Connected to Django ERP</span></footer>
      </div>
    </main>{toast&&<div className="toast" role="status">✓ {toast}</div>}
  </div></ReferenceProvider>;
}
createRoot(document.getElementById('root')).render(<App/>);
