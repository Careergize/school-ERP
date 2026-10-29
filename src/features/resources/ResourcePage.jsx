import React,{useState,useEffect,useCallback} from 'react';
import {Plus,Search,Download,RefreshCw,Eye,Pencil,Trash2,ArrowRight,CheckCircle,RotateCcw,Wallet,ChevronLeft,ChevronRight} from 'lucide-react';
import {resourcePath} from '../../lib/api';
import {computedFields,resourceScreens,queryPath,localDate,money} from '../../lib/modules';
import {useReferences,ReferenceSelect} from '../../components/References';
import {ErrorNotice,EmptyState,Loading,Modal} from '../../components/Feedback';
import {FieldValue,RecordForm,RecordDetails} from './RecordEditor';

export default function ResourcePage({module,config,api,user,route,navigate,notify,onMutation}) {
  const screen=resourceScreens[module]||{};
  const [rows,setRows]=useState([]),[count,setCount]=useState(0),[page,setPage]=useState(1),[size,setSize]=useState(25),[search,setSearch]=useState(''),[query,setQuery]=useState(''),[filters,setFilters]=useState({}),[loading,setLoading]=useState(true),[error,setError]=useState(null),[revision,setRevision]=useState(0),[editor,setEditor]=useState(null),[confirm,setConfirm]=useState(null),[actionBusy,setActionBusy]=useState(false),[pending,setPending]=useState(false);
  const filterKey=JSON.stringify(filters);
  const canWrite=config.can_write??config.roles.includes(user.role);
  const columns=(screen.columns||config.fields.map(field=>field.key)).map(key=>config.fields.find(field=>field.key===key)||{key,...computedFields[key]});
  useEffect(()=>{const timer=setTimeout(()=>{setQuery(search);setPage(1);},300);return()=>clearTimeout(timer);},[search]);
  const reload=useCallback(()=>setRevision(value=>value+1),[]);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setError(null);
    api(queryPath(config.endpoint,{search:query,page,page_size:size,...JSON.parse(filterKey)}),'GET',undefined,{signal:controller.signal})
      .then(result=>{setRows(result.results);setCount(result.count);if(page>1&&!result.results.length&&result.count)setPage(Math.ceil(result.count/size));})
      .catch(error=>{if(error.name!=='AbortError')setError(error);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[api,config.endpoint,query,page,size,filterKey,revision]);
  useEffect(()=>{
    let active=true;setEditor(null);
    if(route.action==='new') {
      if(canWrite)setEditor({mode:'form',defaults:Object.fromEntries(route.params)});
    } else if(route.id) {
      setPending(true);
      api(resourcePath({[module]:config},module,route.id)).then(record=>{if(active)setEditor({mode:route.action==='edit'&&canWrite?'form':'view',record});})
        .catch(error=>{if(active)setError(error);}).finally(()=>{if(active)setPending(false);});
    }
    return()=>{active=false;};
  },[route.key,api,config,module,canWrite]);
  function closeEditor(){setEditor(null);navigate(module);}
  async function save(body) {
    await api(config.endpoint+(editor.record?editor.record.id+'/':''),editor.record?'PUT':'POST',body);
    notify(`${config.singular} saved`);closeEditor();reload();onMutation();
  }
  async function exportCSV(){setActionBusy(true);try{const blob=await api.download(config.export_endpoint);const href=URL.createObjectURL(blob);const link=document.createElement('a');link.href=href;link.download=module+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(href),1000);notify('CSV export downloaded');}catch(error){setError(error);}finally{setActionBusy(false);}}
  async function runAction(){
    setActionBusy(true);setError(null);
    try {
      const latest=await api(config.endpoint+confirm.record.id+'/');
      if(confirm.action==='delete')await api(config.endpoint+latest.id+'/','DELETE');
      if(confirm.action==='enroll')await api(config.endpoint+latest.id+'/enroll/','POST');
      if(confirm.action==='return')await api(config.endpoint+latest.id+'/','PUT',{...latest,returned:localDate()});
      notify(confirm.action==='delete'?'Record deleted':confirm.action==='enroll'?'Applicant enrolled successfully':'Book return recorded');
      setConfirm(null);reload();onMutation();
    }catch(error){setError(error);setConfirm(old=>old?{...old,error}:null);}finally{setActionBusy(false);}
  }
  function changeFilter(key,value){setFilters(old=>({...old,[key]:value}));setPage(1);}
  const editable=record=>canWrite&&!(module==='admissions'&&record.status==='Accepted')&&!(user.role==='teacher'&&['notices','messages'].includes(module)&&record.author_id!==user.id);
  return <>
    <div className="page-heading"><div><div className="eyebrow">{config.app.toUpperCase()} / SCHOOL OPERATIONS</div><h1>{config.label}</h1><p>{screen.description||`Manage ${config.label.toLowerCase()}.`}</p></div>
      <div className="actions"><button className="outline" onClick={exportCSV} disabled={actionBusy}><Download size={16}/>Export CSV</button>{canWrite&&<button className="primary" onClick={()=>navigate(module+'/new')}><Plus size={17}/>Add {config.singular.toLowerCase()}</button>}</div>
    </div>
    <ErrorNotice error={confirm?null:error} onClose={()=>setError(null)}/>
    <div className="panel">
      <div className="list-toolbar"><h3>{config.label} <span className="count">{count}</span></h3><div className="toolbar-actions"><div className="search"><Search size={16}/><input aria-label={`Search ${config.label}`} value={search} placeholder="Search records…" onChange={event=>setSearch(event.target.value)}/></div><button className="icon-button" aria-label="Refresh records" disabled={loading} onClick={reload}><RefreshCw size={16}/></button></div></div>
      {!!screen.filters?.length&&<div className="filter-bar">{screen.filters.map(key=>{
        const field=config.fields.find(field=>field.key===key);if(!field)return null;
        return <div key={key} className="filter"><label htmlFor={'filter-'+key}>{field.label}</label>{field.type.startsWith('ref:')?<ReferenceSelect id={'filter-'+key} module={field.type.slice(4)} value={filters[key]||''} onChange={value=>changeFilter(key,value)}/>:
          field.type==='select'?<select id={'filter-'+key} value={filters[key]||''} onChange={event=>changeFilter(key,event.target.value)}><option value="">All {field.label.toLowerCase()}</option>{field.options.map(option=><option key={option}>{option}</option>)}</select>:
          <input id={'filter-'+key} type={field.type} value={filters[key]||''} onChange={event=>changeFilter(key,event.target.value)}/>}</div>;
      })}{Object.values(filters).some(Boolean)&&<button className="text-button" onClick={()=>{setFilters({});setPage(1);}}>Clear filters</button>}</div>}
      {loading?<Loading text={`Loading ${config.label.toLowerCase()}…`}/>:!rows.length?<EmptyState title={query||Object.values(filters).some(Boolean)?'No matching records':`No ${config.label.toLowerCase()} yet`} description={query?'Try another search or clear your filters.':'Add a record to get started. Related records must be created first.'}>{canWrite&&!query&&<button className="primary" onClick={()=>navigate(module+'/new')}><Plus size={15}/>Add {config.singular.toLowerCase()}</button>}</EmptyState>:
      <div className="table-scroll"><table><thead><tr>{columns.map(field=><th key={field.key}>{field.label||field.key}</th>)}<th>ACTIONS</th></tr></thead><tbody>{rows.map(record=><tr key={record.id}>{columns.map(field=><td key={field.key}><FieldValue field={field} value={record[field.key]}/></td>)}
        <td><div className="row-actions"><button title="View full record" aria-label={`View record ${record.id}`} onClick={()=>navigate(module+'/'+record.id)}><Eye size={15}/></button>
          {editable(record)&&<><button title="Edit record" aria-label={`Edit record ${record.id}`} onClick={()=>navigate(module+'/'+record.id+'/edit')}><Pencil size={14}/></button><button title="Delete record" aria-label={`Delete record ${record.id}`} onClick={()=>setConfirm({action:'delete',record})}><Trash2 size={14}/></button></>}
          {module==='admissions'&&canWrite&&!['Accepted','Rejected'].includes(record.status)&&<button className="action-link" onClick={()=>setConfirm({action:'enroll',record})}><CheckCircle size={14}/>Enroll</button>}
          {module==='loans'&&canWrite&&!record.returned&&<button className="action-link" onClick={()=>setConfirm({action:'return',record})}><RotateCcw size={14}/>Return</button>}
          {module==='fees'&&canWrite&&Number(record.balance)>0&&<button className="action-link" onClick={()=>navigate('payments/new',{invoice_id:record.id,amount:record.balance,date:localDate(),method:'Cash'})}><Wallet size={14}/>Receipt</button>}
        </div></td></tr>)}</tbody></table></div>}
      <div className="pagination"><span>{count?`${(page-1)*size+1}–${Math.min(page*size,count)} of ${count}`:'0 records'}</span><div><label>Rows<select aria-label="Rows per page" value={size} onChange={event=>{setSize(Number(event.target.value));setPage(1);}}>{[10,25,50,100].map(value=><option key={value}>{value}</option>)}</select></label><button aria-label="Previous page" disabled={page===1||loading} onClick={()=>setPage(page-1)}><ChevronLeft size={17}/></button><span>Page {page}</span><button aria-label="Next page" disabled={page*size>=count||loading} onClick={()=>setPage(page+1)}><ChevronRight size={17}/></button></div></div>
    </div>
    {pending&&<div className="floating-loading"><Loading text="Opening record…"/></div>}
    {editor?.mode==='form'&&<RecordForm module={module} config={config} record={editor.record} defaults={editor.defaults} user={user} onClose={closeEditor} onSave={save}/>}
    {editor?.mode==='view'&&<RecordDetails config={config} record={editor.record} onClose={closeEditor} canEdit={editable(editor.record)} onEdit={()=>navigate(module+'/'+editor.record.id+'/edit')}/>}
    {confirm&&<Modal title={{delete:'Delete this record?',enroll:'Enroll this applicant?',return:'Record book return?'}[confirm.action]} subtitle={config.label} onClose={()=>{if(!actionBusy)setConfirm(null);}}>
      <p>{confirm.action==='delete'?'This removes the record permanently. Records linked elsewhere are protected and cannot be removed.':confirm.action==='enroll'?'This accepts the application, creates the student profile, and records enrollment history. Class capacity is checked before enrollment.':`This records ${localDate()} as the return date and makes the copy available to lend again.`}</p>
      <ErrorNotice error={confirm.error}/><div className="modal-footer"><button className="outline" disabled={actionBusy} onClick={()=>setConfirm(null)}>Cancel</button><button className={confirm.action==='delete'?'danger-button':'primary'} disabled={actionBusy} onClick={runAction}>{actionBusy?'Working…':{delete:'Delete record',enroll:'Enroll student',return:'Confirm return'}[confirm.action]}</button></div>
    </Modal>}
  </>;
}
