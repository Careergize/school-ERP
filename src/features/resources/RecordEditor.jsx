import React,{useEffect,useState} from 'react';
import {computedFields,money} from '../../lib/modules';
import {ReferenceLabel,ReferenceSelect,useReferences} from '../../components/References';
import {ErrorNotice,Modal,StatusBadge} from '../../components/Feedback';
import {initialValues,formBody} from '../../lib/modules';

export function FieldValue({field,value}) {
  if(value===null||value===undefined||value==='')return <span className="muted">—</span>;
  if(field?.type?.startsWith('ref:'))return <ReferenceLabel module={field.type.slice(4)} id={value} link/>;
  if(field?.type==='money')return <span className="numeric">{money(value)}</span>;
  if(field?.type==='percentage')return `${value}%`;
  if(field?.type==='status'||['status','payment_status','loan_status','outcome'].includes(field?.key))return <StatusBadge value={value}/>;
  return <span className={field?.type==='textarea'?'long-text':''}>{String(value)}</span>;
}
function errorsFor(error,key) {
  const alias=key==='class_id'?'school_class':key.endsWith('_id')?key.slice(0,-3):key;
  const errors=error?.errors?.[key]||error?.errors?.[alias];
  return errors?(Array.isArray(errors)?errors.join(' '):String(errors)):'';
}
export function RecordForm({module,config,record,defaults,user,onClose,onSave}) {
  const [values,setValues]=useState(()=>({...initialValues(config,record),...defaults}));
  const [error,setError]=useState(null),[busy,setBusy]=useState(false);
  const {get}=useReferences();
  const [related,setRelated]=useState(null);
  const relation=module==='payments'?['fees',values.invoice_id]:module==='loans'?['books',values.book_id]:module==='results'?['exams',values.exam_id]:module==='payroll'?['staff',values.staff_id]:null;
  const relatedModule=relation?.[0],relatedId=relation?.[1];
  useEffect(()=>{let active=true;setRelated(null);if(relatedId)get(relatedModule,relatedId).then(value=>{if(active)setRelated(value);}).catch(()=>{});return()=>{active=false;};},[get,relatedModule,relatedId]);
  const change=(field,value)=>setValues(old=>({...old,[field]:value,...(field==='class_id'?{subject_id:''}:{})}));
  async function submit(event) {
    event.preventDefault();setBusy(true);setError(null);
    const body=formBody(config,values,record);
    if(user.role==='student'&&module==='submissions')delete body.feedback;
    try{await onSave(body);}catch(error){setError(error);}finally{setBusy(false);}
  }
  return <Modal title={`${record?'Edit':'Add'} ${config.singular.toLowerCase()}`} subtitle={config.label} onClose={busy?()=>{}:onClose}>
    <form onSubmit={submit}><ErrorNotice error={error}/>
      <div className="form-grid">{config.fields.map(field=>{
        const fieldId='record-'+field.key;const fieldError=errorsFor(error,field.key);const readOnly=user.role==='student'&&field.key==='feedback';
        const filters=field.type==='ref:subjects'&&values.class_id?{class_id:values.class_id}:{};
        const fieldProps={id:fieldId,value:values[field.key]??'',required:field.required,disabled:busy||readOnly,'aria-invalid':!!fieldError,'aria-describedby':fieldError?fieldId+'-error':undefined};
        return <div key={field.key} className={'form-field '+(field.type==='textarea'?'wide':'')}>
          <label htmlFor={fieldId}>{field.label}{field.required&&' *'}</label>
          {field.type.startsWith('ref:')?<ReferenceSelect module={field.type.slice(4)} {...fieldProps} filters={filters} invalid={!!fieldError} onChange={value=>change(field.key,value)}/>:
            field.type==='select'?<select {...fieldProps} onChange={event=>change(field.key,event.target.value)}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map(option=><option key={option} value={option}>{option}</option>)}</select>:
            field.type==='textarea'?<textarea {...fieldProps} maxLength={field.max_length||undefined} onChange={event=>change(field.key,event.target.value)}/>:
            <input {...fieldProps} type={['money','number'].includes(field.type)?'number':field.type} step={field.type==='money'?'0.01':field.type==='number'?'1':undefined} min={field.min??(['number','money'].includes(field.type)?0:undefined)} max={module==='reviews'&&field.key==='rating'?5:field.max} maxLength={field.max_length||undefined} onChange={event=>change(field.key,event.target.value)}/>}
          {fieldError&&<small className="field-error" id={fieldId+'-error'}>{fieldError}</small>}
          {readOnly&&<small>Feedback is managed by your teacher.</small>}
          {field.type==='ref:subjects'&&!values.class_id&&config.fields.some(f=>f.key==='class_id')&&<small>Select a class to narrow the subject choices.</small>}
        </div>;
      })}</div>
      {related&&<div className="form-hint" role="status">{module==='payments'?<>Invoice balance: <b>{money(related.balance)}</b>{!record&&Number(related.balance)>0&&<button type="button" className="text-button" onClick={()=>change('amount',related.balance)}>Use outstanding amount</button>}</>:module==='loans'?<>Available copies: <b>{related.available_copies}</b></>:module==='results'?<>Maximum marks: <b>{related.max_marks}</b> · Pass marks: <b>{related.pass_marks}</b></>:<>Monthly salary: <b>{money(related.salary)}</b>{!record&&<button type="button" className="text-button" onClick={()=>change('basic',related.salary)}>Use monthly salary as basic pay</button>}</>}</div>}
      {module==='payments'&&<p className="form-hint">Receipts record money already received. No payment gateway is used.</p>}
      {module==='payroll'&&<div className="form-hint">Net pay: <b>{money(Number(values.basic||0)+Number(values.allowances||0)-Number(values.deductions||0))}</b></div>}
      <div className="modal-footer"><button type="button" className="outline" disabled={busy} onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy?'Saving…':`Save ${config.singular.toLowerCase()}`}</button></div>
    </form>
  </Modal>;
}
export function RecordDetails({config,record,onClose,onEdit,canEdit}) {
  const fields=[...config.fields,...Object.entries(computedFields).filter(([key])=>key in record).map(([key,field])=>({...field,key}))];
  return <Modal title={record.name||`${config.singular} #${record.id}`} subtitle={config.label} onClose={onClose} wide>
    <dl className="detail-grid">{fields.map(field=><div key={field.key} className={field.type==='textarea'?'wide':''}><dt>{field.label}</dt><dd><FieldValue field={field} value={record[field.key]}/></dd></div>)}</dl>
    <div className="record-meta">Record #{record.id} · Version {record.version}{record.updated_at&&` · Updated ${new Date(record.updated_at).toLocaleString('en-IN')}`}</div>
    <div className="modal-footer"><button className="outline" onClick={onClose}>Close</button>{canEdit&&<button className="primary" onClick={onEdit}>Edit record</button>}</div>
  </Modal>;
}
