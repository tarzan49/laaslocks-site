'use strict';
(()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
qa('.phone-link,.phone-float').forEach(a=>{a.href='tel:+4531338213';a.setAttribute('aria-label','Call LAAS on +45 31 33 82 13');if(a.classList.contains('phone-link'))a.textContent='+45 31 33 82 13 ↗';});
qa('.phone-label').forEach(e=>e.textContent='+45 31 33 82 13');
if(document.body.classList.contains('subpage')){
q('.menu-toggle')?.addEventListener('click',()=>{q('#navigation').showModal();document.body.style.overflow='hidden';q('.menu-toggle').setAttribute('aria-expanded','true');});
qa('[data-close]').forEach(b=>b.addEventListener('click',()=>q('#'+b.dataset.close)?.close()));
qa('dialog').forEach(d=>d.addEventListener('close',()=>{document.body.style.overflow='';q('.menu-toggle')?.setAttribute('aria-expanded','false');}));
}
if(q('#faq-search')){let category=new URLSearchParams(location.search).get('category')||'All';function filter(){const term=q('#faq-search').value.trim().toLowerCase();let count=0;qa('.faq-item').forEach(el=>{el.hidden=!((category==='All'||el.dataset.category===category)&&el.dataset.search.includes(term));if(!el.hidden)count++;});q('#faq-count').textContent=count+' question'+(count===1?'':'s');q('.no-results').hidden=count>0;qa('[data-category-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.categoryFilter===category);b.setAttribute('aria-pressed',String(b.dataset.categoryFilter===category));});}q('#faq-search').addEventListener('input',filter);qa('[data-category-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.categoryFilter;filter();}));filter();}
qa('.print-guide').forEach(b=>b.addEventListener('click',()=>window.print()));
})();
