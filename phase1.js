/* ============================================================
   Chalkie | Phase 1: Calculus Readiness
   Navigation shell, Calculus Toolbox, and the seven environment modules.
   ============================================================ */

var CHALKIE = (function(){
  "use strict";

  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var TOTAL = screens.length;
  var current = 0, isAnimating = false;

  var ENVMAP = {0: "ENVIRONMENT 1 OF 6", 1: "ENVIRONMENT 1 OF 6", 2: "ENVIRONMENT 1 OF 6", 3: "ENVIRONMENT 1 OF 6", 4: "ENVIRONMENT 1 OF 6", 5: "ENVIRONMENT 2 OF 6", 6: "ENVIRONMENT 2 OF 6", 7: "ENVIRONMENT 2 OF 6", 8: "ENVIRONMENT 2 OF 6", 9: "ENVIRONMENT 2 OF 6", 10: "ENVIRONMENT 2 OF 6", 11: "ENVIRONMENT 3 OF 6", 12: "ENVIRONMENT 3 OF 6", 13: "ENVIRONMENT 3 OF 6", 14: "ENVIRONMENT 3 OF 6", 15: "ENVIRONMENT 3 OF 6", 16: "ENVIRONMENT 3 OF 6", 17: "ENVIRONMENT 3 OF 6", 18: "ENVIRONMENT 4 OF 6", 19: "ENVIRONMENT 4 OF 6", 20: "ENVIRONMENT 4 OF 6", 21: "ENVIRONMENT 4 OF 6", 22: "ENVIRONMENT 4 OF 6", 23: "ENVIRONMENT 4 OF 6", 24: "ENVIRONMENT 4 OF 6", 25: "ENVIRONMENT 4 OF 6", 26: "ENVIRONMENT 4 OF 6", 27: "ENVIRONMENT 5 OF 6", 28: "ENVIRONMENT 5 OF 6", 29: "ENVIRONMENT 5 OF 6", 30: "ENVIRONMENT 5 OF 6", 31: "ENVIRONMENT 5 OF 6", 32: "ENVIRONMENT 5 OF 6", 33: "ENVIRONMENT 6 OF 6", 34: "ENVIRONMENT 6 OF 6", 35: "ENVIRONMENT 6 OF 6", 36: "ENVIRONMENT 6 OF 6", 37: "ENVIRONMENT 6 OF 6", 38: "ENVIRONMENT 6 OF 6", 39: "PHASE 1 MASTERY GATE", 40: "PHASE 1 MASTERY GATE", 41: "PHASE 1 MASTERY GATE"};

  /* ---------------- navigation ---------------- */
  function goTo(i){
    if(isAnimating || i === current || i < 0 || i >= TOTAL) return;
    var from = screens[current], to = screens[i];
    isAnimating = true;
    from.classList.remove('active');
    if(i < current) from.classList.add('exit-left');
    to.classList.remove('exit-left');
    void to.offsetWidth;
    to.classList.add('active');
    var sc = to.querySelector('.screen-scroll');
    if(sc) sc.scrollTop = 0;
    current = i;
    document.getElementById('progressFill').style.width =
      Math.round((i/(TOTAL-1))*100) + '%';
    document.getElementById('envTag').textContent = ENVMAP[i] || '';
    var tool = to.getAttribute('data-tool');
    if(tool) unlockTool(tool);
    if(typeof window.onScreenEnter === 'function') window.onScreenEnter(i, to);
    setTimeout(function(){ from.classList.remove('exit-left'); isAnimating = false; }, 650);
  }

  /* ---------------- Calculus Toolbox ----------------
     One shared state across all six environments. Tools unlock at the
     moment the learner first needs them and stay unlocked afterwards. */
  var TOOLS = [
    {id:'function',  n:'Function',   w:'Environment 2',
     b:'A rule that turns an input into an output, written f(x). Feed it a value and it hands one back.'},
    {id:'graph',     n:'Graph',      w:'Environment 2',
     b:'A picture of a relationship. Input along the bottom, output up the side. Every point is one pair.'},
    {id:'expression',n:'Expression', w:'Environment 3',
     b:'Algebra you can rearrange, expand or compress without changing its value. Index notation is compression.'},
    {id:'power',     n:'Power',      w:'Environment 3',
     b:'A count of how many times something multiplies. A negative index means reciprocal. A fractional index means a root.'},
    {id:'gradient',  n:'Gradient',   w:'Environment 4',
     b:'The measure of change. Change in output divided by change in input.'},
    {id:'rate',      n:'Rate',       w:'Environment 4',
     b:'What the gradient means in context, carrying its units. A gradient of 6 becomes 6 L/min, or 6 naira per item.'}
  ];
  var unlocked = {};

  function renderTb(){
    var any = false, i;
    for(i in unlocked){ if(unlocked[i]){ any = true; break; } }
    document.getElementById('tbSub').textContent = any
      ? 'The tools you have collected so far. More unlock as you meet them.'
      : 'Nothing unlocked yet. Each tool opens at the moment you need it.';
    document.getElementById('tbList').innerHTML = TOOLS.map(function(t){
      var on = unlocked[t.id];
      return '<div class="tb-item ' + (on ? 'unlocked' : 'locked') + '" id="tb-' + t.id + '">' +
             '<div class="tb-name"><span>' + t.n + '</span></div>' +
             '<div class="tb-body">' + t.b + '</div>' +
             (on ? '' : '<div class="tb-where">Opens in ' + t.w + '</div>') +
             '</div>';
    }).join('');
  }

  function unlockTool(id){
    if(unlocked[id]) return;
    unlocked[id] = 1;
    renderTb();
    var t = TOOLS.filter(function(x){ return x.id === id; })[0];
    if(!t) return;
    var toast = document.getElementById('tbToast');
    toast.textContent = 'You are going to need the ' + t.n + ' tool.';
    toast.classList.add('show');
    var tab = document.getElementById('tbTab');
    tab.classList.add('pulse');
    setTimeout(function(){
      toast.classList.remove('show');
      tab.classList.remove('pulse');
    }, 3600);
  }

  function toggleTb(){ document.getElementById('tbPanel').classList.toggle('open'); }

  /* ---------------- boot ---------------- */
  renderTb();
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('envTag').textContent = ENVMAP[0] || '';

  return { goTo: goTo, toggleTb: toggleTb, unlockTool: unlockTool, screens: screens };
})();

/* expose the shell to the inline handlers in phase1.html */
var goTo       = CHALKIE.goTo;
var toggleTb   = CHALKIE.toggleTb;
var unlockTool = CHALKIE.unlockTool;
window.goTo = goTo; window.toggleTb = toggleTb; window.unlockTool = unlockTool;


