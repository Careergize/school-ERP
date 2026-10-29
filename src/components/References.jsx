import React,{createContext,useContext,useState,useEffect,useCallback,useRef,useMemo} from 'react';
import {resourcePath} from '../lib/api';
import {queryPath} from '../lib/modules';

const References=createContext(null);
export function ReferenceProvider({api,catalog,revision,navigate,children}) {
  const cache=useMemo(()=>new Map(),[api,revision]);
  const get=useCallback((module,id)=>{
    const key=module+':'+id;
    if(!cache.has(key)) cache.set(key,api(resourcePath(catalog,module,id)).catch(error=>{cache.delete(key);throw error;}));
    return cache.get(key);
  },[api,catalog,cache]);
  const label=useCallback(async(module,record)=>{
    if(record.name) return record.name+(record.roll?` · ${record.roll}`:record.code?` · ${record.code}`:'');
    const resolve=async(target,id)=>id?get(target,id).then(row=>row.name||row.month||`#${id}`).catch(()=>`#${id}`):'';
    if(record.staff_id) return `${await resolve('staff',record.staff_id)} · ${record.month||record.date||'Review'}`;
    if(record.invoice_id) return `${await resolve('fees',record.invoice_id)} · ${record.amount}`;
    if(record.student_id) {
      const person=await resolve('students',record.student_id);
      const target=record.exam_id?['exams',record.exam_id]:record.book_id?['books',record.book_id]:record.assignment_id?['assignments',record.assignment_id]:record.route_id?['transport',record.route_id]:record.hostel_id?['hostels',record.hostel_id]:record.class_id?['classes',record.class_id]:null;
      return `${person} · ${target?await resolve(...target):record.date||record.from_date||'#'+record.id}`;
    }
    return `${catalog[module]?.singular||'Record'} #${record.id}`;
  },[get,catalog]);
  return <References.Provider value={{api,catalog,get,label,navigate}}>{children}</References.Provider>;
}
export function useReferences(){return useContext(References);}
export function ReferenceLabel({module,id,link=false}) {
  const {get,label,navigate}=useReferences();const [text,setText]=useState(id?'Loading…':'—');
  useEffect(()=>{let active=true;if(!id){setText('—');return;}get(module,id).then(row=>label(module,row)).then(text=>{if(active)setText(text);}).catch(()=>{if(active)setText(`Record #${id} unavailable`);});return()=>{active=false;};},[module,id,get,label]);
  return link&&id&&navigate?<button type="button" className="record-link" onClick={()=>navigate(module+'/'+id)}>{text}</button>:<span>{text}</span>;
}
export function ReferenceSelect({module,value,onChange,filters={},required=false,disabled=false,id,invalid=false}) {
  const {api,catalog,get,label}=useReferences();
  const [query,setQuery]=useState(''),[options,setOptions]=useState([]),[page,setPage]=useState(1),[next,setNext]=useState(null),[busy,setBusy]=useState(true),[error,setError]=useState(''),[selected,setSelected]=useState(null);
  const serialFilters=JSON.stringify(filters);const generation=useRef(0);
  useEffect(()=>{setPage(1);},[query,serialFilters]);
  useEffect(()=>{
    const request=++generation.current;const controller=new AbortController();
    const timer=setTimeout(async()=>{
      setBusy(true);setError('');
      try {
        const result=await api(queryPath(resourcePath(catalog,module),{...JSON.parse(serialFilters),search:query,page,page_size:25}),'GET',undefined,{signal:controller.signal});
        const resolved=await Promise.all(result.results.map(async record=>({id:record.id,label:await label(module,record)})));
        if(request===generation.current){setOptions(old=>page===1?resolved:[...old,...resolved.filter(option=>!old.some(existing=>existing.id===option.id))]);setNext(result.next);}
      } catch(error){if(error.name!=='AbortError'&&request===generation.current)setError(error.message);}
      finally{if(request===generation.current)setBusy(false);}
    },200);
    return()=>{clearTimeout(timer);controller.abort();};
  },[api,catalog,module,query,page,serialFilters,label]);
  useEffect(()=>{let active=true;if(!value){setSelected(null);return;}get(module,value).then(async row=>({id:row.id,label:await label(module,row)})).then(row=>{if(active)setSelected(row);}).catch(()=>{if(active)setSelected({id:Number(value),label:`Record #${value} unavailable`});});return()=>{active=false;};},[value,module,get,label]);
  const visible=selected&&!options.some(option=>option.id===selected.id)?[selected,...options]:options;
  return <div className="reference-select"><input aria-label={`Search ${catalog[module]?.label||module} options`} value={query} onChange={event=>setQuery(event.target.value)} placeholder={`Search ${catalog[module]?.label.toLowerCase()||module}…`} disabled={disabled}/>
    <select id={id} value={value??''} onChange={event=>onChange(event.target.value)} required={required} disabled={disabled} aria-invalid={invalid}>
      <option value="">Select {catalog[module]?.singular.toLowerCase()||'record'}</option>{visible.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}
    </select>{busy&&<small>Loading options…</small>}{error&&<small className="field-error">{error}</small>}{!busy&&!error&&!options.length&&<small>No matching records. Add {catalog[module]?.label.toLowerCase()} first if needed.</small>}
    {next&&<button type="button" className="text-button" disabled={busy} onClick={()=>setPage(next)}>Load more options</button>}
  </div>;
}
