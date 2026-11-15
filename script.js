(function(){
var c=document.getElementById('fx'),x=c.getContext('2d'),P=[],W,H;
function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener('resize',rs);
var cols=['#d9b46a','#f6ecd6','#e88aa5','#3fb68b','#c2410c'];
function burst(n,ox,oy){for(var i=0;i<n;i++)P.push({x:ox==null?Math.random()*W:ox,y:oy==null?-10:oy,vx:(Math.random()-.5)*(ox==null?2:12),vy:ox==null?1+Math.random()*2:-Math.random()*11,s:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.2,c:cols[i%5],l:1})}
function loop(){x.clearRect(0,0,W,H);P=P.filter(function(p){return p.y<H+20});
P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
requestAnimationFrame(loop)}loop();
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var AC;function pop(t,v,d){var sr=AC.sampleRate,n=Math.floor(sr*d),buf=AC.createBuffer(1,n,sr),a=buf.getChannelData(0);for(var i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,4);var s=AC.createBufferSource();s.buffer=buf;var f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=900+Math.random()*2500;var g=AC.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(AC.destination);s.start(AC.currentTime+t)}
function crackers(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();for(var i=0;i<26;i++)pop(i*.07+Math.random()*.05,.5+Math.random()*.5,.05+Math.random()*.05);pop(.0,1.4,.35);pop(.9,1.4,.35);pop(1.8,1.6,.4)}catch(e){}}
var M,RV;
function setup(){if(M)return;var c=AC.createDynamicsCompressor();c.connect(AC.destination);M=AC.createGain();M.gain.value=.9;M.connect(c);var len=Math.floor(AC.sampleRate*1.6),ib=AC.createBuffer(2,len,AC.sampleRate);for(var ch=0;ch<2;ch++){var d=ib.getChannelData(ch);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}RV=AC.createConvolver();RV.buffer=ib;var rg=AC.createGain();rg.gain.value=.35;RV.connect(rg);rg.connect(M)}
function out(n,wet){n.connect(M);if(wet){var w=AC.createGain();w.gain.value=wet;n.connect(w);w.connect(RV)}}
function noise(dur){var n=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++)a[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;return s}
function env(g,t,v,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d)}
function whistle(t){var o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(2200,t+.6);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.1);g.gain.exponentialRampToValueAtTime(.0001,t+.62);o.connect(g);out(g,.2);o.start(t);o.stop(t+.7)}
function boom(t){var o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(35,t+.4);env(g,t,1,.6);o.connect(g);out(g,.3);o.start(t);o.stop(t+.7);var n=noise(.5),f=AC.createBiquadFilter(),g2=AC.createGain();f.type='lowpass';f.frequency.setValueAtTime(3500,t);f.frequency.exponentialRampToValueAtTime(200,t+.4);env(g2,t,.9,.5);n.connect(f);f.connect(g2);out(g2,.4);n.start(t)}
function spark(t){var n=noise(.06),f=AC.createBiquadFilter(),g=AC.createGain();f.type='highpass';f.frequency.value=3000+Math.random()*3000;env(g,t,.15+Math.random()*.25,.03+Math.random()*.03);n.connect(f);f.connect(g);if(AC.createStereoPanner){var p=AC.createStereoPanner();p.pan.value=Math.random()*2-1;g.connect(p);out(p,.25)}else out(g,.25);n.start(t)}
function firework(t){whistle(t);boom(t+.62);for(var i=0;i<40;i++)spark(t+.7+Math.random()*1.3)}
function chime(t,fr){var o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=fr;env(g,t,.18,.9);o.connect(g);out(g,.4);o.start(t);o.stop(t+1)}
function fireworks(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();setup();var t=AC.currentTime+.05;firework(t);firework(t+1.5);firework(t+3);[523,659,784,1047].forEach(function(f,i){chime(t+3.9+i*.12,f)})}catch(e){}}
function popper(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();setup();var t=AC.currentTime+.02,o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(260,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);env(g,t,.9,.16);o.connect(g);out(g,.15);o.start(t);o.stop(t+.2);var n=noise(.12),f=AC.createBiquadFilter(),g2=AC.createGain();f.type='bandpass';f.frequency.value=1800;f.Q.value=.7;env(g2,t,1,.08);n.connect(f);f.connect(g2);out(g2,.25);n.start(t);for(var i=0;i<14;i++)spark(t+.06+i*.025+Math.random()*.03)}catch(e){}}
document.getElementById('pop').onclick=function(e){popper();if(!rm){burst(160,e.clientX,e.clientY);burst(60)}};
if(!rm)burst(60);window.__b=burst;
var tn=document.getElementById('tn');
document.getElementById('nowimg').src=document.querySelector('.strip img').src;
tn.onclick=function(e){var on=tn.classList.toggle('on');tn.setAttribute('aria-pressed',on);document.getElementById('th').textContent=on?'Now: the same smile, all grown up. Tap to go back.':'Tap to flip';if(on&&!rm){var r=tn.getBoundingClientRect();window.__b(120,r.left+r.width/2,r.top+r.height/2)}};
var target=new Date(2026,10,16,0,0,0),end=new Date(2026,10,17,0,0,0),el=document.getElementById('count'),ln=document.getElementById('line');
function tick(){var n=new Date(),d=target-n;
if(n>=target&&n<end){ln.textContent='Today is your day. Make it unforgettable.';el.innerHTML='';return}
if(n>=end){ln.textContent='Hope your birthday was beautiful, Nabeela.';el.innerHTML='';return}
var s=Math.floor(d/1000),dd=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),ss=s%60;
function b(v,l){return '<div><b>'+v+'</b><span>'+l+'</span></div>'}
el.innerHTML=b(dd,'days')+b(h,'hours')+b(m,'min')+b(ss,'sec')}
tick();setInterval(tick,1000);
})();