/* ================= env1 ================= */
(function(){
"use strict";
/* ================= SCREENING ================= */
  function norm(s){
    return String(s).toLowerCase().replace(/\s+/g,'').replace(/\u00d7/g,'*')
           .replace(/^\+/,'');
  }
  // accepts 2x+7 in any order
  function okBuild(v){
    var s=norm(v).replace(/\*/g,'');
    return s==='2x+7'||s==='7+2x';
  }

  var ITEMS=[
    {
      id:'rep', dom:'Representation and function',
      type:'build',
      prompt:'If f(x) = 2x + 3, what is f(x + 2)?',
      sub:'Type your simplified answer. Use x for the variable, for example 5x+1.',
      check:okBuild,
      ok:'Correct. The whole bracket (x + 2) replaced x, then 2(x + 2) + 3 expanded and simplified to 2x + 7.',
      probes:[
        {tag:'SUBSTITUTION',
         q:'In f(x) = 2x + 3, when you write f(x + 2), what takes the place of x?',
         opts:['The 2 only','The whole bracket (x + 2)','Nothing changes','The x is multiplied by 2'],
         c:1,
         ok:'Good, substitution is sound. So the slip is further along, in the expanding.',
         no:'This is the step to fix. Whatever sits inside the brackets replaces every x in the rule, all of it.'},
        {tag:'EXPANDING BRACKETS',
         q:'What does 2(x + 2) expand to?',
         opts:['2x + 2','2x + 4','x + 4','4x'],
         c:1,
         ok:'Right. So 2(x + 2) + 3 becomes 2x + 4 + 3, which is 2x + 7.',
         no:'Found it. The 2 outside multiplies both terms inside, not just the first one.'}
      ]
    },
    {
      id:'alg', dom:'Algebraic manipulation',
      type:'mcq',
      prompt:'Expand (x + 3)<sup>2</sup>',
      opts:['x&sup2; + 9','x&sup2; + 6x + 9','x&sup2; + 3x + 9','2x + 6'],
      c:1,
      ok:'Correct. Both brackets were multiplied out and the two middle terms combined into 6x.',
      probes:[
        {tag:'BINOMIAL MULTIPLICATION',
         q:'Before simplifying, (x + 3)(x + 3) gives which set of terms?',
         opts:['x&middot;x + 3&middot;3','x&middot;x + 3x + 3x + 9','x&middot;x + 3','x&sup2; + 3'],
         c:1,
         ok:'That is the step. Those two 3x terms are what most people lose, and together they make the 6x.',
         no:'Here is the cause. Every term in the first bracket must meet every term in the second, which gives four products, not two.'}
      ]
    },
    {
      id:'idx', dom:'Indices',
      type:'mcq',
      prompt:'Which of these is equal to x<sup>-2</sup>?',
      opts:['-x&sup2;','1 / x&sup2;','2x','1 / 2x'],
      c:1,
      ok:'Correct. A negative index means reciprocal. It never makes the value itself negative.',
      probes:[
        {tag:'MEANING OF A NEGATIVE INDEX',
         q:'A negative sign in the index tells you to do what?',
         opts:['Make the answer negative','Put the term underneath, as a fraction','Subtract the index','Multiply by minus one'],
         c:1,
         ok:'Right. That is all it does, and it is worth holding on to before power rules arrive.',
         no:'This is the misconception to clear. The minus does not change the sign of the value, it moves the term into the denominator.'}
      ]
    },
    {
      id:'grad', dom:'Gradient and rate of change',
      type:'mcq',
      prompt:'A tank rises from 20 litres to 50 litres in 5 minutes. What is the average rate of change?',
      opts:['30 litres per minute','6 litres per minute','10 litres per minute','6 minutes per litre'],
      c:1,
      ok:'Correct, and you kept the units the right way round. 30 litres across 5 minutes is 6 litres per minute.',
      probes:[
        {tag:'RATE VERSUS CHANGE',
         q:'The tank gained 30 litres. Why is 30 not the answer?',
         opts:['Because 30 is the change, not the rate','Because 30 is too large','Because the tank started at 20','Because litres are not a rate'],
         c:0,
         ok:'Exactly. A change on its own says nothing about speed until you divide it by the time it took.',
         no:'This is the distinction to fix. 30 litres is how much it changed. How fast it changed needs that 30 divided by the 5 minutes.'}
      ]
    }
  ];

  var idx=0, res={}, mode='main', probeN=0, answered=false, conf=null, wasRight=false;

  function a_startScreen(){
    idx=0; res={}; mode='main'; probeN=0;
    render(); goTo(2);
  }
  window.a_startScreen = a_startScreen;

  function render(){
    mode='main'; answered=false; conf=null; probeN=0;
    var it=ITEMS[idx], h='';
    h+='<div class="qhead"><span>QUESTION '+(idx+1)+' OF '+ITEMS.length+'</span>'+
       '<span class="qtag">'+it.dom.toUpperCase()+'</span></div>';
    h+='<p class="qprompt">'+it.prompt+'</p>';
    if(it.type==='build'){
      h+='<p class="qsub">'+it.sub+'</p>';
      h+='<div class="build"><span>f(x + 2) =</span>'+
         '<input type="text" id="a_bIn" placeholder="?" aria-label="Your answer" autocomplete="off"></div>';
      h+='<div class="buildhint">Work it out on paper first if that helps.</div>';
      h+='<div style="text-align:center;margin-top:14px;"><button onclick="a_submitBuild()">Submit</button></div>';
    } else {
      h+='<div class="options" id="a_opts">';
      it.opts.forEach(function(o,i){ h+='<button class="option" onclick="a_answer('+i+')">'+o+'</button>'; });
      h+='</div>';
    }
    h+=confBlock();
    h+='<div class="fb" id="a_fb"></div>';
    document.getElementById('a_qCard').innerHTML=h;
    document.getElementById('a_qNext').disabled=true;
    document.getElementById('a_qNext').textContent =
      (idx===ITEMS.length-1) ? 'See my map' : 'Continue';
  }

  function confBlock(){
    return '<div class="conf" id="a_conf"><div class="conf-q">Before we go on, how sure were you?</div>'+
      '<div class="conf-row">'+
      '<button class="cbtn" onclick="a_setConf(\'high\',this)">I was confident</button>'+
      '<button class="cbtn" onclick="a_setConf(\'mid\',this)">Fairly sure</button>'+
      '<button class="cbtn" onclick="a_setConf(\'low\',this)">I am not sure</button>'+
      '</div></div>';
  }

  function a_submitBuild(){
    if(answered) return;
    var v=document.getElementById('a_bIn').value.trim();
    if(v===''){ return; }
    answered=true;
    wasRight=ITEMS[idx].check(v);
    document.getElementById('a_bIn').disabled=true;
    document.getElementById('a_conf').classList.add('show');
  }
  window.a_submitBuild = a_submitBuild;

  function a_answer(i){
    if(answered) return;
    answered=true;
    var it=(mode==='main')?ITEMS[idx]:ITEMS[idx].probes[probeN];
    var opts=document.querySelectorAll('#a_opts .option');
    Array.prototype.forEach.call(opts,function(o){o.disabled=true;});
    wasRight=(i===it.c);
    opts[i].classList.add(wasRight?'correct':'incorrect');
    if(!wasRight) opts[it.c].classList.add('correct');
    if(mode==='main'){
      document.getElementById('a_conf').classList.add('show');
    } else {
      resolveProbe();
    }
  }
  window.a_answer = a_answer;

  function a_setConf(level,btn){
    if(conf) return;
    conf=level;
    Array.prototype.forEach.call(document.querySelectorAll('.cbtn'),function(b){b.classList.remove('on');});
    btn.classList.add('on');
    resolveMain();
  }
  window.a_setConf = a_setConf;

  function resolveMain(){
    var it=ITEMS[idx], fb=document.getElementById('a_fb');
    fb.classList.remove('ok','no','probe');
    if(wasRight && conf!=='low'){
      res[it.id]={s:'secure'};
      fb.classList.add('ok','show'); fb.innerHTML=it.ok;
      document.getElementById('a_qNext').disabled=false;
    } else if(wasRight && conf==='low'){
      // right but unsure: probe anyway, per the spec
      res[it.id]={s:'shaky'};
      fb.classList.add('probe','show');
      fb.innerHTML='Correct, but you were not sure. That is worth one more question, because a guess and a grasp look identical here.'+
                   '<span class="pill">CHECKING THE REASONING</span>';
      setTimeout(startProbe,1100);
    } else {
      fb.classList.add('probe','show');
      fb.innerHTML='Let us find the exact step causing this, rather than writing off the whole topic.'+
                   '<span class="pill">NARROWING DOWN</span>';
      setTimeout(startProbe,1100);
    }
  }

  function startProbe(){
    mode='probe'; answered=false;
    var pr=ITEMS[idx].probes[probeN];
    var h='<div class="qhead"><span>TARGETED CHECK</span><span class="qtag">'+pr.tag+'</span></div>';
    h+='<p class="qprompt">'+pr.q+'</p>';
    h+='<div class="options" id="a_opts">';
    pr.opts.forEach(function(o,i){ h+='<button class="option" onclick="a_answer('+i+')">'+o+'</button>'; });
    h+='</div><div class="fb" id="a_fb"></div>';
    document.getElementById('a_qCard').innerHTML=h;
  }

  function resolveProbe(){
    var it=ITEMS[idx], pr=it.probes[probeN], fb=document.getElementById('a_fb');
    fb.classList.remove('ok','no','probe');
    if(wasRight){
      if(probeN+1 < it.probes.length && !(res[it.id] && res[it.id].s==='shaky')){
        // first probe passed but the original was wrong: try the next step down
        fb.classList.add('probe','show');
        fb.innerHTML=pr.ok+'<span class="pill">ONE MORE</span>';
        probeN++;
        setTimeout(startProbe,1300);
        return;
      }
      if(res[it.id] && res[it.id].s==='shaky'){
        fb.classList.add('ok','show');
        fb.innerHTML=pr.ok+' Your reasoning is sound, so this is confidence rather than understanding. We will still give it a moment when it comes up.';
      } else {
        res[it.id]={s:'shaky',w:pr.tag};
        fb.classList.add('ok','show');
        fb.innerHTML=pr.ok+' We know where to slow down now.';
      }
    } else {
      res[it.id]={s:'needs',w:pr.tag};
      fb.classList.add('no','show');
      fb.innerHTML=pr.no;
    }
    document.getElementById('a_qNext').disabled=false;
  }

  function a_nextItem(){
    idx++;
    if(idx>=ITEMS.length){ buildRoute(); goTo(3); }
    else render();
  }
  window.a_nextItem = a_nextItem;

  function buildRoute(){
    var LBL={secure:'Secure',shaky:'Shaky',needs:'Needs work'};
    document.getElementById('a_routeGrid').innerHTML=ITEMS.map(function(it){
      var r=res[it.id]||{s:'needs'};
      var w=r.w?('<div class="rw">'+r.w.toLowerCase()+'</div>'):
                (r.s==='secure'?'<div class="rw">ready to build on</div>':'');
      return '<div class="rc"><span class="rn">'+it.dom+'</span>'+
             '<span class="rs '+r.s+'">'+LBL[r.s]+'</span>'+w+'</div>';
    }).join('');
  }
})();

