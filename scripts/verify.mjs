import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const tmp=mkdtempSync(join(tmpdir(),'newsletter-check-'));
try {
 for(const folder of ['scripts','content','public'])cpSync(resolve(folder),join(tmp,folder),{recursive:true});
 const original=JSON.parse(readFileSync('content/2026-09-09.json','utf8'));
 const fixture={...original,date:'2026-09-14',title:'Archive routing fixture <script>unsafe</script>'};
 writeFileSync(join(tmp,'content/2026-09-14.json'),JSON.stringify(fixture));
 cpSync(join(tmp,'public/downloads/2026-09-09.docx'),join(tmp,'public/downloads/2026-09-14.docx'));
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:tmp});
 const home=readFileSync(join(tmp,'dist/index.html'),'utf8');
 const archive=readFileSync(join(tmp,'dist/archive/index.html'),'utf8');
 const older=readFileSync(join(tmp,'dist/issues/2026-09-09/index.html'),'utf8');
 const newer=readFileSync(join(tmp,'dist/issues/2026-09-14/index.html'),'utf8');
 assert(home.includes('Issue 02'));assert(home.includes('routing fixture &lt;script&gt;unsafe&lt;/script&gt;'));assert(!home.includes('<script>unsafe'));
 assert(archive.indexOf('September 14, 2026')<archive.indexOf('September 9, 2026'));
 assert(older.includes('href="/issues/2026-09-14/"'));assert(newer.includes('href="/issues/2026-09-09/"'));
 assert.equal((older.match(/class="story" id=/g)||[]).length,8);
 assert.equal((older.match(/rel="noopener noreferrer"/g)||[]).length,13);
 console.log('Verified two-issue ordering, permanent links, previous/next navigation, safe text escaping, eight stories, and thirteen source links.');
}finally{rmSync(tmp,{recursive:true,force:true});}
