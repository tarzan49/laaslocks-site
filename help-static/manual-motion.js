/* Source-based visual guides: real LAAS renders, screenshots and tutorial frames. */
(()=>{
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const render='/help-static/assets/steel-v8-guide.webp';
function photo(src,alt,cls=''){return `<img class="${cls}" src="${src}" alt="${esc(alt)}" decoding="async"/>`;}
function scene(key,i,step){
 const source=step.image;
 if(key==='setup'&&i<2){
  const app=i===0?'/help-assets/steps/app-welcome.png':'/help-assets/steps/serial-number.jpg';
  return `<div class="mm-product-pair"><div class="mm-screen">${photo(app,step.title)}${i===0?'<span class="mm-highlight mm-add" aria-hidden="true"></span>':''}</div><div class="mm-product">${photo(render,'LAAS Ring-Lock — corrected steel render')}</div></div>`;
 }
 if(key==='unlocking'&&i<2){
  return `<div class="mm-product-pair"><div class="mm-screen">${photo('/help-static/assets/app-screen.png','LAAS app showing the Unlock button')}${i===1?'<span class="mm-highlight mm-unlock" aria-hidden="true"></span>':''}</div><div class="mm-product">${photo(render,'LAAS Ring-Lock — corrected steel render')}</div></div>`;
 }
 if(key==='unlocking')return `<div class="mm-source-photo">${photo('/help-assets/steps/locking-2.jpg','The actual Ring-Lock mounted on a bike, with its shackle open')}</div>`;
 if(key==='find-my'&&i===1)return '<div class="mm-source-photo"><video muted playsinline loop preload="metadata" poster="/help-assets/steps/find-my-blinking.jpg" aria-label="The real lock’s LED blinking in pairing mode"><source src="/help-assets/steps/find-my-blinking.mp4" type="video/mp4"/></video></div>';
 if(key==='app-settings'&&i===0)return `<div class="mm-source-photo mm-app-screen">${photo('/help-static/assets/app-screen.png','The LAAS app showing locks and battery levels')}</div>`;
 return `<div class="mm-source-photo">${photo(source,step.title)}</div>`;
}
let dataReady;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
async function mount(host,key){
 if(host.dataset.manualMounted)return;host.dataset.manualMounted='true';host.classList.add('manual-motion');host.dataset.guide=key;
 try{
  if(!dataReady)dataReady=fetch('/help-static/manual-motion-data.json?v=96').then(r=>{if(!r.ok)throw Error();return r.json()});
  const data=(await dataReady)[key];if(!data)throw Error('Unknown guide');
  host.innerHTML='<div class="manual-motion-visual" role="img"></div><div class="manual-motion-info"><div class="manual-motion-top"><span class="manual-motion-label">VISUAL STEPS</span><button type="button" class="manual-motion-play">Pause</button></div><div class="manual-motion-steps" aria-label="Animation steps"></div><h3></h3><p></p><div class="manual-motion-track" aria-hidden="true"><span></span></div></div>';
  const visual=host.querySelector('.manual-motion-visual'),title=host.querySelector('h3'),copy=host.querySelector('p'),play=host.querySelector('.manual-motion-play'),progress=host.querySelector('.manual-motion-track span'),buttons=host.querySelector('.manual-motion-steps');
  let index=0,elapsed=0,last=0,raf=0,visible=false,paused=reduced.matches;
  const duration=6500;
  data.steps.forEach((step,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label','Step '+(i+1)+': '+step.title);b.onclick=()=>{index=i;elapsed=0;last=0;render();sync();};buttons.append(b)});
  function render(){visual.querySelectorAll('video').forEach(v=>v.pause());const s=data.steps[index];visual.innerHTML=scene(key,index,s);visual.setAttribute('aria-label',s.title+' '+s.copy);title.textContent=s.title;copy.textContent=s.copy;host.dataset.step=String(index+1);buttons.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));progress.style.transform='scaleX(0)';}
  function frame(now){raf=0;if(!visible||paused||document.hidden)return;elapsed+=last?Math.min(now-last,100):0;last=now;if(elapsed>=duration){elapsed=0;index=(index+1)%data.steps.length;if(index===0)host.dataset.loops=String(Number(host.dataset.loops||0)+1);render();visual.querySelectorAll('video').forEach(v=>v.play().catch(()=>{}));}progress.style.transform='scaleX('+elapsed/duration+')';raf=requestAnimationFrame(frame);}
  function sync(){const active=visible&&!paused&&!document.hidden;host.dataset.playing=String(active);visual.querySelectorAll('video').forEach(v=>{if(active)v.play().catch(()=>{});else v.pause()});play.textContent=paused?'Play':'Pause';play.setAttribute('aria-label',(paused?'Play ':'Pause ')+data.title);last=0;if(raf){cancelAnimationFrame(raf);raf=0;}if(active)raf=requestAnimationFrame(frame);}
  play.onclick=()=>{paused=!paused;sync()};host.addEventListener('manual-motion-pause',()=>{paused=true;sync()});host.addEventListener('manual-motion-resume',()=>{paused=reduced.matches;sync()});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.1});observer.observe(host);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});render();sync();
 }catch(error){host.innerHTML='<p>The visual guide could not load. Follow the written steps below.</p>';}
}
window.LAASManualMotion={mount};document.querySelectorAll('[data-manual-motion]').forEach(h=>mount(h,h.dataset.manualMotion));
})();
