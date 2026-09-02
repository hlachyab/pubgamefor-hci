import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {t:"title"},
  {t:"rules"},
  {t:"ri",r:1,title:"Estonia & TLU",sub:"10 questions · 1 point each"},
  {t:"q",r:1,n:1,q:"Estonia declared independence twice. Name one of those years.",a:"1918 or 1991"},
  {t:"q",r:1,n:2,q:"In what year was Tallinn University founded in its current form?",a:"2005"},
  {t:"q",r:1,n:3,q:"What was the currency Estonia used before the Euro?",a:"Kroon (EEK)"},
  {t:"q",r:1,n:4,q:"In what year did Estonia join the European Union?",a:"2004"},
  {t:"q",r:1,n:5,q:"What is the famous outdoor activity done in Estonian woodland swamps?",a:"Bogwalking"},
  {t:"q",r:1,n:6,q:"What is the name of the oldest building on TLU's main campus?",a:"Terra Building"},
  {t:"q",r:1,n:7,q:"What is Estonia's largest island?",a:"Saaremaa"},
  {t:"q",r:1,n:8,q:"TLU's main campus is located near which well-known Tallinn park?",a:"Kadriorg Park"},
  {t:"q",r:1,n:9,q:"Estonia was the first country in the world to allow what kind of political voting?",a:"Online / Internet voting"},
  {t:"q",r:1,n:10,q:"How many schools does Tallinn University currently have?",a:"6 schools"},
  {t:"sc",r:1},
  {t:"ri",r:2,title:"HCI Basics",sub:"7 questions + True/False · Bonus included"},
  {t:"q",r:2,n:1,q:"What is the term for how easy and satisfying a product is to use?",a:"Usability"},
  {t:"q",r:2,n:2,q:"What is the term for a fictional profile representing a typical user group?",a:"A Persona"},
  {t:"q",r:2,n:3,q:"What do we call the first screens that guide a new user through how an app works?",a:"Onboarding"},
  {t:"q",r:2,n:4,q:"What term describes a design element that suggests how it should be used? (e.g. a button that looks pressable)",a:"Affordance"},
  {t:"q",r:2,n:5,q:"What do we call the layout and organization of information on a website so users can find things easily?",a:"Information Architecture"},
  {t:"q",r:2,n:6,q:"What law states that decision time increases as the number of choices grows?",a:"Hick's Law"},
  {t:"q",r:2,n:7,q:'BONUS — Name the two "gulfs" identified by Don Norman that explain usability breakdowns.',a:"Gulf of Execution & Gulf of Evaluation",bonus:true},
  {t:"tfi"},
  {t:"tf",n:1,q:"Good UX design means users need extra help or a manual to use the product.",a:false,exp:"Good UX should be intuitive — no manual needed."},
  {t:"tf",n:2,q:'If a button is red, it always means "stop" or "error" in every culture.',a:false,exp:"Color meaning varies by culture. Red means luck in China."},
  {t:"tf",n:3,q:'The "Double Diamond" design process has four main phases.',a:true,exp:"Discover · Define · Develop · Deliver"},
  {t:"sc",r:2},
  {t:"ri",r:3,title:"Your Word",sub:"Taboo style · 2 pts per word · 45 seconds"},
  {t:"w",w:"Sauna",b:["hot","steam","Finland","heat","wood"]},
  {t:"w",w:"Wi-Fi",b:["internet","connect","password","router","network"]},
  {t:"w",w:"Potluck",b:["food","bring","party","dish","share"]},
  {t:"w",w:"Prototype",b:["mockup","model","wireframe","test","design"]},
  {t:"w",w:"Ice Skating",b:["rink","cold","skates","glide","winter"]},
  {t:"w",w:"Minecraft",b:["blocks","build","game","craft","survive"]},
  {t:"w",w:"Vegan",b:["plant","meat","diet","animal","food"]},
  {t:"w",w:"Christmas Market",b:["winter","stalls","mulled wine","lights","square"]},
  {t:"w",w:"Chopsticks",b:["eat","sticks","Asia","food","rice"]},
  {t:"w",w:"Library",b:["books","quiet","study","borrow","university"]},
  {t:"w",w:"Airbnb",b:["rent","stay","apartment","host","booking"]},
  {t:"w",w:"Eye Tracking",b:["gaze","screen","attention","heatmap","camera"]},
  {t:"w",w:"Hogwarts",b:["Harry Potter","wizard","magic","school","castle"]},
  {t:"w",w:"Museum",b:["free","exhibit","art","evening","ticket"]},
  {t:"w",w:"FOMO",b:["miss out","social","event","feeling","anxious"]},
  {t:"w",w:"Group Chat",b:["message","phone","notification","friends","WhatsApp"]},
  {t:"fin"},
];

