
'use strict';
const VERSION='2.2.0-ACUERDO-TECNICO';
let CASES={
 A:{id:'DEMO-A',title:'Correspondencia del cronograma',context:'Solicitud ficticia de ampliación de plazo de una obra de drenaje. Usted apoya la preparación de la respuesta. No debe calcular ni aprobar una ampliación.',parts:[
 ['Qué se observó','El cronograma presentado no identifica cuáles actividades fueron afectadas ni muestra cómo su afectación modifica la fecha de culminación de la obra.'],
 ['Por qué se solicita la corrección','Para este ejercicio, la revisión requiere relacionar las actividades afectadas con la secuencia del cronograma y con la fecha de culminación. Esta es una pauta didáctica, no una norma ni una evaluación de procedencia.'],
 ['Qué debe corregirse','Identificar las actividades afectadas y explicar su relación con la secuencia del cronograma y el cambio de la fecha de culminación. Actualizar el cronograma para que coincida con la explicación.'],
 ['Qué evidencia debe presentarse','Presentar el cronograma actualizado y un informe explicativo que relacione las actividades afectadas con el cambio de la fecha de culminación.']
 ],rubric:[
 'Reconoce ambas omisiones: actividades afectadas e incidencia en la fecha de culminación.',
 'Propone identificar actividades, explicar su efecto en secuencia y culminación y actualizar el cronograma de forma coherente.',
 'Identifica cronograma actualizado e informe explicativo; relaciona ambos con el efecto de las actividades en la culminación.'
 ]},
 B:{id:'DEMO-B',title:'Correspondencia de fechas y sustento',context:'Solicitud ficticia de ampliación de plazo de una obra de saneamiento. Usted apoya la preparación de la respuesta. No debe calcular ni aprobar una ampliación.',parts:[
 ['Qué se observó','Las fechas de inicio y fin de la afectación consignadas en el informe no coinciden con las fechas de los asientos de obra citados como sustento. No se explica la diferencia.'],
 ['Por qué se solicita la corrección','Para este ejercicio, la revisión requiere relacionar el periodo señalado en el informe con los registros que lo sustentan. Esta es una pauta didáctica, no una norma ni una evaluación de procedencia.'],
 ['Qué debe corregirse','Contrastar las fechas del informe con los asientos citados, corregir las discrepancias que correspondan y explicar qué registros sustentan el inicio y el fin del periodo.'],
 ['Qué evidencia debe presentarse','Presentar el informe corregido y una copia de los asientos de obra citados, identificando los registros que sustentan el inicio y el fin del periodo.']
 ],rubric:[
 'Reconoce discrepancia entre fechas del informe y asientos y falta de explicación de esa diferencia.',
 'Propone contrastar fechas, corregir discrepancias y justificar inicio y fin del periodo con sus registros.',
 'Identifica informe corregido y copia de asientos citados, y explica la correspondencia con inicio y fin.'
 ]}
};
CASES.A.rubric.splice(1,0,'Explica que debe poder relacionarse la afectación con la secuencia del cronograma y su efecto sobre la fecha final; no confunde ese criterio con aprobación de la causal.');
CASES.B.rubric.splice(1,0,'Explica que el periodo informado debe corresponder con los registros de sustento para poder revisarlo; no presupone que una ampliación ya fue aprobada.');
const DEMO_CASES=JSON.parse(JSON.stringify(CASES));
let DATASET={version:'DEMO-2.0',source:'demo',note:'Texto continuo de práctica construido para este MVP; no procede de expedientes del GORE.'};
const SEQUENCES={
 S1:[['A','continuo'],['B','estructurado']],
 S2:[['A','estructurado'],['B','continuo']],
 S3:[['B','continuo'],['A','estructurado']],
 S4:[['B','estructurado'],['A','continuo']]
};
const QUESTIONS=['¿Qué se ha observado en el expediente?','¿Por qué se solicita esa corrección?','¿Qué corrección prepararía?','¿Qué documentos presentaría y qué sustenta cada uno?'];
