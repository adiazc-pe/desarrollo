 $('sessionNav').onclick=()=>{view='session';render();};$('guideNav').onclick=()=>{view='guide';render();};$('reviewNav').onclick=openReview;
 document.addEventListener('visibilitychange',()=>{if(!session||!['task','summary'].includes(stage))return;if(document.hidden){stopClock();log('tab_hidden');}else if(!manualPause){startClock();log('tab_visible');}});
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 render();
