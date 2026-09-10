import {createServer} from 'node:http';
import {readFileSync,statSync,existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const server=createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');let p=resolve(root,'.'+decodeURIComponent(url.pathname));if(p!==root&&!p.startsWith(root+'/')){res.writeHead(403);res.end();return;}if(existsSync(p)&&statSync(p).isDirectory())p=resolve(p,'index.html');if(!existsSync(p)){res.writeHead(404,{'Content-Type':mime['.html']});res.end(readFileSync(resolve(root,'404.html')));return;}res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'});res.end(readFileSync(p));}catch{res.writeHead(400);res.end('Bad request');}});
server.listen(3000,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:3000'));