/* ================= env2 ================= */
(function(){
"use strict";
/* ---------- Toolbox ---------- */
  
  var unlocked={};
  
  
  

  /* ---------- 2.2 ---------- */
  function b_pick1(btn,ok,msg){
    var items=document.querySelectorAll('#b_drvOpts .option');
    Array.prototype.forEach.call(items,function(i){i.disabled=true;});
    btn.classList.add(ok?'correct':'incorrect');
    if(!ok) items[1].classList.add('correct');
    var fb=document.getElementById('b_drvFb'); fb.innerHTML=msg; fb.classList.add('show');
    document.getElementById('b_b2').disabled=false;
  }
  window.b_pick1 = b_pick1;

  /* ---------- 2.3 Representation laboratory ---------- */
  var BASE=700, RATE=400, XMAX=6, CMAX=3600;
  var X0=56,X1=344,Y0=204,Y1=22;
  function px(x){return X0+(x/XMAX)*(X1-X0);}
  function py(c){return Y0-(c/CMAX)*(Y0-Y1);}
  function fare(x){return BASE+RATE*x;}
  function money(v){return '\u20A6'+Math.round(v).toLocaleString('en-US');}

  var selected=-1;
  var usedTabs={T:1}, usedTable=false, usedEq=false;

  function draw(){
    var ln=document.getElementById('b_plotLine');
    ln.setAttribute('x1',px(0)); ln.setAttribute('y1',py(Math.min(fare(0),CMAX)));
    ln.setAttribute('x2',px(XMAX)); ln.setAttribute('y2',py(Math.min(fare(XMAX),CMAX)));

    var g=document.getElementById('b_pts'), h='';
    for(var x=0;x<=4;x++){
      var c=fare(x);
      var cy=py(Math.min(c,CMAX));
      h+='<circle class="gpt" data-x="'+x+'" cx="'+px(x)+'" cy="'+cy+'" r="'+(selected===x?8:6)+
         '" fill="'+(selected===x?'#92610A':'#0B7A6E')+'" stroke="#F1F5F9" stroke-width="2.5" '+
         'style="cursor:pointer;transition:r 220ms ease,fill 220ms ease;"></circle>';
      // generous invisible touch target
      h+='<circle data-x="'+x+'" cx="'+px(x)+'" cy="'+cy+'" r="22" fill="transparent" style="cursor:pointer;"></circle>';
    }
    g.innerHTML=h;
    Array.prototype.forEach.call(g.querySelectorAll('circle'),function(c){
      c.addEventListener('click',function(){ selectRow(+c.getAttribute('data-x'), true); });
    });

    var tag=document.getElementById('b_coordTag');
    if(selected>=0){
      var cc=fare(selected);
      tag.setAttribute('x',px(selected));
      tag.setAttribute('y',py(Math.min(cc,CMAX))-15);
      tag.textContent='('+selected+' km, '+money(cc)+')';
      tag.setAttribute('opacity','1');
    } else tag.setAttribute('opacity','0');

    var w=document.getElementById('b_rowWrap'), rh='';
    for(var i=0;i<=4;i++){
      rh+='<button class="rrow'+(selected===i?' sel':'')+'" data-r="'+i+'">'+
          '<span>'+i+' km</span><span class="rv">'+money(fare(i))+'</span></button>';
    }
    w.innerHTML=rh;
    Array.prototype.forEach.call(w.querySelectorAll('.rrow'),function(b){
      b.addEventListener('click',function(){ selectRow(+b.getAttribute('data-r'), false); });
    });
    updFn();
    checkLabDone();
  }

  function selectRow(x,fromGraph){
    selected = (selected===x ? -1 : x);
    if(selected>=0) usedTable=true;
    draw();
  }

  function updFn(){
    var xi=document.getElementById('b_inX');
    if(!xi) return;
    var x=Math.max(0,Math.min(10,+xi.value||0));
    document.getElementById('b_fnOut').textContent=money(fare(x));
    var n=document.getElementById('b_fnNote');
    if(BASE===700&&RATE===400&&x===3) n.textContent='A three kilometre trip. That is exactly what the app quoted for Iwo Road Motor Park.';
    else if(BASE===700&&RATE===400&&x===7) n.textContent='Seven kilometres. That is exactly what the app quoted for Lead City University.';
    else n.textContent='Give it any distance and it returns the matching fare.';
  }

  function b_showTab(k){
    ['T','E','F'].forEach(function(t){
      document.getElementById('b_tab'+t).classList.toggle('on',t===k);
      document.getElementById('b_body'+t).classList.toggle('on',t===k);
    });
    usedTabs[k]=1;
    checkLabDone();
  }
  window.b_showTab = b_showTab;

  var labDone=false;
  function checkLabDone(){
    if(labDone) return;
    if(usedTabs.T&&usedTabs.E&&usedTabs.F&&usedTable&&usedEq){
      labDone=true;
      document.getElementById('b_b3').disabled=false;
      var fb=document.getElementById('b_labFb');
      fb.textContent='Notice what happened. Changing one number changed all three at once, because the table, the graph and the equation were never three separate things. They are three ways of looking at one relationship.';
      fb.classList.add('show');
    }
  }

  document.getElementById('b_inBase').addEventListener('input',function(){
    var v=+this.value; if(isNaN(v))return;
    BASE=Math.max(0,Math.min(2000,v)); usedEq=true; draw();
  });
  document.getElementById('b_inRate').addEventListener('input',function(){
    var v=+this.value; if(isNaN(v))return;
    RATE=Math.max(0,Math.min(700,v)); usedEq=true; draw();
  });
  document.getElementById('b_inX').addEventListener('input',updFn);

  /* ---------- 2.5 Construct ---------- */
  function b_checkCon(){
    var b=document.getElementById('b_cBase').value, r=document.getElementById('b_cRate').value;
    var chip=document.getElementById('b_conChip');
    chip.classList.remove('ok','no'); chip.classList.add('show');
    if(b===''||r===''){
      chip.classList.add('no'); chip.textContent='Fill both boxes. One number never changes, the other is attached to d.';
      return;
    }
    var B=+b, R=+r;
    if(B===300&&R===250){
      chip.classList.add('ok');
      chip.textContent='That is the rule: W(d) = 300 + 250d. The 300 is the fixed delivery charge and the 250 is the rate per drum. Different situation, different units, identical shape.';
      document.getElementById('b_b5').disabled=false;
    } else if(B===250&&R===300){
      chip.classList.add('no');
      chip.textContent='The two numbers are swapped. Ask which one you pay only once, and which one you pay again for every extra drum.';
    } else {
      chip.classList.add('no');
      chip.textContent='Not quite. The fixed charge stands alone. The rate is the number attached to d, because it is paid once per drum.';
    }
  }
  window.b_checkCon = b_checkCon;

   draw();
})();

