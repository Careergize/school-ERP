import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoClient,resetDemo} from '../src/lib/demo.js';

// Exercise the presentation flow with networking unavailable.
test('demo signs in and supports catalogue, references, search, edits, reports and CSV without a server',async()=>{
  const previous=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('Demo must never use the network');};
  try{
    resetDemo();
    await assert.rejects(createDemoClient('')('v1/accounts/login/','POST',{email:'wrong@example.com',password:'wrong'}));
    const login=await createDemoClient('')('v1/accounts/login/','POST',{email:'demo@schoolhouse.local',password:'demo123'});
    const api=createDemoClient(login.token),catalog=await api('v1/configuration/modules/');
    for(const [module,config] of Object.entries(catalog)){
      const result=await api(config.endpoint);
      assert.ok(result.count>0,module+' has sample records');
      for(const row of result.results)for(const field of config.fields.filter(f=>f.type.startsWith('ref:'))){
        if(row[field.key])assert.ok((await api(catalog[field.type.slice(4)].endpoint+row[field.key]+'/')).id);
      }
    }
    const first=await api(catalog.students.endpoint+'?page_size=2');
    assert.equal(first.results.length,2);assert.equal(first.next,2);
    const found=await api(catalog.students.endpoint+'?search=Aarav');assert.ok(found.results.every(r=>r.name.includes('Aarav')));
    const created=await api(catalog.students.endpoint,'POST',{name:'Client Demo Student',roll:'DEMO-NEW',status:'Active',class_id:1});
    await api(catalog.students.endpoint+created.id+'/','PUT',{...created,name:'Updated Demo Student'});
    assert.equal((await api(catalog.students.endpoint+created.id+'/')).name,'Updated Demo Student');
    const totals=await api('v1/reporting/summary/');assert.equal(totals.counts.students,25);assert.equal(totals.finance.invoiced,totals.finance.collected+totals.finance.outstanding);
    const csv=await (await api.download(catalog.students.export_endpoint)).text();assert.ok(csv.includes('Updated Demo Student'));
    await api(catalog.students.endpoint+created.id+'/','DELETE');assert.equal((await api('v1/reporting/summary/')).counts.students,24);
    const chat=await api('v1/assistant/chat/','POST',{message:'Show fees'});assert.match(chat.answer,/Sample fees/);assert.equal(chat.reportable,false);
    await assert.rejects(api('v1/accounts/password/','POST',{}),/unavailable/);
    resetDemo();assert.equal((await api('v1/reporting/summary/')).counts.students,24);
  }finally{globalThis.fetch=previous;}
});
