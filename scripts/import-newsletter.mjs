import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,basename} from 'node:path';
const [mdPath,docPath,titleArg]=process.argv.slice(2);
if(!mdPath||!docPath) throw Error('Usage: node scripts/import-newsletter.mjs ISSUE.md ISSUE.docx [editorial title]');
const raw=readFileSync(mdPath,'utf8');
const date=basename(mdPath).match(/^\d{4}-\d{2}-\d{2}/)?.[0];
if(!date) throw Error('Issue filename must begin YYYY-MM-DD');
const blocks=raw.trim().split(/\n\n+/);
const introBlocks=[];const stories=[];let story;
for(const block of blocks){
 if(block.startsWith('## ')){story={title:block.slice(3).trim(),category:'',eventDate:'',paragraphs:[],sources:[]};stories.push(story);continue;}
 if(!story){introBlocks.push(block);continue;}
 const meta=block.match(/^(.+) \| Event (\d{4}-\d{2}-\d{2})$/);
 if(meta){story.category=meta[1];story.eventDate=meta[2];continue;}
 const para=block.match(/^\*\*(.+?)\.\*\* ([\s\S]+)$/);
 if(para){story.paragraphs.push({label:para[1],text:para[2]});continue;}
 const ref=block.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\) · (.+)$/);
 if(ref){story.sources.push({title:ref[1],url:ref[2],date:ref[3]});continue;}
 throw Error('Unrecognized newsletter block: '+block.slice(0,90));
}
if(!stories.length||stories.some(s=>!s.category||!s.eventDate||s.paragraphs.length<2||!s.sources.length)) throw Error('Incomplete issue; no files imported');
const path=resolve('content',date+'.json');
if(existsSync(path)) throw Error('Issue already exists; review the existing JSON explicitly to revise it');
const issue={date,title:titleArg||'Founders Inflections',coverage:introBlocks.find(b=>b.startsWith('Coverage'))||'',intro:introBlocks.at(-1),stories};
if(!existsSync(docPath)||readFileSync(docPath).subarray(0,2).toString()!=='PK')throw Error('Word document is missing or invalid');
mkdirSync('content',{recursive:true});mkdirSync('public/downloads',{recursive:true});
copyFileSync(docPath,resolve('public/downloads',date+'.docx'));
writeFileSync(path,JSON.stringify(issue,null,2)+'\n');
console.log('Imported '+date+' with '+stories.length+' stories');
