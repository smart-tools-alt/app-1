import { useState, useEffect } from "react";

/* ═══════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --P:#2D6A4F;--PD:#1B4332;--PL:#52B788;
  --A:#FF6B35;--W:#F4A261;
  --bg:#F8F4EF;--T:#1A1A1A;--TM:#78716C;
  --card:#FFFFFF;--bdr:#E5E0D8;
  --sh:0 4px 20px rgba(0,0,0,.08);
  --sh2:0 12px 40px rgba(0,0,0,.15);
  --r:18px;--rs:12px;
}
body{font-family:'Rubik',system-ui,sans-serif;background:#1B4332;height:100vh;overflow:hidden}
#root{height:100vh;display:flex;align-items:center;justify-content:center}
.frame{
  width:min(390px,100vw);height:min(844px,100vh);
  background:var(--bg);
  border-radius:clamp(0px,calc((100vw - 390px) * 9999),44px);
  overflow:hidden;position:relative;display:flex;flex-direction:column;
  box-shadow:0 40px 100px rgba(0,0,0,.55);
}
@media(max-width:420px){body{background:var(--bg)}.frame{box-shadow:none}}
.sc{overflow-y:auto;-webkit-overflow-scrolling:touch}.sc::-webkit-scrollbar{display:none}

@keyframes fi{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes pw{0%{opacity:0;transform:scale(.3) rotate(-15deg)}70%{opacity:1;transform:scale(1.1) rotate(3deg)}100%{transform:scale(1) rotate(0)}}
@keyframes fl{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}

.fi{animation:fi .4s ease both}
.su{animation:su .35s cubic-bezier(.34,1.56,.64,1) both}

/* Buttons */
.btn{display:flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:var(--rs);padding:14px 20px;font-family:'Rubik',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%;transition:transform .15s,opacity .15s}
.btn:active{transform:scale(.97)}
.bp{background:var(--P);color:#fff}
.ba{background:var(--A);color:#fff}
.bg2{background:#fff;color:var(--T);border:2px solid var(--bdr)}
.bw{background:#25D366;color:#fff;border-radius:14px;padding:15px}
.bsm{width:auto;padding:8px 14px;font-size:12px}

/* Inputs */
.inp{width:100%;border:2px solid var(--bdr);border-radius:var(--rs);padding:13px 15px;font-family:'Rubik',sans-serif;font-size:15px;background:#fff;color:var(--T);outline:none;transition:border .2s}
.inp:focus{border-color:var(--P)}
textarea.inp{resize:none;min-height:88px}
select.inp{cursor:pointer}

/* Cards */
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh)}

/* Chips */
.chip{display:inline-flex;align-items:center;padding:7px 13px;border-radius:20px;font-size:12px;font-weight:700;border:2px solid var(--bdr);cursor:pointer;white-space:nowrap;font-family:'Rubik',sans-serif;background:#fff;color:var(--TM);transition:all .15s}
.chip.on{background:var(--P);color:#fff;border-color:var(--P)}

/* Scrollable row */
.srow{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}
.srow::-webkit-scrollbar{display:none}

/* Bottom nav */
.bnav{background:#fff;border-top:1px solid var(--bdr);display:flex;flex-shrink:0;box-shadow:0 -3px 14px rgba(0,0,0,.06)}
.ntab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px 5px;border:none;background:transparent;cursor:pointer;font-family:'Rubik',sans-serif;font-size:10px;font-weight:600;color:var(--TM);transition:color .2s}
.ntab.on{color:var(--P)}
.ntab .ni{font-size:21px;transition:transform .2s}
.ntab.on .ni{transform:scale(1.18)}

/* Lang FAB */
.langfab{position:absolute;top:58px;width:42px;height:42px;border-radius:21px;background:#fff;border:2px solid var(--bdr);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Rubik',sans-serif;font-size:10px;font-weight:800;color:var(--P);box-shadow:var(--sh);z-index:100;gap:1px;transition:all .2s}
.langfab:active{transform:scale(.88)}

/* Modal overlay + sheet */
.ov{position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:200;display:flex;align-items:flex-end}
.sheet{background:#fff;border-radius:22px 22px 0 0;width:100%;max-height:90%;overflow-y:auto;padding:20px;animation:su .3s cubic-bezier(.34,1.56,.64,1)}
.sheet::-webkit-scrollbar{display:none}
.hdl{width:36px;height:4px;background:var(--bdr);border-radius:2px;margin:0 auto 18px}

/* Star */
.str{cursor:pointer;line-height:1;transition:transform .1s}
.str:active{transform:scale(1.3)}

/* Info row */
.ir{display:flex;justify-content:space-between;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--bdr)}
.ir:last-child{border-bottom:none}
`;

/* ═══════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════ */
const T = {
  he: {
    dir:"rtl", name:"דוג-לי", tag:"הקהילה שלך לכלבים 🐾",
    who:"מי אתה?", roleHint:"בחר את תפקידך בקהילה",
    walker:"מטייל / מטפל בכלבים", owner:"בעל / בעלת כלב",
    walkerD:"הצע שירותי טיול וסיטינג לכלבים",
    ownerD:"מצא מטיילים ומטפלים איכותיים",
    ps:"הגדרת פרופיל", photoL:"תמונת פרופיל (אופציונלי)",
    fName:"שם מלא", fPhone:"מספר טלפון", fCity:"עיר", fHood:"שכונה", fGender:"מין",
    gF:"נקבה", gM:"זכר", gO:"אחר",
    fBio:"ספר על עצמך", fExp:"שנות ניסיון",
    pricing:"תמחור (₪)", p15:"15 דק'", p30:"30 דק'", p60:"60 דק' (אופ')",
    petSize:"גודל הכלב", sml:"קטן", med:"בינוני", lrg:"גדול",
    petAge:"גיל הכלב", petInfo:"מידע נוסף על הכלב", fStreet:"רחוב",
    cont:"שמור והמשך",
    done:"כמעט שם! 🎉", gLogin:"כניסה עם Google", loginHint:"כדי לשמור את הפרופיל שלך",
    loading:"טוען...",
    tProf:"פרופיל", tSearch:"חיפוש", tCom:"קהילה", tAbout:"אודות", tWork:"מצא עבודה",
    searchH:"מטיילים זמינים", found:"נמצאו",
    allF:"הכל", allC:"כל הערים",
    gFem:"👩 נקבה", gMal:"👨 זכר",
    e2:"2+ שנים", e5:"5+ שנים",
    pr50:"עד 50₪", pr70:"עד 70₪",
    noRes:"לא נמצאו מטיילים",
    wa:"יצירת קשר ב-WhatsApp", revs:"ביקורות",
    writeR:"כתוב ביקורת", subR:"שלח", revPh:"הביקורת שלך...", ratLbl:"דירוג",
    comH:"קהילה", posts:"פוסטים",
    newPost:"+ פוסט חדש", chooseT:"בחר סוג פוסט", postPh:"מה תרצה לכתוב?", pub:"פרסם 🚀",
    allP:"הכל",
    t1:"מציע הליכה", t2:"מציע סיטינג", t3:"מחפש מטייל", t4:"מחפש סיטר",
    now:"עכשיו",
    aboutH:"אודות דוג-לי",
    aboutTx:"דוג-לי היא פלטפורמה קהילתית המחברת בין בעלי כלבים לבין מטיילים ומטפלים איכותיים בכל רחבי ישראל. משימתנו: לדאוג שכל כלב יקבל את הטיפול הטוב ביותר.",
    a11y:"הצהרת נגישות", priv:"מדיניות פרטיות",
    ctUs:"צור קשר", terms:"תנאי שימוש", ver:"גרסה 1.0.0",
    editP:"ערוך פרופיל", curRole:"תפקיד נוכחי", switchR:"החלף תפקיד",
    addW:"הוסף פרופיל מטייל", addO:"הוסף פרופיל בעל כלב",
    yrs:"שנים", yr:"ש'", mn:"דק'", nis:"₪",
    expL:"ניסיון", bio:"ביו",
  },
  en: {
    dir:"ltr", name:"Dog-Li", tag:"Your dog care community 🐾",
    who:"Who are you?", roleHint:"Choose your role in the community",
    walker:"Dog Walker / Sitter", owner:"Dog Owner",
    walkerD:"Offer walking & sitting services",
    ownerD:"Find quality walkers & sitters",
    ps:"Profile Setup", photoL:"Profile Photo (optional)",
    fName:"Full Name", fPhone:"Phone Number", fCity:"City", fHood:"Neighborhood", fGender:"Gender",
    gF:"Female", gM:"Male", gO:"Other",
    fBio:"Tell us about yourself", fExp:"Years of Experience",
    pricing:"Pricing (NIS)", p15:"15 min", p30:"30 min", p60:"60 min (opt)",
    petSize:"Dog Size", sml:"Small", med:"Medium", lrg:"Large",
    petAge:"Dog's Age", petInfo:"Additional dog info", fStreet:"Street",
    cont:"Save & Continue",
    done:"Almost there! 🎉", gLogin:"Sign in with Google", loginHint:"To save your profile",
    loading:"Loading...",
    tProf:"Profile", tSearch:"Search", tCom:"Community", tAbout:"About", tWork:"Find Work",
    searchH:"Available Walkers", found:"found",
    allF:"All", allC:"All Cities",
    gFem:"👩 Female", gMal:"👨 Male",
    e2:"2+ yrs", e5:"5+ yrs",
    pr50:"Up to ₪50", pr70:"Up to ₪70",
    noRes:"No walkers found",
    wa:"Contact on WhatsApp", revs:"Reviews",
    writeR:"Write Review", subR:"Submit", revPh:"Your review...", ratLbl:"Rating",
    comH:"Community", posts:"posts",
    newPost:"+ New Post", chooseT:"Choose post type", postPh:"What would you like to write?", pub:"Publish 🚀",
    allP:"All",
    t1:"Offering Walking", t2:"Offering Sitting", t3:"Need Walker", t4:"Need Sitter",
    now:"Just now",
    aboutH:"About Dog-Li",
    aboutTx:"Dog-Li is a community platform connecting dog owners with quality walkers and sitters across Israel. Our mission: ensuring every dog gets the best care possible.",
    a11y:"Accessibility", priv:"Privacy Policy",
    ctUs:"Contact Us", terms:"Terms of Use", ver:"Version 1.0.0",
    editP:"Edit Profile", curRole:"Current Role", switchR:"Switch Role",
    addW:"Add Walker Profile", addO:"Add Owner Profile",
    yrs:"years", yr:"yr", mn:"min", nis:"₪",
    expL:"Experience", bio:"Bio",
  }
};

/* ═══════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════ */
const CITIES = ["תל אביב","חיפה","ירושלים","ראשון לציון","פתח תקווה","נתניה","באר שבע"];
const HOODS = {
  "תל אביב":["פלורנטין","נווה צדק","לב העיר","הצפון הישן","יפו"],
  "חיפה":["כרמל","נווה שאנן","הדר","הנמל"],
  "ירושלים":["רחביה","גילה","קטמון","תלפיות"],
  "ראשון לציון":["מרכז","נחלת יהודה","נאות אפקה"],
  "פתח תקווה":["כפר גנים","נחשון","מרכז"],
  default:["מרכז","צפון","דרום"],
};

const PT = {
  t1:{ bg:"#E8F5E9", tc:"#1B5E20", icon:"🦮" },
  t2:{ bg:"#E3F2FD", tc:"#0D47A1", icon:"🏠" },
  t3:{ bg:"#FFF8E1", tc:"#E65100", icon:"🔍" },
  t4:{ bg:"#F3E5F5", tc:"#4A148C", icon:"🛏️" },
};

const WALKERS_INIT = [
  { id:"w1", em:"🧑‍🦰", name:"נועה כהן", nameE:"Noa Cohen",
    age:26, gen:"נקבה", genE:"Female", city:"תל אביב", hood:"פלורנטין", exp:3,
    bio:"אוהבת כלבים מגיל קטן. מנוסה עם כל הגדלים. גמישה בשעות ומזמינה!",
    bioE:"Dog lover since childhood. Experienced with all sizes. Flexible hours and welcoming!",
    p15:30, p30:55, p60:100, phone:"050-1234567", rat:4.9, rc:47,
    revs:[
      {u:"דנה ל.",s:5,tx:"מדהימה! הכלב שלנו אוהב אותה",d:"לפני 2 ימים"},
      {u:"ירון מ.",s:5,tx:"אמינה ומקצועית, מומלצת מאוד",d:"לפני שבוע"},
    ]},
  { id:"w2", em:"👨", name:"עמית שפירא", nameE:"Amit Shapira",
    age:31, gen:"זכר", genE:"Male", city:"תל אביב", hood:"נווה צדק", exp:7,
    bio:"מדריך כלבים מוסמך. מתמחה בכלבים גדולים וחרדתיים.",
    bioE:"Certified dog trainer. Specializes in large & anxious dogs.",
    p15:40, p30:70, p60:130, phone:"052-9876543", rat:5.0, rc:89,
    revs:[
      {u:"מיכל ר.",s:5,tx:"הכי טוב שיש! שינה את חיי הכלב שלנו",d:"אתמול"},
      {u:"גל ב.",s:5,tx:"מקצועי ברמה אחרת לגמרי",d:"לפני 3 ימים"},
    ]},
  { id:"w3", em:"👩", name:"מיה רוזן", nameE:"Maya Rosen",
    age:22, gen:"נקבה", genE:"Female", city:"חיפה", hood:"כרמל", exp:2,
    bio:"סטודנטית לווטרינריה. אחראית מאוד ואוהבת כלבים מכל הלב.",
    bioE:"Vet student. Very responsible and loves dogs from the heart.",
    p15:25, p30:45, p60:80, phone:"054-3456789", rat:4.8, rc:23,
    revs:[{u:"שרה כ.",s:5,tx:"מקסימה! הכלב חזר שמח ורגוע",d:"לפני 4 ימים"}]},
  { id:"w4", em:"🧔", name:"ליאור בן-דוד", nameE:"Lior Ben-David",
    age:19, gen:"זכר", genE:"Male", city:"ראשון לציון", hood:"מרכז", exp:1,
    bio:"אוהב חיות כל חיי. לב גדול ומחירים נגישים לכולם!",
    bioE:"Animal lover all my life. Big heart and accessible prices for everyone!",
    p15:20, p30:35, p60:60, phone:"053-7654321", rat:4.5, rc:8,
    revs:[{u:"אמיר פ.",s:4,tx:"נחמד, אמין, מחיר מצוין",d:"לפני שבועיים"}]},
  { id:"w5", em:"👩‍🦱", name:"שירה מזרחי", nameE:"Shira Mizrahi",
    age:28, gen:"נקבה", genE:"Female", city:"פתח תקווה", hood:"מרכז", exp:4,
    bio:"עסק רשום לטיפול בכלבים. ביטוח מלא. זמינה גם בסופי שבוע!",
    bioE:"Registered dog care business. Fully insured. Available weekends too!",
    p15:35, p30:60, p60:110, phone:"050-5555555", rat:4.6, rc:34,
    revs:[
      {u:"רחל ש.",s:5,tx:"אמינה ומקצועית, הכלבה אוהבת אותה",d:"לפני 5 ימים"},
      {u:"עופר ד.",s:4,tx:"שירות מעולה, זמינה בוואטסאפ",d:"לפני שבוע"},
    ]},
  { id:"w6", em:"👨‍🦳", name:"יונתן לוי", nameE:"Yonatan Levy",
    age:45, gen:"זכר", genE:"Male", city:"ירושלים", hood:"רחביה", exp:5,
    bio:"פנסיונר שמטייל כלבים מתוך אהבה אמיתית. הרבה זמן וסבלנות.",
    bioE:"Retired walker out of genuine love. Plenty of time and patience.",
    p15:25, p30:45, p60:null, phone:"050-9991234", rat:4.7, rc:56,
    revs:[{u:"נעמי א.",s:5,tx:"מלאך! מטייל את הכלב שלנו כל יום",d:"לפני יומיים"}]},
];

const POSTS_INIT = [
  {id:1,type:"t1",u:"שירה מזרחי",uE:"Shira Mizrahi",av:"👩‍🦱",city:"פתח תקווה",
   tx:"מציעה טיולי בוקר בפתח תקווה! זמינה 7–9. 35₪ ל-15 דק' 🐕",
   txE:"Offering morning walks in Petah Tikva! Available 7–9 AM. ₪35 for 15min 🐕",h:2},
  {id:2,type:"t3",u:"יעל גולד",uE:"Yael Gold",av:"👩",city:"תל אביב",
   tx:"מחפשת מטייל קבוע לגולדן שלנו, אזור פלורנטין. בקרה ראשונה בחינם!",
   txE:"Looking for a regular walker for our Golden in Florentin. First meeting free!",h:5},
  {id:3,type:"t2",u:"עמית שפירא",uE:"Amit Shapira",av:"👨",city:"תל אביב",
   tx:"זמין לסיטינג סופי שבוע! הכלב ישן אצלי עם כל הפינוקים. 180₪ ללילה 🏠",
   txE:"Available for weekend sitting! Dog sleeps at mine, fully pampered. ₪180/night 🏠",h:8},
  {id:4,type:"t4",u:"דוד ישראלי",uE:"David Israeli",av:"👨‍🦲",city:"חיפה",
   tx:"מחפש סיטר לשבועות! 2 לילות לבולדוג צרפתי מפונק. תשלום נדיב 🙏",
   txE:"Looking for Shavuot sitter! 2 nights for spoiled French Bulldog. Good pay 🙏",h:12},
  {id:5,type:"t1",u:"נועה כהן",uE:"Noa Cohen",av:"🧑‍🦰",city:"תל אביב",
   tx:"פתחתי יומן לחודש הבא! מקבלת הזמנות לטיולי בוקר בפלורנטין ולב העיר 📅",
   txE:"Opening calendar for next month! Taking morning walk bookings in Florentin & City Center 📅",d:1},
  {id:6,type:"t3",u:"רינת אבי",uE:"Rinat Avi",av:"👩‍🦳",city:"ירושלים",
   tx:"צריכה מטייל לפוינטר שלנו, 3 פעמים בשבוע, בוקר. אזור גילה. מי מכיר?",
   txE:"Need walker for our Pointer, 3x/week, mornings. Gilo area. Any recommendations?",d:1},
  {id:7,type:"t2",u:"מיה רוזן",uE:"Maya Rosen",av:"👩",city:"חיפה",
   tx:"סיטינג בבית עם אהבה! הכלב ישן אצלי. זמינה כל הקיץ ☀️",
   txE:"Home sitting with love! Dog sleeps at mine. Available all summer ☀️",d:2},
  {id:8,type:"t4",u:"אורן שמש",uE:"Oren Shemesh",av:"🧔",city:"ראשון לציון",
   tx:"יוצאים לחו\"ל שבוע! מחפשים סיטר לשתי כלבות בינוניות. תשלום נדיב!",
   txE:"Going abroad for a week! Looking for sitter for two medium female dogs. Generous pay!",d:3},
];

/* ═══════════════════════════════════════
   SMALL SHARED COMPONENTS
═══════════════════════════════════════ */
function Stars({ val, onChange, size = 18 }) {
  const [hov, sH] = useState(0);
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} className="str"
          style={{ fontSize:size, color:(hov||val)>=s?"#F59E0B":"#D1D5DB", cursor:onChange?"pointer":"default" }}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && sH(s)}
          onMouseLeave={() => onChange && sH(0)}
        >★</span>
      ))}
    </div>
  );
}

function Av({ em, size = 48 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:"linear-gradient(135deg,#E8F5E9,#C8E6C9)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.55, border:"2.5px solid #fff",
      boxShadow:"0 2px 8px rgba(0,0,0,.1)", flexShrink:0,
    }}>{em}</div>
  );
}

function GH({ pt="68px", children }) {
  return (
    <div style={{
      background:"linear-gradient(160deg,var(--PD),var(--P))",
      paddingTop:pt, paddingBottom:26, paddingLeft:22, paddingRight:22, color:"#fff",
    }}>{children}</div>
  );
}

function Chip({ on, onClick, children }) {
  return <button className={`chip${on?" on":""}`} onClick={onClick}>{children}</button>;
}

function FG({ label, children }) {
  return (
    <div>
      <div style={{ fontSize:12, fontWeight:700, color:"var(--TM)", marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}

function LangFab({ lang, onToggle, dir }) {
  return (
    <button className="langfab"
      style={{ [dir==="rtl"?"left":"right"]: 14 }}
      onClick={onToggle}
      aria-label="Toggle language"
    >
      🇮🇱<span style={{ fontSize:9 }}>{lang==="he"?"EN":"עב"}</span>
    </button>
  );
}

/* ═══════════════════════════════════════
   SPLASH
═══════════════════════════════════════ */
function Splash({ t, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:24,
      background:"linear-gradient(160deg,#081C15,#1B4332,#2D6A4F)",
    }}>
      <div style={{ fontSize:80, animation:"pw .8s cubic-bezier(.34,1.56,.64,1) .3s both" }}>🐾</div>
      <div style={{ textAlign:"center", animation:"fi .6s ease .9s both", color:"#fff" }}>
        <div style={{ fontSize:44, fontWeight:900, letterSpacing:-1 }}>{t.name}</div>
        <div style={{ fontSize:16, opacity:.8, marginTop:6 }}>{t.tag}</div>
      </div>
      <div style={{
        marginTop:28, width:34, height:34, borderRadius:"50%",
        border:"3px solid rgba(255,255,255,.2)", borderTopColor:"#fff",
        animation:"sp .7s linear 1.5s infinite",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   ROLE SELECT
═══════════════════════════════════════ */
function RoleSelect({ t, onSelect }) {
  return (
    <div style={{ flex:1, background:"var(--bg)", overflowY:"auto" }}>
      <GH pt="72px">
        <div style={{ fontSize:46, marginBottom:10 }}>🐾</div>
        <div style={{ fontSize:26, fontWeight:900 }}>{t.who}</div>
        <div style={{ fontSize:14, opacity:.8, marginTop:6 }}>{t.roleHint}</div>
      </GH>
      <div style={{ padding:"26px 20px", display:"flex", flexDirection:"column", gap:16 }}>
        {[
          {r:"walker",em:"🏃‍♂️",tt:t.walker,d:t.walkerD,c:"var(--P)"},
          {r:"owner", em:"🐕", tt:t.owner, d:t.ownerD, c:"var(--A)"},
        ].map(({r,em,tt,d,c},i) => (
          <button key={r} onClick={()=>onSelect(r)}
            className="card"
            style={{
              display:"flex", alignItems:"center", gap:18, padding:22,
              border:`2px solid ${c}20`, cursor:"pointer",
              fontFamily:"'Rubik',sans-serif", textAlign:"inherit",
              background:"#fff", width:"100%",
              animation:`fi .5s ease ${i*.12+.1}s both`, transition:"all .2s",
            }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{
              width:64, height:64, borderRadius:20,
              background:`${c}18`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:30, flexShrink:0,
            }}>{em}</div>
            <div style={{ flex:1, textAlign:"start" }}>
              <div style={{ fontSize:17, fontWeight:800, color:"var(--T)", marginBottom:4 }}>{tt}</div>
              <div style={{ fontSize:13, color:"var(--TM)" }}>{d}</div>
            </div>
            <span style={{ fontSize:24, color:c, opacity:.6 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PROFILE SETUP
═══════════════════════════════════════ */
function ProfileSetup({ role, t, lang, onDone }) {
  const [f, sF] = useState({
    name:"", phone:"", city:"תל אביב", hood:"", gender:"נקבה",
    bio:"", exp:"", p15:"", p30:"", p60:"",
    street:"", petSize:"בינוני", petAge:"", petInfo:"",
  });
  const upd = (k,v) => sF(p=>({...p,[k]:v}));
  const hoods = HOODS[f.city] || HOODS.default;
  const d = t.dir;

  return (
    <div style={{ flex:1, overflowY:"auto" }} className="sc">
      <GH pt="68px">
        <div style={{ fontSize:36, marginBottom:8 }}>{role==="walker"?"🏃‍♂️":"🐕"}</div>
        <div style={{ fontSize:22, fontWeight:800 }}>{t.ps}</div>
        <div style={{ fontSize:13, opacity:.75, marginTop:4 }}>{role==="walker"?t.walker:t.owner}</div>
      </GH>

      <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:16, paddingBottom:36 }}>
        {/* Photo */}
        <div className="card" style={{ padding:18, display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:66,height:66,borderRadius:"50%",background:"var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>
            {role==="walker"?"🏃‍♂️":"🐕"}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{t.photoL}</div>
            <button className="btn bp bsm">📷 {lang==="he"?"בחר תמונה":"Choose Photo"}</button>
          </div>
        </div>

        {/* Basic info */}
        <div className="card" style={{ padding:18, display:"flex", flexDirection:"column", gap:14 }}>
          <FG label={t.fName}><input dir={d} className="inp" placeholder={t.fName} value={f.name} onChange={e=>upd("name",e.target.value)}/></FG>
          <FG label={t.fPhone}><input dir="ltr" className="inp" placeholder="050-0000000" value={f.phone} onChange={e=>upd("phone",e.target.value)}/></FG>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FG label={t.fCity}>
              <select className="inp" value={f.city} onChange={e=>upd("city",e.target.value)}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </FG>
            <FG label={t.fHood}>
              <select className="inp" value={f.hood} onChange={e=>upd("hood",e.target.value)}>
                <option value="">—</option>
                {hoods.map(h=><option key={h}>{h}</option>)}
              </select>
            </FG>
          </div>
          <FG label={t.fGender}>
            <div style={{ display:"flex", gap:8 }}>
              {["נקבה","זכר","אחר"].map((g,i) => (
                <button key={g} onClick={()=>upd("gender",g)} style={{
                  flex:1, padding:"11px 4px", border:"2px solid",
                  borderColor:f.gender===g?"var(--P)":"var(--bdr)", borderRadius:10,
                  background:f.gender===g?"var(--P)":"#fff",
                  color:f.gender===g?"#fff":"var(--TM)",
                  fontFamily:"'Rubik',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                }}>{[t.gF,t.gM,t.gO][i]}</button>
              ))}
            </div>
          </FG>
        </div>

        {/* Walker extras */}
        {role==="walker" && <>
          <div className="card" style={{ padding:18, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ color:"var(--P)", fontWeight:800, fontSize:14 }}>📋 {lang==="he"?"פרטים נוספים":"More Details"}</div>
            <FG label={t.fBio}><textarea dir={d} className="inp" placeholder={t.fBio} value={f.bio} onChange={e=>upd("bio",e.target.value)}/></FG>
            <FG label={t.fExp}><input className="inp" type="number" min={0} placeholder="0" value={f.exp} onChange={e=>upd("exp",e.target.value)}/></FG>
          </div>
          <div className="card" style={{ padding:18 }}>
            <div style={{ color:"var(--P)", fontWeight:800, fontSize:14, marginBottom:14 }}>💰 {t.pricing}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[["p15",t.p15],["p30",t.p30],["p60",t.p60]].map(([k,l]) => (
                <FG key={k} label={l}>
                  <input className="inp" type="number" placeholder="₪" value={f[k]} onChange={e=>upd(k,e.target.value)} style={{ textAlign:"center" }}/>
                </FG>
              ))}
            </div>
          </div>
        </>}

        {/* Owner extras */}
        {role==="owner" && (
          <div className="card" style={{ padding:18, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ color:"var(--P)", fontWeight:800, fontSize:14 }}>🐕 {lang==="he"?"פרטי הכלב":"Pet Details"}</div>
            <FG label={t.fStreet}><input dir={d} className="inp" placeholder={t.fStreet} value={f.street} onChange={e=>upd("street",e.target.value)}/></FG>
            <FG label={t.petSize}>
              <div style={{ display:"flex", gap:8 }}>
                {["קטן","בינוני","גדול"].map((s,i) => (
                  <button key={s} onClick={()=>upd("petSize",s)} style={{
                    flex:1, padding:"11px 4px", border:"2px solid",
                    borderColor:f.petSize===s?"var(--P)":"var(--bdr)", borderRadius:10,
                    background:f.petSize===s?"var(--P)":"#fff",
                    color:f.petSize===s?"#fff":"var(--TM)",
                    fontFamily:"'Rubik',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer",
                  }}>{[t.sml,t.med,t.lrg][i]}</button>
                ))}
              </div>
            </FG>
            <FG label={t.petAge}><input className="inp" type="number" min={0} placeholder="0" value={f.petAge} onChange={e=>upd("petAge",e.target.value)}/></FG>
            <FG label={t.petInfo}><textarea dir={d} className="inp" placeholder={t.petInfo} value={f.petInfo} onChange={e=>upd("petInfo",e.target.value)}/></FG>
          </div>
        )}

        <button className="btn bp" onClick={()=>onDone(f)} style={{ marginTop:4, fontSize:16 }}>
          {t.cont} →
        </button>
        <div style={{ height:20 }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   AUTH SCREEN
═══════════════════════════════════════ */
function Auth({ t, onDone }) {
  const [ld, sL] = useState(false);
  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"40px 32px", gap:24, background:"var(--bg)",
    }}>
      <div style={{ fontSize:72, animation:"pw .7s cubic-bezier(.34,1.56,.64,1) both" }}>🔐</div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>{t.done}</div>
        <div style={{ color:"var(--TM)", fontSize:15 }}>{t.loginHint}</div>
      </div>
      <button
        className="btn bg2"
        onClick={() => { sL(true); setTimeout(onDone, 1800); }}
        style={{ fontSize:16, borderRadius:14, padding:"16px 24px", boxShadow:"var(--sh)", borderColor:"#ddd", gap:12, opacity:ld?.55:1 }}
      >
        {ld
          ? <><div style={{width:20,height:20,border:"2px solid var(--bdr)",borderTopColor:"var(--P)",borderRadius:"50%",animation:"sp .7s linear infinite"}}/>{t.loading}</>
          : <><span style={{fontSize:22,fontWeight:900,color:"#4285F4"}}>G</span>{t.gLogin}</>
        }
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP (shell + bottom nav)
═══════════════════════════════════════ */
function MainApp({ user, lang, t, onLT, walkers, setWalkers, posts, setPosts }) {
  const [tab, sTab] = useState(0);
  const [sel, sSel] = useState(null);
  const isW = user.role === "walker";

  const tabs = isW
    ? [{id:"p",icon:"👤",lbl:t.tProf},{id:"w",icon:"🔍",lbl:t.tWork},{id:"a",icon:"ℹ️",lbl:t.tAbout}]
    : [{id:"p",icon:"👤",lbl:t.tProf},{id:"s",icon:"🦮",lbl:t.tSearch},{id:"c",icon:"💬",lbl:t.tCom},{id:"a",icon:"ℹ️",lbl:t.tAbout}];

  const cur = tabs[tab]?.id;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <LangFab lang={lang} onToggle={onLT} dir={t.dir}/>
      <div className="sc" style={{ flex:1 }}>
        {cur==="p" && <ProfileTab user={user} t={t} lang={lang}/>}
        {cur==="s" && <SearchTab walkers={walkers} t={t} lang={lang} onSel={w=>{setWalkers(ws=>ws);sSel(w)}}/>}
        {cur==="c" && <ComTab posts={posts} setPosts={setPosts} t={t} lang={lang}/>}
        {cur==="w" && <ComTab posts={posts} setPosts={setPosts} t={t} lang={lang}/>}
        {cur==="a" && <AboutTab t={t} lang={lang}/>}
      </div>
      <nav className="bnav" dir={t.dir}>
        {tabs.map((tb,i) => (
          <button key={tb.id} className={`ntab${tab===i?" on":""}`} onClick={()=>sTab(i)}>
            <span className="ni">{tb.icon}</span>{tb.lbl}
          </button>
        ))}
      </nav>
      {sel && (
        <WalkerModal w={sel} t={t} lang={lang}
          onClose={()=>sSel(null)}
          onUpdate={updated => { setWalkers(ws=>ws.map(x=>x.id===updated.id?updated:x)); sSel(updated); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   PROFILE TAB
═══════════════════════════════════════ */
function ProfileTab({ user, t, lang }) {
  const p = user.profile || {};
  return (
    <div style={{ background:"var(--bg)", minHeight:"100%" }}>
      <GH pt="72px">
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:62, marginBottom:12 }}>{user.role==="walker"?"🏃‍♂️":"🐕"}</div>
          <div style={{ fontSize:24, fontWeight:900 }}>{p.name || "משתמש חדש"}</div>
          <div style={{ opacity:.75, marginTop:4, fontSize:14 }}>{user.role==="walker"?t.walker:t.owner}</div>
          {p.city && <div style={{ opacity:.65, fontSize:13, marginTop:4 }}>📍 {p.city}{p.hood?`, ${p.hood}`:""}</div>}
        </div>
      </GH>

      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:16, marginTop:-8 }}>
        <div className="card" style={{ padding:18 }}>
          {user.role==="walker" && <>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.expL}</span><span style={{fontSize:13,fontWeight:700}}>{p.exp||0} {t.yrs}</span></div>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.p15}</span><span style={{fontSize:13,fontWeight:700}}>{p.p15?`${t.nis}${p.p15}`:"-"}</span></div>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.p30}</span><span style={{fontSize:13,fontWeight:700}}>{p.p30?`${t.nis}${p.p30}`:"-"}</span></div>
            {p.bio && <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.bio}</span><span style={{fontSize:12,fontWeight:600,maxWidth:"60%",textAlign:"end"}}>{p.bio}</span></div>}
          </>}
          {user.role==="owner" && <>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.fCity}</span><span style={{fontSize:13,fontWeight:700}}>{p.city}</span></div>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.petSize}</span><span style={{fontSize:13,fontWeight:700}}>{p.petSize}</span></div>
            <div className="ir"><span style={{fontSize:13,color:"var(--TM)",fontWeight:600}}>{t.petAge}</span><span style={{fontSize:13,fontWeight:700}}>{p.petAge?`${p.petAge} ${t.yrs}`:"-"}</span></div>
          </>}
        </div>

        <button className="btn bp">{t.editP} ✏️</button>

        <div className="card" style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontSize:12, color:"var(--TM)", fontWeight:700 }}>
            {t.curRole}: {user.role==="walker"?t.walker:t.owner}
          </div>
          <button className="btn bg2" style={{ borderRadius:12 }}>↔ {t.switchR}</button>
          <button className="btn" style={{ background:"#F0FDF4", color:"var(--P)", border:"2px solid var(--PL)", borderRadius:12 }}>
            + {user.role==="walker"?t.addO:t.addW}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SEARCH TAB (Owner)
═══════════════════════════════════════ */
function SearchTab({ walkers, t, lang, onSel }) {
  const [ft, sF] = useState({ city:"all", gen:"all", exp:"any", pr:"any" });
  const set = (k,v) => sF(p=>({...p,[k]:v}));
  const cities = ["all", ...new Set(WALKERS_INIT.map(w=>w.city))];

  const list = walkers.filter(w => {
    if(ft.city !== "all" && w.city !== ft.city) return false;
    if(ft.gen  !== "all" && w.genE !== ft.gen)  return false;
    if(ft.exp  !== "any" && w.exp  <  parseInt(ft.exp)) return false;
    if(ft.pr   !== "any" && w.p30  >  parseInt(ft.pr))  return false;
    return true;
  });

  return (
    <div style={{ background:"var(--bg)", minHeight:"100%" }}>
      <GH pt="68px">
        <div style={{ fontSize:22, fontWeight:900 }}>{t.searchH}</div>
        <div style={{ fontSize:13, opacity:.75, marginTop:4 }}>{list.length} {t.found}</div>
      </GH>

      {/* Filter bar */}
      <div style={{ background:"#fff", padding:"12px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
        <div className="srow">
          {cities.map(c => (
            <Chip key={c} on={ft.city===c} onClick={()=>set("city",c)}>
              {c==="all"?`🌍 ${t.allC}`:`📍 ${c}`}
            </Chip>
          ))}
        </div>
        <div className="srow" style={{ marginTop:8 }}>
          {[["all",`👥 ${t.allF}`],["Female",t.gFem],["Male",t.gMal]].map(([v,l]) =>
            <Chip key={v} on={ft.gen===v} onClick={()=>set("gen",v)}>{l}</Chip>
          )}
          {[["any",`⭐ ${t.allF}`],["2",`⭐ ${t.e2}`],["5",`⭐ ${t.e5}`]].map(([v,l]) =>
            <Chip key={"e"+v} on={ft.exp===v} onClick={()=>set("exp",v)}>{l}</Chip>
          )}
          {[["any",`💰 ${t.allF}`],["50",t.pr50],["70",t.pr70]].map(([v,l]) =>
            <Chip key={"p"+v} on={ft.pr===v} onClick={()=>set("pr",v)}>{l}</Chip>
          )}
        </div>
      </div>

      {/* Walker cards */}
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14, paddingBottom:100 }}>
        {list.length===0
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"var(--TM)" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:16, fontWeight:700 }}>{t.noRes}</div>
            </div>
          : list.map((w,i) => <WalkerCard key={w.id} w={w} t={t} lang={lang} onSel={onSel} delay={i*0.05}/>)
        }
      </div>
    </div>
  );
}

function WalkerCard({ w, t, lang, onSel, delay }) {
  return (
    <button onClick={()=>onSel(w)} className="card"
      style={{
        display:"flex", flexDirection:"column", padding:18,
        border:"none", cursor:"pointer", textAlign:"inherit",
        fontFamily:"'Rubik',sans-serif", width:"100%",
        animation:`fi .4s ease ${delay}s both`, transition:"all .2s",
      }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
      onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    >
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <Av em={w.em} size={54}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:800, marginBottom:3 }}>{lang==="he"?w.name:w.nameE}</div>
          <div style={{ display:"flex", gap:4, alignItems:"center", marginBottom:4 }}>
            <Stars val={Math.round(w.rat)} size={13}/>
            <span style={{ fontSize:13, fontWeight:800, color:"#F59E0B" }}>{w.rat}</span>
            <span style={{ fontSize:11, color:"var(--TM)" }}>({w.rc})</span>
          </div>
          <div style={{ fontSize:12, color:"var(--TM)" }}>📍 {w.city}, {w.hood} · {w.exp} {t.yr}</div>
        </div>
        <div style={{ textAlign:"end" }}>
          <div style={{ fontSize:20, fontWeight:900, color:"var(--P)" }}>{t.nis}{w.p30}</div>
          <div style={{ fontSize:10, color:"var(--TM)" }}>30 {t.mn}</div>
        </div>
      </div>
      <div style={{ marginTop:10, fontSize:13, color:"var(--TM)", lineHeight:1.5, textAlign:"start" }}>
        {lang==="he"?w.bio:w.bioE}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════
   WALKER DETAIL MODAL
═══════════════════════════════════════ */
function WalkerModal({ w, t, lang, onClose, onUpdate }) {
  const [showRev, sRev] = useState(false);
  const [rt, sRT] = useState("");
  const [rs, sRS] = useState(0);

  const submit = () => {
    if(!rt || !rs) return;
    const r = { u: lang==="he"?"אתה":"You", s:rs, tx:rt, d:t.now };
    onUpdate({
      ...w,
      revs: [r, ...w.revs],
      rc: w.rc + 1,
      rat: Math.round(((w.rat*w.rc)+rs)/(w.rc+1)*10)/10,
    });
    sRT(""); sRS(0); sRev(false);
  };

  const waTxt = lang==="he"
    ? `היי ${w.name}, ראיתי את הפרופיל שלך בדוג-לי ואשמח לקבל פרטים!`
    : `Hi ${w.nameE}, I found your profile on Dog-Li and would love to connect!`;
  const waUrl = `https://wa.me/972${w.phone.replace(/\D/g,"").replace(/^0/,"")}?text=${encodeURIComponent(waTxt)}`;

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" dir={t.dir} onClick={e=>e.stopPropagation()}>
        <div className="hdl"/>

        {/* Header */}
        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
          <Av em={w.em} size={66}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:900 }}>{lang==="he"?w.name:w.nameE}</div>
            <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:4 }}>
              <Stars val={Math.round(w.rat)} size={15}/>
              <span style={{ fontWeight:800, color:"#F59E0B", fontSize:14 }}>{w.rat}</span>
              <span style={{ fontSize:12, color:"var(--TM)" }}>({w.rc})</span>
            </div>
            <div style={{ fontSize:12, color:"var(--TM)", marginTop:3 }}>📍 {w.city} · {w.exp} {t.yrs}</div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:"50%", background:"var(--bdr)",
            border:"none", cursor:"pointer", fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>

        {/* Bio */}
        <div style={{ background:"var(--bg)", borderRadius:12, padding:14, marginBottom:14, fontSize:14, lineHeight:1.6 }}>
          {lang==="he"?w.bio:w.bioE}
        </div>

        {/* Pricing */}
        <div style={{ display:"grid", gridTemplateColumns:w.p60?"1fr 1fr 1fr":"1fr 1fr", gap:8, marginBottom:14 }}>
          {[[15,w.p15],[30,w.p30],[60,w.p60]].filter(([,p])=>p).map(([mn,pr]) => (
            <div key={mn} style={{ background:"#F0FDF4", borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:"var(--TM)", marginBottom:3 }}>{mn} {t.mn}</div>
              <div style={{ fontSize:19, fontWeight:900, color:"var(--P)" }}>{t.nis}{pr}</div>
            </div>
          ))}
        </div>

        {/* WhatsApp */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block", marginBottom:14 }}>
          <button className="btn bw" style={{ width:"100%", fontSize:15, gap:10 }}>
            <span style={{ fontSize:20 }}>💬</span> {t.wa}
          </button>
        </a>

        {/* Reviews */}
        <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:16, fontWeight:800 }}>⭐ {t.revs}</div>
            <button className="btn bp bsm" onClick={()=>sRev(!showRev)}>+ {t.writeR}</button>
          </div>

          {showRev && (
            <div style={{ background:"var(--bg)", borderRadius:12, padding:14, marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--TM)", marginBottom:8 }}>{t.ratLbl}</div>
              <Stars val={rs} onChange={sRS} size={28}/>
              <div style={{ height:10 }}/>
              <textarea dir={t.dir} className="inp" placeholder={t.revPh}
                value={rt} onChange={e=>sRT(e.target.value)} style={{ marginBottom:10 }}/>
              <button className="btn bp" onClick={submit}>{t.subR} ✓</button>
            </div>
          )}

          {w.revs.map((r,i) => (
            <div key={i} style={{ padding:"11px 0", borderBottom:"1px solid var(--bdr)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontWeight:800, fontSize:14 }}>{r.u}</span>
                <span style={{ fontSize:11, color:"var(--TM)" }}>{r.d}</span>
              </div>
              <Stars val={r.s} size={13}/>
              <div style={{ fontSize:13, marginTop:5, lineHeight:1.5 }}>{r.tx}</div>
            </div>
          ))}
          <div style={{ height:20 }}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMMUNITY TAB
═══════════════════════════════════════ */
function ComTab({ posts, setPosts, t, lang }) {
  const [filter, sFilter] = useState("all");
  const [showNew, sNew] = useState(false);
  const [nType, sNT] = useState("");
  const [nTxt, sNTx] = useState("");

  const list = filter==="all" ? posts : posts.filter(p=>p.type===filter);

  const publish = () => {
    if(!nType || !nTxt) return;
    setPosts(ps => [{
      id: Date.now(), type:nType, u:lang==="he"?"אתה":"You", uE:"You",
      av:"😊", city:"תל אביב", tx:nTxt, txE:nTxt, h:0,
    }, ...ps]);
    sNTx(""); sNT(""); sNew(false);
  };

  return (
    <div style={{ background:"var(--bg)", minHeight:"100%" }}>
      <GH pt="68px">
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900 }}>{t.comH}</div>
            <div style={{ fontSize:13, opacity:.75, marginTop:3 }}>{list.length} {t.posts}</div>
          </div>
          <button className="btn ba" style={{ width:"auto", padding:"10px 16px", fontSize:13, borderRadius:12, gap:6 }}
            onClick={()=>sNew(true)}>{t.newPost}</button>
        </div>
      </GH>

      <div style={{ background:"#fff", padding:"12px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
        <div className="srow">
          {[["all",`🌍 ${t.allP}`],["t1",`${PT.t1.icon} ${t.t1}`],["t2",`${PT.t2.icon} ${t.t2}`],["t3",`${PT.t3.icon} ${t.t3}`],["t4",`${PT.t4.icon} ${t.t4}`]].map(([v,l]) =>
            <Chip key={v} on={filter===v} onClick={()=>sFilter(v)}>{l}</Chip>
          )}
        </div>
      </div>

      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12, paddingBottom:100 }}>
        {list.map((p,i) => <PostCard key={p.id} post={p} t={t} lang={lang} delay={i*0.04}/>)}
      </div>

      {showNew && (
        <div className="ov" onClick={()=>sNew(false)}>
          <div className="sheet" dir={t.dir} onClick={e=>e.stopPropagation()}>
            <div className="hdl"/>
            <div style={{ fontSize:18, fontWeight:900, marginBottom:16 }}>{t.newPost}</div>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--TM)", marginBottom:10 }}>{t.chooseT}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {["t1","t2","t3","t4"].map(tp => (
                <button key={tp} onClick={()=>sNT(tp)} style={{
                  padding:"13px 8px", border:"2px solid",
                  borderColor:nType===tp?PT[tp].tc:"var(--bdr)",
                  borderRadius:14,
                  background:nType===tp?PT[tp].bg:"#fff",
                  color:nType===tp?PT[tp].tc:"var(--TM)",
                  fontFamily:"'Rubik',sans-serif", fontSize:12, fontWeight:800,
                  cursor:"pointer", display:"flex", alignItems:"center", gap:6, justifyContent:"center",
                  transition:"all .15s",
                }}>{PT[tp].icon} {t[tp]}</button>
              ))}
            </div>
            <FG label={t.postPh}>
              <textarea dir={t.dir} className="inp" placeholder={t.postPh}
                value={nTxt} onChange={e=>sNTx(e.target.value)} style={{ minHeight:110 }}/>
            </FG>
            <div style={{ height:14 }}/>
            <button className="btn bp" onClick={publish}>{t.pub}</button>
            <div style={{ height:20 }}/>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post:p, t, lang, delay }) {
  const cfg = PT[p.type];
  const time = p.h===0 ? t.now
    : p.h ? (lang==="he"?`לפני ${p.h}ש'`:`${p.h}h ago`)
    : (lang==="he"?`לפני ${p.d}י'`:`${p.d}d ago`);

  return (
    <div className="card" style={{ padding:16, animation:`fi .4s ease ${delay}s both` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <Av em={p.av} size={38}/>
          <div>
            <div style={{ fontWeight:800, fontSize:14 }}>{lang==="he"?p.u:p.uE}</div>
            <div style={{ fontSize:11, color:"var(--TM)" }}>📍 {p.city} · {time}</div>
          </div>
        </div>
        <div style={{
          background:cfg.bg, color:cfg.tc,
          borderRadius:20, padding:"4px 10px",
          fontSize:11, fontWeight:800,
          display:"flex", alignItems:"center", gap:3, flexShrink:0,
        }}>
          {cfg.icon} {t[p.type]}
        </div>
      </div>
      <div style={{ fontSize:14, lineHeight:1.6 }}>{lang==="he"?p.tx:p.txE}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ABOUT TAB
═══════════════════════════════════════ */
function AboutTab({ t, lang }) {
  return (
    <div style={{ background:"var(--bg)", minHeight:"100%" }}>
      <GH pt="72px">
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:54, marginBottom:12 }}>🐾</div>
          <div style={{ fontSize:22, fontWeight:900 }}>{t.aboutH}</div>
        </div>
      </GH>
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:14 }}>
        <div className="card" style={{ padding:18, fontSize:14, lineHeight:1.75, color:"var(--T)" }}>
          {t.aboutTx}
        </div>
        {[[t.a11y,"♿"],[t.priv,"🔒"],[t.ctUs,"📧"],[t.terms,"📄"]].map(([lbl,ic]) => (
          <button key={lbl} className="card" style={{
            display:"flex", alignItems:"center", gap:14, padding:"15px 18px",
            border:"none", cursor:"pointer", width:"100%", fontFamily:"'Rubik',sans-serif",
            transition:"opacity .15s",
          }}>
            <span style={{ fontSize:20 }}>{ic}</span>
            <span style={{ flex:1, textAlign:"start", fontWeight:600, fontSize:14 }}>{lbl}</span>
            <span style={{ color:"var(--TM)", fontSize:18 }}>›</span>
          </button>
        ))}
        <div style={{ textAlign:"center", color:"var(--TM)", fontSize:12, padding:"8px 0" }}>
          {t.ver} · Made with ❤️ in Israel 🇮🇱
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
export default function DogLi() {
  const [lang, sLang] = useState("he");
  const [screen, sScreen] = useState("splash");
  const [role, sRole] = useState(null);
  const [profData, sProfData] = useState(null);
  const [user, sUser] = useState(null);
  const [walkers, sWalkers] = useState(WALKERS_INIT);
  const [posts, sPosts] = useState(POSTS_INIT);

  const t = T[lang];
  const toggleLang = () => sLang(l => l==="he"?"en":"he");

  return (
    <div dir={t.dir}>
      <style>{CSS}</style>
      <div className="frame">

        {/* SPLASH */}
        {screen==="splash" && (
          <Splash t={t} onDone={()=>sScreen("role")}/>
        )}

        {/* ROLE SELECT */}
        {screen==="role" && <>
          <LangFab lang={lang} onToggle={toggleLang} dir={t.dir}/>
          <RoleSelect t={t} onSelect={r=>{sRole(r);sScreen("profile")}}/>
        </>}

        {/* PROFILE SETUP */}
        {screen==="profile" && <>
          <LangFab lang={lang} onToggle={toggleLang} dir={t.dir}/>
          <ProfileSetup role={role} t={t} lang={lang} onDone={d=>{sProfData(d);sScreen("auth")}}/>
        </>}

        {/* AUTH */}
        {screen==="auth" && (
          <Auth t={t} onDone={()=>{sUser({role,profile:profData});sScreen("main")}}/>
        )}

        {/* MAIN APP */}
        {screen==="main" && (
          <MainApp
            user={user} lang={lang} t={t} onLT={toggleLang}
            walkers={walkers} setWalkers={sWalkers}
            posts={posts} setPosts={sPosts}
          />
        )}

      </div>
    </div>
  );
}