const RC = {
  1:{c:"#b45309",bg:"#fffbeb",bdr:"#fcd34d",acc:"#d97706",sh:"#92400e"},
  2:{c:"#1d4ed8",bg:"#eff6ff",bdr:"#93c5fd",acc:"#2563eb",sh:"#1e40af"},
  3:{c:"#b91c1c",bg:"#fef2f2",bdr:"#fca5a5",acc:"#dc2626",sh:"#991b1b"},
};

const NEUTRAL_ACCENT = "#475569";
const FONT_BODY = "'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
const FONT_DISPLAY = "'Fredoka',"+FONT_BODY;
const CONFETTI_EMOJI = ["🎉","🎊","⭐","🎈","🏆","✨"];

function slideAccent(slide) {
  if (slide.t==="q" || slide.t==="ri" || slide.t==="sc") return RC[slide.r].acc;
  if (slide.t==="tfi" || slide.t==="tf") return RC[2].acc;
  if (slide.t==="w") return RC[3].acc;
  return NEUTRAL_ACCENT;
}

const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Tag({children,acc,rotate=-2}) {
  return (
    <span className="sticker" style={{background:acc,color:"#fff",borderRadius:999,padding:"5px 16px",fontSize:12,fontWeight:700,letterSpacing:"0.04em",display:"inline-block",transform:`rotate(${rotate}deg)`,boxShadow:`0 4px 10px -4px ${acc}aa`,fontFamily:FONT_DISPLAY}}>
      {children}
    </span>
  );
}

function CoinBadge({label,acc,c,size=96}) {
  return (
    <div className="sticker" style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg, ${acc}, ${c})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:`0 10px 26px -8px ${acc}99`,transform:"rotate(-6deg)"}}>
      <span style={{fontFamily:FONT_DISPLAY,fontSize:size*0.44,fontWeight:700,color:"#fff"}}>{label}</span>
    </div>
  );
}

function TitleSlide() {
  return (
    <div style={{textAlign:"center",maxWidth:680}}>
      <div style={{fontSize:12,color:"#d97706",letterSpacing:"0.12em",marginBottom:24,textTransform:"uppercase"}}>Tallinn University · HCI Programme</div>
      <h1 style={{fontFamily:FONT_DISPLAY,fontSize:60,fontWeight:700,margin:"0 0 16px",lineHeight:1.05,letterSpacing:"-0.5px",color:"#0f172a"}}>HCI: First Interaction</h1>
      <p style={{color:"#64748b",fontSize:22,margin:"0 0 32px",fontWeight:300}}>Welcome Night · Pub Quiz</p>
      <div aria-hidden="true" style={{fontSize:30,marginBottom:40,display:"flex",gap:18,justifyContent:"center"}}>
        <span style={{display:"inline-block",animation:"wiggle 2.2s ease-in-out infinite"}}>🍻</span>
        <span style={{display:"inline-block",animation:"wiggle 2.2s ease-in-out .3s infinite"}}>🧠</span>
        <span style={{display:"inline-block",animation:"wiggle 2.2s ease-in-out .6s infinite"}}>🎉</span>
      </div>
      <p style={{color:"#cbd5e1",fontSize:13,margin:0}}>← → to navigate · Space or click to reveal answers</p>
    </div>
  );
}