/* ================= env3 ================= */
(function(){
"use strict";
/* ---------- Toolbox ---------- */
  
  var unlocked={'function':1,'graph':1};
  
  
  

  /* ---------- 3.2 Compression laboratory ---------- */
  (function(){
    var s=document.getElementById('c_nSlider');
    var maxN=0, done=false;
    function fmt(v){
      if(v>=1) return (v%1===0? v : v.toFixed(2))+' MB';
      return (v*1024>=1 ? (v*1024).toFixed(0)+' KB' : v.toFixed(4)+' MB');
    }
    function upd(){
      var n=+s.value, size=64*Math.pow(0.5,n);
      maxN=Math.max(maxN,n);
      document.getElementById('c_barFill').style.width=(100*Math.pow(0.5,n))+'%';
      document.getElementById('c_barPasses').textContent=n+(n===1?' pass':' passes');
      document.getElementById('c_barSize').textContent=fmt(size);
      document.getElementById('c_roN').textContent=n;
      document.getElementById('c_roSize').textContent=fmt(size);
      document.getElementById('c_roHalves').textContent=n;

      var parts=['64'];
      for(var i=0;i<n;i++) parts.push('<span class="half">&frac12;</span>');
      document.getElementById('c_lfText').innerHTML=parts.join(' &times; ');
      document.getElementById('c_longform').classList.toggle('strain', n>=7);

      if(n>=10 && !done){
        done=true;
        document.getElementById('c_b2').disabled=false;
        var fb=document.getElementById('c_labFb');
        fb.textContent='Ten halves written out, and the file is down to 64 KB. Now picture doing this for a hundred passes. The arithmetic is easy. It is the writing that has become impossible.';
        fb.classList.add('show');
      }
    }
    s.addEventListener('input',upd); upd();
  })();

  /* ---------- 3.4 ---------- */
  function c_pick(btn,ok,msg){
    var items=document.querySelectorAll('#c_negOpts .option');
    Array.prototype.forEach.call(items,function(i){i.disabled=true;});
    btn.classList.add(ok?'correct':'incorrect');
    if(!ok) items[1].classList.add('correct');
    var fb=document.getElementById('c_negFb'); fb.textContent=msg; fb.classList.add('show');
    document.getElementById('c_b4').disabled=false;
  }
  window.c_pick = c_pick;

  /* ---------- 3.5 Flashcards ---------- */
  var CARDS=[
    {q:'x<sup>-2</sup>', a:'1 / x&sup2;', w:'The minus flips it underneath.'},
    {q:'x<sup>1/2</sup>', a:'&radic;x', w:'The 2 underneath means square root.'},
    {q:'1 / &radic;x', a:'x<sup>-1/2</sup>', w:'A root and a flip, both in one index.'}
  ];
  (function(){
    var row=document.getElementById('c_fcRow');
    row.innerHTML=CARDS.map(function(c,i){
      return '<button class="fc" data-i="'+i+'" aria-label="Flashcard '+(i+1)+'">'+
        '<div class="fc-inner">'+
          '<div class="fc-face fc-front"><div class="fc-q">'+c.q+'</div>'+
            '<div class="fc-hint">TAP TO TURN</div></div>'+
          '<div class="fc-face fc-back"><div class="fc-a">'+c.a+'</div>'+
            '<div class="fc-why">'+c.w+'</div></div>'+
        '</div></button>';}).join('');
    var flipped={};
    Array.prototype.forEach.call(row.querySelectorAll('.fc'),function(card){
      card.addEventListener('click',function(){
        card.classList.toggle('flip');
        flipped[card.getAttribute('data-i')]=1;
        if(Object.keys(flipped).length>=3){
          document.getElementById('c_b5').disabled=false;
          var fb=document.getElementById('c_fcFb');
          fb.textContent='Three cards, three versions of the same idea. The index tells you how many, the minus tells you which side of the fraction, the fraction tells you which root.';
          fb.classList.add('show');
        }
      });
    });
  })();

  /* ---------- 3.6 Sorting ---------- */
  var ITEMS=[
    {t:'2<sup>-3</sup>', bin:'r'},
    {t:'&radic;x', bin:'s'},
    {t:'1 / 5<sup>2</sup>', bin:'r'},
    {t:'x<sup>1/3</sup>', bin:'s'}
  ];
  var dragged=null, tapped=null, placed=0;
  (function(){
    var pool=document.getElementById('c_pool');
    pool.innerHTML=ITEMS.map(function(it,i){
      return '<div class="drg" draggable="true" data-i="'+i+'" data-bin="'+it.bin+'">'+it.t+'</div>';}).join('');
    Array.prototype.forEach.call(pool.querySelectorAll('.drg'),function(el){
      el.addEventListener('dragstart',function(e){
        dragged=el; e.dataTransfer.effectAllowed='move';
        try{e.dataTransfer.setData('text/plain','x');}catch(err){}
      });
      el.addEventListener('click',function(){
        if(el.classList.contains('ok'))return;
        Array.prototype.forEach.call(pool.querySelectorAll('.drg'),function(o){o.classList.remove('pick');});
        tapped=el; el.classList.add('pick');
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.bin'),function(bin){
      bin.addEventListener('click',function(){ if(tapped){ place(tapped,bin); tapped=null; } });
    });
  })();
  function c_allow(e){e.preventDefault(); e.currentTarget.classList.add('over');}
  window.c_allow = c_allow;
  function c_leave(e){e.currentTarget.classList.remove('over');}
  window.c_leave = c_leave;
  function c_drop(e){
    e.preventDefault(); e.currentTarget.classList.remove('over');
    if(dragged){ place(dragged,e.currentTarget); dragged=null; }
  }
  window.c_drop = c_drop;
  function place(el,bin){
    if(el.classList.contains('ok'))return;
    var fb=document.getElementById('c_sortFb');
    el.classList.remove('pick');
    if(el.getAttribute('data-bin')===bin.getAttribute('data-bin')){
      el.classList.remove('no'); el.classList.add('ok');
      el.setAttribute('draggable','false');
      bin.querySelector('.bin-items').appendChild(el);
      placed++;
      if(placed>=4){
        document.getElementById('c_b6').disabled=false;
        fb.textContent='All four placed. A minus sign in the index sends the term underneath. A fraction in the index takes a root. Two signs, two completely different jobs.';
      } else {
        fb.textContent='That one is right. '+(4-placed)+' to go.';
      }
      fb.classList.add('show');
    } else {
      el.classList.add('no');
      fb.textContent='Not that box. Ask what the sign is doing: is it flipping the term into a fraction, or is it taking a root?';
      fb.classList.add('show');
      setTimeout(function(){el.classList.remove('no');},1300);
    }
  }
})();

/* ================= env4 ================= */
(function(){
"use strict";
/* ---------- Model: steady tank, 20 L start, 6 L/min ---------- */
  function vol(t){ return 20 + 6*t; }
  var GX0=44, GX1=288, GY0=164, GY1=20, VMIN=0, VMAX=160;
  function gx(t){ return GX0 + (t/20)*(GX1-GX0); }
  function gy(v){ return GY0 - ((v-VMIN)/(VMAX-VMIN))*(GY0-GY1); }

  /* ---------- Navigation ---------- */
  
  

  /* ---------- Toolbox ---------- */
  
  var unlocked={ 'function':1, 'graph':1, 'expression':1, 'power':1 }; // carried in from Env 1 to 3

  
  
  

  /* ---------- 4.2 Tank laboratory ---------- */
  (function(){
    var s=document.getElementById('d_timeSlider'), fill=document.getElementById('d_waterFill'),
        lab=document.getElementById('d_tankLabel'), dot=document.getElementById('d_tankDot'),
        trace=document.getElementById('d_tankTrace'),
        roT=document.getElementById('d_roTime'), roV=document.getElementById('d_roVol'),
        fb=document.getElementById('d_tankFb');
    var reached=false;
    function upd(){
      var t=parseFloat(s.value), v=vol(t);
      var frac=(v-0)/160, h=134*frac;
      fill.setAttribute('y', 151-h); fill.setAttribute('height', h);
      lab.textContent=Math.round(v)+' L';
      roT.textContent=(t%1===0? t : t.toFixed(1))+' min';
      roV.textContent=Math.round(v)+' L';
      var pts=[]; for(var i=0;i<=t;i+=0.5){ pts.push(gx(i).toFixed(1)+','+gy(vol(i)).toFixed(1)); }
      if(t>0) trace.setAttribute('points', pts.join(' '));
      dot.setAttribute('cx', gx(t)); dot.setAttribute('cy', gy(v));
      if(t>=20 && !reached){
        reached=true; document.getElementById('d_b2').disabled=false;
        fb.textContent='The tank rose steadily and the graph rose in a straight line. Equal minutes gave equal litres, every time.';
        fb.classList.add('show');
      }
    }
    s.addEventListener('input',upd); upd();
  })();

  /* ---------- 4.3 Interval selector ---------- */
  var IX0=46, IX1=326, IY0=176, IY1=24;
  function ix(t){ return IX0 + (t/20)*(IX1-IX0); }
  function iy(v){ return IY0 - (v/160)*(IY0-IY1); }
  var ivOK=false;
  (function(){
    var a=document.getElementById('d_ivA'), b=document.getElementById('d_ivB');
    var tr=document.getElementById('d_ivTrace');
    var pts=[]; for(var i=0;i<=20;i+=1){ pts.push(ix(i).toFixed(1)+','+iy(vol(i)).toFixed(1)); }
    tr.setAttribute('points', pts.join(' '));
    function upd(){
      var t1=parseFloat(a.value), t2=parseFloat(b.value);
      if(t2<=t1){ t2=t1+5; b.value=t2; }
      var v1=vol(t1), v2=vol(t2);
      var x1=ix(t1), x2=ix(t2), y1=iy(v1), y2=iy(v2);
      document.getElementById('d_ivP1').setAttribute('cx',x1);
      document.getElementById('d_ivP1').setAttribute('cy',y1);
      document.getElementById('d_ivP2').setAttribute('cx',x2);
      document.getElementById('d_ivP2').setAttribute('cy',y2);
      var dxl=document.getElementById('d_ivDx');
      dxl.setAttribute('x1',x1); dxl.setAttribute('y1',y1+0);
      dxl.setAttribute('x2',x2); dxl.setAttribute('y2',y1);
      var dyl=document.getElementById('d_ivDy');
      dyl.setAttribute('x1',x2); dyl.setAttribute('y1',y1);
      dyl.setAttribute('x2',x2); dyl.setAttribute('y2',y2);
      var dxt=document.getElementById('d_ivDxT');
      dxt.setAttribute('x',(x1+x2)/2); dxt.setAttribute('y',y1+15);
      dxt.textContent=(t2-t1)+' min';
      var dyt=document.getElementById('d_ivDyT');
      dyt.setAttribute('x',x2+2); dyt.setAttribute('y',(y1+y2)/2);
      dyt.setAttribute('text-anchor','start');
      dyt.textContent=(v2-v1)+' L';
      document.getElementById('d_roDx').textContent=(t2-t1)+' min';
      document.getElementById('d_roDy').textContent=(v2-v1)+' L';
      document.getElementById('d_ivPrompt').textContent=(v2-v1)+' L over '+(t2-t1)+' min =';
      document.getElementById('d_ivChip').classList.remove('show');
    }
    a.addEventListener('input',upd); b.addEventListener('input',upd); upd();
  })();

  function d_checkIv(){
    var v=document.getElementById('d_ivAns').value;
    var chip=document.getElementById('d_ivChip');
    chip.classList.remove('ok','no'); chip.classList.add('show');
    if(v!=='' && Math.abs(Number(v)-6)<0.001){
      chip.classList.add('ok');
      chip.textContent='Yes. Whichever interval you picked, the answer came out at 6 L/min, because this tank fills at a steady pace. The gap changed, the rate did not.';
      document.getElementById('d_b3').disabled=false; ivOK=true;
    } else {
      chip.classList.add('no');
      chip.textContent='Not yet. Take the change in water and divide it by the change in time. The two numbers are shown on the right.';
    }
  }
  window.d_checkIv = d_checkIv;

  /* ---------- 4.6 Drain ---------- */
  function d_checkDrain(){
    var v=document.getElementById('d_drainAns').value;
    var chip=document.getElementById('d_drainChip');
    chip.classList.remove('ok','no'); chip.classList.add('show');
    if(v!=='' && Math.abs(Number(v)+4)<0.001){
      chip.classList.add('ok');
      chip.textContent='Correct. It lost 80 litres across 20 minutes, giving -4 L/min. The minus sign is carrying real information here: it is the difference between filling and emptying.';
      document.getElementById('d_b6').disabled=false;
    } else if(v!=='' && Math.abs(Number(v)-4)<0.001){
      chip.classList.add('no');
      chip.textContent='The size is right, but check the direction. The water went down, not up, so what should the sign be?';
    } else {
      chip.classList.add('no');
      chip.textContent='Not yet. Find the change in water first, then divide by the 20 minutes.';
    }
  }
  window.d_checkDrain = d_checkDrain;

  /* ---------- 4.7 Averages investigation ---------- */
  // slow, fast, slow: (0,0) (5,10) (10,90) (20,120)
  var AVG=[[0,0],[5,10],[10,90],[20,120]];
  function avgVol(t){
    for(var i=0;i<AVG.length-1;i++){
      if(t>=AVG[i][0] && t<=AVG[i+1][0]){
        var f=(t-AVG[i][0])/(AVG[i+1][0]-AVG[i][0]);
        return AVG[i][1]+f*(AVG[i+1][1]-AVG[i][1]);
      }
    }
    return 120;
  }
  function ay(v){ return IY0 - (v/130)*(IY0-IY1); }
  (function(){
    var pts=[]; for(var i=0;i<=20;i+=0.5){ pts.push(ix(i).toFixed(1)+','+ay(avgVol(i)).toFixed(1)); }
    document.getElementById('d_avgTrace').setAttribute('points', pts.join(' '));
    var al=document.getElementById('d_avgLine');
    al.setAttribute('x1',ix(0)); al.setAttribute('y1',ay(0));
    al.setAttribute('x2',ix(20)); al.setAttribute('y2',ay(120));
  })();

  var tested={};
  function d_testIv(btn){
    var a=+btn.getAttribute('data-a'), b=+btn.getAttribute('data-b');
    var v1=avgVol(a), v2=avgVol(b), r=(v2-v1)/(b-a);
    btn.classList.add('on');
    tested[a+'-'+b]=r;
    var p1=document.getElementById('d_avgP1'), p2=document.getElementById('d_avgP2'),
        sec=document.getElementById('d_avgSec');
    p1.setAttribute('cx',ix(a)); p1.setAttribute('cy',ay(v1)); p1.setAttribute('opacity','1');
    p2.setAttribute('cx',ix(b)); p2.setAttribute('cy',ay(v2)); p2.setAttribute('opacity','1');
    sec.setAttribute('x1',ix(a)); sec.setAttribute('y1',ay(v1));
    sec.setAttribute('x2',ix(b)); sec.setAttribute('y2',ay(v2));

    var log=document.getElementById('d_ivLog');
    var cls = Math.abs(r-6)<0.01 ? '' : (r>6 ? 'hi' : 'lo');
    if(!document.getElementById('log-'+a+'-'+b)){
      var d=document.createElement('div');
      d.className='iv-line '+cls; d.id='log-'+a+'-'+b;
      d.innerHTML='<span>'+a+' to '+b+' min</span><span class="iv-r">'+r.toFixed(1)+' L/min</span>';
      log.appendChild(d);
    }
    if(Object.keys(tested).length>=4){
      var fb=document.getElementById('d_avgFb');
      fb.textContent='Look at what you found. Two litres per minute, then sixteen, then three. The whole period averages exactly six, and yet the tank never once filled at six litres per minute. The average is true as a summary and false as a description.';
      fb.classList.add('show');
      document.getElementById('d_b7').disabled=false;
    }
  }
  window.d_testIv = d_testIv;

  /* ---------- 4.8 Narrowing ---------- */
  (function(){
    var s=document.getElementById('d_nwSlider');
    var pts=[]; for(var i=0;i<=20;i+=0.5){ pts.push(ix(i).toFixed(1)+','+ay(avgVol(i)).toFixed(1)); }
    document.getElementById('d_nwTrace').setAttribute('points', pts.join(' '));
    var done=false;
    function upd(){
      var f=parseFloat(s.value)/100;
      var half=3.0*(1-f)+0.15*f;           // 6.0 min wide down to 0.3 min
      var a=8-half, b=8+half;
      var v1=avgVol(a), v2=avgVol(b), r=(v2-v1)/(b-a);
      document.getElementById('d_nwP1').setAttribute('cx',ix(a));
      document.getElementById('d_nwP1').setAttribute('cy',ay(v1));
      document.getElementById('d_nwP2').setAttribute('cx',ix(b));
      document.getElementById('d_nwP2').setAttribute('cy',ay(v2));
      var sec=document.getElementById('d_nwSec');
      sec.setAttribute('x1',ix(a)); sec.setAttribute('y1',ay(v1));
      sec.setAttribute('x2',ix(b)); sec.setAttribute('y2',ay(v2));
      document.getElementById('d_roNw').textContent=(2*half).toFixed(1)+' min';
      document.getElementById('d_roNwDy').textContent=(v2-v1).toFixed(1)+' L';
      document.getElementById('d_roNwR').textContent=r.toFixed(2)+' L/min';
      if(f>0.92 && !done){
        done=true;
        var fb=document.getElementById('d_nwFb');
        fb.textContent='The interval is now less than half a minute wide, and the rate has settled near 16 L/min. That is what the tank was doing at minute eight, not across the whole hour.';
        fb.classList.add('show');
        document.getElementById('d_b8').disabled=false;
      }
    }
    s.addEventListener('input',upd); upd();
  })();
})();

/* ================= env5 ================= */
(function(){
"use strict";
/* ---------- 5.3 Decision laboratory ---------- */
  var NA=function(n){return 5000+20*n;}, NB=function(n){return 45*n;};
  var X0=52,X1=344,Y0=204,Y1=24,NMAX=400,CMAX=18000;
  function px(n){return X0+(n/NMAX)*(X1-X0);}
  function py(c){return Y0-(c/CMAX)*(Y0-Y1);}

  (function(){
    var la=document.getElementById('e_lineA'), lb=document.getElementById('e_lineB');
    la.setAttribute('x1',px(0)); la.setAttribute('y1',py(NA(0)));
    la.setAttribute('x2',px(NMAX)); la.setAttribute('y2',py(NA(NMAX)));
    lb.setAttribute('x1',px(0)); lb.setAttribute('y1',py(NB(0)));
    lb.setAttribute('x2',px(NMAX)); lb.setAttribute('y2',py(NB(NMAX)));

    var s=document.getElementById('e_nSlider');
    var seenBelow=false, seenAbove=false, unlocked=false;

    function fmt(v){return '\u20A6'+v.toLocaleString('en-US');}

    function upd(){
      var n=+s.value, a=NA(n), b=NB(n);
      document.getElementById('e_nVal').textContent=n;
      document.getElementById('e_costA').textContent=fmt(a);
      document.getElementById('e_costB').textContent=fmt(b);
      var nl=document.getElementById('e_nowLine');
      nl.setAttribute('x1',px(n)); nl.setAttribute('x2',px(n));
      document.getElementById('e_dotA').setAttribute('cx',px(n));
      document.getElementById('e_dotA').setAttribute('cy',py(a));
      document.getElementById('e_dotB').setAttribute('cx',px(n));
      document.getElementById('e_dotB').setAttribute('cy',py(b));

      var v=document.getElementById('e_verdict');
      v.classList.remove('tie');
      if(Math.abs(a-b)<1){
        v.classList.add('tie');
        v.textContent='At exactly '+n+' flyers the two printers cost the same, '+fmt(a)+'. This is the break-even point.';
        document.getElementById('e_xPoint').setAttribute('opacity','1');
        document.getElementById('e_xLabel').setAttribute('opacity','1');
      } else if(a<b){
        v.textContent='At '+n+' flyers, Printer A is cheaper by '+fmt(b-a)+'.';
        seenAbove=true;
      } else {
        v.textContent='At '+n+' flyers, Printer B is cheaper by '+fmt(a-b)+'.';
        seenBelow=true;
      }
      if(seenBelow&&seenAbove&&!unlocked){
        unlocked=true;
        document.getElementById('e_b3').disabled=false;
        var fb=document.getElementById('e_labFb');
        fb.textContent='You have now seen it both ways. For small orders B wins, for large orders A wins, and somewhere between the two the lines must cross. That crossing is the number the shop actually needs.';
        fb.classList.add('show');
      }
    }
    var xp=document.getElementById('e_xPoint'), xl=document.getElementById('e_xLabel');
    xp.setAttribute('cx',px(200)); xp.setAttribute('cy',py(NA(200)));
    xl.setAttribute('x',px(200)); xl.setAttribute('y',py(NA(200))-13);
    s.addEventListener('input',upd); upd();
  })();

  function e_checkBE(){
    var v=document.getElementById('e_beAns').value, chip=document.getElementById('e_beChip');
    chip.classList.remove('ok','no'); chip.classList.add('show');
    if(v!==''&&Number(v)===200){
      chip.classList.add('ok');
      chip.textContent='Correct. Taking 20n from both sides leaves 5,000 = 25n, so n = 200. That matches the crossing you watched on the graph.';
      document.getElementById('e_b4').disabled=false;
    } else if(v!==''&&Number(v)===250){
      chip.classList.add('no');
      chip.textContent='Close. Check the subtraction: 45n minus 20n leaves 25n, not 20n.';
    } else {
      chip.classList.add('no');
      chip.textContent='Not yet. Subtract 20n from both sides first, then divide what remains.';
    }
  }
  window.e_checkBE = e_checkBE;

  function e_pick(btn,ok,msg){
    var items=document.querySelectorAll('#e_ineqOpts .option');
    Array.prototype.forEach.call(items,function(i){i.disabled=true;});
    btn.classList.add(ok?'correct':'incorrect');
    if(!ok){ items[1].classList.add('correct'); }
    var fb=document.getElementById('e_ineqFb');
    fb.innerHTML=msg; fb.classList.add('show');
    document.getElementById('e_b5').disabled=false;
  }
  window.e_pick = e_pick;
})();

/* ================= env6 ================= */
(function(){
"use strict";
/* ---------- The curve: y = x squared over 4 ---------- */
  function f(x){ return x*x/4; }
  var AX=4, AY=f(4);              // A is fixed at (4, 4)
  var XMIN=0, XMAX=9, YMIN=0, YMAX=21;

  /* 6.2 shape curve */
  (function(){
    var X0=44,X1=322,Y0=172,Y1=18, pts=[];
    for(var x=0;x<=9;x+=0.25){
      var px=X0+((x-XMIN)/(XMAX-XMIN))*(X1-X0);
      var py=Y0-(f(x)/YMAX)*(Y0-Y1);
      pts.push(px.toFixed(1)+','+py.toFixed(1));
    }
    document.getElementById('f_shapeCurve').setAttribute('points',pts.join(' '));
  })();

  function f_pickShape(btn,ok,msg){
    var items=document.querySelectorAll('#f_shapeOpts .option');
    Array.prototype.forEach.call(items,function(i){i.disabled=true;});
    btn.classList.add(ok?'correct':'incorrect');
    if(!ok) items[1].classList.add('correct');
    var fb=document.getElementById('f_shapeFb'); fb.textContent=msg; fb.classList.add('show');
    document.getElementById('f_b2').disabled=false;
  }
  window.f_pickShape = f_pickShape;

  /* ---------- 6.3 prediction (recorded, not graded) ---------- */
  var PRED=['It keeps growing larger without ever stopping',
            'It settles towards one particular number',
            'It falls away to zero',
            'It becomes impossible to calculate'];
  var predIdx=null;
  function f_pickPred(btn,i){
    if(predIdx!==null) return;
    predIdx=i;
    var items=document.querySelectorAll('#f_predOpts .option');
    Array.prototype.forEach.call(items,function(o){o.disabled=true;});
    btn.classList.add('chosen');
    var fb=document.getElementById('f_predFb');
    fb.textContent='Recorded. Now go and test it yourself. We will come back to this.';
    fb.classList.add('show');
    document.getElementById('f_b3').disabled=false;
  }
  window.f_pickPred = f_pickPred;

  function showVerdict(){
    if(predIdx===null) return;
    document.getElementById('f_predEcho').textContent=PRED[predIdx];
    var v=document.getElementById('f_predVerdict'), h='';
    if(predIdx===1){
      h='<p class="lead" style="margin-bottom:0;font-size:15px;">And that is what happened. The gradient closed in on <strong>2</strong> and stayed there. You predicted the behaviour of a curve before you measured it, which is most of what mathematical reasoning is.</p>';
    } else if(predIdx===0){
      h='<p class="lead" style="margin-bottom:0;font-size:15px;">It did the opposite. Rather than running away, the gradient tightened onto <strong>2</strong>. A reasonable guess, since the gaps were shrinking, but shrinking gaps do not force a shrinking ratio.</p>';
    } else if(predIdx===2){
      h='<p class="lead" style="margin-bottom:0;font-size:15px;">This is the most common prediction, and it is worth understanding why it fails. Both gaps did head towards zero. But they shrank <em>together</em>, at roughly the same pace, so their ratio held steady at <strong>2</strong> rather than collapsing.</p>';
    } else {
      h='<p class="lead" style="margin-bottom:0;font-size:15px;">Close to something important. Putting B exactly on A really would break the calculation. But everywhere short of that it stayed perfectly calculable, and it closed in on <strong>2</strong>.</p>';
    }
    v.innerHTML=h;
  }

  /* ---------- 6.4 curve laboratory ---------- */
  var LX0=46,LX1=342,LY0=214,LY1=22;
  function lx(x){ return LX0+((x-XMIN)/(XMAX-XMIN))*(LX1-LX0); }
  function ly(y){ return LY0-((y-YMIN)/(YMAX-YMIN))*(LY0-LY1); }

  (function(){
    var pts=[];
    for(var x=0;x<=9;x+=0.15) pts.push(lx(x).toFixed(1)+','+ly(f(x)).toFixed(1));
    document.getElementById('f_labCurve').setAttribute('points',pts.join(' '));
    var a=document.getElementById('f_ptA');
    a.setAttribute('cx',lx(AX)); a.setAttribute('cy',ly(AY));
    var la=document.getElementById('f_lblA');
    la.setAttribute('x',lx(AX)); la.setAttribute('y',ly(AY)+22);
  })();

  var slider=document.getElementById('f_bSlide');
  var closest=0, trailAt={}, done=false;

  function bxFromT(t){
    // B travels from x=9 down towards x=4 but never arrives
    return 9 - t*(9-4.04);
  }

  function update(t){
    var bx=bxFromT(t), by=f(bx);
    var dx=bx-AX, dy=by-AY, g=dy/dx;

    document.getElementById('f_ptB').setAttribute('cx',lx(bx));
    document.getElementById('f_ptB').setAttribute('cy',ly(by));
    document.getElementById('f_ptBHit').setAttribute('cx',lx(bx));
    document.getElementById('f_ptBHit').setAttribute('cy',ly(by));
    var lb=document.getElementById('f_lblB');
    lb.setAttribute('x',lx(bx)); lb.setAttribute('y',ly(by)-14);

    var sec=document.getElementById('f_secant');
    // extend the secant a little past both points so it reads as a line
    var ex=(lx(bx)-lx(AX))*0.18, ey=(ly(by)-ly(AY))*0.18;
    sec.setAttribute('x1',lx(AX)-ex); sec.setAttribute('y1',ly(AY)-ey);
    sec.setAttribute('x2',lx(bx)+ex); sec.setAttribute('y2',ly(by)+ey);

    var dxl=document.getElementById('f_dxLine');
    dxl.setAttribute('x1',lx(AX)); dxl.setAttribute('y1',ly(AY));
    dxl.setAttribute('x2',lx(bx)); dxl.setAttribute('y2',ly(AY));
    var dyl=document.getElementById('f_dyLine');
    dyl.setAttribute('x1',lx(bx)); dyl.setAttribute('y1',ly(AY));
    dyl.setAttribute('x2',lx(bx)); dyl.setAttribute('y2',ly(by));

    document.getElementById('f_roDx').textContent=dx.toFixed(2);
    document.getElementById('f_roDy').textContent=dy.toFixed(2);
    document.getElementById('f_roW').textContent=Math.abs(dx).toFixed(2);
    document.getElementById('f_roG').textContent=g.toFixed(2);

    // faint trail of secants already visited, so convergence is visible in space
    var key=Math.round(t*12);
    if(!trailAt[key]){
      trailAt[key]=1;
      var l=document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('class','trail');
      l.setAttribute('x1',lx(AX)); l.setAttribute('y1',ly(AY));
      l.setAttribute('x2',lx(bx)); l.setAttribute('y2',ly(by));
      document.getElementById('f_trails').appendChild(l);
    }

    closest=Math.max(closest,t);
    if(closest>0.93 && !done){
      done=true;
      document.getElementById('f_b4').disabled=false;
      var fb=document.getElementById('f_labFb');
      fb.textContent='Look at the two gaps. Both are almost nothing now, and the gradient has stopped moving. B never landed on A, and it never needed to.';
      fb.classList.add('show');
    }
  }

  slider.addEventListener('input',function(){ update(+slider.value/100); });

  /* drag B directly on the curve */
  (function(){
    var svg=document.getElementById('f_labSvg'), dragging=false;
    function pt(e){
      var r=svg.getBoundingClientRect();
      var cx=(e.touches?e.touches[0].clientX:e.clientX);
      var vb=svg.viewBox.baseVal;
      return vb.x + (cx-r.left)/r.width*vb.width;
    }
    function move(e){
      if(!dragging) return;
      e.preventDefault();
      var ux=pt(e);
      var x=XMIN+((ux-LX0)/(LX1-LX0))*(XMAX-XMIN);
      x=Math.max(4.04,Math.min(9,x));
      var t=(9-x)/(9-4.04);
      slider.value=Math.round(t*100);
      update(t);
    }
    function down(e){ dragging=true; move(e); }
    function up(){ dragging=false; }
    ['f_ptB','f_ptBHit'].forEach(function(id){
      var el=document.getElementById(id);
      el.addEventListener('mousedown',down);
      el.addEventListener('touchstart',down,{passive:false});
    });
    window.addEventListener('mousemove',move);
    window.addEventListener('touchmove',move,{passive:false});
    window.addEventListener('mouseup',up);
    window.addEventListener('touchend',up);
  })();

  update(0);
})();

/* ================= gate ================= */
(function(){
"use strict";
var SCEN='A solar panel is charging a battery. The battery is at 15 per cent when the sun comes up, and the panel adds 8 percentage points every hour.';

  /* term-set comparison so order and spacing do not matter */
  function termSet(s){
    s=String(s).toLowerCase().replace(/\s+/g,'').replace(/\u00d7/g,'').replace(/\*/g,'');
    s=s.replace(/-/g,'+-');
    var parts=s.split('+').filter(function(p){return p!=='';});
    return parts.map(function(p){
      // normalise 5x and x5 to 5x, and bare x to 1x
      var m=p.match(/^(-?\d*)([a-z]?)$/);
      if(!m) return p;
      var n=m[1], v=m[2];
      if(v===''){ return n; }
      if(n===''||n==='-'){ n=n+'1'; }
      return n+v;
    }).sort().join('|');
  }
  function same(a,b){ return termSet(a)===termSet(b); }

  var TASKS=[
    {
      comp:'Representation', env:'Environment 2',
      kind:'build2',
      prompt:'Build the rule for the battery charge.',
      sub:'If t is the number of hours since sunrise and B(t) is the charge as a percentage, fill both boxes.',
      render:function(){
        return '<div class="build"><span>B(t) =</span>'+
               '<input type="number" id="g_i1" placeholder="?" aria-label="Starting charge">'+
               '<span>+</span>'+
               '<input type="number" id="g_i2" placeholder="?" aria-label="Rate per hour">'+
               '<span>t</span></div>';
      },
      grade:function(){
        var a=document.getElementById('g_i1').value, b=document.getElementById('g_i2').value;
        if(a===''||b==='') return null;
        if(+a===15 && +b===8) return {ok:true,
          why:'B(t) = 15 + 8t. The 15 stands alone because it is there before any time passes, and the 8 is attached to t because it arrives once per hour.'};
        if(+a===8 && +b===15) return {ok:false,
          why:'The two numbers are the wrong way round. Ask which one you have before the sun has done any work at all.',
          rem:'Revisit the fixed value against the rate in Environment 2.'};
        return {ok:false,
          why:'Not the rule. The starting charge sits alone and the per hour figure multiplies t.',
          rem:'Revisit situation to equation in Environment 2.'};
      }
    },
    {
      comp:'Algebraic fluency', env:'Environment 1 and 3',
      kind:'build1',
      prompt:'Now substitute and simplify.',
      sub:'A different panel follows f(x) = 5x + 2. Write f(x + h) in its simplest form. Use x and h.',
      render:function(){
        return '<div class="build"><span>f(x + h) =</span>'+
               '<input type="text" class="wide" id="g_i1" placeholder="?" aria-label="Your simplified answer" autocomplete="off"></div>';
      },
      grade:function(){
        var v=document.getElementById('g_i1').value.trim();
        if(v==='') return null;
        if(same(v,'5x+5h+2')) return {ok:true,
          why:'Correct. The whole bracket replaced x, then 5(x + h) expanded to 5x + 5h before the 2 was added. This exact manipulation is what a first principles derivative runs on.'};
        if(same(v,'5x+h+2')) return {ok:false,
          why:'The 5 outside must multiply both terms inside the bracket, not just the x. That gives 5x + 5h, not 5x + h.',
          rem:'Revisit expanding brackets, flagged in Environment 1.'};
        if(same(v,'5x+2+h')) return {ok:false,
          why:'The h was added on at the end rather than substituted in. Every x in the rule becomes the whole bracket (x + h) first.',
          rem:'Revisit substitution, flagged in Environment 1.'};
        var bare=v.toLowerCase().replace(/\s+/g,'');
        if(bare==='5(x+h)+2'||bare==='2+5(x+h)') return {ok:false,
          why:'Your substitution is right, which is the harder half. It is not simplified yet though. Multiply the 5 across both terms inside the bracket to get 5x + 5h + 2.',
          rem:'Revisit expanding brackets in Environment 1.'};
        return {ok:false,
          why:'Not simplified correctly. Replace x with (x + h), expand the 5 across both terms, then add the 2.',
          rem:'Revisit substitution and expanding in Environment 1.'};
      }
    },
    {
      comp:'Rate of change', env:'Environment 4',
      kind:'rate',
      prompt:'Measure how fast it is charging.',
      sub:'A cloudier day. The battery reads 31 per cent at hour 2 and 55 per cent at hour 5. Give the average rate of change, then choose its units.',
      render:function(){
        return '<div class="build"><span>Rate =</span>'+
               '<input type="number" id="g_i1" placeholder="?" aria-label="Rate value"></div>'+
               '<div class="unitrow" id="g_urow">'+
               '<button class="ubtn" onclick="g_pickUnit(0,this)">per cent per hour</button>'+
               '<button class="ubtn" onclick="g_pickUnit(1,this)">hours per cent</button>'+
               '<button class="ubtn" onclick="g_pickUnit(2,this)">per cent</button>'+
               '</div>';
      },
      grade:function(){
        var v=document.getElementById('g_i1').value;
        if(v===''||unit===null) return null;
        var numOk=(+v===8), unitOk=(unit===0);
        if(numOk&&unitOk) return {ok:true,
          why:'Correct on both counts. The charge rose 24 points across 3 hours, giving 8 per cent per hour, and the units are the right way round.'};
        if(!numOk&&+v===24) return {ok:false,
          why:'24 is the change, not the rate. It still has to be divided by the 3 hours it took.',
          rem:'Revisit change against rate of change in Environment 4.'};
        if(numOk&&!unitOk) return {ok:false,
          why:'The number is right but the units are not. It is per cent per hour, because you divided a charge by a time, not the other way round.',
          rem:'Revisit units on a rate in Environment 4.'};
        return {ok:false,
          why:'Not yet. Find how much the charge rose, find how long that took, and divide the first by the second.',
          rem:'Revisit average rate of change in Environment 4.'};
      }
    },
    {
      comp:'Graphical reasoning', env:'Environment 6',
      kind:'shape',
      prompt:'Read what the shape is telling you.',
      sub:'A third battery charges quickly at first, then more and more slowly as it approaches full. Choose the graph, then say what is happening to the rate.',
      render:function(){
        var mk=function(id,path,cap){
          return '<button class="shapecard" id="g_'+id+'" onclick="g_pickShape(\''+id+'\')">'+
            '<svg class="graph-svg" viewBox="0 0 160 104" aria-hidden="true">'+
            '<line x1="20" y1="86" x2="150" y2="86" stroke="rgba(15,23,42,0.4)" stroke-width="1.4"/>'+
            '<line x1="20" y1="10" x2="20" y2="86" stroke="rgba(15,23,42,0.4)" stroke-width="1.4"/>'+
            '<path d="'+path+'" fill="none" stroke="#047857" stroke-width="2.6"/></svg>'+
            '<div class="cap">'+cap+'</div></button>';
        };
        return '<div class="shapegrid">'+
          mk('sA','M24,82 Q70,74 100,44 T146,14','rises and gets steeper')+
          mk('sB','M24,82 Q70,22 104,16 T146,12','rises and flattens out')+
          '</div><div id="g_ratePart"></div>';
      },
      grade:function(){
        if(shapePick===null||ratePick===null) return null;
        var sOk=(shapePick==='sB'), rOk=(ratePick===1);
        if(sOk&&rOk) return {ok:true,
          why:'Both right. A rate that shrinks over time produces a curve that keeps climbing but flattens as it goes, and the steepness at any point is exactly what that rate looks like on a graph.'};
        if(!sOk) return {ok:false,
          why:'That graph gets steeper, which would mean the battery charges faster and faster as it fills. The description says the opposite.',
          rem:'Revisit reading shape in Environment 6.'};
        return {ok:false,
          why:'The graph was right but the reasoning underneath it was not. Flattening means each hour adds less than the hour before, so the rate is falling.',
          rem:'Revisit steepness against rate in Environment 6.'};
      }
    }
  ];

  var idx=0, res=[], unit=null, shapePick=null, ratePick=null, locked=false;

  function g_startGate(){ idx=0; res=[]; render(); goTo(40); }
  window.g_startGate = g_startGate;

  function render(){
    unit=null; shapePick=null; ratePick=null; locked=false;
    var t=TASKS[idx];
    var h='<div class="qhead"><span>TASK '+(idx+1)+' OF '+TASKS.length+'</span>'+
          '<span class="qtag">'+t.comp.toUpperCase()+'</span></div>';
    h+='<p class="qprompt">'+t.prompt+'</p>';
    h+='<div class="scen">'+SCEN+'</div>';
    h+='<p class="qsub">'+t.sub+'</p>';
    h+=t.render();
    h+='<div style="text-align:center;margin-top:16px;"><button id="g_subBtn" onclick="g_submit()">Submit</button></div>';
    h+='<div class="fb" id="g_fb"></div>';
    document.getElementById('g_gCard').innerHTML=h;
    document.getElementById('g_gNext').disabled=true;
    document.getElementById('g_gNext').textContent=(idx===TASKS.length-1)?'See my evidence':'Continue';
  }

  function g_pickUnit(i,btn){
    if(locked) return;
    unit=i;
    Array.prototype.forEach.call(document.querySelectorAll('.ubtn'),function(b){b.classList.remove('on');});
    btn.classList.add('on');
  }
  window.g_pickUnit = g_pickUnit;

  function g_pickShape(id){
    if(locked) return;
    shapePick=id;
    ['sA','sB'].forEach(function(s){
      var el=document.getElementById(s);
      if(el) el.style.borderColor = (s===id) ? 'var(--amber-ink)' : 'rgba(15,23,42,0.2)';
      if(el) el.style.background = (s===id) ? 'rgba(251,191,36,0.15)' : '#fff';
    });
    var rp=document.getElementById('g_ratePart');
    if(rp && !rp.innerHTML){
      rp.innerHTML='<p class="qsub" style="margin-top:16px;margin-bottom:10px;">'+
        'And what is happening to the rate of charging as the hours pass?</p>'+
        '<div class="options" id="g_rOpts">'+
        '<button class="option" onclick="g_pickRate(0,this)">The rate is rising</button>'+
        '<button class="option" onclick="g_pickRate(1,this)">The rate is falling</button>'+
        '<button class="option" onclick="g_pickRate(2,this)">The rate stays the same</button>'+
        '</div>';
    }
  }
  window.g_pickShape = g_pickShape;

  function g_pickRate(i,btn){
    if(locked) return;
    ratePick=i;
    Array.prototype.forEach.call(document.querySelectorAll('#g_rOpts .option'),function(b){
      b.style.borderColor='rgba(15,23,42,0.2)'; b.style.background='#fff';});
    btn.style.borderColor='var(--amber-ink)'; btn.style.background='rgba(251,191,36,0.15)';
  }
  window.g_pickRate = g_pickRate;

  function g_submit(){
    if(locked) return;
    var t=TASKS[idx], g=t.grade();
    if(g===null) return;   // incomplete, say nothing and wait
    locked=true;
    res[idx]={comp:t.comp, env:t.env, ok:g.ok, why:g.why, rem:g.rem||''};

    // lock the inputs
    Array.prototype.forEach.call(document.querySelectorAll('#g_gCard input'),function(i){i.disabled=true;});
    Array.prototype.forEach.call(document.querySelectorAll('.ubtn'),function(b){
      b.disabled=true;
      if(t.kind==='rate'){
        if(b.textContent.indexOf('per cent per hour')===0) b.classList.add('correct');
        else if(b.classList.contains('on')) b.classList.add('incorrect');
      }});
    Array.prototype.forEach.call(document.querySelectorAll('#g_rOpts .option'),function(b){b.disabled=true;});
    Array.prototype.forEach.call(document.querySelectorAll('.shapecard'),function(b){b.disabled=true;});
    if(t.kind==='shape'){
      var right=document.getElementById('sB');
      if(right){ right.classList.add('correct'); right.style.borderColor=''; right.style.background=''; }
      if(shapePick==='sA'){ var w=document.getElementById('sA');
        w.classList.add('incorrect'); w.style.borderColor=''; w.style.background=''; }
    }
    document.getElementById('g_subBtn').disabled=true;

    var fb=document.getElementById('g_fb');
    fb.classList.add('show', g.ok?'ok':'no');
    fb.innerHTML=g.why;
    document.getElementById('g_gNext').disabled=false;
  }
  window.g_submit = g_submit;

  function g_nextTask(){
    idx++;
    if(idx>=TASKS.length){ buildResults(); goTo(41); }
    else render();
  }
  window.g_nextTask = g_nextTask;

  function buildResults(){
    var passed=res.filter(function(r){return r.ok;}).length;
    document.getElementById('g_evid').innerHTML=res.map(function(r){
      return '<div class="ev '+(r.ok?'pass':'fail')+'"><div class="evbar"></div><div class="evbody">'+
        '<div class="evtop"><span class="evn">'+r.comp+'</span>'+
        '<span class="evs">'+(r.ok?'SECURE':'NEEDS ANOTHER PASS')+'</span></div>'+
        '<div class="evw">'+r.why+'</div>'+
        (r.rem?'<div class="evr">'+r.rem+'</div>':'')+
        '</div></div>';
    }).join('');

    var v=document.getElementById('g_verdict');
    if(passed===4){
      document.getElementById('g_resTitle').textContent='All four competencies are secure.';
      v.className='verdict ready';
      v.innerHTML='<div class="vt">You are ready for Limits.</div><div class="vb">'+
        'You can represent a relationship, manipulate its algebra, measure its rate with the right units, and read what a curve is doing. '+
        'That is the whole of what Phase 2 will assume you already hold. The question you were left with at the end of Environment 6 is still waiting.</div>';
      document.getElementById('g_phase2').title='Phase 2 is not built yet';
    } else {
      document.getElementById('g_resTitle').textContent=passed+' of 4 secure.';
      v.className='verdict notyet';
      v.innerHTML='<div class="vt">Close, and not a reason to repeat anything.</div><div class="vb">'+
        'Each line above names the one environment that covers what slipped. Work through that single step, then come back here. '+
        'Going into Limits without these is what makes Calculus feel impossible, and you have come too far for that.</div>';
    }
  }
})();
