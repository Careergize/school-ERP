import catalog from './demo-catalog.js';

export const DEMO_MODE=import.meta.env?.VITE_DEMO_MODE==='true'||(typeof location!=='undefined'&&new URLSearchParams(location.search).get('demo')==='1');
export const DEMO_SESSION_KEY='schoolhouse-demo-token';
const storageKey='schoolhouse-demo-data-v1';
const user={id:9001,name:'Alex Morgan',email:'demo@schoolhouse.local',role:'admin'};
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
const names=['Aarav Sharma','Diya Menon','Ishaan Patel','Ananya Rao','Arjun Nair','Meera Iyer','Kabir Das','Sana Khan','Rohan Verma','Tara Joseph','Vihaan Shah','Zoya Thomas'];
const copy=value=>JSON.parse(JSON.stringify(value));
function seed(){
  const data={};
  for(const [module,config] of Object.entries(catalog)){
    data[module]=Array.from({length:module==='school_settings'?1:module==='students'?24:module==='attendance'?24:module==='fees'?24:module==='payments'?16:4},(_,i)=>{
      const id=i+1;const record={id,version:1,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
      for(const f of config.fields){
        record[f.key]=f.type.startsWith('ref:')?i%4+1:f.type==='select'?f.options[i%f.options.length]:f.type==='date'?today():f.type==='time'?'09:00':f.type==='money'?'2500.00':f.type==='number'?40:f.type==='email'?`sample${id}@example.com`:f.type==='textarea'?'Sample information for the client demonstration.':f.default??`${f.label} ${id}`;
      }
      return record;
    });
  }
  data.school_settings[0]={...data.school_settings[0],name:'Schoolhouse Demo School',email:'office@example.com',phone:'0000000000',currency:'INR',timezone:'Asia/Kolkata'};
  data.academic_years.forEach((r,i)=>Object.assign(r,{name:`${2026+i}–${2027+i}`,start_date:`${2026+i}-06-01`,end_date:`${2027+i}-03-31`}));
  data.classes.forEach((r,i)=>Object.assign(r,{name:`Class ${i+7} · A`,year:'2026–2027',capacity:40}));
  data.staff.forEach((r,i)=>Object.assign(r,{name:['Priya Menon','Rahul Shah','Neha Joseph','Vikram Rao'][i],designation:'Teacher',department:['Mathematics','Science','English','Social Studies'][i],salary:'35000.00'}));
  data.students.forEach((r,i)=>Object.assign(r,{name:names[i%names.length]+(i>=12?' Kumar':''),roll:`SH${String(i+1).padStart(3,'0')}`,status:'Active',phone:'0000000000',email:`student${i+1}@example.com`}));
  data.parents.forEach((r,i)=>Object.assign(r,{name:['Suresh Sharma','Lakshmi Menon','Ravi Patel','Anita Rao'][i],relationship:'Parent',phone:'0000000000'}));
  data.subjects.forEach((r,i)=>Object.assign(r,{name:['Mathematics','Science','English','Social Studies'][i],code:['MAT','SCI','ENG','SOC'][i]}));
  data.attendance.forEach((r,i)=>Object.assign(r,{student_id:i+1,date:today(),status:i===3?'Absent':i===9?'Late':'Present',note:''}));
  data.fees.forEach((r,i)=>Object.assign(r,{name:`Term 2 tuition · ${r.id}`,student_id:i+1,amount:'2500.00',due:'2026-11-30'}));
  data.payments.forEach((r,i)=>Object.assign(r,{invoice_id:i+1,amount:i<12?'2500.00':'1000.00',method:['Cash','Bank transfer'][i%2],reference:`DEMO-${1000+i}`}));
  data.notices.forEach((r,i)=>Object.assign(r,{name:['Welcome to the new term','Parent–teacher meeting','Annual sports day','Library reading week'][i],description:['A warm welcome to our school community. Explore your workspace for the latest updates.','Meet your child’s teachers on Saturday, 10:00 AM to 1:00 PM.','Join us for a day of teamwork and celebration on the school grounds.','Discover a new book and share your favourite story with your class.'][i],audience:'All',date:today()}));
  data.books.forEach((r,i)=>Object.assign(r,{name:['The Blue Umbrella','A Brief History of Time','Malgudi Days','Wings of Fire'][i],author:['Ruskin Bond','Stephen Hawking','R. K. Narayan','A. P. J. Abdul Kalam'][i],copies:8}));
  data.exams.forEach((r,i)=>Object.assign(r,{name:`Term 2 · ${data.subjects[i].name}`,max_marks:100,pass_marks:40,subject_id:i+1}));
  data.results.forEach((r,i)=>Object.assign(r,{student_id:i+1,exam_id:i+1,marks:[78,56,91,45][i]}));
  data.audit=[{id:1,name:user.name,action:'demo_started',module:'workspace',record_id:1,at:new Date().toISOString()}];
  return data;
}
let state;
function getState(){
  if(!state){try{state=JSON.parse(sessionStorage.getItem(storageKey)||'null');}catch{}state??=seed();}
  return state;
}
function persist(){try{sessionStorage.setItem(storageKey,JSON.stringify(state));}catch{}}
export function resetDemo(){state=seed();persist();}
function records(module){
  const data=getState();
  return (data[module]||[]).map(row=>{
    if(module==='fees'){const paid=data.payments.filter(p=>Number(p.invoice_id)===row.id).reduce((s,p)=>s+Number(p.amount),0);return {...row,paid_amount:paid,balance:Number(row.amount)-paid,payment_status:paid>=Number(row.amount)?'Paid':paid?'Partial':'Unpaid'};}
    if(module==='results'){const exam=data.exams.find(e=>e.id===Number(row.exam_id));const percentage=Number(row.marks)/Number(exam?.max_marks||100)*100;return {...row,percentage,outcome:percentage>=40?'Pass':'Fail'};}
    if(module==='payroll')return {...row,net_pay:Number(row.basic)+Number(row.allowances)-Number(row.deductions)};
    if(module==='books')return {...row,available_copies:Number(row.copies)-data.loans.filter(l=>Number(l.book_id)===row.id&&!l.returned).length};
    if(module==='loans')return {...row,loan_status:row.returned?'Returned':'Issued'};
    return row;
  });
}
function summary(){
  const data=getState(),fees=records('fees');const total=key=>fees.reduce((s,r)=>s+Number(r[key]||0),0);
  return {as_of:today(),counts:Object.fromEntries(Object.keys(catalog).map(key=>[key,data[key].length])),attendance:{recorded:data.attendance.filter(r=>r.date===today()).length,present:data.attendance.filter(r=>r.date===today()&&r.status==='Present').length},finance:{invoiced:total('amount'),collected:total('paid_amount'),outstanding:total('balance')},payroll:{net_total:records('payroll').reduce((s,r)=>s+r.net_pay,0)},admissions:Object.fromEntries(['Applied','Under review','Accepted','Rejected'].map(status=>[status,data.admissions.filter(r=>r.status===status).length]))};
}
const failure=message=>Object.assign(new Error(message),{status:400});
export function createDemoClient(token){
  async function request(path,method='GET',body,options={}){
    if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
    const url=new URL(path,'https://demo.invalid/'),route=url.pathname.replace(/^\//,'');const data=getState();
    if(route==='v1/accounts/login/'){
      if(body?.email!=='demo@schoolhouse.local'||body?.password!=='demo123')throw failure('Use the displayed demo email and password.');
      return {token:'demo-session',user:copy(user)};
    }
    if(token!=='demo-session')throw failure('Please sign in to the demo workspace.');
    if(route==='v1/accounts/me/')return copy(user);
    if(route==='v1/accounts/logout/')return null;
    if(route==='v1/accounts/password/'||route==='v1/accounts/users/'&&method!=='GET')throw failure('Account changes are unavailable in this browser demo.');
    if(route==='v1/accounts/users/')return [copy(user)];
    if(route==='v1/configuration/modules/')return copy(catalog);
    if(route==='v1/reporting/summary/')return summary();
    if(route==='v1/reporting/audit/')return copy(data.audit);
    if(route==='v1/assistant/capabilities/')return {resources:Object.keys(catalog),examples:['How many students are enrolled?','Show outstanding fees','Show attendance today']};
    if(route.startsWith('v1/assistant/conversations/'))return {conversation_id:'demo-conversation'};
    if(route==='v1/assistant/chat/'){
      const q=String(body.message).toLowerCase(),s=summary();
      const answer=/fee|payment|collect|outstanding/.test(q)?`Sample fees: ₹${s.finance.invoiced.toLocaleString('en-IN')} invoiced, ₹${s.finance.collected.toLocaleString('en-IN')} collected, and ₹${s.finance.outstanding.toLocaleString('en-IN')} outstanding.`:/attendance|absent|present/.test(q)?`Sample attendance today: ${s.attendance.present} present out of ${s.attendance.recorded} records.`:/student|enrol/.test(q)?`There are ${s.counts.students} students in this sample workspace.`:'I can show sample student counts, today’s attendance, and fee totals. This is a scripted browser demo; the full school assistant needs the backend.';
      return {conversation_id:'demo-conversation',kind:'demo',answer,reportable:false,suggestions:['How many students are enrolled?','Show outstanding fees','Show attendance today']};
    }
    if(route==='v1/improvement/'&&method==='GET')return {classes:copy(data.classes),class_id:url.searchParams.get('class_id')||null,can_manage:false,plans:[],gaps:records('results').filter(r=>r.percentage<60).filter(r=>!url.searchParams.get('class_id')||String(data.students.find(s=>s.id===r.student_id)?.class_id)===url.searchParams.get('class_id')).map(r=>({result_id:r.id,student:data.students.find(s=>s.id===r.student_id)?.name,school_class:data.classes.find(c=>c.id===data.students.find(s=>s.id===r.student_id)?.class_id)?.name,subject:data.subjects.find(s=>s.id===data.exams.find(e=>e.id===r.exam_id)?.subject_id)?.name,score:r.percentage,previous:null,reason:'Sample result below 60%'}))};
    const entry=Object.entries(catalog).sort((a,b)=>b[1].endpoint.length-a[1].endpoint.length).find(([,config])=>route.startsWith(config.endpoint));
    if(!entry)throw failure('This feature requires the backend and is unavailable in the static demo.');
    const [module,config]=entry,tail=route.slice(config.endpoint.length),id=Number(tail.split('/')[0]);
    let rows=records(module);
    const search=url.searchParams.get('search')?.toLowerCase();
    if(search)rows=rows.filter(row=>Object.values(row).some(value=>String(value).toLowerCase().includes(search)));
    for(const [key,value] of url.searchParams)if(!['search','page','page_size','ordering'].includes(key))rows=rows.filter(row=>String(key==='class_id'&&module==='fees'?data.students.find(s=>s.id===Number(row.student_id))?.class_id:row[key])===value);
    if(tail==='export/'){
      const keys=[...new Set(rows.flatMap(row=>Object.keys(row)))];
      const escape=value=>{let text=String(value??'');if(/^[=+@\-\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
      return new Blob([[keys,...rows.map(row=>keys.map(key=>row[key]))].map(row=>row.map(escape).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    }
    if(method==='GET'){
      if(id){const record=rows.find(row=>row.id===id);if(!record)throw failure('Sample record not found.');return copy(record);}
      const size=Math.max(1,Math.min(100,Number(url.searchParams.get('page_size'))||25)),page=Math.max(1,Number(url.searchParams.get('page'))||1);
      return {count:rows.length,results:copy(rows.slice((page-1)*size,page*size)),next:page*size<rows.length?page+1:null,previous:page>1?page-1:null};
    }
    if(tail.endsWith('/enroll/'))throw failure('Enrollment automation requires the backend. You can demonstrate student creation from Students.');
    if(method==='DELETE'){
      if(Object.entries(catalog).some(([target,c])=>c.fields.some(f=>f.type==='ref:'+module&&data[target].some(row=>Number(row[f.key])===id))))throw failure('This sample record is linked elsewhere. Remove its linked records first.');
      data[module]=data[module].filter(row=>row.id!==id);
    }else if(method==='POST'&&!tail){
      const record={...body,id:Math.max(0,...data[module].map(row=>row.id))+1,version:1,created_at:new Date().toISOString()};data[module].push(record);persist();return copy(record);
    }else if(['PUT','PATCH'].includes(method)&&id){
      const record=data[module].find(row=>row.id===id);if(!record)throw failure('Sample record not found.');Object.assign(record,body,{id,version:record.version+1});persist();return copy(record);
    }else throw failure('This action requires the backend.');
    persist();return null;
  }
  request.download=(path,options={})=>request(path,'GET',undefined,options);
  return request;
}
