import React,{useState,useEffect} from 'react';
import {RefreshCw} from 'lucide-react';
import {endpoints} from '../../lib/api';
import {money} from '../../lib/modules';
import {ErrorNotice,Loading} from '../../components/Feedback';

export default function Reports({api,catalog,revision,navigate}) {
  const [summary,setSummary]=useState(null),[error,setError]=useState(null),[loading,setLoading]=useState(true),[refresh,setRefresh]=useState(0);
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError(null);api(endpoints.summary,'GET',undefined,{signal:controller.signal}).then(setSummary).catch(error=>{if(error.name!=='AbortError')setError(error);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[api,revision,refresh]);
  const cards=[['Invoiced',summary?.finance.invoiced],['Collected',summary?.finance.collected],['Outstanding',summary?.finance.outstanding],['Net payroll',summary?.payroll.net_total]];
  const visible=Object.entries(summary?.counts||{}).filter(([module])=>catalog[module]?.can_read!==false);
  const max=Math.max(1,...visible.map(([,count])=>count));
  return <><div className="page-heading"><div><div className="eyebrow">REPORTING / INSIGHTS</div><h1>Reports & analytics</h1><p>Live, permission-scoped totals as of {summary?.as_of||'today'}.</p></div><button className="outline" disabled={loading} onClick={()=>setRefresh(value=>value+1)}><RefreshCw size={16}/>Refresh reports</button></div><ErrorNotice error={error}/>
    {loading&&!summary?<Loading text="Loading reports…"/>:<><div className="stats">{cards.map(([label,value])=><div className="stat" key={label}><p>{label}</p><strong>{money(value)}</strong></div>)}</div><div className="panel report-list"><h3>Records by module</h3><p>Select a module to review or export its records.</p>{visible.map(([module,count])=><div key={module}><button className="record-link" onClick={()=>navigate(module)}>{catalog[module]?.label||module}</button><div className="bar-track"><div style={{width:count/max*100+'%'}}/></div><b>{count}</b></div>)}</div></>}
  </>;
}
