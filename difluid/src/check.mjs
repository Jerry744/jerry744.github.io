import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const expected=['index','foundation','identity','applications','experience','future','resources'];
const failures=[];
for(const slug of expected){
 const name=slug+'.html',html=await readFile(path.join(root,name),'utf8');
 if((html.match(/<h1\b/g)||[]).length!==1)failures.push(`${name}: requires one h1`);
 if(!html.includes('lang="zh-CN"'))failures.push(`${name}: missing Chinese`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)failures.push(`${name}: duplicate IDs`);
 for(const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)){
   const url=match[1];if(/^(https?:|data:|mailto:)/.test(url))continue;
   const [file,hash]=url.split('#');const dest=path.resolve(root,file||name);
   if(!dest.startsWith(root+path.sep)){failures.push(`${name}: link escapes subfolder: ${url}`);continue;}
   try{await stat(dest);if(hash && dest.endsWith('.html')){const target=await readFile(dest,'utf8');if(!target.includes(`id="${hash}"`))failures.push(`${name}: missing anchor ${url}`);}}catch{failures.push(`${name}: missing resource ${url}`);}
 }
}
const css=await readFile(path.join(root,'styles.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)){try{await stat(path.resolve(root,match[1]));}catch{failures.push(`Missing CSS resource ${match[1]}`);}}
for(const file of ['site.js','identity.js','experience.js'])execFileSync(process.execPath,['--check',path.join(root,file)]);
const downloads=(await readdir(path.join(root,'downloads'))).filter(x=>x!=='.gitkeep');
if(downloads.length)failures.push('Download packages must remain empty for this release');
const resources=await readFile(path.join(root,'resources.html'),'utf8');
if((resources.match(/<button[^>]+disabled/g)||[]).length!==6)failures.push('Expected six unavailable download entries');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('PASS: 7 complete bilingual pages; all local links, anchors, styles, media and scripts resolve; JS syntax valid; 6 download placeholders with no packages.');
