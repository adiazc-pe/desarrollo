const {JSDOM,VirtualConsole}=require(process.env.JSDOM_PATH || 'jsdom');
const fs=require('fs');const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8');
const failures=[];const checks=[];
function boot(){const blobs=[],errors=[];const v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};w.Blob=Blob;w.URL.createObjectURL=b=>{blobs.push(b);return 'blob:test'};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};}});return {w:dom.window,d:dom.window.document,blobs,errors,close:()=>dom.window.close()};}
function input(t,id,value){const e=t.d.getElementById(id);assert(e,id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new t.w.Event('input',{bubbles:true}));e.dispatchEvent(new t.w.Event('change',{bubbles:true}));}
function click(t,id){const e=t.d.getElementById(id);assert(e,id);e.click();}
function fill(t){input(t,'answer0','Identifico el hallazgo técnico.');input(t,'answer1','Propongo la corrección y su fundamento.');input(t,'answer2','Presento los ajustes que sustentan la corrección.');input(t,'answer3','Documentos y su aporte.');}
function setup(t,seq='S1'){input(t,'code','QA01');input(t,'seq',seq);input(t,'consent',true);click(t,'setupForm');t.d.getElementById('setupForm').requestSubmit();}
(async()=>{
 let t=boot();input(t,'code','QA01');input(t,'kind','real');input(t,'eligible',true);input(t,'consent',true);t.d.getElementById('setupForm').requestSubmit();assert(t.d.getElementById('setupError').textContent.includes('evaluadores deben acordar'));checks.push('Bloqueo de prueba real sin revisión técnica declarada');t.close();
 for(const seq of ['S1','S2','S3','S4']){
  t=boot();setup(t,seq);assert(t.d.getElementById('answerForm'));
  assert(t.d.getElementById('guideNav').disabled);assert(t.d.getElementById('reviewNav').disabled);
  click(t,'reviewAnswer');assert(t.d.getElementById('answerError').textContent.includes('cuatro preguntas'));
  fill(t);click(t,'pauseBtn');assert(t.d.getElementById('taskArea').classList.contains('hidden'));click(t,'pauseBtn');assert.equal(t.d.getElementById('answer0').value,'Identifico el hallazgo técnico.');
  click(t,'helpBtn');assert.equal(t.d.getElementById('helpCount').textContent,'1 registradas');
  input(t,'answer1','<img src=x onerror="window.bad=true">');click(t,'reviewAnswer');assert(t.d.querySelector('.answer').textContent);assert(!t.d.querySelector('.answer img'));assert.equal(t.w.bad,undefined);
  click(t,'edit');assert.equal(t.d.getElementById('answer1').value,'<img src=x onerror="window.bad=true">');
  fill(t);click(t,'reviewAnswer');click(t,'submit');assert(t.d.getElementById('nextCase'));click(t,'nextCase');fill(t);click(t,'reviewAnswer');click(t,'submit');assert(t.d.getElementById('goReview'));click(t,'goReview');assert(t.d.getElementById('dialog').open);click(t,'dialogYes');
  assert(t.d.getElementById('result0').textContent.includes('Pendiente'));
  for(let i=0;i<2;i++){for(let j=0;j<4;j++)input(t,`score${i}_${j}`,'2');input(t,`help${i}`,i===0?'no':'si');input(t,`critical${i}`,'no');input(t,`reviewer${i}`,'R01');input(t,`notes${i}`,'=SUM(1;2)');t.d.getElementById('rating'+i).requestSubmit();}
  assert(t.d.getElementById('result0').textContent.includes('No alcanza'));assert.equal(t.d.getElementById('result1').textContent,'Comprensión completa sin ayuda');
  click(t,'jsonBtn');const data=JSON.parse(await t.blobs[0].text());assert.equal(data.session.kind,'ensayo');assert.equal(data.records.length,2);assert.equal(data.records[0].helpRequests,1);assert(data.events.some(e=>e.type==='returned_to_edit'));assert.deepEqual(data.records.map(r=>r.caseId),seq.startsWith('S1')||seq.startsWith('S2')?['A','B']:['B','A']);assert.equal(new Set(data.records.map(r=>r.format)).size,2);assert(data.records.every(r=>Number.isFinite(r.activeSeconds)));assert(data.warning.includes('ficticios'));
  click(t,'csvBtn');const csv=await t.blobs[1].text();assert(csv.includes("'=SUM(1;2)"));assert(csv.includes('ensayo'));assert(csv.includes('estado_evaluacion'));
  input(t,'score1_0','1');assert(t.d.getElementById('result1').textContent.includes('pendientes'));click(t,'jsonBtn');const changed=JSON.parse(await t.blobs[2].text());assert.equal(changed.records[1].rating.status,'pendiente');
  click(t,'newSession');click(t,'dialogNo');assert(t.d.getElementById('rating0'));click(t,'newSession');click(t,'dialogYes');assert(t.d.getElementById('setupForm'));assert.equal(t.d.getElementById('code').value,'');assert.equal(t.errors.length,0,t.errors.join('\n'));
  checks.push(seq+': recorrido de 2 casos, validaciones, pausa, retorno, ayuda, escape de texto, evaluación manual, exportaciones y reinicio');t.close();
 }
 t=boot();setup(t);fill(t);click(t,'withdraw');click(t,'dialogYes');assert(t.d.getElementById('setupForm'));click(t,'reviewNav');click(t,'dialogYes');assert(t.d.querySelector('.empty'));checks.push('Retiro elimina sesión y respuestas');t.close();
 t=boot();click(t,'configureCases');input(t,'referenceType','institucional');t.d.getElementById('configForm').requestSubmit();assert(t.d.getElementById('configError').textContent.includes('Confirme'));input(t,'fidelity',true);input(t,'titleA','<img src=x onerror=bad()>');input(t,'datasetVersion','QA-CONFIG');t.d.getElementById('configForm').requestSubmit();assert(t.d.getElementById('setupForm'));setup(t);assert(!t.d.querySelector('img'));assert(t.d.querySelector('h2').textContent.includes('<img'));checks.push('Configuración: declaración institucional obligatoria y texto escapado');t.close();
 t=boot();input(t,'code','QAREAL');input(t,'kind','real');input(t,'technical',true);input(t,'consent',true);t.d.getElementById('setupForm').requestSubmit();assert(t.d.getElementById('setupError').textContent.includes('Confirme'));input(t,'eligible',true);t.d.getElementById('setupForm').requestSubmit();assert(t.d.getElementById('answerForm'));checks.push('Elegibilidad obligatoria para prueba real');t.close();
 console.log(JSON.stringify({status:'PASS',checks,limitation:'Pruebas DOM con jsdom; resultados de ensayo técnico. No son pruebas con usuarios ni validación de HS01.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