function RulesSlide() {
  const rules = [
    "Teams of 4–5 people",
    "One answer sheet per team",
    "No phones in rounds 1 and 2",
    "1 point per correct answer",
    "2 points per word in round 3",
    "Host decision is final",
  ];
  return (
    <div style={{maxWidth:580,width:"100%"}}>
      <div style={{fontSize:11,color:"#d97706",letterSpacing:"0.12em",marginBottom:32,textTransform:"uppercase"}}>Rules</div>
      {rules.map((r,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:20,padding:"15px 0",borderBottom:"1px solid #f1f5f9"}}>
          <span className="sticker" style={{background:"#d97706",color:"#fff",fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,minWidth:28,height:28,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",transform:`rotate(${i%2?3:-3}deg)`,boxShadow:"0 3px 0 #92400e"}}>{i+1}</span>
          <span style={{fontSize:20,color:"#1e293b"}}>{r}</span>
        </div>
      ))}
    </div>
  );
}

function RoundIntro({slide}) {
  const {c,acc} = RC[slide.r];
  return (
    <div style={{textAlign:"center"}}>
      <CoinBadge label={slide.r} acc={acc} c={c}/>
      <div style={{fontSize:11,color:c,letterSpacing:"0.12em",marginBottom:20,textTransform:"uppercase"}}>Round {slide.r}</div>
      <h1 style={{fontFamily:FONT_DISPLAY,fontSize:68,fontWeight:700,margin:"0 0 20px",letterSpacing:"-1px",color:"#0f172a",lineHeight:1.05}}>{slide.title}</h1>
      <p style={{color:"#64748b",fontSize:18,margin:0}}>{slide.sub}</p>
    </div>
  );
}

function QuestionSlide({slide,rev,setRev}) {
  const {c,bg,bdr,sh} = RC[slide.r];
  return (
    <div style={{maxWidth:700,width:"100%"}}>
      <div style={{marginBottom:36}}>
        <Tag acc={c}>{slide.bonus ? "Bonus — 2 pts" : `R${slide.r} · Q${slide.n}`}</Tag>
      </div>
      <h2 style={{fontSize:38,fontWeight:500,lineHeight:1.3,margin:"0 0 48px",color:"#0f172a"}}>{slide.q}</h2>
      {rev ? (
        <div style={{borderLeft:`4px solid ${c}`,paddingLeft:24,animation:"popIn .35s cubic-bezier(.34,1.56,.64,1) both"}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:"0.08em",marginBottom:8,textTransform:"uppercase"}}>Answer</div>
          <div style={{fontFamily:FONT_DISPLAY,fontSize:32,fontWeight:600,color:c}}>{slide.a}</div>
        </div>
      ) : (
        <button onClick={()=>setRev(true)} className="reveal-btn" style={{"--rc":c,"--rc-sh":sh,fontFamily:FONT_DISPLAY,fontSize:15,fontWeight:600,color:c,background:bg,border:`2px solid ${c}`,borderRadius:999,padding:"12px 30px",cursor:"pointer",boxShadow:`0 4px 0 ${sh}`}}>
          Reveal answer
        </button>
      )}
    </div>
  );
}

function TrueFalseIntro() {
  const {c} = RC[2];
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:11,color:c,letterSpacing:"0.12em",marginBottom:20,textTransform:"uppercase"}}>Round 2 · Part 2</div>
      <h1 style={{fontFamily:FONT_DISPLAY,fontSize:64,fontWeight:700,margin:"0 0 20px",letterSpacing:"-1px",color:"#0f172a",lineHeight:1.05}}>True or False</h1>
      <p style={{color:"#64748b",fontSize:18,margin:0}}>3 questions · 1 point each</p>
    </div>
  );
}

