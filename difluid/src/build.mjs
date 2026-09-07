import {writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const modules=[];
for(const file of ['home','foundation','identity','experience','resources']){
  try { modules.push(await import(`./${file}.mjs`)); } catch(e){if(e.code==='ERR_MODULE_NOT_FOUND' && process.argv.includes('--preview'))continue;throw e;}
}
const pages=modules.flatMap(m=>m.pages).sort((a,b)=>a.chapter.localeCompare(b.chapter));
const nav=[['index','01','Vision','愿景'],['foundation','02','Foundation','品牌'],['identity','03','Identity','视觉'],['applications','04','Applications','应用'],['experience','05','Experience','体验'],['future','06','Long view','长期'],['resources','07','Resources','素材']];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const page of pages){
const i=nav.findIndex(n=>n[0]===page.slug),prev=nav[i-1],next=nav[i+1];
const description='Coffee, understood. 读懂咖啡。Explore DiFluid’s brand foundation, visual identity, applications and a vision for a continuous learning experience.';
const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0A0D10"><title>${escape(page.title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="https://www.halfmind.nl/difluid/${page.slug==='index'?'':page.slug+'.html'}"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="assets/mona-sans.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="styles.css"><script type="module" src="site.js"></script></head>
<body data-page="${page.slug}"><a class="skip-link" href="#main">Skip to content / 跳至正文</a>
<header class="site-header"><a class="brand-home" href="index.html" aria-label="DiFluid — home / 首页"><img src="assets/logo-light.svg" alt="DiFluid" width="137" height="31"></a><a class="header-label" href="index.html">Brand perspective<span lang="zh-CN">品牌视角</span></a><button class="menu-toggle" type="button" aria-controls="chapter-nav" aria-expanded="false">Chapters <span lang="zh-CN">章节</span> <span aria-hidden="true">＋</span></button><nav id="chapter-nav" aria-label="Chapters / 章节">${nav.map(([slug,num,en,zh])=>`<a href="${slug}.html" ${slug===page.slug?'aria-current="page"':''}><span class="nav-number">${num}</span><span>${en}<small lang="zh-CN">${zh}</small></span></a>`).join('')}</nav></header>
<main id="main">${page.body}</main>
<footer class="site-footer"><div class="chapter-pagination">${prev?`<a href="${prev[0]}.html" rel="prev"><span class="caption">← Previous / 上一章</span><strong>${prev[1]} — ${prev[2]} <span lang="zh-CN">${prev[3]}</span></strong></a>`:`<a href="index.html"><img src="assets/logo-light.svg" alt="DiFluid" width="137" height="31"></a>`}${next?`<a class="next-chapter" href="${next[0]}.html" rel="next"><span class="caption">Next chapter / 下一章 →</span><strong>${next[1]} — ${next[2]} <span lang="zh-CN">${next[3]}</span></strong></a>`:`<a class="next-chapter" href="index.html"><span class="caption">Back to the beginning / 回到起点 ↗</span><strong>Coffee, understood.</strong></a>`}</div><div class="footer-meta"><span>DiFluid — Coffee, understood. <span lang="zh-CN">读懂咖啡。</span></span><span>Brand perspective · 2026 <span lang="zh-CN">前瞻展示</span></span><a href="#main">Back to top / 返回顶部 ↑</a></div></footer>
<noscript><p class="noscript-note">All chapters remain readable. Enable JavaScript for interactive previews. / 所有章节均可阅读，开启 JavaScript 可使用交互预览。</p></noscript></body></html>`;
await writeFile(path.join(root,`${page.slug}.html`),html);
}
const base=await readFile(path.join(root,'src/base.css'),'utf8');
let identityCss='';try{identityCss=await readFile(path.join(root,'src/identity.css'),'utf8');}catch{}
const refinements=await readFile(path.join(root,'src/refinements.css'),'utf8');
await writeFile(path.join(root,'styles.css'),base+'\n'+modules.map(m=>m.css||'').join('\n')+'\n'+identityCss+'\n'+refinements);
console.log(`Built ${pages.length} static pages: ${pages.map(p=>p.slug).join(', ')}`);
