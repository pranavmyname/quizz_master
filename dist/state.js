export const KEY='quiz-night.v1';
export function validateBoard(b){
 if(!b||b.version!==1||typeof b.title!=='string'||b.title.length>100||typeof b.subtitle!=='string'||b.subtitle.length>200||!Array.isArray(b.rounds)||!b.rounds.length||b.rounds.length>10)throw Error('Invalid board. Use a Quiz Night backup.');
 const ids=new Set();
 for(const r of b.rounds){if(typeof r.id!=='string'||typeof r.name!=='string'||!Array.isArray(r.categories)||!r.categories.length||r.categories.length>8)throw Error('Each round needs 1–8 categories.');for(const c of r.categories){if(typeof c.id!=='string'||typeof c.name!=='string'||!c.name.trim()||c.name.length>100||!Array.isArray(c.questions)||c.questions.length>20)throw Error('Invalid category.');for(const q of c.questions){if(typeof q.id!=='string'||ids.has(q.id)||!Number.isFinite(q.points)||q.points<0||q.points>10000||typeof q.prompt!=='string'||q.prompt.length>5000)throw Error('Question IDs must be unique, and points must be between 0 and 10,000.');ids.add(q.id);for(const k of ['questionImage','answerImage']){if(q[k]&&!(typeof q[k]==='string'&&(/^(assets\/[\w.-]+|https:\/\/[^\s]+)$/.test(q[k]))))throw Error('Use an assets/ filename or an HTTPS image URL.');}if(q.answer&&typeof q.answer!=='string')throw Error('Invalid answer.');}}}
 return b;
}
export function sanitizeProgress(board,progress={}){const ids=new Set(board.rounds.flatMap(r=>r.categories.flatMap(c=>c.questions.map(q=>q.id))));return Object.fromEntries(Object.entries(progress||{}).filter(([id,v])=>ids.has(id)&&v===true));}
export function completed(state,id,value){return {...state,done:{...state.done,[id]:value}};}
export function migrateAnswerImages(board,defaults){
 const originals=new Map(defaults.rounds.flatMap(r=>r.categories.flatMap(c=>c.questions.map(q=>[q.id,q.answerImage]))));let changed=false;
 for(const r of board.rounds)for(const c of r.categories)for(const q of c.questions){
  const match=/^ep19-(\d+)$/.exec(q.id);if(!match)continue;
  const legacy=`assets/${match[1].padStart(2,'0')}-answer.jpg`,replacement=originals.get(q.id);
  if(q.answerImage===legacy&&replacement){q.answerImage=replacement;changed=true;}
 }
 return changed;
}
