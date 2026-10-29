import test from 'node:test';
import assert from 'node:assert/strict';
import {filterByPercentage} from '../src/features/improvement/filters.js';

test('percentage filter includes endpoints and supports open bounds and zero',()=>{
  const items=[{score:0},{score:30},{score:59.5},{score:60},{score:100}];
  const scores=rows=>rows.map(r=>r.score);
  assert.deepEqual(scores(filterByPercentage(items,r=>r.score,'30','60')),[30,59.5,60]);
  assert.deepEqual(scores(filterByPercentage(items,r=>r.score,'','0')),[0]);
  assert.deepEqual(scores(filterByPercentage(items,r=>r.score,'60','')),[60,100]);
  assert.deepEqual(filterByPercentage(items,r=>r.score),items);
  assert.deepEqual(filterByPercentage(items,r=>r.score,'61','99'),[]);
});

test('support plan filtering uses baseline rather than target or reassessment',()=>{
  const plans=[{baseline:38,target:60,reassessment:70},{baseline:75,target:90,reassessment:null}];
  assert.deepEqual(filterByPercentage(plans,p=>p.baseline,'0','40'),[plans[0]]);
});
