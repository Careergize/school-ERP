import React from 'react';
import {AlertCircle, LoaderCircle, X} from 'lucide-react';

export function ErrorNotice({error,onClose}) {
  if(!error) return null;
  const fields=error.errors||{};
  return <div className="error error-notice" role="alert"><div><b>{error.message||String(error)}</b>
    {!!Object.keys(fields).length&&<ul>{Object.entries(fields).map(([key,messages])=><li key={key}>{!['__all__','non_field_errors'].includes(key)&&key.replaceAll('_',' ')+': '}{Array.isArray(messages)?messages.join(' '):String(messages)}</li>)}</ul>}
  </div>{onClose&&<button type="button" aria-label="Dismiss error" onClick={onClose}><X size={16}/></button>}</div>;
}
export function Loading({text='Loading…'}) {return <div className="loading" role="status"><LoaderCircle size={20} className="spin"/>{text}</div>;}
export function EmptyState({title,description,children}) {return <div className="empty"><AlertCircle size={28}/><h3>{title}</h3>{description&&<p>{description}</p>}{children}</div>;}
export function Modal({title,subtitle,onClose,children,wide=false}) {
  const headingId=React.useId();const element=React.useRef(null);const closeRef=React.useRef(onClose);closeRef.current=onClose;
  React.useEffect(()=>{
    const previous=document.activeElement;
    element.current?.focus();
    const handle=event=>{
      if(event.key==='Escape') closeRef.current();
      if(event.key==='Tab') {
        const nodes=[...element.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')];
        if(!nodes.length) return;
        const first=nodes[0],last=nodes[nodes.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',handle);return()=>{document.removeEventListener('keydown',handle);previous?.focus();};
  },[]);
  return <div className="overlay"><section ref={element} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={headingId} className={'modal'+(wide?' modal-wide':'')}>
    <div className="modal-head"><div>{subtitle&&<small>{subtitle}</small>}<h2 id={headingId}>{title}</h2></div><button type="button" onClick={onClose} aria-label="Close dialog"><X/></button></div>{children}
  </section></div>;
}
export function StatusBadge({value}) {
  const tone=['Rejected','Absent','Overdue','Fail','Withdrawn'].includes(value)?'negative':['Applied','Under review','Draft','Late','Unpaid','Partial'].includes(value)?'pending':'';
  return <span className={'badge '+tone}>{value||'—'}</span>;
}
