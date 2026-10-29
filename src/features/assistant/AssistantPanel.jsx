import React,{useEffect,useRef,useState} from 'react';
import {Send,X,Plus,Download,FileText,RefreshCw,ChevronLeft,ChevronRight,ShieldCheck,Maximize2} from 'lucide-react';
import {ErrorNotice,Loading} from '../../components/Feedback';
import {money} from '../../lib/modules';
import './assistant.css';
import assistantAvatar from '../../assets/assistant-girl.png';

const Avatar=()=> <img className="assistant-avatar" src={assistantAvatar} alt=""/>;

const root='v1/assistant/';
const label=value=>value===null||value===undefined?'Unavailable':String(value);
const saraGreeting=()=>({id:crypto.randomUUID(),role:'assistant',result:{kind:'greeting',answer:"Hi! I’m Sara, your personalized AI assistant. How can I help you today?",reportable:false,suggestions:['What can you do?','Help with students','Help with faculty']}});

function Answer({message,api,onUpdate,onReport,onDownload,reportState,onAsk,busy}) {
  const answer=message.result;
  const [pageBusy,setPageBusy]=useState(false),[pageError,setPageError]=useState(null);
  async function page(number){setPageBusy(true);setPageError(null);try{const result=await api(`${root}results/${answer.result_id}/?page=${number}&page_size=25`);onUpdate(result);}catch(error){setPageError(error);}finally{setPageBusy(false);}}
  return <div className="assistant-answer"><p className="assistant-answer-text">{answer.answer}</p>
    {!!answer.suggestions?.length&&<div className="assistant-examples">{answer.suggestions.map(question=><button key={question} disabled={busy} onClick={()=>onAsk(question)}>{question}</button>)}</div>}
    {!!answer.filters?.length&&<div className="assistant-filters">{answer.filters.map((item,index)=><span key={index}>{item}</span>)}</div>}
    {!!answer.summary?.length&&<div className="assistant-metrics">{answer.summary.map((item,index)=><div key={index}><small>{item.label}</small><strong>{item.value===null?'Unavailable':item.unit==='INR'?money(item.value):label(item.value)+(item.unit==='%'?'%':'')}</strong></div>)}</div>}
    {!!answer.rows?.length&&<><div className="assistant-table"><table><thead><tr>{answer.columns.map(column=><th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{answer.rows.map((row,index)=><tr key={index}>{answer.columns.map(column=><td key={column.key}>{column.type==='money'&&row[column.key]!==null?money(row[column.key]):label(row[column.key])}</td>)}</tr>)}</tbody></table></div>
      {answer.stored_rows>25&&<div className="assistant-pagination"><span>{(answer.page-1)*25+1}–{Math.min(answer.page*25,answer.stored_rows)} of {answer.stored_rows} stored rows</span><button aria-label="Previous result page" disabled={pageBusy||answer.page<=1} onClick={()=>page(answer.page-1)}><ChevronLeft size={15}/></button><button aria-label="Next result page" disabled={pageBusy||!answer.next} onClick={()=>page(answer.next)}><ChevronRight size={15}/></button></div>}</>}
    {!!answer.notes?.length&&<details className="assistant-notes"><summary>Definitions and limitations</summary>{answer.notes.map((note,index)=><p key={index}>{note}</p>)}</details>}
    <ErrorNotice error={pageError}/>
    {answer.guidance&&<details className="assistant-module-help" open={answer.kind==='help'||answer.kind==='unavailable'}><summary>What can I ask about {answer.guidance.label}?</summary><p>Available details: {answer.guidance.details.join(', ')}.</p><ul>{answer.guidance.capabilities.map(item=><li key={item}>{item}</li>)}</ul><b>Try a question</b><div className="assistant-examples">{answer.guidance.examples.map(question=><button key={question} disabled={busy} onClick={()=>onAsk(question)}>{question}</button>)}</div>{answer.guidance.limitations.map(item=><p key={item}>{item}</p>)}</details>}
    {answer.reportable&&!message.dismissReport&&<div className="assistant-report"><FileText size={18}/><div><b>Would you like a PDF report for this data?</b><small>The report uses this result snapshot and your current access permissions.</small></div>
      <div className="assistant-report-actions">
        {reportState?.status==='ready'?<button className="primary" onClick={()=>onDownload(reportState)}><Download size={14}/>Download {reportState.mode} PDF</button>:
         reportState?.status==='generating'?<><span role="status">Generating PDF…</span>{reportState.status_endpoint&&<button className="outline" onClick={()=>onReport(null,null,reportState.status_endpoint)}>Check status</button>}</>:
         <><button className="primary" onClick={()=>onReport(answer.result_id,'detailed')}>Yes, Generate PDF Report</button><button className="outline" onClick={()=>onReport(answer.result_id,'summary')}>Summary PDF</button><button className="text-button" onClick={()=>onUpdate(null,true)}>No, Continue Chatting</button></>}
      </div><ErrorNotice error={reportState?.error}/>
    </div>}
    {answer.result_id&&<small className="assistant-snapshot">Data snapshot: {new Date(answer.as_of).toLocaleString('en-IN')} · Downloads expire at {new Date(answer.expires_at).toLocaleTimeString('en-IN')}</small>}
  </div>;
}

export default function AssistantPanel({api,user,fullPage=false,navigate}) {
  const [open,setOpen]=useState(true),[capabilities,setCapabilities]=useState(null),[messages,setMessages]=useState(()=>[saraGreeting()]),[input,setInput]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(null),[conversation,setConversation]=useState(null),[reportStates,setReportStates]=useState({});
  const bottom=useRef(null),inputRef=useRef(null),generation=useRef(0);
  const sessionKey='school-assistant-conversation-'+user.id;
  useEffect(()=>{const active=++generation.current;const controller=new AbortController();api(root+'capabilities/','GET',undefined,{signal:controller.signal}).then(setCapabilities).catch(error=>{if(error.name!=='AbortError')setError(error);});
    const stored=sessionStorage.getItem(sessionKey);
    if(stored)api(root+'conversations/'+stored+'/','GET',undefined,{signal:controller.signal}).then(result=>{if(active!==generation.current)return;setConversation(result.conversation_id);if(result.latest)setMessages(old=>old.some(message=>message.role==='user')?old:[{id:crypto.randomUUID(),role:'assistant',result:result.latest},saraGreeting()]);}).catch(error=>{if(error.name!=='AbortError'){sessionStorage.removeItem(sessionKey);setConversation(null);if(![403,404,410].includes(error.status))setError(error);}});
    return()=>controller.abort();
  },[api,sessionKey]);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[messages.length,busy]);
  useEffect(()=>{if(open||fullPage)inputRef.current?.focus();},[open,fullPage]);
  async function send(event,question){
    event?.preventDefault();const text=(question||input).trim();if(!text||busy)return;
    setMessages(old=>[...old,{id:crypto.randomUUID(),role:'user',text}]);setInput('');setBusy(true);setError(null);
    try{const result=await api(root+'chat/','POST',{message:text,conversation_id:conversation,request_id:crypto.randomUUID()});setConversation(result.conversation_id);sessionStorage.setItem(sessionKey,result.conversation_id);const id=crypto.randomUUID();setMessages(old=>[...old,{id,role:'assistant',result}]);if(result.report)setReportStates(old=>({...old,[result.result_id]:result.report}));}
    catch(error){setMessages(old=>[...old,{id:crypto.randomUUID(),role:'assistant',result:{answer:error.message,kind:'error',reportable:false,rows:[],summary:[]}}]);}
    finally{setBusy(false);inputRef.current?.focus();}
  }
  async function newConversation(){if(busy)return;setError(null);try{const response=await api(root+'conversations/','POST',{});setConversation(response.conversation_id);sessionStorage.setItem(sessionKey,response.conversation_id);setMessages([saraGreeting()]);setReportStates({});setInput('');inputRef.current?.focus();}catch(error){setError(error);}}
  function updateMessage(id,result,dismiss){setMessages(old=>old.map(message=>message.id===id?{...message,...(result?{result}:{}),dismissReport:dismiss||false}:message));}
  async function generate(resultId,mode,statusEndpoint){
    if(statusEndpoint){try{const response=await api(statusEndpoint);setReportStates(old=>{const found=Object.entries(old).find(([,value])=>value.report_id===response.report_id);return found?{...old,[found[0]]:response}:old;});}catch(error){setError(error);}return;}
    setReportStates(old=>({...old,[resultId]:{status:'generating',mode}}));
    try{const response=await api(root+'reports/','POST',{result_id:resultId,mode});setReportStates(old=>({...old,[resultId]:response}));}
    catch(error){setReportStates(old=>({...old,[resultId]:{status:'failed',mode,error}}));}
  }
  async function download(report){try{const blob=await api.download(report.download_endpoint);const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`school-${report.mode}-report.pdf`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){setError(error);}}
  if(!open&&!fullPage)return <button className="assistant-launcher" onClick={()=>setOpen(true)}><Avatar/>Ask Sara</button>;
  return <section className={'assistant-panel '+(fullPage?'assistant-fullpage':'assistant-floating')} aria-label="School data assistant">
    <div className="assistant-header"><div className="assistant-heading-icon"><Avatar/></div><div><h2>Sara</h2><span>Your personalized school assistant</span></div><div className="assistant-header-actions"><button aria-label="Start new conversation" title="New conversation" disabled={busy} onClick={newConversation}><Plus size={19}/></button>{!fullPage&&<button aria-label="Expand assistant" onClick={()=>navigate('assistant')}><Maximize2 size={17}/></button>}{!fullPage&&<button aria-label="Close assistant" onClick={()=>setOpen(false)}><X size={20}/></button>}</div></div>
    <div className="assistant-privacy"><ShieldCheck size={14}/>{capabilities?`${capabilities.resources.length} permitted modules. `:''}Your questions and records stay on this server.</div>
    <ErrorNotice error={error} onClose={()=>setError(null)}/>
    <div className="assistant-history" aria-live="polite">
      {!messages.length&&<div className="assistant-welcome"><div className="assistant-welcome-icon"><Avatar/></div><h3>Ask your school data a question.</h3><p>I can count, filter, summarize, compare periods, and create PDF reports. If a query is unclear or unsupported, I will ask you to clarify.</p><div className="assistant-examples">{(capabilities?.examples||['How many students are currently enrolled?']).map(question=><button key={question} disabled={busy} onClick={()=>send(null,question)}>{question}</button>)}</div></div>}
      {messages.map(message=><article key={message.id} className={'assistant-message '+message.role}><div className="assistant-speaker">{message.role==='user'?'You':<><Avatar/>Sara</>}</div>{message.role==='user'?<p>{message.text}</p>:<Answer message={message} api={api} busy={busy} onAsk={question=>send(null,question)} onUpdate={(result,dismiss)=>updateMessage(message.id,result,dismiss)} onReport={generate} onDownload={download} reportState={reportStates[message.result.result_id]}/>}</article>)}
      {busy&&<div className="assistant-thinking" role="status"><RefreshCw size={16} className="spin"/>Checking permitted school records…</div>}
      <div ref={bottom}/>
    </div>
    <form className="assistant-composer" onSubmit={send}><textarea ref={inputRef} aria-label="Ask the school assistant" placeholder="Ask about students, attendance, fees, exams…" value={input} maxLength={2000} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send(event);}}} rows={2} disabled={busy}/><button className="primary" type="submit" disabled={busy||!input.trim()} aria-label="Send question"><Send size={18}/></button><small>Enter to send · Shift+Enter for a new line · Questions are interpreted locally, not by an external language model.</small></form>
  </section>;
}