function TrueFalseSlide({slide,rev,setRev}) {
  const {c,bg,sh} = RC[2];
  return (
    <div style={{maxWidth:700,width:"100%"}}>
      <div style={{marginBottom:36}}>
        <Tag acc={c}>T/F · {slide.n}</Tag>
      </div>
      <h2 style={{fontSize:38,fontWeight:500,lineHeight:1.3,margin:"0 0 40px",color:"#0f172a"}}>{slide.q}</h2>
      {!rev && (
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div className="sticker" style={{background:"#16a34a",color:"#fff",fontFamily:FONT_DISPLAY,borderRadius:999,padding:"12px 30px",fontSize:18,fontWeight:700,transform:"rotate(-3deg)",boxShadow:"0 4px 0 #15803d"}}>TRUE</div>
          <div className="sticker" style={{background:"#dc2626",color:"#fff",fontFamily:FONT_DISPLAY,borderRadius:999,padding:"12px 30px",fontSize:18,fontWeight:700,transform:"rotate(3deg)",boxShadow:"0 4px 0 #991b1b"}}>FALSE</div>
          <button onClick={()=>setRev(true)} className="reveal-btn" style={{"--rc":c,"--rc-sh":sh,marginLeft:"auto",fontFamily:FONT_DISPLAY,fontSize:14,fontWeight:600,color:c,background:bg,border:`2px solid ${c}`,borderRadius:999,padding:"11px 24px",cursor:"pointer",boxShadow:`0 4px 0 ${sh}`}}>Reveal</button>
        </div>
      )}
      {rev && (
        <div style={{animation:"popIn .35s cubic-bezier(.34,1.56,.64,1) both"}}>
          <div style={{fontFamily:FONT_DISPLAY,fontSize:44,fontWeight:700,color:slide.a?"#16a34a":"#dc2626",marginBottom:12,lineHeight:1}}>
            {slide.a ? "TRUE ✓" : "FALSE ✗"}
          </div>
          <p style={{color:"#64748b",fontSize:18,margin:0}}>{slide.exp}</p>
        </div>
      )}
    </div>
  );
}

function ScoresSlide({slide}) {
  const {c,acc} = RC[slide.r];
  return (
    <div style={{textAlign:"center"}}>
      <CoinBadge label="✓" acc={acc} c={c} size={72}/>
      <div style={{fontSize:11,color:c,letterSpacing:"0.12em",marginBottom:20,textTransform:"uppercase"}}>End of Round {slide.r}</div>
      <h1 style={{fontFamily:FONT_DISPLAY,fontSize:56,fontWeight:700,margin:"0 0 16px",letterSpacing:"-0.5px",color:"#0f172a"}}>Update Scores</h1>
      <p style={{color:"#64748b",fontSize:18,margin:0}}>Add up the points and mark on the scoreboard</p>
    </div>
  );
}

