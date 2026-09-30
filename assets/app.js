const menuBtn=document.querySelector('.menu-btn');
const navLinks=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

const revealObs=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav-links a')];
const spy=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>spy.observe(s));

document.querySelectorAll('.detail-btn').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.need-card');const isOpen=card.classList.toggle('open');btn.innerHTML=isOpen?'Ocultar diagnóstico <span>−</span>':'Ver diagnóstico <span>+</span>'}));

const tooltip=document.getElementById('tooltip');
document.querySelectorAll('[data-tip]').forEach(el=>{
  el.addEventListener('pointerenter',()=>{tooltip.textContent=el.dataset.tip;tooltip.classList.add('show')});
  el.addEventListener('pointermove',e=>{tooltip.style.left=(e.clientX+14)+'px';tooltip.style.top=(e.clientY+14)+'px'});
  el.addEventListener('pointerleave',()=>tooltip.classList.remove('show'));
});

const processCopy={
  strategic:{title:'Estratégica',text:'Define el rumbo institucional mediante la planificación, el liderazgo, la participación y el seguimiento para la mejora continua.'},
  mission:{title:'Misional',text:'Desarrolla el servicio educativo: admisión y matrícula, gestión curricular, enseñanza y aprendizaje, evaluación y retroalimentación, tutoría, convivencia e inclusión.'},
  support:{title:'Soporte',text:'Proporciona las condiciones para trabajar mediante la gestión de personas, administración y finanzas, materiales, infraestructura y tecnología, y gestión documental.'}
};
const title=document.getElementById('processTitle'); const textEl=document.getElementById('processText');
document.querySelectorAll('.process-band').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.process-band').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const d=processCopy[btn.dataset.process]; title.textContent=d.title; textEl.textContent=d.text;
}));