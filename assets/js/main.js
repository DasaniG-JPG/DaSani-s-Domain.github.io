const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('#main-nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const tabs=document.querySelectorAll('.tab');
const items=document.querySelectorAll('.gallery-item');
tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');const filter=tab.dataset.filter;items.forEach(item=>item.hidden=filter!=='all'&&item.dataset.kind!==filter)}));

const modal=document.querySelector('#media-modal');
const content=modal.querySelector('.modal-content');
const title=modal.querySelector('.modal-title');
document.querySelectorAll('.media-button').forEach(btn=>btn.addEventListener('click',()=>{
  content.innerHTML='';
  const src=btn.dataset.src;
  const type=btn.dataset.type;
  title.textContent=btn.dataset.title||'';
  if(type==='video'){
    const video=document.createElement('video');
    video.src=src;video.controls=true;video.autoplay=true;video.playsInline=true;video.muted=true;
    video.setAttribute('aria-label',`${btn.dataset.title||'Animation'} (silent video)`);
    content.appendChild(video);
  }else{
    const img=document.createElement('img');img.src=src;img.alt=btn.dataset.title||'Portfolio image';content.appendChild(img)
  }
  modal.showModal()
}));
modal.querySelector('.modal-close').addEventListener('click',()=>{content.querySelector('video')?.pause();modal.close()});
modal.addEventListener('click',e=>{if(e.target===modal){content.querySelector('video')?.pause();modal.close()}});

const channels=[...document.querySelectorAll('.codec-channel')];
const codecShell=document.querySelector('.codec-shell');
const frequency=document.querySelector('#codec-frequency');
const heroTitle=document.querySelector('#hero-title');
const heroRole=document.querySelector('#codec-role');
const preview=document.querySelector('#codec-preview');
const previewLabel=document.querySelector('#codec-preview-label');
const channelLabel=document.querySelector('#codec-channel-label');
let codecIndex=0;

function tuneCodec(index,{scroll=false}={}){
  codecIndex=(index+channels.length)%channels.length;
  const ch=channels[codecIndex];
  channels.forEach((c,i)=>c.classList.toggle('active',i===codecIndex));
  frequency.textContent=ch.dataset.frequency;
  heroTitle.textContent=ch.dataset.title;
  heroRole.textContent=ch.dataset.role;
  preview.src=ch.dataset.image;
  preview.alt=`${ch.dataset.label} preview`;
  previewLabel.textContent=ch.dataset.label;
  channelLabel.textContent=`CH ${ch.dataset.frequency}`;
  codecShell.classList.remove('tuning');
  void codecShell.offsetWidth;
  codecShell.classList.add('tuning');
  window.setTimeout(()=>codecShell.classList.remove('tuning'),550);
  if(scroll) document.querySelector(ch.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
}
channels.forEach((ch,i)=>ch.addEventListener('click',()=>tuneCodec(i)));
document.querySelector('#codec-prev')?.addEventListener('click',()=>tuneCodec(codecIndex-1,{scroll:true}));
document.querySelector('#codec-next')?.addEventListener('click',()=>tuneCodec(codecIndex+1,{scroll:true}));
window.addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea,select,button,summary')) return;
  if(e.key==='ArrowLeft'){e.preventDefault();tuneCodec(codecIndex-1,{scroll:true})}
  if(e.key==='ArrowRight'){e.preventDefault();tuneCodec(codecIndex+1,{scroll:true})}
});

const sectionMap=new Map(channels.map((ch,i)=>[ch.getAttribute('href').slice(1),i]));
const sections=[...document.querySelectorAll('main section[id]')];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting && sectionMap.has(entry.target.id)) tuneCodec(sectionMap.get(entry.target.id))})
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));