function WordSlide({slide,timer,running,setRunning,setTimer}) {
  const {acc,sh} = RC[3];
  const pct = timer/45;
  const urgent = running && timer<=5 && timer>0;
  const tc = timer>15?"#16a34a":timer>5?"#d97706":"#dc2626";
  return (
    <div style={{textAlign:"center",maxWidth:600,width:"100%"}}>
      <div style={{fontSize:11,color:"#b91c1c",letterSpacing:"0.12em",marginBottom:28,textTransform:"uppercase"}}>Round 3 · Your Word</div>
      <div style={{background:"#f8fafc",border:`1px solid ${urgent?"#fca5a5":"#e2e8f0"}`,borderRadius:24,padding:"40px 48px",boxShadow:`0 24px 60px -28px ${acc}55`,transition:"border-color .3s"}}>
        <h1 style={{fontFamily:FONT_DISPLAY,fontSize:58,fontWeight:700,margin:"0 0 32px",letterSpacing:"-1px",color:acc,lineHeight:1}}>{slide.w}</h1>
        <div style={{borderTop:"1px solid #e2e8f0",paddingTop:28}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>Cannot say</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
            {slide.b.map((w,i)=>(
              <span key={i} style={{background:"#fee2e2",color:"#b91c1c",borderRadius:999,padding:"6px 14px",fontSize:15,fontWeight:600}}>{w}</span>
            ))}
          </div>
        </div>
        <div style={{marginTop:32}}>
          <div className={urgent?"timer-urgent":""} style={{fontFamily:FONT_BODY,fontSize:56,fontWeight:800,color:tc,fontVariantNumeric:"tabular-nums",lineHeight:1,transition:"color .3s",display:"inline-block"}}>{timer}s</div>
          <div style={{height:6,background:"#e2e8f0",borderRadius:3,margin:"12px 0 20px",overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:3,width:`${pct*100}%`,background:tc,transition:"width 1s linear, background .3s"}}/>
          </div>
          {!running ? (
            <button onClick={()=>{setRunning(true);setTimer(45);}} className="timer-start" style={{"--rc":acc,"--rc-sh":sh,fontFamily:FONT_DISPLAY,background:acc,border:"none",color:"#fff",borderRadius:999,padding:"14px 40px",fontSize:16,fontWeight:700,cursor:"pointer",letterSpacing:"0.02em",boxShadow:`0 5px 0 ${sh}`}}>
              Start Timer
            </button>
          ) : (
            <button onClick={()=>{setRunning(false);setTimer(45);}} className="timer-reset" style={{fontFamily:FONT_BODY,background:"transparent",border:"1px solid #e2e8f0",color:"#94a3b8",borderRadius:999,padding:"12px 32px",fontSize:13,fontWeight:500,cursor:"pointer"}}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({length:16});
  return (
    <div aria-hidden="true" style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:2}}>
      {pieces.map((_,i)=>{
        const left = (i*13 + (i%3)*17) % 100;
        const delay = (i%8)*0.35;
        const dur = 3.2+(i%4)*0.6;
        const emoji = CONFETTI_EMOJI[i%CONFETTI_EMOJI.length];
        const size = 20+(i%3)*8;
        return (
          <span key={i} style={{position:"absolute",top:-40,left:`${left}%`,fontSize:size,animation:`confettiFall ${dur}s ${delay}s ease-in infinite`}}>{emoji}</span>
        );
      })}
    </div>
  );
}

function FinalSlide() {
  return (
    <div style={{textAlign:"center",position:"relative"}}>
      <Confetti/>
      <div className="trophy" style={{fontSize:68,marginBottom:16,lineHeight:1,display:"inline-block"}}>🏆</div>
      <h1 style={{fontFamily:FONT_DISPLAY,fontSize:54,fontWeight:700,margin:"0 0 16px",letterSpacing:"-0.5px",color:"#0f172a"}}>Final Scores</h1>
      <p style={{color:"#64748b",fontSize:18,margin:"0 0 40px"}}>Tally up and crown the winner</p>
      <p style={{color:"#94a3b8",fontSize:14,margin:0}}>Then head to Kivi Paber Käärid · Telliskivi 60a</p>
    </div>
  );
}

export default function Quiz() {
  const [idx,setIdx] = useState(0);
  const [rev,setRev] = useState(false);
  const [timer,setTimer] = useState(45);
  const [running,setRunning] = useState(false);

  const slide = SLIDES[idx];

  const go = useCallback((dir) => {
    setIdx(i => Math.max(0,Math.min(SLIDES.length-1,i+dir)));
    setRev(false);
    setTimer(45);
    setRunning(false);
  },[]);

  useEffect(()=>{
    const fn = e => {
      if (e.key==="ArrowRight") go(1);
      else if (e.key==="ArrowLeft") go(-1);
      else if (e.key===" ") { e.preventDefault(); setRev(r=>!r); }
    };
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[go]);

  useEffect(()=>{
    if (!running||timer<=0) { if (timer<=0) setRunning(false); return; }
    const t = setTimeout(()=>setTimer(v=>v-1),1000);
    return ()=>clearTimeout(t);
  },[running,timer]);

  const renderSlide = () => {
    switch(slide.t) {
      case "title": return <TitleSlide/>;
      case "rules": return <RulesSlide/>;
      case "ri": return <RoundIntro slide={slide}/>;
      case "q": return <QuestionSlide slide={slide} rev={rev} setRev={setRev}/>;
      case "tfi": return <TrueFalseIntro/>;
      case "tf": return <TrueFalseSlide slide={slide} rev={rev} setRev={setRev}/>;
      case "sc": return <ScoresSlide slide={slide}/>;
      case "w": return <WordSlide slide={slide} timer={timer} running={running} setRunning={setRunning} setTimer={setTimer}/>;
      case "fin": return <FinalSlide/>;
      default: return null;
    }
  };

  const progress = ((idx+1)/SLIDES.length)*100;
  const accent = slideAccent(slide);
  const btnStyle = (disabled) => ({
    background:"none",border:"none",
    color:disabled?"#e2e8f0":"#64748b",
    fontSize:14,cursor:disabled?"default":"pointer",
    padding:"8px 16px",borderRadius:999,fontFamily:"inherit",
  });

  return (
    <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:FONT_BODY,background:"#ffffff",color:"#0f172a",position:"relative",overflow:"hidden"}}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes popIn{0%{opacity:0;transform:translateY(14px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes floatBlob{0%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(24px,-18px) rotate(8deg)}100%{transform:translate(0,0) rotate(0deg)}}
        @keyframes wiggle{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
        @keyframes trophyBounce{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(4deg)}}
        @keyframes pulseBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        @keyframes confettiFall{0%{transform:translateY(-40px) rotate(0deg);opacity:0}10%{opacity:1}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
        h1,h2{text-wrap:balance}
        button{font-family:inherit}
        .slide-pop{animation:popIn .45s cubic-bezier(.34,1.56,.64,1) both;width:100%;display:flex;justify-content:center}
        .sticker:hover{animation:wiggle .4s ease}
        .trophy{animation:trophyBounce 2s ease-in-out infinite}
        .timer-urgent{animation:pulseBeat .5s ease-in-out infinite}
        .reveal-btn,.timer-start,.timer-reset,.nav-btn{transition:background .2s ease,color .2s ease,border-color .2s ease,box-shadow .2s ease,transform .15s ease,filter .2s ease}
        .reveal-btn:hover{background:var(--rc);color:#fff;box-shadow:0 6px 0 var(--rc-sh);transform:translateY(-2px)}
        .reveal-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--rc-sh)}
        .reveal-btn:focus-visible{outline:2px solid var(--rc);outline-offset:4px}
        .timer-start:hover{filter:brightness(1.06);box-shadow:0 7px 0 var(--rc-sh);transform:translateY(-2px)}
        .timer-start:active{transform:translateY(3px);box-shadow:0 1px 0 var(--rc-sh)}
        .timer-start:focus-visible{outline:2px solid var(--rc);outline-offset:4px}
        .timer-reset:hover{border-color:#94a3b8;color:#475569}
        .timer-reset:focus-visible{outline:2px solid #94a3b8;outline-offset:3px}
        .nav-btn:not(:disabled):hover{color:#0f172a;background:#f8fafc}
        .nav-btn:not(:disabled):active{transform:scale(.95)}
        .nav-btn:focus-visible{outline:2px solid #d97706;outline-offset:3px}
      `}</style>
      <div aria-hidden="true" style={{position:"fixed",top:"-10%",left:"-8%",width:420,height:420,borderRadius:"50%",background:accent,opacity:0.15,filter:"blur(90px)",animation:"floatBlob 14s ease-in-out infinite",transition:"background .5s ease"}}/>
      <div aria-hidden="true" style={{position:"fixed",bottom:"-12%",right:"-8%",width:480,height:480,borderRadius:"50%",background:accent,opacity:0.12,filter:"blur(100px)",animation:"floatBlob 18s ease-in-out infinite reverse",transition:"background .5s ease"}}/>
      <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",opacity:0.02,mixBlendMode:"multiply",backgroundImage:NOISE_BG,backgroundSize:"140px 140px"}}/>
      <div role="progressbar" aria-label="Quiz progress" aria-valuenow={idx+1} aria-valuemin={1} aria-valuemax={SLIDES.length} style={{height:5,background:"#f1f5f9",flexShrink:0,position:"relative"}}>
        <div style={{height:"100%",width:`${progress}%`,background:accent,borderRadius:"0 3px 3px 0",boxShadow:`0 0 10px ${accent}`,transition:"width .3s, background .3s"}}/>
      </div>
      <main style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 48px",position:"relative"}}>
        <div key={idx} className="slide-pop">
          {renderSlide()}
        </div>
      </main>
      <footer style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 32px",borderTop:"1px solid #f1f5f9",flexShrink:0,position:"relative"}}>
        <button onClick={()=>go(-1)} disabled={idx===0} className="nav-btn" aria-label="Previous slide" style={btnStyle(idx===0)}>← Back</button>
        <span style={{color:"#cbd5e1",fontSize:13,fontVariantNumeric:"tabular-nums"}} aria-live="polite">{idx+1} / {SLIDES.length}</span>
        <button onClick={()=>go(1)} disabled={idx===SLIDES.length-1} className="nav-btn" aria-label="Next slide" style={btnStyle(idx===SLIDES.length-1)}>Next →</button>
      </footer>
    </div>
  );
}
