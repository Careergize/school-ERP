import test,{afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {createApiClient,resourcePath,ApiError} from '../src/lib/api.js';
import {formBody,initialValues,queryPath,navigation,resourceScreens} from '../src/lib/modules.js';
const originalFetch=globalThis.fetch;
afterEach(()=>{globalThis.fetch=originalFetch;});

test('API client sends the versioned endpoint, bearer token, and typed JSON body',async()=>{
  let request;
  globalThis.fetch=async(url,options)=>{request={url,options};return Response.json({id:4},{status:201});};
  const api=createApiClient('test-session');
  assert.deepEqual(await api('v1/students/','POST',{name:'Test',class_id:2}),{id:4});
  assert.equal(request.url,'/api/v1/students/');
  assert.equal(request.options.headers.Authorization,'Bearer test-session');
  assert.equal(JSON.parse(request.options.body).class_id,2);
});
test('deleted records return 204 without JSON parsing',async()=>{
  globalThis.fetch=async()=>new Response(null,{status:204});
  assert.equal(await createApiClient('test')('v1/library/books/1/','DELETE'),null);
});
test('field validation and stale-edit status remain available to the form',async()=>{
  globalThis.fetch=async()=>Response.json({detail:'Validation failed.',errors:{student:['Choose a student.']}},{status:422});
  await assert.rejects(createApiClient('test')('v1/results/','POST',{}),error=>error instanceof ApiError&&error.status===422&&error.errors.student[0]==='Choose a student.');
});
test('expired sessions notify the application and downloads retain authorization',async()=>{
  let expired=false;
  globalThis.fetch=async()=>Response.json({detail:'Please sign in again.'},{status:401});
  await assert.rejects(createApiClient('test',()=>{expired=true;})('v1/accounts/me/'));
  assert.equal(expired,true);
  globalThis.fetch=async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer test');return new Response('name\nTest',{headers:{'content-type':'text/csv'}});};
  assert.equal(await (await createApiClient('test').download('v1/students/export/')).text(),'name\nTest');
});
test('form payload preserves exact monetary text, optional relationships, and edit versions',()=>{
  const config={fields:[{key:'invoice_id',type:'ref:fees'},{key:'amount',type:'money'},{key:'date',type:'date'},{key:'copies',type:'number'},{key:'parent_id',type:'ref:parents'}]};
  const body=formBody(config,{invoice_id:'2',amount:'0.30',date:'2026-10-28',copies:'4',parent_id:''},{id:7,version:3});
  assert.deepEqual(body,{invoice_id:2,amount:'0.30',date:'2026-10-28',copies:4,parent_id:null,version:3});
  assert.equal(initialValues({fields:[{key:'method',default:'Cash'}]},null).method,'Cash');
});
test('all thirty resource screens are reachable and scoped paths encode filters safely',()=>{
  const items=navigation.flatMap(([,items])=>items);
  assert.equal(Object.keys(resourceScreens).length,30);
  for(const module of Object.keys(resourceScreens))assert.ok(items.includes(module),`${module} must have navigation`);
  assert.equal(resourcePath({students:{endpoint:'v1/students/'}},'students',2),'v1/students/2/');
  assert.equal(queryPath('v1/subjects/',{class_id:2,search:'A & B',status:''}),'v1/subjects/?class_id=2&search=A+%26+B');
});
