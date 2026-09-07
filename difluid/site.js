const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#chapter-nav');
function closeMenu(){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();toggle?.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
for (const module of ['identity','experience']) {
  if ((module==='identity' && ['identity','applications'].includes(document.body.dataset.page)) || (module==='experience' && ['experience','future'].includes(document.body.dataset.page))) {
    import(`./${module}.js`).catch(error=>console.error('Interactive chapter could not load:',error));
  }
}
