import React,{useEffect,useState} from 'react';
import {RefreshCw} from 'lucide-react';
import {endpoints} from '../../lib/api';
import {ErrorNotice,Loading,EmptyState} from '../../components/Feedback';

export default function Audit({api,revision}) {
  const [rows,setRows]=useState([]),[error,setError]=useState(null),[loading,setLoading]=useState(true),[refresh,setRefresh]=useState(0);
  useEffect(()=>{const controller=new AbortController();setLoading(true);api(endpoints.audit,'GET',undefined,{signal:controller.signal}).then(setRows).catch(error=>{if(error.name!=='AbortError')setError(error);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[api,revision,refresh]);
  return <><div className="page-heading"><div><div className="eyebrow">SECURITY / AUDIT</div><h1>Audit log</h1><p>Review the latest 500 recorded workspace changes.</p></div><button className="outline" disabled={loading} onClick={()=>setRefresh(value=>value+1)}><RefreshCw size={16}/>Refresh audit</button></div><ErrorNotice error={error}/><div className="panel">{loading?<Loading/>:!rows.length?<EmptyState title="No audit events yet"/>:<div className="table-scroll"><table><thead><tr>{['User','Action','Module','Record','Time'].map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(record=><tr key={record.id}><td>{record.name||'Deleted account'}</td><td>{record.action.replaceAll('_',' ')}</td><td>{record.module.replaceAll('_',' ')}</td><td>#{record.record_id}</td><td>{new Date(record.at).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>}</div></>;
}
