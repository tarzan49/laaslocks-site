/* Original LAAS Lottie movement, presented in the Help & Guides palette. */
(()=>{
  const guides={
    locking:{title:'Lock manually.',copy:'Lift and rotate the handle until it clicks.',href:'/help/locking/#steps'},
    charging:{title:'Charge your lock.',copy:'Lift the cover and plug in USB-C. The light goes out when charging is complete.',href:'/help/charging/#steps'},
    jammed:{title:'Something in the way?',copy:'Check that nothing is obstructing the shackle, such as a wheel spoke.',href:'/help/troubleshooting/#step-3'}
  };
  const instances=new Set();let playerReady,serial=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function loadPlayer(){
    if(window.lottie)return Promise.resolve(window.lottie);
    if(!playerReady)playerReady=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/help-static/vendor/lottie-light-5.13.0.min.js';s.onload=()=>resolve(window.lottie);s.onerror=()=>{playerReady=null;reject(Error('Animation player unavailable'));};document.head.append(s);});
    return playerReady;
  }
  const ns='http://www.w3.org/2000/svg';
  function element(name,attrs={}){const n=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;}
  function table(points){return Array.from({length:256},(_,i)=>{let j=1;while(j<points.length-1&&i>points[j][0])j++;const [x0,y0]=points[j-1],[x1,y1]=points[j];return Math.max(0,Math.min(1,(y0+(i-x0)*(y1-y0)/(x1-x0))/255)).toFixed(5);}).join(' ');}
  function palette(svg,data,id){
    const defs=element('defs');svg.prepend(defs);
    const filters={
      ink:'0 0 0 0 .12549 0 0 0 0 .18431 0 0 0 0 .18824 0 0 0 1 0',
      copper:'0 0 0 0 .6902 0 0 0 0 .44706 0 0 0 0 .28627 0 0 0 1 0',
      hand:'.85714 0 0 0 .06835 0 .93130 0 0 .01286 0 0 1.24806 0 -.29615 0 0 0 1 0'
    };
    // Hand matrix retains the original two-colour drawing, using copper and warm white.
    for(const [role,values] of Object.entries(filters)){const f=element('filter',{id:id+'-'+role,'color-interpolation-filters':'sRGB'});f.append(element('feColorMatrix',{type:'matrix',values}));defs.append(f);}
    const blue=element('filter',{id:id+'-teal','color-interpolation-filters':'sRGB'}),transfer=element('feComponentTransfer');
    const maps={R:[[0,32],[29,32],[69,29],[155,188],[255,236]],G:[[0,47],[95,47],[137,95],[205,213],[255,236]],B:[[0,48],[98,48],[142,99],[208,202],[255,234]]};
    for(const [channel,points] of Object.entries(maps))transfer.append(element('feFunc'+channel,{type:'table',tableValues:table(points)}));
    blue.append(transfer);defs.append(blue);
    svg.querySelectorAll('image').forEach(image=>{const href=image.getAttribute('href')||image.getAttributeNS('http://www.w3.org/1999/xlink','href');const asset=data.assets.find(a=>a.p===href);const role=asset&&data.laasPresentation.roles[asset.id];if(role)image.setAttribute('filter','url(#'+id+'-'+role+')');});
  }
  async function mount(host,key,{autoplay=true,showCopy=true}={}){
    if(host.dataset.animationMounted)return;
    host.dataset.animationMounted='true';host.classList.add('laas-animation');
    const guide=guides[key];if(!guide)return;
    const stage=document.createElement('div');stage.className='laas-animation-stage';stage.setAttribute('role','img');stage.setAttribute('aria-label',guide.title+' '+guide.copy);stage.setAttribute('aria-busy','true');host.append(stage);
    if(showCopy){const caption=document.createElement('p');caption.className='laas-animation-caption';caption.textContent=guide.copy;host.append(caption);}
    const controls=document.createElement('div');controls.className='laas-animation-controls';
    const play=document.createElement('button');play.type='button';play.textContent='Play animation';play.disabled=true;
    const replay=document.createElement('button');replay.type='button';replay.textContent='Replay';replay.disabled=true;
    controls.append(play,replay);host.append(controls);
    try{
      const [lottie,response]=await Promise.all([loadPlayer(),fetch('/help-assets/animations/'+key+'.json?v=94')]);if(!response.ok)throw Error('Animation unavailable');const data=await response.json();
      const animation=lottie.loadAnimation({container:stage,renderer:'svg',loop:true,autoplay:false,animationData:data,rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
      const item={animation,host,play,started:false,ready:false,visible:false,manualPaused:false,requested:false};instances.add(item);
      const sync=()=>{if(!item.ready)return;const active=item.visible&&!document.hidden&&!item.manualPaused&&(!reduced.matches||item.requested)&&(autoplay||item.requested);if(active){item.started=true;animation.play();play.textContent='Pause';}else{animation.pause();play.textContent=item.started?'Play':'Play animation';}host.dataset.playing=String(active);};
      const observer=new IntersectionObserver(entries=>{item.visible=entries[0].isIntersecting;sync();},{threshold:.15});observer.observe(host);
      document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
      animation.addEventListener('DOMLoaded',()=>{palette(stage.querySelector('svg'),data,'laas-motion-'+(++serial));stage.setAttribute('aria-busy','false');play.disabled=false;replay.disabled=false;item.ready=true;sync();});
      animation.addEventListener('loopComplete',()=>{host.dataset.loops=String(Number(host.dataset.loops||0)+1);});
      play.addEventListener('click',()=>{item.manualPaused=!animation.isPaused;item.requested=true;sync();});
      replay.addEventListener('click',()=>{animation.goToAndStop(0,true);item.manualPaused=false;item.requested=true;sync();});
      host.addEventListener('laas-animation-pause',()=>{item.manualPaused=true;sync();});
      host.addEventListener('laas-animation-resume',()=>{item.manualPaused=false;sync();});
      return item;
    }catch(error){stage.setAttribute('aria-busy','false');stage.textContent='The animation could not load. ';const link=document.createElement('a');link.href=guide.href;link.textContent='Read the illustrated steps';stage.append(link);controls.hidden=true;}
  }
  let dialog;
  async function open(key){
    const guide=guides[key];if(!guide)return;
    document.querySelectorAll('video').forEach(v=>v.pause());instances.forEach(i=>i.host.dispatchEvent(new Event('laas-animation-pause')));
    if(!dialog){dialog=document.createElement('dialog');dialog.className='laas-animation-dialog';dialog.innerHTML='<div class="laas-animation-dialog-top"><h2 id="laas-animation-title"></h2><button type="button" aria-label="Close animation">×</button></div><div class="laas-animation-content"></div><a class="laas-animation-steps">Read the illustrated steps →</a>';dialog.setAttribute('aria-labelledby','laas-animation-title');document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{dialog.querySelectorAll('.laas-animation').forEach(h=>h.dispatchEvent(new Event('laas-animation-pause')));document.body.style.overflow=dialog.dataset.previousOverflow||'';});}
    const content=dialog.querySelector('.laas-animation-content');content.querySelectorAll('.laas-animation').forEach(h=>h.hidden=true);
    let host=content.querySelector('[data-key="'+key+'"]');if(!host){host=document.createElement('div');host.dataset.key=key;content.append(host);mount(host,key,{autoplay:true});}else{host.hidden=false;const item=[...instances].find(i=>i.host===host);if(item){item.animation.goToAndStop(0,true);host.dispatchEvent(new Event('laas-animation-resume'));}}
    dialog.querySelector('h2').textContent=guide.title;dialog.querySelector('.laas-animation-steps').href=guide.href;dialog.dataset.previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';
  }
  window.LAASGuideAnimations={open,mount};
  document.querySelectorAll('[data-inline-animation]').forEach(h=>mount(h,h.dataset.inlineAnimation,{showCopy:h.dataset.animationCopy!=='false'}));
})();
