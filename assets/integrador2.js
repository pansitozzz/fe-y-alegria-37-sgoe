(()=>{"use strict";
const all=Array.isArray(window.PROCESSES)?window.PROCESSES:[];
const menuBtn=document.querySelector(".menu-btn");
const navLinks=document.querySelector(".nav-links");
menuBtn?.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú")});
navLinks?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{navLinks.classList.remove("open");menuBtn?.setAttribute("aria-expanded","false");menuBtn?.setAttribute("aria-label","Abrir menú")}));

const category={E:"Estratégico",M:"Misional",S:"Soporte"};
const phaseLabels={P:"Planear",H:"Hacer",V:"Verificar",A:"Actuar"};
const esc=(s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId=id=>document.getElementById(id);
const codeBadge=p=>'<span class="code-tag">'+esc(p.code)+'</span>';
const rows=raw=>String(raw||"").split("\n").filter(x=>x.trim()).map(x=>x.split("|"));
const mapNode=p=>'<button class="map-node" type="button" data-open="'+esc(p.code)+'" aria-label="Abrir ficha '+esc(p.code)+': '+esc(p.name)+'"><b>'+esc(p.code)+'</b>'+esc(p.name)+'</button>';
for(const t of ["E","M","S"])byId("map"+t).innerHTML=all.filter(p=>p.type===t).map(mapNode).join("");
byId("inventoryBody").innerHTML=all.map(p=>'<tr><td>'+codeBadge(p)+'</td><td><strong class="type-'+esc(p.type)+'">'+esc(category[p.type])+'</strong></td><td>'+esc(p.name)+'</td><td>'+esc(p.leader)+'</td><td><button class="mini-link" type="button" data-open="'+esc(p.code)+'">Consultar</button></td></tr>').join("");
const cards=byId("processCards");
function renderCards(filter="all"){
const groups=(filter==="all"?["E","M","S"]:[filter]).filter(t=>["E","M","S"].includes(t));
cards.innerHTML=groups.map(t=>{
  const items=all.filter(p=>p.type===t);
  const title={E:"Procesos estratégicos",M:"Procesos misionales",S:"Procesos de soporte"}[t];
  return '<section class="process-group" id="grupo-'+t+'"><div class="group-head"><h3>'+esc(title)+'</h3><span>'+items.length+' fichas</span></div><div class="group-cards">'+items.map(p=>'<article class="process-card" id="card-'+esc(p.code)+'"><div class="card-top">'+codeBadge(p)+'<span class="card-type type-'+esc(p.type)+'">'+esc(category[p.type])+'</span></div><h3>'+esc(p.name)+'</h3><p><strong>Responsable:</strong> '+esc(p.leader)+'</p><button type="button" class="open-card" data-open="'+esc(p.code)+'">Abrir ficha completa →</button></article>').join("")+'</div></section>';
}).join("");
}
function detailBlock(label,text){return '<article class="detail-block"><h5>'+esc(label)+'</h5><p>'+esc(text)+'</p></article>'}
function info(label,value,full=false){return '<div class="info-pill'+(full?' full':'')+'"><b>'+esc(label)+'</b>'+esc(value)+'</div>'}
const headings=["Proveedor interno","Proveedor externo","Entradas · información primaria","Actividades","Salidas · información secundaria","Cliente interno","Cliente externo"];
function phaseTable(label,raw){
return '<div class="phase-section phase-'+label+'"><h5>PHVA · '+esc(phaseLabels[label])+'</h5><div class="phase-table-wrap"><table class="phase-table"><thead><tr>'+headings.map(h=>'<th>'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+rows(raw).map(line=>'<tr>'+Array.from({length:7},(_,j)=>'<td>'+esc(line[j]??"—")+'</td>').join("")+'</tr>').join("")+'</tbody></table></div></div>';
}
function showProcess(code,push=true){
const p=all.find(x=>x.code===code);
if(!p)return;
document.querySelectorAll(".filter").forEach(btn=>{const selected=btn.dataset.filter==="all";btn.classList.toggle("selected",selected);btn.setAttribute("aria-pressed",String(selected))});
renderCards("all");
byId("detailCategory").textContent="Ficha "+p.code+" · "+category[p.type]+" · Nivel 0 · Versión 2.0";
byId("detailTitle").textContent=p.name;
byId("detailMeta").textContent="I.E. Fe y Alegría N.° 37 · Fecha de aprobación: por aprobar";
let out='<div class="info-grid">'+info("1. Responsable — líder del proceso",p.leader)+info("2. Objetivo",p.goal)+info("3. Alcance",p.scope,true)+'</div>';
out+='<h4 class="detail-section-title">4. Ciclo PHVA · Proveedores, entradas, actividades, salidas y clientes</h4>';
for(const stage of ["P","H","V","A"])out+=phaseTable(stage,p.phva[stage]);
out+='<h4 class="detail-section-title">5–9. Caracterización y seguimiento</h4>';
out+=detailBlock("5. Requisitos del proceso",p.requirements)+detailBlock("Documentos y evidencias",p.documents)+detailBlock("6. Recursos necesarios",p.resources);
out+='<div class="detail-block"><h5>7. Indicador de desempeño</h5><p><strong>'+esc(p.indicator)+'</strong></p><p>'+esc(p.formula)+'</p><p><strong>Frecuencia y meta:</strong> '+esc(p.target)+'</p></div>';
out+=detailBlock("8. Riesgo",p.risk)+detailBlock("Control previsto",p.control)+detailBlock("Oportunidad",p.opportunity);
out+=detailBlock("9. Seguimiento y relación con otros procesos","El responsable reúne las evidencias de esta ficha y revisa el indicador con la frecuencia señalada. Registra problemas, acciones, fechas y responsables. Comunica los resultados a E02; los cambios en objetivos o alcance se acuerdan con E01.");
if(p.extra)out+=detailBlock("10. Precisiones complementarias",p.extra);
out+='<div class="notice">Las metas son propuestas y deben validarse con datos del colegio. Si no hay casos u operaciones en el periodo, registrar “No aplica” con su justificación. La aprobación institucional de esta ficha está pendiente. El contenido no incluye registros personales de estudiantes.</div>';
byId("detailContent").innerHTML=out;
const detail=byId("detalle");detail.hidden=false;
if(push)history.replaceState(null,"","#"+code);
detail.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
}
function closeDetail(){byId("detalle").hidden=true;history.replaceState(null,"","#fichas");byId("fichas").scrollIntoView({behavior:"smooth",block:"start"})}
document.addEventListener("click",e=>{const open=e.target.closest("[data-open]");if(open){e.preventDefault();showProcess(open.dataset.open);return}const filter=e.target.closest("[data-filter]");if(filter){const value=filter.dataset.filter;document.querySelectorAll(".filter").forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active))});renderCards(value);byId("detalle").hidden=true;}});
byId("closeDetail").addEventListener("click",closeDetail);
byId("returnFichas")?.addEventListener("click",e=>{e.preventDefault();closeDetail()});
renderCards();
if(/^#(E0[12]|M0[1-4]|S0[1-4])$/.test(location.hash)){const target=location.hash.slice(1);requestAnimationFrame(()=>showProcess(target,false))}
})();