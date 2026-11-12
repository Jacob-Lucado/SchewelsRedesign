/* Shared demo engine: cart + saved drawer, quick view, product grid, search suggest, showroom picker.
   Each concept themes it through CSS variables (--sx-*) and marks hooks with data-sx attributes. */
(function () {
  'use strict';
  var IMG = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=75'; };
  var $ = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var CATS = { living: 'Living room', bedroom: 'Bedroom', dining: 'Dining room', office: 'Home office', entertainment: 'Entertainment', mattress: 'Mattresses', appliances: 'Appliances' };
  var STYLES = ['Casual', 'Contemporary', 'Traditional', 'Transitional', 'Relaxed vintage'];

  // Sample catalog. Names, prices, and photos are stand-ins for the demo.
  var P = [
    { id: 's1', name: 'Velvet three-seat sofa', cat: 'living', style: 'Contemporary', price: 1099, img: '1555041469-a586c61ea9bc', blurb: 'Deep seats, tapered wood legs, and soft velvet in forest green.' },
    { id: 's2', name: 'Cognac leather sofa', cat: 'living', style: 'Transitional', price: 1799, img: '1549187774-b4e9b0445b41', blurb: 'Slim arms and a low profile. The leather softens the more you sit on it.' },
    { id: 's3', name: 'Rust accent sofa', cat: 'living', style: 'Casual', price: 749, img: '1567016432779-094069958ea5', blurb: 'Compact enough for apartments, comfortable enough to nap on.' },
    { id: 's4', name: 'Tufted gray sofa', cat: 'living', style: 'Traditional', price: 949, img: '1493663284031-b7e3aefcae8e', blurb: 'Button tufting and rolled arms in a gray that works with any wall color.' },
    { id: 's5', name: 'Mustard accent chair', cat: 'living', style: 'Contemporary', price: 349, img: '1586023492125-27b2c045efd7', blurb: 'A bright chair on slim wood legs for a reading corner.' },
    { id: 's6', name: 'Molded side chair', cat: 'dining', style: 'Contemporary', price: 129, img: '1592078615290-033ee584e267', blurb: 'Sold singly. Comfortable shell, wood legs, easy to wipe clean.' },
    { id: 's7', name: 'Tufted queen bed', cat: 'bedroom', style: 'Traditional', price: 1249, img: '1505693416388-ac5ce068fe85', blurb: 'A tall tufted headboard with a matching bench at the foot.' },
    { id: 's8', name: 'Platform bed with nightstand', cat: 'bedroom', style: 'Casual', price: 899, img: '1522771739844-6a9f6d5f14af', blurb: 'Low and simple, with a nightstand that has a drawer and open shelf.' },
    { id: 's9', name: 'Channel-tufted upholstered bed', cat: 'bedroom', style: 'Transitional', price: 1399, img: '1616594039964-ae9021a400a0', blurb: 'Soft channels in a light fabric. Looks as good with dark walls as light ones.' },
    { id: 's10', name: 'Wood two-door armoire', cat: 'bedroom', style: 'Relaxed vintage', price: 1099, img: '1558997519-83ea9252edf8', blurb: 'Hanging space and shelves behind two tall doors.' },
    { id: 's11', name: 'Writing desk with drawer', cat: 'office', style: 'Relaxed vintage', price: 549, img: '1611269154421-4e27233ac5c7', blurb: 'Slim enough for a spare room, with a drawer for the odds and ends.' },
    { id: 's12', name: 'Dining set for six', cat: 'dining', style: 'Transitional', price: 1299, img: '1615066390971-03e4e1c36ddf', blurb: 'A solid wood table with six cushioned chairs.' },
    { id: 's13', name: 'Dining set with velvet chairs', cat: 'dining', style: 'Contemporary', price: 1499, img: '1617806118233-18e1de247200', blurb: 'Round table, four green velvet chairs, and brass-tone legs.' },
    { id: 's14', name: 'Open storage shelf', cat: 'office', style: 'Casual', price: 329, img: '1595428774223-ef52624120d2', blurb: 'Open cubbies in a light wood finish. Mount it or stand it.' },
    { id: 's15', name: 'Front-load washer', cat: 'appliances', style: 'Casual', price: 799, img: '1626806787461-102c1bfaaea1', blurb: 'A big drum, quiet spin cycle, and stackable with the matching dryer.' },
    { id: 's16', name: 'Floating media shelf', cat: 'entertainment', style: 'Contemporary', price: 459, img: '1594026112284-02bb6f3352fe', blurb: 'Wall-mounted shelves that hold the TV, a soundbar, and the plants.' },
    { id: 's17', name: 'Medium queen mattress', cat: 'mattress', style: 'Casual', price: 999, img: '1631049307264-da0ec9d70304', blurb: 'Medium feel for most sleepers, with a 180-night trial at home.' }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });

  var STORE_RAW = [["Ahoskie", "NC", 56304], ["Altavista", "VA", 596], ["Amherst", "VA", 597], ["Appomattox", "VA", 598], ["Beckley", "WV", 56305], ["Bedford", "VA", 599], ["Blackstone", "VA", 600], ["Bristol", "VA", 601], ["Charles Town", "WV", 56307], ["Charlottesville", "VA", 602], ["Christiansburg", "VA", 603], ["Collinsville", "VA", 604], ["Covington", "VA", 605], ["Culpeper", "VA", 606], ["Danville", "VA", 607], ["Eden", "NC", 56308], ["Elizabeth City", "NC", 56399], ["Elkin", "NC", 56309], ["Emporia", "VA", 608], ["Farmville", "VA", 609], ["Franklin", "VA", 610], ["Front Royal", "VA", 612], ["Galax", "VA", 613], ["Harrisonburg", "VA", 614], ["Henderson", "NC", 56310], ["Lewisburg", "WV", 56311], ["Lexington", "VA", 615], ["Luray", "VA", 616], ["Lynchburg", "VA", 618], ["Martinsburg", "WV", 56312], ["Mount Airy", "NC", 56313], ["Orange", "VA", 619], ["Oxford", "NC", 56314], ["Princeton", "WV", 56315], ["Reidsville", "NC", 56316], ["Richlands", "VA", 620], ["Richmond (Central)", "VA", 56516, "richmond"], ["Richmond (West)", "VA", 56317, "richmond"], ["Roanoke", "VA", 621], ["Roanoke Rapids", "NC", 56318], ["Rocky Mount", "VA", 622], ["Roxboro", "NC", 645], ["Salem", "VA", 623], ["South Boston", "VA", 624], ["South Hill", "VA", 625], ["Staunton", "VA", 626], ["Suffolk", "VA", 627], ["Washington", "NC", 56487], ["Waynesboro", "VA", 628], ["Williamston", "NC", 646], ["Winchester", "VA", 629], ["Wytheville", "VA", 630]];
  var STATE = { VA: ['virginia', 'Virginia'], WV: ['westvirginia', 'West Virginia'], NC: ['northcarolina', 'North Carolina'] };
  var STORES = STORE_RAW.map(function (r) {
    return { n: r[0], st: r[1], id: r[2], full: STATE[r[1]][1], url: 'https://www.schewelshome.com/stores/' + (r[3] || r[0].toLowerCase().replace(/ /g, '-')) + '-' + STATE[r[1]][0] + '/' + r[2] };
  });

  // Cleaned-up navigation: the real categories, grouped instead of repeated.
  var NAV = [
    { t: 'Living room', l: ['Sofas', 'Sectionals', 'Recliners', 'Accent chairs', 'Coffee tables', 'TV stands'] },
    { t: 'Bedroom', l: ['Beds', 'Bedroom groups', 'Dressers', 'Nightstands', 'Kids & teens'] },
    { t: 'Dining room', l: ['Dining sets', 'Tables', 'Chairs', 'Bar stools', 'Sideboards'] },
    { t: 'Mattresses', l: ['By size', 'By comfort', 'Adjustable bases', 'Pillows & sheets'] },
    { t: 'Home office', l: ['Desks', 'Task chairs', 'Bookcases', 'Filing & storage'] },
    { t: 'Appliances', l: ['Washers & dryers', 'Refrigerators', 'Ranges', 'Dishwashers'] },
    { t: 'Electronics', l: ['TVs', 'Speakers', 'Game systems', 'Computers & tablets'] },
    { t: 'Outdoor & lawn', l: ['Patio sets', 'Firepits', 'Mowers', 'Blowers & trimmers'] }
  ];

  var KEY = 'schewels-demo-v1';
  var S = { store: null, wish: [], cart: {}, term: 24 };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || '{}'); for (var k in raw) S[k] = raw[k]; } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  var cfg = { tiers: false, term: null };
  var listeners = [];

  /* ---------- styles ---------- */
  var css = '\
:root{--sx-accent:#EA0028;--sx-accent-d:#C4001F;--sx-accent-ink:#fff;--sx-ink:#16171A;--sx-bg:#fff;--sx-soft:#F7F7F7;--sx-line:#DEE2E6;--sx-muted:#5B6168;--sx-radius:12px;--sx-btn-radius:10px;--sx-font:"Montserrat",system-ui,sans-serif;--sx-head:var(--sx-font);--sx-head-weight:700;--sx-ratio:4/3}\
.sx-btn,.sx-ghost,.sx-chip{font:600 14px/1 var(--sx-font);cursor:pointer;border-radius:var(--sx-btn-radius);transition:background .15s,color .15s,border-color .15s}\
.sx-btn{background:var(--sx-accent);color:var(--sx-accent-ink);border:2px solid var(--sx-accent);padding:12px 18px}\
.sx-btn:hover{background:var(--sx-accent-d);border-color:var(--sx-accent-d)}\
.sx-ghost{background:transparent;color:var(--sx-ink);border:2px solid var(--sx-ink);padding:11px 16px}\
.sx-ghost:hover{background:var(--sx-ink);color:var(--sx-bg)}\
.sx-chip{background:var(--sx-bg);color:var(--sx-ink);border:1.5px solid var(--sx-line);padding:9px 14px;border-radius:999px}\
.sx-chip:hover{border-color:var(--sx-ink)}.sx-chip[aria-pressed=true]{background:var(--sx-ink);color:var(--sx-bg);border-color:var(--sx-ink)}\
.sx-btn:focus-visible,.sx-ghost:focus-visible,.sx-chip:focus-visible,.sx-x:focus-visible,.sx-heart:focus-visible,.sx-img:focus-visible{outline:3px solid var(--sx-accent);outline-offset:2px}\
.sx-grid-wrap{font-family:var(--sx-font);color:var(--sx-ink)}\
.sx-bar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:22px}\
.sx-chips{display:flex;gap:8px;flex-wrap:wrap}\
.sx-sort{font:500 14px var(--sx-font);padding:9px 12px;border:1.5px solid var(--sx-line);border-radius:10px;background:var(--sx-bg);color:var(--sx-ink)}\
.sx-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}\
.sx-card{position:relative;display:flex;flex-direction:column;background:var(--sx-bg);border:1px solid var(--sx-line);border-radius:var(--sx-radius);overflow:hidden}\
.sx-img{display:block;width:100%;padding:0;border:0;background:var(--sx-soft);aspect-ratio:var(--sx-ratio);cursor:pointer;overflow:hidden}\
.sx-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}\
.sx-card:hover .sx-img img{transform:scale(1.04)}\
.sx-heart{position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.95);display:grid;place-items:center;cursor:pointer;color:var(--sx-ink);box-shadow:0 4px 14px -6px rgba(0,0,0,.4)}\
.sx-heart[aria-pressed=true]{color:var(--sx-accent)}.sx-heart[aria-pressed=true] svg{fill:currentColor}\
.sx-body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:4px;flex:1}\
.sx-tag{font:500 13px var(--sx-font);color:var(--sx-muted)}\
.sx-name{font:var(--sx-head-weight) 17px/1.25 var(--sx-head);margin:0;color:var(--sx-ink)}\
.sx-name button{all:unset;cursor:pointer}.sx-name button:hover{text-decoration:underline}\
.sx-price{font:700 18px var(--sx-font);margin-top:6px}.sx-mo{font:500 13px var(--sx-font);color:var(--sx-muted)}\
.sx-add{margin-top:12px;width:100%}\
.sx-empty{padding:40px 0;color:var(--sx-muted);text-align:center;grid-column:1/-1}\
.sx-scrim{position:fixed;inset:0;background:rgba(10,11,13,.55);z-index:900;opacity:0;pointer-events:none;transition:opacity .2s}\
.sx-scrim.on{opacity:1;pointer-events:auto}\
.sx-drawer{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--sx-bg);color:var(--sx-ink);z-index:910;display:flex;flex-direction:column;transform:translateX(104%);transition:transform .28s cubic-bezier(.2,.7,.2,1);font-family:var(--sx-font);box-shadow:-30px 0 60px -30px rgba(0,0,0,.5)}\
.sx-drawer.on{transform:none}\
.sx-dh{display:flex;justify-content:space-between;align-items:center;padding:16px 18px 0;border-bottom:1px solid var(--sx-line)}\
.sx-tabs{display:flex;gap:4px}.sx-tab{font:600 15px var(--sx-font);background:none;border:0;border-bottom:3px solid transparent;padding:10px 12px 12px;cursor:pointer;color:var(--sx-muted)}\
.sx-tab[aria-selected=true]{color:var(--sx-ink);border-color:var(--sx-accent)}\
.sx-x{width:38px;height:38px;border-radius:50%;border:0;background:var(--sx-soft);cursor:pointer;font-size:20px;line-height:1;color:var(--sx-ink)}\
.sx-db{flex:1;overflow:auto;padding:8px 18px}\
.sx-row{display:grid;grid-template-columns:76px 1fr auto;gap:14px;padding:14px 0;border-bottom:1px solid var(--sx-line);align-items:center}\
.sx-row img{width:76px;height:76px;object-fit:cover;border-radius:10px;background:var(--sx-soft)}\
.sx-row b{display:block;font:600 15px/1.3 var(--sx-font)}.sx-row small{color:var(--sx-muted);font-size:13px}\
.sx-qty{display:inline-flex;align-items:center;border:1.5px solid var(--sx-line);border-radius:999px;margin-top:8px}\
.sx-qty button{width:30px;height:30px;border:0;background:none;font-size:17px;cursor:pointer;color:var(--sx-ink)}\
.sx-qty span{min-width:22px;text-align:center;font:600 14px var(--sx-font)}\
.sx-link{background:none;border:0;color:var(--sx-muted);font:500 13px var(--sx-font);text-decoration:underline;cursor:pointer;padding:6px 0}\
.sx-df{border-top:1px solid var(--sx-line);padding:16px 18px 18px;background:var(--sx-soft)}\
.sx-line{display:flex;justify-content:space-between;font:500 15px var(--sx-font);padding:3px 0}\
.sx-line.big{font:700 20px var(--sx-font);padding-top:8px}.sx-line.save{color:var(--sx-accent);font-weight:700}\
.sx-fin{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:12px 0;padding:12px 14px;background:var(--sx-bg);border:1px solid var(--sx-line);border-radius:10px;font:500 14px var(--sx-font)}\
.sx-fin select{font:600 14px var(--sx-font);border:1.5px solid var(--sx-line);border-radius:8px;padding:6px 8px;background:var(--sx-bg);color:var(--sx-ink)}\
.sx-note{font:400 12px/1.45 var(--sx-font);color:var(--sx-muted);margin-top:10px}\
.sx-prog{height:8px;border-radius:99px;background:var(--sx-line);overflow:hidden;margin:6px 0 4px}.sx-prog i{display:block;height:100%;background:var(--sx-accent);transition:width .3s}\
.sx-empty-d{text-align:center;padding:60px 20px;color:var(--sx-muted)}.sx-empty-d b{display:block;color:var(--sx-ink);font:700 18px var(--sx-font);margin-bottom:6px}\
.sx-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-46%) scale(.98);width:min(860px,calc(100vw - 28px));max-height:calc(100vh - 28px);overflow:auto;background:var(--sx-bg);color:var(--sx-ink);z-index:920;border-radius:calc(var(--sx-radius) + 6px);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;font-family:var(--sx-font);box-shadow:0 40px 90px -30px rgba(0,0,0,.6)}\
.sx-modal.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%)}\
.sx-modal .sx-x{position:absolute;top:12px;right:12px;z-index:2}\
.sx-qv{display:grid;grid-template-columns:1.1fr 1fr}.sx-qv img{width:100%;height:100%;min-height:340px;object-fit:cover;display:block}\
.sx-qv>div{padding:34px 30px;display:flex;flex-direction:column;gap:8px}\
.sx-qv h3{font:var(--sx-head-weight) 28px/1.1 var(--sx-head);margin:0}.sx-qv p{color:var(--sx-muted);margin:6px 0;line-height:1.55;font-size:15px}\
.sx-qv .sx-price{font-size:26px}\
.sx-qrow{display:flex;gap:10px;margin-top:auto;padding-top:14px;flex-wrap:wrap}\
.sx-sm{padding:30px 26px 24px}.sx-sm h3{font:var(--sx-head-weight) 24px var(--sx-head);margin:0 0 4px}.sx-sm p{color:var(--sx-muted);margin:0 0 14px;font-size:14px}\
.sx-sm input{width:100%;font:500 16px var(--sx-font);padding:13px 14px;border:2px solid var(--sx-ink);border-radius:10px;background:var(--sx-bg);color:var(--sx-ink)}\
.sx-sm .sx-chips{margin:12px 0}\
.sx-slist{max-height:min(46vh,360px);overflow:auto;border:1px solid var(--sx-line);border-radius:10px}\
.sx-slist button{display:flex;justify-content:space-between;width:100%;text-align:left;font:600 16px var(--sx-font);padding:12px 14px;border:0;border-bottom:1px solid var(--sx-line);background:var(--sx-bg);color:var(--sx-ink);cursor:pointer}\
.sx-slist button:last-child{border-bottom:0}.sx-slist button:hover,.sx-slist button[aria-current=true]{background:var(--sx-soft)}\
.sx-slist em{font-style:normal;font-weight:500;color:var(--sx-muted);font-size:13px}\
.sx-suggest{position:fixed;z-index:880;background:var(--sx-bg);color:var(--sx-ink);border:1px solid var(--sx-line);border-radius:14px;box-shadow:0 26px 60px -24px rgba(0,0,0,.45);overflow:hidden;font-family:var(--sx-font);display:none}\
.sx-suggest.on{display:block}\
.sx-suggest h5{margin:0;padding:12px 16px 6px;font:600 13px var(--sx-font);color:var(--sx-muted)}\
.sx-suggest button{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:9px 16px;border:0;background:none;font:500 15px var(--sx-font);cursor:pointer;color:var(--sx-ink)}\
.sx-suggest button:hover,.sx-suggest button.act{background:var(--sx-soft)}\
.sx-suggest img{width:42px;height:42px;border-radius:8px;object-fit:cover}\
.sx-suggest small{margin-left:auto;color:var(--sx-muted);font-weight:600}\
.sx-toast{position:fixed;left:50%;bottom:26px;transform:translate(-50%,30px);background:var(--sx-ink);color:var(--sx-bg);padding:12px 18px;border-radius:12px;font:500 14px var(--sx-font);z-index:950;opacity:0;pointer-events:none;transition:all .25s;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);max-width:calc(100vw - 32px)}\
.sx-toast.on{opacity:1;transform:translate(-50%,0)}\
@media (max-width:1000px){.sx-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\
@media (max-width:720px){.sx-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.sx-qv{grid-template-columns:1fr}.sx-qv img{min-height:240px;max-height:300px}.sx-qv>div{padding:22px 20px}.sx-name{font-size:15px}.sx-body{padding:12px}.sx-sort{width:100%}}\
@media (prefers-reduced-motion:reduce){.sx-drawer,.sx-modal,.sx-scrim,.sx-toast,.sx-img img{transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- helpers ---------- */
  var HEART = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.3C3.5 6.6 5.6 4.6 8 4.6c1.7 0 3.3.9 4 2.4.7-1.5 2.3-2.4 4-2.4 2.4 0 4.5 2 4.5 4.7 0 6.1-8.5 11.2-8.5 11.2z"/></svg>';
  var mk = function (cls, html, tag) { var e = document.createElement(tag || 'div'); e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var monthly = function (total) { return total / (S.term || 24); };
  var cartCount = function () { return Object.keys(S.cart).reduce(function (a, k) { return a + S.cart[k]; }, 0); };
  var subtotal = function () { return Object.keys(S.cart).reduce(function (a, k) { return a + (byId[k] ? byId[k].price * S.cart[k] : 0); }, 0); };
  var qualifying = function () { return Object.keys(S.cart).reduce(function (a, k) { var p = byId[k]; return a + (p && p.cat !== 'mattress' ? p.price * S.cart[k] : 0); }, 0); };
  var TIERS = [[2000, 200], [1500, 150], [1000, 100], [500, 50]];
  var savings = function () { var q = qualifying(); for (var i = 0; i < TIERS.length; i++) if (q >= TIERS[i][0]) return TIERS[i][1]; return 0; };
  var nextTier = function () { var q = qualifying(); for (var i = TIERS.length - 1; i >= 0; i--) if (q < TIERS[i][0]) return TIERS[i]; return null; };

  var toastEl, toastT;
  function toast(msg) { if (!toastEl) { toastEl = mk('sx-toast'); toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); } toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400); }

  /* ---------- state changes ---------- */
  function changed() {
    save();
    document.querySelectorAll('[data-sx-count="cart"]').forEach(function (e) { var n = cartCount(); e.textContent = n; e.hidden = !n; });
    document.querySelectorAll('[data-sx-count="wish"]').forEach(function (e) { var n = S.wish.length; e.textContent = n; e.hidden = !n; });
    document.querySelectorAll('[data-sx-label="store"]').forEach(function (e) { e.textContent = S.store ? S.store.n.replace(/ \(.*\)/, '') + ', ' + S.store.st : (e.getAttribute('data-default') || 'Choose your showroom'); });
    document.querySelectorAll('.sx-heart').forEach(function (b) { b.setAttribute('aria-pressed', S.wish.indexOf(b.getAttribute('data-id')) > -1); });
    if (drawer && drawer.classList.contains('on')) renderDrawer();
    listeners.forEach(function (f) { try { f(S); } catch (e) {} });
  }
  function add(id, qty) { if (!byId[id]) return; S.cart[id] = (S.cart[id] || 0) + (qty || 1); changed(); toast('Added ' + byId[id].name + ' to your cart'); }
  function addMany(ids, label) { ids.forEach(function (id) { if (byId[id]) S.cart[id] = (S.cart[id] || 0) + 1; }); changed(); toast(label || ('Added ' + ids.length + ' items to your cart')); }
  function setQty(id, q) { if (q <= 0) delete S.cart[id]; else S.cart[id] = q; changed(); }
  function wish(id) { var i = S.wish.indexOf(id); if (i > -1) { S.wish.splice(i, 1); toast('Removed from saved'); } else { S.wish.push(id); toast('Saved ' + byId[id].name); } changed(); }
  function setStore(n, stt) { var s = STORES.filter(function (x) { return x.n === n && (!stt || x.st === stt); })[0]; if (s) { S.store = s; changed(); toast('Your showroom is ' + s.n.replace(/ \(.*\)/, '') + ', ' + s.st); } }

  /* ---------- scrim, drawer, modals ---------- */
  var scrim, drawer, modal, storeModal, tab = 'cart', lastFocus;
  function closeAll() { [drawer, modal, storeModal].forEach(function (e) { e && e.classList.remove('on'); }); scrim && scrim.classList.remove('on'); if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} } }
  function openLayer(el) { lastFocus = document.activeElement; scrim.classList.add('on'); el.classList.add('on'); var f = el.querySelector('input,button,select'); if (f) setTimeout(function () { f.focus(); }, 60); }

  function build() {
    scrim = mk('sx-scrim'); scrim.addEventListener('click', closeAll);
    drawer = mk('sx-drawer'); drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-label', 'Cart and saved items');
    modal = mk('sx-modal'); modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
    storeModal = mk('sx-modal'); storeModal.setAttribute('role', 'dialog'); storeModal.setAttribute('aria-modal', 'true'); storeModal.setAttribute('aria-label', 'Choose your showroom'); storeModal.style.width = 'min(520px,calc(100vw - 28px))';
    [scrim, drawer, modal, storeModal].forEach(function (e) { document.body.appendChild(e); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); hideSuggest(); } });
    storeModal.addEventListener('click', function (e) {
      var t = e.target; if (t.closest('.sx-x')) return closeAll();
      var c = t.closest('[data-s]');
      if (c) { sState = c.getAttribute('data-s'); renderStoreModal(); var i2 = storeModal.querySelector('input'); i2.focus(); return; }
      var b = t.closest('[data-n]'); if (b) { setStore(b.getAttribute('data-n'), b.getAttribute('data-st')); closeAll(); }
    });
    renderStoreModal();
  }

  function openDrawer(t) { tab = t || tab; renderDrawer(); openLayer(drawer); }
  function renderDrawer() {
    var ids = Object.keys(S.cart).filter(function (k) { return byId[k]; });
    var h = '<div class="sx-dh"><div class="sx-tabs" role="tablist"><button class="sx-tab" role="tab" data-t="cart" aria-selected="' + (tab === 'cart') + '">Cart (' + cartCount() + ')</button><button class="sx-tab" role="tab" data-t="wish" aria-selected="' + (tab === 'wish') + '">Saved (' + S.wish.length + ')</button></div><button class="sx-x" aria-label="Close">&times;</button></div><div class="sx-db">';
    if (tab === 'cart') {
      if (!ids.length) h += '<div class="sx-empty-d"><b>Your cart is empty</b>Add something from the shop and it will show up here.<br><br><button class="sx-btn" data-close>Keep shopping</button></div>';
      ids.forEach(function (id) { var p = byId[id]; h += '<div class="sx-row"><img src="' + IMG(p.img, 200) + '" alt=""><div><b>' + esc(p.name) + '</b><small>' + $(p.price) + ' each</small><br><span class="sx-qty"><button data-q="' + id + '" data-d="-1" aria-label="Fewer">&minus;</button><span>' + S.cart[id] + '</span><button data-q="' + id + '" data-d="1" aria-label="More">+</button></span></div><div style="text-align:right"><b>' + $(p.price * S.cart[id]) + '</b><br><button class="sx-link" data-rm="' + id + '">Remove</button></div></div>'; });
    } else {
      if (!S.wish.length) h += '<div class="sx-empty-d"><b>Nothing saved yet</b>Tap the heart on anything you like and it will wait here.<br><br><button class="sx-btn" data-close>Keep browsing</button></div>';
      S.wish.filter(function (k) { return byId[k]; }).forEach(function (id) { var p = byId[id]; h += '<div class="sx-row"><img src="' + IMG(p.img, 200) + '" alt=""><div><b>' + esc(p.name) + '</b><small>' + $(p.price) + '</small><br><button class="sx-link" data-wrm="' + id + '">Remove</button></div><button class="sx-btn" data-wadd="' + id + '" style="padding:10px 14px">Add</button></div>'; });
    }
    h += '</div>';
    if (tab === 'cart' && ids.length) {
      var sub = subtotal(), sv = cfg.tiers ? savings() : 0, tot = sub - sv, nt = cfg.tiers ? nextTier() : null;
      h += '<div class="sx-df">';
      if (cfg.tiers) {
        if (nt) { var q = qualifying(); h += '<div style="font:600 14px var(--sx-font)">Add ' + $(nt[0] - q) + ' more to save ' + $(nt[1]) + '</div><div class="sx-prog"><i style="width:' + Math.min(100, q / nt[0] * 100) + '%"></i></div>'; }
        else h += '<div style="font:700 14px var(--sx-font);color:var(--sx-accent)">You have the top savings tier.</div>';
      }
      h += '<div class="sx-line"><span>Subtotal</span><span>' + $(sub) + '</span></div>';
      if (cfg.tiers) h += '<div class="sx-line save"><span>Black Friday savings</span><span>&minus;' + $(sv) + '</span></div>';
      h += '<div class="sx-line big"><span>Total</span><span>' + $(tot) + '</span></div>';
      h += '<div class="sx-fin"><span>Or about <b>' + $(tot / (S.term || 24)) + '</b>/mo over</span><select aria-label="Months">' + [12, 24, 36, 48, 60].map(function (m) { return '<option' + (m === S.term ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></div>';
      h += '<button class="sx-btn" style="width:100%" data-reserve>' + (S.store ? 'Reserve at ' + esc(S.store.n.replace(/ \(.*\)/, '')) : 'Choose a showroom to reserve') + '</button>';
      h += '<p class="sx-note">Demo math only: total divided by months, before any fees or interest. Sample products and prices.' + (cfg.tiers ? ' Savings tiers shown for a sample promotion; mattresses are left out of the qualifying total. Real terms apply in store.' : '') + '</p></div>';
    }
    drawer.innerHTML = h;
  }
  drawer_click();
  function drawer_click() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      if (drawer && drawer.contains(t)) {
        if (t.closest('.sx-x') || t.closest('[data-close]')) return closeAll();
        var tb = t.closest('.sx-tab'); if (tb) { tab = tb.getAttribute('data-t'); return renderDrawer(); }
        var q = t.closest('[data-q]'); if (q) { var id = q.getAttribute('data-q'); return setQty(id, (S.cart[id] || 0) + (+q.getAttribute('data-d'))); }
        var rm = t.closest('[data-rm]'); if (rm) return setQty(rm.getAttribute('data-rm'), 0);
        var wr = t.closest('[data-wrm]'); if (wr) return wish(wr.getAttribute('data-wrm'));
        var wa = t.closest('[data-wadd]'); if (wa) return add(wa.getAttribute('data-wadd'));
        if (t.closest('[data-reserve]')) { if (!S.store) { closeAll(); return openStore(); } closeAll(); return toast('Demo: this would hold your items at ' + S.store.n.replace(/ \(.*\)/, '') + '.'); }
      }
      if (modal && modal.contains(t)) {
        if (t.closest('.sx-x')) return closeAll();
        var ma = t.closest('[data-madd]'); if (ma) { add(ma.getAttribute('data-madd')); return closeAll(); }
        var mw = t.closest('[data-mwish]'); if (mw) { wish(mw.getAttribute('data-mwish')); var on = S.wish.indexOf(mw.getAttribute('data-mwish')) > -1; mw.textContent = on ? 'Saved' : 'Save for later'; return; }
      }
    });
    document.addEventListener('change', function (e) { if (drawer && drawer.contains(e.target) && e.target.tagName === 'SELECT') { S.term = +e.target.value; changed(); } });
  }

  function openProduct(id) {
    var p = byId[id]; if (!p) return;
    var saved = S.wish.indexOf(id) > -1;
    modal.setAttribute('aria-label', p.name);
    modal.innerHTML = '<button class="sx-x" aria-label="Close">&times;</button><div class="sx-qv"><img src="' + IMG(p.img, 900) + '" alt="' + esc(p.name) + '"><div><span class="sx-tag">' + CATS[p.cat] + ' &middot; ' + p.style + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.blurb) + '</p><div class="sx-price">' + $(p.price) + '</div><div class="sx-mo">About ' + $(p.price / (S.term || 24)) + '/mo over ' + (S.term || 24) + ' months (demo math)</div><div class="sx-qrow"><button class="sx-btn" data-madd="' + id + '">Add to cart</button><button class="sx-ghost" data-mwish="' + id + '">' + (saved ? 'Saved' : 'Save for later') + '</button></div><p class="sx-note" style="margin-top:10px">' + (S.store ? 'Ask about it at ' + esc(S.store.n.replace(/ \(.*\)/, '')) + '.' : 'Pick your showroom to see what is on the floor near you.') + ' Sample product and price.</p></div></div>';
    openLayer(modal);
  }

  /* ---------- showroom picker ---------- */
  var sState = 'ALL', sQuery = '';
  function renderStoreModal() {
    storeModal.innerHTML = '<button class="sx-x" aria-label="Close">&times;</button><div class="sx-sm"><h3>Choose your showroom</h3><p>We will keep it for the rest of your visit.</p><label class="sx-sr" style="position:absolute;left:-9999px" for="sx-sq">Town</label><input id="sx-sq" placeholder="Type your town" autocomplete="off"><div class="sx-chips">' + ['ALL', 'VA', 'WV', 'NC'].map(function (k) { return '<button class="sx-chip" data-s="' + k + '" aria-pressed="' + (sState === k) + '">' + (k === 'ALL' ? 'All 52' : STATE[k][1]) + '</button>'; }).join('') + '</div><div class="sx-slist" id="sx-sl"></div></div>';
    var inp = storeModal.querySelector('input'); inp.value = sQuery;
    var fill = function () {
      var q = inp.value.trim().toLowerCase(); sQuery = inp.value;
      var m = STORES.filter(function (s) { return (sState === 'ALL' || s.st === sState) && (!q || s.n.toLowerCase().indexOf(q) > -1); });
      storeModal.querySelector('#sx-sl').innerHTML = m.length ? m.map(function (s) { return '<button data-n="' + esc(s.n) + '" data-st="' + s.st + '"' + (S.store && S.store.n === s.n ? ' aria-current="true"' : '') + '>' + esc(s.n) + '<em>' + s.full + '</em></button>'; }).join('') : '<div style="padding:20px;color:var(--sx-muted)">No showroom in &ldquo;' + esc(inp.value.trim()) + '&rdquo;. Try a nearby town.</div>';
    };
    inp.addEventListener('input', fill); fill();

  }
  function openStore() { renderStoreModal(); openLayer(storeModal); }

  /* ---------- product grid ---------- */
  var grids = [];
  function mountGrid(el) {
    var o = { cat: el.getAttribute('data-cat') || 'all', limit: +(el.getAttribute('data-limit') || 0), filters: el.getAttribute('data-filters') !== 'off', sort: 'featured', cats: (el.getAttribute('data-cats') || '').split(',').filter(Boolean), style: el.getAttribute('data-style') || '', ids: (el.getAttribute('data-ids') || '').split(',').filter(Boolean) };
    if (el._sxGrid) { Object.assign(el._sxGrid.o, o); el._sxGrid.render(); return el._sxGrid; }
    el.classList.add('sx-grid-wrap');
    var g = { el: el, o: o }; el._sxGrid = g;
    function list() {
      var a = P.filter(function (p) { return (!o.ids.length || o.ids.indexOf(p.id) > -1) && (o.cat === 'all' || p.cat === o.cat) && (!o.cats.length || o.cats.indexOf(p.cat) > -1) && (!o.style || p.style === o.style); });
      if (o.sort === 'low') a.sort(function (x, y) { return x.price - y.price; });
      if (o.sort === 'high') a.sort(function (x, y) { return y.price - x.price; });
      return o.limit ? a.slice(0, o.limit) : a;
    }
    g.render = function () {
      var present = Object.keys(CATS).filter(function (c) { return P.some(function (p) { return (!o.cats.length || o.cats.indexOf(p.cat) > -1) && p.cat === c; }); });
      var h = '';
      if (o.filters) h += '<div class="sx-bar"><div class="sx-chips" role="group" aria-label="Filter by room"><button class="sx-chip" data-f="all" aria-pressed="' + (o.cat === 'all') + '">All</button>' + present.map(function (c) { return '<button class="sx-chip" data-f="' + c + '" aria-pressed="' + (o.cat === c) + '">' + CATS[c] + '</button>'; }).join('') + '</div><label><span style="position:absolute;left:-9999px">Sort</span><select class="sx-sort"><option value="featured"' + (o.sort === 'featured' ? ' selected' : '') + '>Featured</option><option value="low"' + (o.sort === 'low' ? ' selected' : '') + '>Price: low to high</option><option value="high"' + (o.sort === 'high' ? ' selected' : '') + '>Price: high to low</option></select></label></div>';
      var a = list();
      h += '<div class="sx-grid">' + (a.length ? a.map(function (p) {
        return '<article class="sx-card"><button class="sx-img" data-open="' + p.id + '" aria-label="Quick view: ' + esc(p.name) + '"><img loading="lazy" src="' + IMG(p.img, 600) + '" alt=""></button><button class="sx-heart" data-id="' + p.id + '" aria-label="Save ' + esc(p.name) + '" aria-pressed="' + (S.wish.indexOf(p.id) > -1) + '">' + HEART + '</button><div class="sx-body"><span class="sx-tag">' + p.style + '</span><h3 class="sx-name"><button data-open="' + p.id + '">' + esc(p.name) + '</button></h3><div class="sx-price">' + $(p.price) + '</div><div class="sx-mo">est. ' + $(monthly(p.price)) + '/mo</div><button class="sx-btn sx-add" data-add="' + p.id + '">Add to cart</button></div></article>';
      }).join('') : '<div class="sx-empty">Nothing here yet. Try another room.</div>') + '</div>';
      el.innerHTML = h;
    };
    el.addEventListener('click', function (e) {
      var t = e.target;
      var f = t.closest('[data-f]'); if (f) { o.cat = f.getAttribute('data-f'); return g.render(); }
      var op = t.closest('[data-open]'); if (op) return openProduct(op.getAttribute('data-open'));
      var ad = t.closest('[data-add]'); if (ad) return add(ad.getAttribute('data-add'));
      var hh = t.closest('.sx-heart'); if (hh) return wish(hh.getAttribute('data-id'));
    });
    el.addEventListener('change', function (e) { if (e.target.classList.contains('sx-sort')) { o.sort = e.target.value; g.render(); } });
    g.render(); grids.push(g); return g;
  }
  function filter(cat, scroll) {
    var first = null; grids.forEach(function (g) { if (g.o.filters) { g.o.cat = cat; g.render(); first = first || g.el; } });
    if (scroll !== false && first) first.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- search suggest ---------- */
  var sg, sgInput, sgItems = [], sgIdx = -1;
  function hideSuggest() { if (sg) sg.classList.remove('on'); sgIdx = -1; }
  function showSuggest(inp) {
    if (!sg) { sg = mk('sx-suggest'); sg.setAttribute('role', 'listbox'); document.body.appendChild(sg); sg.addEventListener('mousedown', function (e) { e.preventDefault(); }); }
    sgInput = inp; var q = inp.value.trim().toLowerCase(); var r = inp.getBoundingClientRect();
    sg.style.left = Math.max(8, r.left) + 'px'; sg.style.top = (r.bottom + 6) + 'px'; sg.style.width = Math.min(Math.max(r.width, 340), window.innerWidth - 16) + 'px';
    var cats = Object.keys(CATS).filter(function (c) { return !q || CATS[c].toLowerCase().indexOf(q) > -1; });
    var prods = P.filter(function (p) { return !q || (p.name + ' ' + CATS[p.cat] + ' ' + p.style).toLowerCase().indexOf(q) > -1; }).slice(0, 5);
    sgItems = []; var h = '';
    if (!q) h += '<h5>Popular searches</h5>';
    else if (cats.length) h += '<h5>Rooms</h5>';
    cats.slice(0, q ? 3 : 4).forEach(function (c) { sgItems.push({ t: 'c', v: c }); h += '<button data-i="' + (sgItems.length - 1) + '"><span>' + CATS[c] + '</span><small>Shop</small></button>'; });
    if (prods.length) { h += '<h5>Products</h5>'; prods.forEach(function (p) { sgItems.push({ t: 'p', v: p.id }); h += '<button data-i="' + (sgItems.length - 1) + '"><img src="' + IMG(p.img, 100) + '" alt=""><span>' + esc(p.name) + '</span><small>' + $(p.price) + '</small></button>'; }); }
    if (!cats.length && !prods.length) h = '<h5>No match for &ldquo;' + esc(inp.value.trim()) + '&rdquo;</h5><button disabled style="cursor:default"><span style="color:var(--sx-muted)">Try &ldquo;sofa&rdquo;, &ldquo;bed&rdquo;, or &ldquo;washer&rdquo;.</span></button>';
    sg.innerHTML = h; sg.classList.add('on'); sgIdx = -1;
  }
  function pickSuggest(i) {
    var it = sgItems[i]; if (!it) return; hideSuggest();
    if (it.t === 'p') { openProduct(it.v); } else { if (grids.some(function (g) { return g.o.filters; })) filter(it.v); else toast('Demo: this would open ' + CATS[it.v] + '.'); }
    if (sgInput) sgInput.blur();
  }
  function bindSearch(inp) {
    inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-autocomplete', 'list');
    inp.addEventListener('focus', function () { showSuggest(inp); }); inp.addEventListener('input', function () { showSuggest(inp); });
    inp.addEventListener('blur', function () { setTimeout(hideSuggest, 120); });
    inp.addEventListener('keydown', function (e) {
      if (!sg || !sg.classList.contains('on')) return;
      var bs = sg.querySelectorAll('button[data-i]'); if (!bs.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); sgIdx = (sgIdx + 1) % bs.length; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sgIdx = (sgIdx - 1 + bs.length) % bs.length; }
      else if (e.key === 'Enter') { e.preventDefault(); return pickSuggest(sgIdx > -1 ? sgIdx : 0); }
      else return;
      bs.forEach(function (b, i) { b.classList.toggle('act', i === sgIdx); });
    });
    window.addEventListener('scroll', hideSuggest, { passive: true });
  }
  document.addEventListener('mousedown', function (e) { var b = e.target.closest && e.target.closest('.sx-suggest button[data-i]'); if (b) pickSuggest(+b.getAttribute('data-i')); });

  /* ---------- wire up ---------- */
  function init() {
    build();
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-sx]') : null; if (!t) return;
      var k = t.getAttribute('data-sx');
      if (k === 'cart') { e.preventDefault(); openDrawer('cart'); }
      else if (k === 'wish') { e.preventDefault(); openDrawer('wish'); }
      else if (k === 'store') { e.preventDefault(); openStore(); }
      else if (k === 'filter') { e.preventDefault(); filter(t.getAttribute('data-cat') || 'all'); }
      else if (k === 'add') { e.preventDefault(); add(t.getAttribute('data-id')); }
      else if (k === 'open') { e.preventDefault(); openProduct(t.getAttribute('data-id')); }
      else if (k === 'save') { e.preventDefault(); wish(t.getAttribute('data-id')); }
    });
    document.querySelectorAll('input[data-sx="search"]').forEach(bindSearch);
    document.querySelectorAll('[data-sx-grid]').forEach(mountGrid);
    changed();
  }

  window.SX = {
    products: P, byId: byId, cats: CATS, styles: STYLES, stores: STORES, nav: NAV, state: S, config: cfg,
    money: $, img: IMG, esc: esc, add: add, addMany: addMany, wish: wish, openProduct: openProduct, openCart: openDrawer, openStore: openStore, setStore: setStore,
    filter: filter, toast: toast, onChange: function (f) { listeners.push(f); }, mountGrid: mountGrid, bindSearch: bindSearch,
    subtotal: subtotal, savings: savings, tiers: TIERS
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
