(()=>{
 const videos=[...document.querySelectorAll('.tutorial video')];
 videos.forEach(video=>{
  const figure=video.closest('.tutorial'),button=figure.querySelector('.tutorial-play');
  const hide=()=>{button.hidden=true;};
  button.addEventListener('click',async()=>{try{await video.play();hide();}catch{button.hidden=false;}});
  video.addEventListener('play',()=>{hide();videos.forEach(other=>{if(other!==video)other.pause();});});
  video.addEventListener('ended',()=>{button.hidden=false;});
  video.addEventListener('error',()=>{if(figure.querySelector('.video-error'))return;button.hidden=true;const p=document.createElement('p');p.className='video-error';p.append('The video could not load. ');const a=document.createElement('a');a.href=video.querySelector('source').src;a.textContent='Open it directly';p.append(a);figure.append(p);});
 });
 const q=new URLSearchParams(location.search).get('q'),search=document.querySelector('#faq-search');
 if(q&&search){search.value=q;search.dispatchEvent(new Event('input'));const result=[...document.querySelectorAll('.faq-item')].find(x=>!x.hidden);if(result)result.open=true;}
})();
// The original short LAAS tutorials, available directly from the guide icons.
(()=>{
 const dialog=document.querySelector('#guide-video-dialog');if(!dialog)return;
 const video=dialog.querySelector('video'),title=dialog.querySelector('h2');let previousOverflow='';
 document.querySelectorAll('[data-guide-video]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('video').forEach(v=>v.pause());
  const key=button.dataset.guideVideo;
  if(['locking','charging','jammed'].includes(key)){
   const open=()=>window.LAASGuideAnimations.open(key);
   if(window.LAASGuideAnimations){open();return;}
   if(!window.laasGuideAnimationReady){
    const css=document.createElement('link');css.rel='stylesheet';css.href='/help-static/guide-animations.css?v=93';document.head.append(css);
    window.laasGuideAnimationReady=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/help-static/guide-animations.js?v=93';script.onload=resolve;script.onerror=()=>{window.laasGuideAnimationReady=null;reject(Error('Animation unavailable'));};document.head.append(script);});
   }
   window.laasGuideAnimationReady.then(open).catch(()=>{location.href=button.dataset.guideHref||'/guides/';});return;
  }
  title.textContent=button.dataset.guideTitle;
  const steps=dialog.querySelector('.guide-video-full');steps.href=button.dataset.guideHref||'/help/videos/';steps.textContent=button.dataset.guideHref?'Read the illustrated steps':'All video guides and illustrated steps';
  video.src='/help-assets/'+key+'.mp4';video.poster='/help-assets/'+key+'.jpg';video.setAttribute('aria-label',button.dataset.guideTitle);
  dialog.querySelector('.guide-video-error')?.remove();previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';
  video.play().catch(()=>{});
 }));
 dialog.querySelector('.guide-video-full').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.guide-video-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{video.pause();document.body.style.overflow=previousOverflow;});
 video.addEventListener('error',()=>{if(dialog.querySelector('.guide-video-error'))return;const p=document.createElement('p');p.className='guide-video-error';p.append('Having trouble playing this guide? ');const a=document.createElement('a');a.href=video.src;a.textContent='Open the video';p.append(a);dialog.append(p);});
})();
