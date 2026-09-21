const views = ['store','aplus','before'];
let currentStory = 'gummies';
function showView(view,scroll=true){
 if(!views.includes(view))return;
 for(const name of views)document.getElementById(name+'-view').hidden=name!==view;
 document.querySelectorAll('.reviewbar [data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));});
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
}
function setStory(story){
 currentStory=story;const slices=story==='slices';
 document.querySelectorAll('[data-story]').forEach(b=>{b.classList.toggle('selected',b.dataset.story===story);b.setAttribute('aria-pressed',String(b.dataset.story===story));});
 const text=(id,value)=>document.getElementById(id).textContent=value;
 text('ap-product-type',slices?'FRUIT SLICES':'MIXED GUMMIES');
 document.getElementById('ap-title').innerHTML=slices?'FRUIT SLICES.':'MIXED GUMMIES.';
 text('ap-description',slices?'Colorful slices. A sugar-coated finish.':'A colorful mix of gummy shapes.');
 const hero=document.getElementById('ap-hero-image');hero.src=slices?'images/slices.webp':'images/hero.webp';hero.alt=slices?'Sugar-coated fruit-shaped jelly candy concept':'Pink gummy pouch beside reference-inspired loose candy';
 text('mix-title',slices?'SUGAR & COLOR.':'MEET THE MIX.');
 const titles=slices?['A sugar-coated finish','Fruit-inspired shapes','A colorful selection']:['A mix of shapes','Sugar-dusted details','Color in the mix'];
 const bodies=slices?['Tiny crystals. A closer look.','Rounded pieces with a playful look.','Different colors, side by side.']:['Little pieces with their own personalities.','A closer look at the coated pieces.','See the little details before the first bite.'];
 for(let i=0;i<3;i++){text('detail-title-'+(i+1),titles[i]);text('detail-body-'+(i+1),bodies[i]);}
 document.querySelectorAll('.detail-image img').forEach(img=>{img.src=hero.src;img.alt=slices?'Close-up of the fruit-slice visualization':'Close-up of the loose gummy visualization';});
 document.querySelector('.mix-section').classList.toggle('slices',slices);
 text('fact-type',slices?'Fruit slices':'Mixed gummies');
 // Keep the gummy pouch out of the fruit-slice story; use the separate right reference pack.
 document.getElementById('pack-image').src=slices?'images/fruit-pouch.jpg':'images/pouch.jpg';
 document.getElementById('pack-image').alt=slices?'Right fruit-slice pouch from the approved two-pouch visualization':'Reference gummy pouch';
 document.querySelector('.ap-occasion').hidden=slices;
 document.getElementById('slices-close').hidden=!slices;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.view)showView(button.dataset.view);
 if(button.dataset.product){setStory(button.dataset.product);showView('aplus');}
 if(button.dataset.story)setStory(button.dataset.story);
 if(button.dataset.scroll){showView('store',false);document.getElementById(button.dataset.scroll).scrollIntoView({behavior:'smooth',block:'start'});}
 if(button.classList.contains('notes-toggle')){const panel=document.getElementById('review-notes');panel.hidden=!panel.hidden;document.querySelectorAll('.notes-toggle').forEach(b=>b.setAttribute('aria-expanded',String(!panel.hidden)));if(!panel.hidden)document.querySelector('.close-notes').focus();}
 if(button.classList.contains('close-notes')){document.getElementById('review-notes').hidden=true;document.querySelectorAll('.notes-toggle').forEach(b=>b.setAttribute('aria-expanded','false'));document.querySelector('.reviewbar .notes-toggle').focus();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('review-notes').hidden)document.querySelector('.close-notes').click();});
