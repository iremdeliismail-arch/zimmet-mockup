(function () {
  const SRC = window.ASSET_DB;
  const state = {
    roleKey: "support",
    route: "dashboard",
    id: null,
    q: "",
    query: {},
    toasts: [],
    modal: null,
    notifOpen: false,
    form: {},
    filters: { person: "", dept: "all", loc: "all", type: "all", status: "all", equipment: "" },
    jobFilters: { q: "", status: "all" },
    ldapQ: "",
    report: "onay-bekleyen",
    signMethod: "dijital-imza",
    serialFilters: { name: "", serial: "", code: "", warehouse: "", stock: "", status: "" },
  };

  const db = {
    employees: SRC.employees,
    packages: SRC.packages,
    logoCatalog: SRC.logoCatalog,
    jobs: SRC.jobs,
    zimmetler: SRC.zimmetler,
    assets: SRC.assets || [],
    assetTransitions: SRC.assetTransitions || [],
    approvalRules: SRC.approvalRules || [],
    approvalProcesses: SRC.approvalProcesses || [],
    permissions: SRC.permissions,
    auditLogs: SRC.auditLogs || [],
    notifications: SRC.notifications,
    warehouses: SRC.warehouses,
  };

  const STATUS_TR = {
    taslak: "Taslak",
    "sistem-destek-kontrolunde": "Sistem Destek Kontrolünde",
    "ceo-onayi-bekliyor": "Onay Bekliyor",
    "depo-hazirliginda": "Depo Hazırlığında",
    "seri-secildi": "Depo Hazırlığında",
    "sevk-irsaliyesi-olusturuldu": "Sevk Edildi",
    "merkeze-ulasti": "Sevk Edildi",
    "teknik-kontrol-bekliyor": "Teknik Kontrolde",
    "zimmet-formu-bekliyor": "Zimmet Bekliyor",
    tamamlandi: "Tamamlandı",
    "isten-ayrilis-bekliyor": "İade Bekliyor",
    "iade-kontrolunde": "Kontrol Aşamasında",
    "iade-tamamlandi": "Kontrol Aşamasında",
    "merkez-depoya-sevk": "Depoya Gönderildi",
    "yeni-kullanici-bekliyor": "İşlemde",
    "lokasyon-uyusmazligi": "İşlemde",
    "devir-tamamlandi": "Tamamlandı",
    reddedildi: "Reddedildi",
    "iptal-edildi": "İptal Edildi",
  };

  const STATUS_CLASS = {
    taslak: "st-draft",
    "sistem-destek-kontrolunde": "st-wait",
    "ceo-onayi-bekliyor": "st-ceo",
    "depo-hazirliginda": "st-depo",
    "seri-secildi": "st-reserved",
    "sevk-irsaliyesi-olusturuldu": "st-transfer",
    "merkeze-ulasti": "st-arrive",
    "teknik-kontrol-bekliyor": "st-wait",
    "zimmet-formu-bekliyor": "st-ready",
    tamamlandi: "st-assigned",
    "isten-ayrilis-bekliyor": "st-wait",
    "iade-kontrolunde": "st-wait",
    "iade-tamamlandi": "st-ready",
    "merkez-depoya-sevk": "st-transfer",
    "yeni-kullanici-bekliyor": "st-reserved",
    "lokasyon-uyusmazligi": "st-esc",
    "devir-tamamlandi": "st-assigned",
    reddedildi: "st-retired",
    "iptal-edildi": "st-cancel",
  };

  const TYPE_TR = {
    "ise-baslangic": "İşe Başlangıç",
    "isten-ayrilma": "İşten Ayrılma",
    degisim: "Değişim",
    devir: "Devir",
  };

  const PROCESS_TR = {
    "ise-baslangic": "İşe Başlangıç",
    "isten-ayrilis": "İşten Ayrılış",
    "zimmet-devri": "Zimmet Devri",
    "cihaz-degisimi": "Cihaz Değişimi",
  };

  const PROCESS_ROUTE = {
    "ise-baslangic": "ise-baslangic",
    "isten-ayrilis": "isten-ayrilis",
    "zimmet-devri": "zimmet-devri",
    "cihaz-degisimi": "cihaz-degisimi",
  };

  const ONB_STEPS = ["Personel", "Ekipman Kontrolü", "Onay", "Depo Hazırlık", "Sevk", "Teknik Kontrol", "Zimmet Formu"];
  const OFF_STEPS = ["İK Kaydı", "Kontrol Formu", "Durum Seçimi", "İade Tamamlama"];
  const TR_STEPS = ["Asset seç", "Yeni kullanıcı", "Lokasyon", "Yeni zimmet"];
  const CH_STEPS = ["Talep", "Paket kontrolü", "Onay", "Depo / Sevk", "Teknik Kontrol", "Eski cihaz", "Yeni zimmet"];

  const ICONS = {
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.2-3 3.5-4.5 7-4.5s5.8 1.5 7 4.5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2"/><path d="M3 12h12M11 8l4 4-4 4"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M8 12l2.5 2.5L16 9"/></svg>',
    pack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 9v11"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h16"/><path d="M8 16v-5M12 16V8M16 16v-8"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 16V10a6 6 0 1 1 12 0v6l2 2H4l2-2z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    asset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4v5c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V7l8-4z"/></svg>',
    log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4h12v16H6z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  };

  function user() { return SRC.roles[state.roleKey]; }
  function emp(id) { return db.employees.find((e) => e.id === id); }
  function job(id) { return db.jobs.find((j) => j.id === id); }
  function pkg(id) { return db.packages.find((p) => p.id === id); }
  function pkgByTitle(title) { return db.packages.find((p) => p.title === title && p.active); }
  function catalog(code) { return db.logoCatalog.find((c) => c.productCode === code); }
  function zimmet(id) { return db.zimmetler.find((z) => z.id === id); }

  function initials(name) {
    return String(name || "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  function escapeAttr(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function escapeHtml(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function badge(status, process, j) {
    const cls = (j && awaitingPersonnel(j)) ? "st-ceo" : (STATUS_CLASS[status] || "st-stock");
    return `<span class="badge ${cls}"><i></i>${statusLabel(status, process, j)}</span>`;
  }
  function statusLabel(status, process, j) {
    if (j && awaitingPersonnel(j)) return "Personel Onayı Bekliyor";
    if (process === "cihaz-degisimi") {
      if (status === "sistem-destek-kontrolunde") return "Talep Oluşturuldu";
      if (status === "zimmet-formu-bekliyor") return "Teslim Bekliyor";
    }
    if (process === "zimmet-devri") {
      if (status === "yeni-kullanici-bekliyor") return "İşlemde";
      if (status === "lokasyon-uyusmazligi") return "İşlemde";
      if (status === "devir-tamamlandi") return "Tamamlandı";
    }
    return STATUS_TR[status] || status;
  }
  function slaBadge(j) {
    const s = j.slaStatus || "ok";
    const lab = s === "breach" ? "SLA ihlali" : s === "risk" ? "SLA riski" : "SLA uygun";
    return `<span class="sla sla-${s}">${lab}</span>`;
  }
  function fmtMoney(n) {
    return Number(n || 0).toLocaleString("tr-TR") + " TL";
  }
  function assetBadge(st) {
    const map = {
      "In Stock": "st-stock", Reserved: "st-reserved", "In Transfer": "st-transfer",
      "Ready For Assignment": "st-ready", Assigned: "st-assigned", Returned: "st-returned",
      "Ready For Reassignment": "st-reassign", Maintenance: "st-maint", Retired: "st-retired",
      Lost: "st-lost", Stolen: "st-retired",
    };
    return `<span class="badge ${map[st] || "st-stock"}"><i></i>${escapeHtml(st)}</span>`;
  }
  function audit(entry) {
    db.auditLogs.unshift(Object.assign({
      id: "al-" + Date.now(),
      t: nowStamp(),
      who: user().name,
      result: "İşlem",
      note: "",
      from: "",
      to: "",
    }, entry));
  }
  function typeBadge(type) {
    return `<span class="badge st-draft">${TYPE_TR[type] || type}</span>`;
  }
  function go(hash) {
    const next = hash.startsWith("#") ? hash : "#/" + hash;
    if (location.hash === next) { render(); return; }
    location.hash = next;
  }
  function toast(msg, kind) {
    const id = Date.now();
    state.toasts.push({ id, msg, kind: kind || "ok" });
    render();
    setTimeout(() => {
      state.toasts = state.toasts.filter((t) => t.id !== id);
      render();
    }, 2800);
  }
  function parseRoute() {
    const raw = (location.hash || "#/dashboard").replace(/^#/, "");
    const qIndex = raw.indexOf("?");
    const pathPart = (qIndex >= 0 ? raw.slice(0, qIndex) : raw).replace(/^\/+/, "");
    const queryPart = qIndex >= 0 ? raw.slice(qIndex + 1) : "";
    const parts = pathPart.split("/").filter(Boolean);
    state.route = parts[0] || "dashboard";
    state.id = parts[1] || null;
    state.query = {};
    if (queryPart) {
      queryPart.split("&").forEach((pair) => {
        const [k, v] = pair.split("=");
        if (k) state.query[decodeURIComponent(k)] = decodeURIComponent(v || "");
      });
    }
  }
  function nowStamp() {
    return "2026-08-19 " + new Date().toTimeString().slice(0, 5);
  }
  function addHist(j, ev, note) {
    j.history = j.history || [];
    j.history.push({ t: nowStamp(), who: user().name, ev, note: note || "" });
  }
  function jobHref(j) {
    return `#/${PROCESS_ROUTE[j.process]}/${j.id}`;
  }
  function needsCeo(j) {
    return (j.items || []).some((it) => it.extra || it.inPackage === false);
  }
  function allSerials(j) {
    return (j.items || []).every((it) => it.serial && it.serial !== "—");
  }
  function takenSerials(exceptIid) {
    const used = new Set();
    db.jobs.forEach((j) => (j.items || []).forEach((it) => {
      if (it.serial && it.serial !== "—" && it.id !== exceptIid) used.add(it.serial);
    }));
    db.zimmetler.forEach((z) => {
      if (z.serial && z.serial !== "—") used.add(z.serial);
    });
    return used;
  }
  function serialRowsFor(it) {
    if (!it) return [];
    const c = catalog(it.productCode);
    const taken = takenSerials(it.id);
    const rows = [];
    const push = (row) => {
      if (!row.serial || rows.some((r) => r.serial === row.serial)) return;
      rows.push(row);
    };
    if (c) {
      (c.serials || []).forEach((s) => push({
        serial: s,
        name: c.name,
        productCode: c.productCode,
        stockCode: c.stockCode,
        warehouse: c.warehouse,
        qty: c.qty,
        stockStatus: c.qty > 0 ? "Stokta" : "Stokta Yok",
        brand: c.brand || "",
        model: c.model || "",
      }));
    }
    db.assets.filter((a) => a.productCode === it.productCode && ["In Stock", "Ready For Reassignment"].includes(a.status)).forEach((a) => {
      const cat = catalog(a.productCode) || c;
      push({
        serial: a.serial,
        name: a.name,
        productCode: a.productCode,
        stockCode: cat ? cat.stockCode : "",
        warehouse: a.warehouse && a.warehouse !== "—" ? a.warehouse : (cat ? cat.warehouse : "IT Deposu"),
        qty: cat ? cat.qty : 1,
        stockStatus: "Stokta",
        brand: a.brand || "",
        model: a.model || "",
      });
    });
    return rows.filter((r) => !taken.has(r.serial) || r.serial === it.serial);
  }
  function defaultChecks() {
    return {
      physical: [
        { id: "p1", label: "Ürün modeli doğrulandı", done: false },
        { id: "p2", label: "Seri numarası doğrulandı", done: false },
        { id: "p3", label: "Donanım bileşenleri doğrulandı", done: false },
        { id: "p4", label: "Hasar kontrolü yapıldı — hasar yok", done: false },
        { id: "p5", label: "Aksesuar kontrolü — aksesuarlar tam", done: false },
        { id: "p6", label: "Çalışabilirlik kontrolü uygun", done: false },
      ],
      technical: [
        { id: "t1", label: "İşletim sistemi kurulumu", done: false },
        { id: "t2", label: "Domain üyeliği", done: false },
        { id: "t3", label: "Kurumsal uygulamaların kurulumu", done: false },
        { id: "t4", label: "Güvenlik yazılımlarının kurulumu", done: false },
        { id: "t5", label: "Politika ve güncelleme kontrolleri", done: false },
      ],
    };
  }
  function ensureChecks(j) {
    if (!j.checks) j.checks = defaultChecks();
    return j.checks;
  }
  function checksDone(j) {
    const c = j.checks;
    if (!c) return false;
    return [...c.physical, ...c.technical].every((x) => x.done);
  }
  function nextJobNo(prefix) {
    const n = 20 + db.jobs.length;
    return `${prefix}-2026-00${n}`;
  }

  function contextFor(j) {
    const e = emp(j.employeeId);
    const map = {
      taslak: ["Taslak", "İşe giriş ve cihaz teslim tarihini tamamlayın", "Sistem Destek kontrolü", "İnsan Kaynakları"],
      "sistem-destek-kontrolunde": ["Sistem Destek Kontrolünde", "Paket ve Logo stok kontrolü yapın", needsCeo(j) ? "Onay Bekliyor" : "Depo Hazırlığında", needsCeo(j) ? "CO / CEO" : "—"],
      "ceo-onayi-bekliyor": ["Onay Bekliyor", "Paket dışı talebi değerlendirin", "Onaylanırsa depo hazırlığı", "CO / CEO"],
      "depo-hazirliginda": ["Depo Hazırlığında", "Seri numaralarını Logo ERP'den seçin", "Sevk irsaliyesi", "Depo Sorumlusu"],
      "seri-secildi": ["Depo Hazırlığında", "Sevk irsaliyesi oluşturun", "Sevk Edildi", "Depo Sorumlusu"],
      "sevk-irsaliyesi-olusturuldu": ["Sevk Edildi", "Genel merkeze ulaşmayı bekleyin", "Teknik kontrol", "—"],
      "merkeze-ulasti": ["Sevk Edildi", "Teslim alıp teknik kontrole geçin", "Teknik Kontrolde", "Sistem Destek Uzmanı"],
      "teknik-kontrol-bekliyor": ["Teknik Kontrolde", "Uygun veya hasarlı sonucu verin", "Uygunsa zimmet formu", "Sistem Destek Uzmanı"],
      "zimmet-formu-bekliyor": ["Zimmet Bekliyor", "Zimmet formunu oluşturup personele gönderin", "Personel onayı", "Sistem Destek Uzmanı"],
      tamamlandi: ["Tamamlandı", "İşlem yok", "—", "—"],
      reddedildi: ["Reddedildi", "Talebi güncelleyin veya iptal edin — süreç Destek'te devam eder", "Yeniden onaya / depoya gönder", "Sistem Destek Uzmanı"],
      "iptal-edildi": ["İptal Edildi", "Süreç sonlandırıldı", "—", "—"],
      "isten-ayrilis-bekliyor": ["İade Bekliyor", "Aktif zimmetleri teslim alıp kontrole alın", "Kontrol Aşamasında", "Sistem Destek Uzmanı"],
      "iade-kontrolunde": ["Kontrol Aşamasında", "Checklist ve durum seçin, İade Tamamla", "Depoya Gönderildi", "Sistem Destek Uzmanı"],
      "iade-tamamlandi": ["Kontrol Aşamasında", "İade Tamamla ile sevk otomatik oluşur", "Depoya Gönderildi", "Sistem Destek Uzmanı"],
      "merkez-depoya-sevk": ["Depoya Gönderildi", "Logo ERP merkez depo sevki başladı", "Tamamlandı", "—"],
      "yeni-kullanici-bekliyor": ["İşlemde", "Aynı lokasyondaki yeni kullanıcıyı seçin", "Yeni zimmet formu", "Sistem Destek Uzmanı"],
      "lokasyon-uyusmazligi": ["İşlemde", "Devir yalnızca aynı lokasyonda yapılabilir", "Kullanıcıyı değiştirin", "Sistem Destek Uzmanı"],
      "devir-tamamlandi": ["Tamamlandı", "Eski zimmet kapandı, yeni zimmet oluştu", "—", "—"],
    };
    const row = map[j.status] || [STATUS_TR[j.status] || j.status, "—", "—", "—"];
    if (awaitingPersonnel(j)) {
      return {
        now: j.process === "cihaz-degisimi" ? "Teslim Bekliyor" : "Zimmet Bekliyor",
        expected: j.signMethod === "elektronik-onay" ? "Elektronik onay verin" : j.signMethod === "pdf" ? "PDF imzasını tamamlayın" : "Dijital imza atın",
        next: "Tamamlandı",
        waiting: e ? e.name : "Teslim alan",
        person: e ? e.name : "",
      };
    }
    return {
      now: row[0],
      expected: row[1],
      next: row[2],
      waiting: row[3],
      person: e ? e.name : "",
    };
  }

  function stepIndex(j) {
    if (j.process === "ise-baslangic" || j.process === "cihaz-degisimi") {
      const map = {
        taslak: 0,
        "sistem-destek-kontrolunde": 1,
        reddedildi: 1,
        "ceo-onayi-bekliyor": 2,
        "depo-hazirliginda": 3,
        "seri-secildi": 3,
        "sevk-irsaliyesi-olusturuldu": 4,
        "merkeze-ulasti": 4,
        "teknik-kontrol-bekliyor": 5,
        "zimmet-formu-bekliyor": j.process === "cihaz-degisimi" ? 6 : 6,
        tamamlandi: 6,
        "iptal-edildi": 0,
      };
      return map[j.status] ?? 0;
    }
    if (j.process === "isten-ayrilis") {
      const m = { "isten-ayrilis-bekliyor": 0, "iade-kontrolunde": 1, "iade-tamamlandi": 2, "merkez-depoya-sevk": 3, tamamlandi: 3 };
      return m[j.status] ?? 0;
    }
    if (j.process === "zimmet-devri") {
      const m = { "yeni-kullanici-bekliyor": 1, "lokasyon-uyusmazligi": 2, "devir-tamamlandi": 3, tamamlandi: 3 };
      return m[j.status] ?? 0;
    }
    return 0;
  }

  function awaitingPersonnel(j) {
    return !!(j && j.formNo && !j.signedAt && (j.status === "zimmet-formu-bekliyor" || (j.process === "zimmet-devri" && j.formNo && j.status !== "devir-tamamlandi" && j.status !== "tamamlandi")));
  }
  function signMethodLabel(m) {
    return m === "dijital-imza" ? "Dijital imza" : m === "elektronik-onay" ? "Elektronik onay" : "PDF çıktısı";
  }
  function jobsOf(process) {
    return db.jobs.filter((j) => j.process === process);
  }
  function myNotifs() {
    const role = user().role;
    return db.notifications.filter((n) => !n.roles || n.roles.includes(role) || role === "admin");
  }
  function countStatus(process, statuses) {
    return db.jobs.filter((j) => (!process || j.process === process) && statuses.includes(j.status)).length;
  }

  function crumb(items) {
    return `<div class="crumb">${items.map((it, i) => i === items.length - 1
      ? `<span>${it.t}</span>`
      : `<a href="${it.h}">${it.t}</a><span class="sep">/</span>`).join("")}</div>`;
  }
  function stepper(steps, current) {
    return `<div class="stepper">${steps.map((s, i) => {
      const cls = i < current ? "done" : i === current ? "now" : "";
      return `<div class="step ${cls}"><div class="n">${i < current ? "✓" : i + 1}</div><div class="lbl">${s}</div></div>`;
    }).join("")}</div>`;
  }
  function pageHead(title, lead, actions) {
    return `<div class="page-head"><div>
      <h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}</div>
      <div class="actions">${actions || ""}</div></div>`;
  }
  function integBar() {
    return `<div class="integ-bar">
      <span class="integ-pill"><i class="dot"></i>LDAP senkron aktif</span>
      <span class="integ-pill"><i class="dot"></i>Logo ERP bağlantısı aktif</span>
    </div>`;
  }
  function nowBox(j) {
    const c = contextFor(j);
    return `<div class="now-box">
      <div><small>Şu an hangi aşamadayım?</small><b>${escapeHtml(c.now)}</b></div>
      <div><small>Benden ne bekleniyor?</small><b>${escapeHtml(c.expected)}</b></div>
      <div><small>Sıradaki adım</small><b>${escapeHtml(c.next)}</b></div>
      <div><small>Kimden onay bekleniyor?</small><b>${escapeHtml(c.waiting)}</b></div>
    </div>`;
  }
  function personBlock(e, extra) {
    if (!e) return "";
    return `<div class="card mb-12"><div class="card-b">
      <div class="ldap-banner"><div>🔗</div><div>
        <b>LDAP'tan güncel personel bilgileri getirildi</b>
        <span class="muted">Dizin senkronu · manuel personel kaydı yok</span>
      </div></div>
      <div class="person-card">
        <div class="avatar">${initials(e.name)}</div>
        <div>
          <b>${escapeHtml(e.name)}</b>
          <div class="muted">${escapeHtml(e.title)} · ${escapeHtml(e.dept)}</div>
          <dl class="dl mt-12">
            <dt>Sicil no</dt><dd>${escapeHtml(e.sicil)}</dd>
            <dt>Yönetici</dt><dd>${escapeHtml(e.manager)}</dd>
            <dt>Lokasyon</dt><dd>${escapeHtml(e.location)}</dd>
            <dt>E-posta</dt><dd>${escapeHtml(e.email)}</dd>
            <dt>İşe başlama</dt><dd>${escapeHtml(e.startDate || "—")}</dd>
            ${e.leaveDate ? `<dt>İşten ayrılma</dt><dd>${escapeHtml(e.leaveDate)}</dd>` : ""}
          </dl>
          ${extra || ""}
        </div>
      </div>
    </div></div>`;
  }
  function historyList(j) {
    const list = (j.history || []).slice().reverse();
    if (!list.length) return "";
    return `<div class="card"><div class="card-h"><h3>Süreç geçmişi</h3></div><div class="card-b">
      <ul class="timeline">${list.map((h) => `<li>
        <div class="when">${escapeHtml(h.t)} · ${escapeHtml(h.who)}</div>
        <div class="what">${escapeHtml(h.ev)}${h.note ? `<div class="muted">${escapeHtml(h.note)}</div>` : ""}</div>
      </li>`).join("")}</ul>
    </div></div>`;
  }
  function stockBadge(it) {
    if (it.stockStatus === "yok" || it.stockQty === 0) return `<span class="stock-no">Stokta Yok</span>`;
    return `<span class="stock-ok">Stokta</span>`;
  }

  function itemsTable(j, mode) {
    const p = pkg(j.packageId);
    const rows = (j.items || []).map((it) => {
      const extra = it.extra || it.inPackage === false;
      const c = catalog(it.productCode);
      const actions = [];
      if (mode === "support") {
        if (it.stockStatus === "yok" || it.stockQty === 0) {
          actions.push(`<button class="btn btn-sm" data-act="open-alt" data-iid="${it.id}">Alternatif Ekipman Seç</button>`);
        }
      }
      if (mode === "warehouse" && !it.serial) {
        actions.push(`<button class="btn btn-sm btn-primary" data-act="open-serial" data-iid="${it.id}">Seri Seç</button>`);
      }
      if (mode === "warehouse" && it.serial) {
        actions.push(`<button class="btn btn-sm" data-act="open-serial" data-iid="${it.id}">Seri Değiştir</button>`);
      }
      return `<tr>
        <td><b>${escapeHtml(it.equipment)}</b>
          ${extra ? `<span class="tag extra">Paket dışı</span>` : `<span class="tag">Paket</span>`}
          ${it.alternativeOf ? `<span class="tag alt">Alternatif</span>` : ""}
          ${extra ? `<div class="mini-note">Onay gerekli — CO / CEO</div>` : ""}
          ${it.alternativeOf ? `<div class="mini-note">${escapeHtml(it.alternativeOf)} yerine</div>` : ""}
        </td>
        <td class="mono">${escapeHtml(it.productCode || it.stockCode)}</td>
        <td>${escapeHtml(it.name)}
          <div class="muted">${escapeHtml(c ? (c.brand + " · " + c.model) : "")}</div></td>
        <td>${escapeHtml(it.warehouse || (c && c.warehouse) || "IT Deposu")}</td>
        <td class="mono">${escapeHtml(it.serial || "—")}</td>
        <td>${stockBadge(it)}<div class="muted">Logo · ${it.stockQty ?? "—"} adet</div></td>
        <td>${actions.join(" ") || "—"}</td>
      </tr>`;
    }).join("");
    return `<div class="card mb-12"><div class="card-h"><h3>Ekipman listesi</h3>
      <span class="integ-pill"><i class="dot"></i>Logo ERP stok</span></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Ekipman</th><th>Ürün Kodu</th><th>Ürün / Marka / Model</th><th>Depo</th><th>Seri No</th><th>Stok Durumu</th><th>Aksiyon</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div>`;
  }

  function warehouseTable(j) {
    const rows = (j.items || []).map((it) => `<tr>
      <td><b>${escapeHtml(it.equipment)}</b><div class="muted">${escapeHtml(it.name)}</div></td>
      <td class="mono">${escapeHtml(it.stockCode)}</td>
      <td class="right">${it.stockQty ?? "—"}</td>
      <td>${escapeHtml(it.warehouse || "IT Deposu")}</td>
      <td class="mono">${escapeHtml(it.serial || "—")}</td>
      <td>${it.serial
        ? `<button class="btn btn-sm" data-act="open-serial" data-iid="${it.id}">Seri Değiştir</button>`
        : `<button class="btn btn-sm btn-primary" data-act="open-serial" data-iid="${it.id}">Seri Seç</button>`}</td>
    </tr>`).join("");
    return `<div class="logo-banner"><div>📦</div><div>
      <b>Ürün ve stok bilgileri Logo ERP entegrasyonu üzerinden gelir</b>
      <span class="muted">IT Deposu · canlı stok</span>
    </div></div>
    <div class="card mb-12"><div class="card-h"><h3>Depo listesi</h3></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Ekipman</th><th>Stok Kodu</th><th class="right">Stok</th><th>Depo</th><th>Seri No</th><th>Aksiyon</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div>`;
  }

  function navItems() {
    const role = user().role;
    const nOnb = countStatus("ise-baslangic", ["sistem-destek-kontrolunde", "merkeze-ulasti", "teknik-kontrol-bekliyor", "zimmet-formu-bekliyor", "taslak", "reddedildi"]);
    const nOff = countStatus("isten-ayrilis", ["isten-ayrilis-bekliyor", "iade-kontrolunde"]);
    const nCh = countStatus("cihaz-degisimi", ["sistem-destek-kontrolunde", "ceo-onayi-bekliyor"]);
    const nAppr = db.jobs.filter((j) => {
      if (role === "personnel") return awaitingPersonnel(j);
      if (role === "ceo" || role === "admin") return j.status === "ceo-onayi-bekliyor" || awaitingPersonnel(j);
      if (role === "support") return ["sistem-destek-kontrolunde", "reddedildi"].includes(j.status) || awaitingPersonnel(j);
      return false;
    }).length;
    const nWh = countStatus(null, ["depo-hazirliginda", "seri-secildi"]);
    const all = [
      { group: "İş Yönetimi", items: [
        { id: "dashboard", href: "#/dashboard", label: "Özet", icon: "dash", roles: ["support", "warehouse", "ceo", "hr", "admin", "personnel"] },
        { id: "islerim", href: "#/islerim", label: "İş Listesi", icon: "list", roles: ["support", "warehouse", "ceo", "hr", "admin", "personnel"] },
        { id: "onaylarim", href: "#/onaylarim", label: "Onaylarım", icon: "check", n: nAppr, roles: ["support", "ceo", "admin", "personnel"] },
      ]},
      { group: "Süreçler", items: [
        { id: "zimmetler", href: "#/zimmetler", label: "Zimmet Kayıtları", icon: "file", roles: ["support", "warehouse", "ceo", "hr", "admin"] },
        { id: "ise-baslangic", href: "#/ise-baslangic", label: "İşe Başlangıç", icon: "user", n: nOnb, roles: ["support", "warehouse", "hr", "admin"] },
        { id: "isten-ayrilis", href: "#/isten-ayrilis", label: "İşten Ayrılış", icon: "out", n: nOff, roles: ["support", "hr", "admin"] },
        { id: "zimmet-devri", href: "#/zimmet-devri", label: "Zimmet Devri", icon: "swap", roles: ["support", "admin"] },
        { id: "cihaz-degisimi", href: "#/cihaz-degisimi", label: "Cihaz Değişimi", icon: "swap", n: nCh, roles: ["support", "warehouse", "ceo", "admin"] },
        { id: "depo", href: "#/depo", label: "Depo Hazırlık", icon: "box", n: nWh, roles: ["support", "warehouse", "admin"] },
        { id: "assetler", href: "#/assetler", label: "Assetler", icon: "asset", roles: ["support", "warehouse", "admin"] },
      ]},
      { group: "Tanımlar", items: [
        { id: "paketler", href: "#/paketler", label: "Ekipman Paketleri", icon: "pack", roles: ["support", "admin"] },
        { id: "onay-kurallari", href: "#/onay-kurallari", label: "Onay Kuralları", icon: "shield", roles: ["admin"] },
        { id: "yetkiler", href: "#/yetkiler", label: "Yetkilendirme", icon: "shield", roles: ["admin"] },
      ]},
      { group: "İzleme", items: [
        { id: "raporlar", href: "#/raporlar", label: "Raporlar", icon: "chart", roles: ["support", "ceo", "admin", "hr", "warehouse"] },
        { id: "audit", href: "#/audit", label: "Audit Log", icon: "log", roles: ["admin", "support"] },
      ]},
    ];
    return all.map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) })).filter((g) => g.items.length);
  }

  function layout(inner) {
    const u = user();
    const unread = myNotifs().filter((n) => n.unread).length;
    const nav = navItems().map((g) => `
      <div class="nav-section">${g.group}</div>
      ${g.items.map((it) => `<a class="${state.route === it.id ? "active" : ""}" href="${it.href}">${ICONS[it.icon]}${it.label}${it.n ? `<span class="badge-n">${it.n}</span>` : ""}</a>`).join("")}
    `).join("");
    return `<div class="app">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">ZM</div>
          <div><h1>Zimmet Yönetimi</h1><p>IT Asset · LDAP · Logo ERP</p></div>
        </div>
        <nav class="nav">${nav}</nav>
        <div class="sidebar-foot">LDAP dizin · Logo ERP stok ve irsaliye</div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="search">${ICONS.search}<input id="global-search" placeholder="Personel, zimmet no, seri, süreç…" value="${escapeAttr(state.q)}" /></div>
          <div class="topbar-actions">
            <select class="role-select" id="role-switch">
              ${Object.entries(SRC.roles).map(([k, r]) => `<option value="${k}" ${k === state.roleKey ? "selected" : ""}>${r.roleLabel} — ${r.name}</option>`).join("")}
            </select>
            <button class="icon-btn" data-act="toggle-notif" title="Bildirimler">${ICONS.bell}${unread ? '<span class="dot"></span>' : ""}</button>
            ${state.notifOpen ? notifPanel() : ""}
            <div class="user-chip">
              <div><b>${u.name}</b><small>${u.title}</small></div>
              <div class="avatar">${initials(u.name)}</div>
            </div>
          </div>
        </header>
        <div class="page wide">${inner}</div>
      </div>
    </div>
    <div class="toast-wrap">${state.toasts.map((t) => `<div class="toast ${t.kind}">${t.msg}</div>`).join("")}</div>
    ${state.modal ? renderModal() : ""}`;
  }

  function notifPanel() {
    return `<div class="notif-pop" id="notif-pop">
      <div class="card-h"><h3>Bildirimler</h3></div>
      ${myNotifs().map((n) => `<a class="item ${n.unread ? "unread" : ""}" href="${n.to}" data-act="read-notif" data-nid="${n.id}">
        <b style="font-size:13px">${escapeHtml(n.title)}</b>
        <div class="muted" style="font-size:12px">${escapeHtml(n.body)} · ${escapeHtml(n.t)}</div>
      </a>`).join("")}
    </div>`;
  }

  /* ---------- pages ---------- */
  function pageDashboard() {
    const role = user().role;
    const slaRisk = (statuses) => db.jobs.filter((j) => statuses.includes(j.status) && (j.slaStatus === "risk" || j.slaStatus === "breach")).length;
    const critOf = (n) => Math.min(n, Math.max(0, Math.round(n * 0.25)));
    const work = [];
    const pushW = (label, statuses, href, process) => {
      const n = countStatus(process || null, statuses);
      work.push({ label, n, crit: critOf(n), sla: slaRisk(statuses), href });
    };
    if (role === "support" || role === "admin") {
      pushW("Sistem Destek Onayı Bekleyen", ["sistem-destek-kontrolunde", "reddedildi", "taslak"], "#/ise-baslangic");
      pushW("CO / CEO Onayı Bekleyen", ["ceo-onayi-bekliyor"], "#/onaylarim");
      pushW("Depo İşlemi Bekleyen", ["depo-hazirliginda", "seri-secildi"], "#/depo");
      pushW("Merkeze Gelen Ekipmanlar", ["merkeze-ulasti", "sevk-irsaliyesi-olusturuldu"], "#/ise-baslangic");
      pushW("Teknik Kontrol Bekleyen", ["teknik-kontrol-bekliyor"], "#/ise-baslangic");
      pushW("Zimmet Formu Bekleyen", db.jobs.filter((j) => j.status === "zimmet-formu-bekliyor" && !j.formNo).map((j) => j.status), "#/ise-baslangic");
      work[work.length - 1].n = db.jobs.filter((j) => j.status === "zimmet-formu-bekliyor" && !j.formNo).length;
      work[work.length - 1].crit = critOf(work[work.length - 1].n);
      work[work.length - 1].sla = db.jobs.filter((j) => j.status === "zimmet-formu-bekliyor" && !j.formNo && (j.slaStatus === "risk" || j.slaStatus === "breach")).length;
      const nPers = db.jobs.filter((j) => awaitingPersonnel(j)).length;
      work.push({ label: "Personel Zimmet Onayı Bekleyen", n: nPers, crit: critOf(nPers), sla: 0, href: "#/onaylarim" });
      pushW("İşten Ayrılış İade Bekleyen", ["isten-ayrilis-bekliyor", "iade-kontrolunde"], "#/isten-ayrilis");
      pushW("Cihaz Değişim Talepleri", jobsOf("cihaz-degisimi").filter((j) => !["tamamlandi", "iptal-edildi"].includes(j.status)).map((j) => j.status), "#/cihaz-degisimi");
      work[work.length - 1].n = jobsOf("cihaz-degisimi").filter((j) => !["tamamlandi", "iptal-edildi"].includes(j.status)).length;
      work[work.length - 1].crit = critOf(work[work.length - 1].n);
      work[work.length - 1].sla = jobsOf("cihaz-degisimi").filter((j) => j.slaStatus === "risk" || j.slaStatus === "breach").length;
    } else if (role === "warehouse") {
      pushW("Seri seçilecek", ["depo-hazirliginda"], "#/depo");
      pushW("İrsaliye bekleyen", ["seri-secildi"], "#/depo");
      pushW("Sevk edilen", ["sevk-irsaliyesi-olusturuldu", "merkeze-ulasti", "merkez-depoya-sevk"], "#/depo");
    } else if (role === "ceo") {
      pushW("Paket dışı onayınız", ["ceo-onayi-bekliyor"], "#/onaylarim");
      pushW("SLA riski olan onaylar", db.jobs.filter((j) => j.status === "ceo-onayi-bekliyor" && j.slaStatus !== "ok").map((j) => j.status), "#/onaylarim");
      work[work.length - 1].n = db.jobs.filter((j) => j.status === "ceo-onayi-bekliyor" && j.slaStatus !== "ok").length;
      work[work.length - 1].crit = work[work.length - 1].n;
      work[work.length - 1].sla = work[work.length - 1].n;
    } else if (role === "hr") {
      pushW("İşe başlangıç kuyruğu", jobsOf("ise-baslangic").filter((j) => j.status !== "tamamlandi" && j.status !== "iptal-edildi").map((j) => j.status), "#/ise-baslangic");
      work[0].n = jobsOf("ise-baslangic").filter((j) => j.status !== "tamamlandi" && j.status !== "iptal-edildi").length;
      work[0].crit = countStatus("ise-baslangic", ["taslak"]);
      work[0].sla = 0;
      pushW("İşten ayrılış", ["isten-ayrilis-bekliyor", "iade-kontrolunde"], "#/isten-ayrilis");
    } else if (role === "personnel") {
      const n = db.jobs.filter((j) => awaitingPersonnel(j)).length;
      work.push({ label: "Zimmet onayınızı bekleyen", n, crit: n, sla: 0, href: "#/onaylarim" });
    }
    const kpis = [
      { l: "Toplam aktif zimmet", n: db.zimmetler.filter((z) => z.status === "tamamlandi").length + db.assets.filter((a) => a.status === "Assigned").length, href: "#/zimmetler" },
      { l: "Bekleyen onay", n: countStatus(null, ["ceo-onayi-bekliyor"]) + db.jobs.filter((j) => awaitingPersonnel(j)).length, href: "#/onaylarim", alert: true },
      { l: "Teknik kontrol bekleyen", n: countStatus(null, ["teknik-kontrol-bekliyor"]), href: "#/ise-baslangic" },
      { l: "Bekleyen iade", n: countStatus("isten-ayrilis", ["isten-ayrilis-bekliyor", "iade-kontrolunde"]), href: "#/isten-ayrilis" },
      { l: "Bekleyen cihaz değişimi", n: jobsOf("cihaz-degisimi").filter((j) => !["tamamlandi", "iptal-edildi"].includes(j.status)).length, href: "#/cihaz-degisimi" },
      { l: "Bekleyen sevkiyat", n: countStatus(null, ["depo-hazirliginda", "seri-secildi"]), href: "#/depo" },
      { l: "Stokta bulunmayan", n: db.jobs.reduce((n, j) => n + (j.items || []).filter((i) => i.stockStatus === "yok" || i.stockQty === 0).length, 0), href: "#/raporlar" },
      { l: "SLA ihlali olan kayıt", n: db.jobs.filter((j) => j.slaStatus === "breach" || j.slaStatus === "risk").length, href: "#/onaylarim", alert: true },
    ];
    const tasks = [];
    db.jobs.forEach((j) => {
      const e = emp(j.employeeId);
      const c = contextFor(j);
      const mine =
        (role === "support" && ["sistem-destek-kontrolunde", "reddedildi", "merkeze-ulasti", "teknik-kontrol-bekliyor", "zimmet-formu-bekliyor", "isten-ayrilis-bekliyor", "iade-kontrolunde", "yeni-kullanici-bekliyor", "taslak"].includes(j.status) && !awaitingPersonnel(j)) ||
        (role === "warehouse" && ["depo-hazirliginda", "seri-secildi"].includes(j.status)) ||
        (role === "ceo" && j.status === "ceo-onayi-bekliyor") ||
        (role === "hr" && ["isten-ayrilis-bekliyor", "taslak"].includes(j.status)) ||
        (role === "personnel" && awaitingPersonnel(j));
      if (mine) tasks.push({ t: `${e ? e.name : ""} · ${PROCESS_TR[j.process]}`, s: c.expected, h: jobHref(j), st: j.status, process: j.process, sla: j.slaStatus, job: j });
    });
    const newBtn = (role === "hr" || role === "admin")
      ? `<button class="btn btn-primary" data-act="goto" data-to="#/ise-baslangic/yeni">Yeni işe başlangıç talebi</button>`
      : "";
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "Özet" }])}
      ${pageHead("İş özeti", "Rolünüze göre bekleyen işler, onaylar ve SLA riski. Kart seçildiğinde ilgili liste açılır.", newBtn)}
      ${integBar()}
      <div class="kpi-strip">
        ${kpis.map((k) => `<div class="kpi-mini ${k.alert && k.n ? "alert" : ""}" data-act="goto" data-to="${k.href}" style="cursor:pointer">
          <span>${k.l}</span><b>${k.n}</b>
        </div>`).join("")}
      </div>
      ${work.length ? `<h3 style="font-size:13px;margin:0 0 8px">Bekleyen işler</h3>
      <div class="work-cards">${work.map((c) => `<button class="work-card" data-act="goto" data-to="${c.href}">
        <h4>${escapeHtml(c.label)}</h4>
        <div class="metrics">
          <div class="m"><span>Bekleyen</span><b>${c.n}</b></div>
          <div class="m crit"><span>Kritik</span><b>${c.crit}</b></div>
          <div class="m sla"><span>SLA riski</span><b>${c.sla}</b></div>
        </div>
      </button>`).join("")}</div>` : ""}
      <div class="grid-2">
        <div class="card">
          <div class="card-h"><h3>Sizden beklenen aksiyon</h3><a href="#/islerim">İş listesi</a></div>
          <div class="card-b" style="padding:0">
            ${tasks.length ? `<table class="data"><thead><tr><th>İş</th><th>Sizden beklenen</th><th>SLA</th><th>Durum</th></tr></thead>
              <tbody>${tasks.map((t) => `<tr data-act="goto" data-to="${t.h}"><td><b>${escapeHtml(t.t)}</b></td><td>${escapeHtml(t.s)}</td><td>${slaBadge({ slaStatus: t.sla || "ok" })}</td><td>${badge(t.st, t.process, t.job)}</td></tr>`).join("")}</tbody></table>`
              : `<div class="empty"><h4>Açık iş yok</h4><p>Bu rol için bekleyen aksiyon bulunmuyor.</p></div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-h"><h3>Son hareketler</h3></div>
          <div class="card-b">
            <ul class="timeline">${SRC.activity.map((a) => `<li><div class="when">${a.t}</div><div class="what">${a.text}</div></li>`).join("")}</ul>
          </div>
        </div>
      </div>`;
  }

  function pageZimmetler() {
    const f = state.filters;
    const depts = [...new Set(db.employees.map((e) => e.dept))];
    const locs = [...new Set(db.employees.map((e) => e.location))];
    const rows = db.zimmetler.filter((z) => {
      const e = emp(z.employeeId);
      if (f.person && !(e && e.name.toLowerCase().includes(f.person.toLowerCase()))) return false;
      if (f.dept !== "all" && e && e.dept !== f.dept) return false;
      if (f.loc !== "all" && z.location !== f.loc) return false;
      if (f.type !== "all" && z.type !== f.type) return false;
      if (f.status !== "all" && z.status !== f.status) return false;
      if (f.equipment && !(`${z.equipment} ${z.name}`.toLowerCase().includes(f.equipment.toLowerCase()))) return false;
      if (state.q && !(`${z.no} ${e ? e.name : ""} ${z.serial}`.toLowerCase().includes(state.q.toLowerCase()))) return false;
      return true;
    });
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "Cihaz Zimmetleri" }])}
      ${pageHead("Cihaz Zimmetleri", "Sistemdeki tüm zimmet kayıtları. Süreç detayına ve devre buradan geçilir.", "")}
      ${integBar()}
      <div class="filters">
        <input placeholder="Personel" value="${escapeAttr(f.person)}" id="f-person" />
        <select id="f-dept"><option value="all">Tüm departmanlar</option>${depts.map((d) => `<option ${f.dept === d ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}</select>
        <select id="f-loc"><option value="all">Tüm lokasyonlar</option>${locs.map((d) => `<option ${f.loc === d ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}</select>
        <select id="f-type">
          <option value="all">Zimmet türü</option>
          ${Object.entries(TYPE_TR).map(([k, v]) => `<option value="${k}" ${f.type === k ? "selected" : ""}>${v}</option>`).join("")}
        </select>
        <select id="f-status">
          <option value="all">Durum</option>
          ${Object.keys(STATUS_TR).map((k) => `<option value="${k}" ${f.status === k ? "selected" : ""}>${STATUS_TR[k]}</option>`).join("")}
        </select>
        <input placeholder="Ekipman" value="${escapeAttr(f.equipment)}" id="f-eq" />
      </div>
      <div class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Zimmet No</th><th>Personel</th><th>Tür</th><th>Ekipman</th><th>Seri No</th><th>Lokasyon</th><th>Durum</th></tr></thead>
        <tbody>${rows.map((z) => {
          const e = emp(z.employeeId);
          return `<tr data-act="goto" data-to="#/zimmetler/${z.id}">
            <td class="mono">${escapeHtml(z.no)}</td>
            <td><b>${escapeHtml(e ? e.name : "—")}</b><div class="muted">${escapeHtml(e ? e.title : "")}</div></td>
            <td>${typeBadge(z.type)}</td>
            <td>${escapeHtml(z.equipment)}<div class="muted">${escapeHtml(z.name)}</div></td>
            <td class="mono">${escapeHtml(z.serial)}</td>
            <td>${escapeHtml(z.location)}</td>
            <td>${badge(z.status)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>
      <div class="pager"><span>${rows.length} kayıt</span></div></div>`;
  }

  function pageZimmetDetail() {
    const z = zimmet(state.id);
    if (!z) return notFound("Zimmet");
    const e = emp(z.employeeId);
    const j = z.jobId ? job(z.jobId) : null;
    const showDevir = z.type !== "isten-ayrilma" && z.status !== "isten-ayrilis-bekliyor" && z.status !== "iade-kontrolunde";
    return `${crumb([{ t: "Cihaz Zimmetleri", h: "#/zimmetler" }, { t: z.no }])}
      ${pageHead(z.no, `${e ? e.name : ""} · ${TYPE_TR[z.type]}`, `
        ${j ? `<button class="btn" data-act="goto" data-to="${jobHref(j)}">Süreç kaydını aç</button>` : ""}
        ${showDevir ? `<button class="btn btn-primary" data-act="start-devir" data-zid="${z.id}">Zimmet Devri</button>` : ""}
      `)}
      ${integBar()}
      ${personBlock(e)}
      <div class="grid-2b">
        <div class="card"><div class="card-h"><h3>Zimmet kaydı</h3></div><div class="card-b">
          <dl class="dl">
            <dt>Tür</dt><dd>${TYPE_TR[z.type]}</dd>
            <dt>Ekipman</dt><dd>${escapeHtml(z.equipment)} — ${escapeHtml(z.name)}</dd>
            <dt>Seri no</dt><dd class="mono">${escapeHtml(z.serial)}</dd>
            <dt>Lokasyon</dt><dd>${escapeHtml(z.location)}</dd>
            <dt>Durum</dt><dd>${badge(z.status)}</dd>
          </dl>
        </div></div>
        <div class="card"><div class="card-h"><h3>Bağlı süreç</h3></div><div class="card-b">
          ${j ? `<p><b>${PROCESS_TR[j.process]}</b> · ${j.no}</p><p class="muted">${contextFor(j).now}</p>
            <button class="btn btn-sm mt-12" data-act="goto" data-to="${jobHref(j)}">Süreci aç</button>`
            : `<p class="muted">Bu kayıt bağımsız tamamlanmış bir zimmettir. Devir buradan başlatılabilir.</p>`}
        </div></div>
      </div>`;
  }

  function pageOnboardingList() {
    const list = jobsOf("ise-baslangic");
    const st = state.jobFilters.status;
    const rows = list.filter((j) => st === "all" || j.status === st);
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "İşe Başlangıç" }])}
      ${pageHead("İşe Başlangıç Zimmeti", "LDAP personel → title paketi → cihaz zimmeti. Depo, sevk ve form bu sürecin devamıdır.", `<button class="btn btn-primary" data-act="goto" data-to="#/ise-baslangic/yeni">Yeni işe başlangıç</button>`)}
      ${integBar()}
      <div class="filters">
        <button class="chip ${st === "all" ? "on" : ""}" data-act="job-st" data-v="all">Tümü</button>
        ${["taslak", "sistem-destek-kontrolunde", "ceo-onayi-bekliyor", "depo-hazirliginda", "sevk-irsaliyesi-olusturuldu", "teknik-kontrol-bekliyor", "zimmet-formu-bekliyor", "tamamlandi", "reddedildi"].map((s) =>
          `<button class="chip ${st === s ? "on" : ""}" data-act="job-st" data-v="${s}">${STATUS_TR[s]}</button>`).join("")}
      </div>
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Personel</th><th>Title / Paket</th><th>Lokasyon</th><th>Durum</th><th>Sıradaki</th></tr></thead>
        <tbody>${rows.map((j) => {
          const e = emp(j.employeeId);
          const p = pkg(j.packageId);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td><b>${escapeHtml(e ? e.name : "")}</b><div class="muted">${escapeHtml(e ? e.sicil : "")}</div></td>
            <td>${escapeHtml(e ? e.title : "")}<div class="muted">${escapeHtml(p ? p.name : "")}</div></td>
            <td>${escapeHtml(j.location)}</td>
            <td>${badge(j.status, j.process, j)}</td>
            <td class="muted">${escapeHtml(contextFor(j).next)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function ldapHits(q, extraFilter) {
    const qq = (q || "").toLowerCase().trim();
    return db.employees.filter((e) => {
      if (extraFilter && !extraFilter(e)) return false;
      if (!qq) return true;
      return `${e.name} ${e.sicil} ${e.title} ${e.email} ${e.dept} ${e.location} ${e.manager}`.toLowerCase().includes(qq);
    });
  }
  function ldapHitButton(e, act) {
    return `<button class="hit" data-act="${act}" data-eid="${e.id}">
      <div class="hit-top">
        <b>${escapeHtml(e.name)}</b>
        <span class="mono">${escapeHtml(e.sicil)}</span>
      </div>
      <div class="muted">${escapeHtml(e.title)} · ${escapeHtml(e.dept)} · ${escapeHtml(e.location)}</div>
      <div class="muted">${escapeHtml(e.email)} · Yönetici: ${escapeHtml(e.manager)}</div>
    </button>`;
  }

  function pageOnboardingNew() {
    const selected = state.form.empId ? emp(state.form.empId) : null;
    const p = selected ? pkgByTitle(selected.title) : null;
    const taken = new Set(jobsOf("ise-baslangic").map((j) => j.employeeId));
    const hits = ldapHits(state.ldapQ, (e) => e.status === "onboarding" && !taken.has(e.id));
    let body;
    if (!selected) {
      body = `<div class="card"><div class="card-h"><h3>Adım 1 — Personel</h3></div><div class="card-b">
        <div class="ldap-banner"><div>🔗</div><div>
          <b>LDAP'tan güncel personel bilgileri getirildi</b>
          <span class="muted">Yeni işe başlayanlar dizinden gelir. Manuel personel oluşturulmaz.</span>
        </div></div>
        <label class="fld">LDAP personel ara
          <input id="ldap-q" placeholder="Ad, sicil, ünvan, departman, lokasyon…" value="${escapeAttr(state.ldapQ)}" />
        </label>
        <div class="muted mt-8">${hits.length} kayıt · LDAP dizin</div>
        <div class="ldap-results mt-12">
          ${hits.map((e) => ldapHitButton(e, "pick-emp")).join("") || `<div class="empty-inline">Eşleşen işe başlangıç kaydı yok. Sicil, ad veya ünvan ile arayın.</div>`}
        </div>
      </div></div>`;
    } else {
      const catRows = (p ? p.items : []).map((it) => {
        const c = catalog(it.productCode);
        const qty = c ? c.qty : 0;
        return `<tr>
          <td>${escapeHtml(it.equipment)}</td>
          <td>${escapeHtml(p.name)}</td>
          <td class="right">${it.qty}</td>
          <td>${qty > 0 ? `<span class="stock-ok">Stokta</span>` : `<span class="stock-no">Stokta Yok</span>`}
            <div class="muted">${c ? c.name : it.productCode} · ${qty} adet</div></td>
        </tr>`;
      }).join("");
      body = personBlock(selected, `<div class="callout info mt-12"><b>${escapeHtml(p ? p.name : "Paket bulunamadı")}</b>Ünvana göre otomatik önerildi. LDAP bilgileri salt okunur.</div>`) +
        `<div class="card mb-12"><div class="card-h"><h3>Adım 2 — Tarihler ve ekipman paketi</h3></div>
        <div class="card-b">
          <div class="form-grid">
            <label class="fld"><span class="req">İşe giriş tarihi</span>
              <input type="date" id="onb-start" value="${escapeAttr(selected.startDate || "")}" />
            </label>
            <label class="fld"><span class="req">Cihaz teslim tarihi</span>
              <input type="date" id="onb-delivery" value="" />
            </label>
          </div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Ekipman</th><th>Ürün</th><th>Stok Durumu</th></tr></thead>
          <tbody>${catRows}</tbody>
        </table></div>
        <div class="card-b">
          <div class="actions">
            <button class="btn" data-act="clear-emp">Personeli değiştir</button>
            <button class="btn btn-primary" data-act="create-onb">Talebi Oluştur</button>
          </div>
        </div></div>`;
    }
    return `${crumb([{ t: "İşe Başlangıç", h: "#/ise-baslangic" }, { t: "Yeni" }])}
      ${pageHead("Yeni işe başlangıç talebi", "İK, LDAP üzerinden çalışanı seçer. Ünvana göre ekipman paketi otomatik gelir. İşe giriş ve cihaz teslim tarihi zorunludur.", "")}
      ${stepper(ONB_STEPS, selected ? 1 : 0)}
      ${integBar()}
      ${body}`;
  }

  function pageOnboardingDetail() {
    const j = job(state.id);
    if (!j || j.process !== "ise-baslangic") return notFound("İşe başlangıç");
    const e = emp(j.employeeId);
    const p = pkg(j.packageId);
    const role = user().role;
    const idx = stepIndex(j);
    let actions = "";
    let extra = "";
    if (j.status === "sistem-destek-kontrolunde" || j.status === "reddedildi" || j.status === "taslak") {
      extra = itemsTable(j, "support") +
        `<div class="card mb-12"><div class="card-h"><h3>Sistem Destek kontrolü</h3></div><div class="card-b">
          ${j.status === "reddedildi" ? `<div class="callout danger"><b>Talep reddedildi — Destek'e döndü</b>${escapeHtml(j.ceoNote || "Gerekçe belirtilmedi")}. Talebi güncelleyip yeniden onaya veya depoya gönderebilir, ya da iptal edebilirsiniz. Süreç ret ile kapanmaz.</div>` : ""}
          ${j.status === "taslak" ? `<div class="callout warn"><b>Taslak</b>İşe giriş ve cihaz teslim tarihi tamamlanmadan süreç ilerletilemez.</div>
            <div class="form-grid mb-12">
              <label class="fld"><span class="req">İşe giriş tarihi</span><input type="date" id="onb-start" value="${escapeAttr(j.startDate || "")}" /></label>
              <label class="fld"><span class="req">Cihaz teslim tarihi</span><input type="date" id="onb-delivery" value="${escapeAttr(j.deliveryDate || "")}" /></label>
            </div>` : `<dl class="dl mb-12"><dt>İşe giriş</dt><dd>${escapeHtml(j.startDate || "—")}</dd><dt>Cihaz teslim</dt><dd>${escapeHtml(j.deliveryDate || "—")}</dd></dl>`}
          <p class="muted">Paket içeriği Logo ERP stok bilgisi ile gösterilir. Stokta yoksa alternatif seçin. Paket dışı kalem onay sürecine gider.</p>
          <label class="fld full">Açıklama<textarea id="support-note">${escapeHtml(j.supportNote || "")}</textarea></label>
          <div class="actions mt-12">
            <button class="btn" data-act="open-extra">Paket dışı ekipman ekle</button>
            ${j.status === "taslak" ? `<button class="btn btn-primary" data-act="submit-draft">Sistem Desteğe Gönder</button>` : needsCeo(j)
              ? `<button class="btn btn-primary" data-act="send-ceo">Onaya Gönder</button>`
              : `<button class="btn btn-primary" data-act="send-wh">Depo Hazırlığına Gönder</button>`}
            ${(role === "support" || role === "admin" || role === "hr") ? `<button class="btn btn-danger" data-act="cancel-job">Talebi İptal Et</button>` : ""}
          </div>
          ${j.status !== "taslak" ? (needsCeo(j) ? `<div class="callout warn mt-12"><b>Onay gerekli</b>Standart paket dışında kalan ürün talepleri CO / CEO onayına gönderilir.</div>` : `<div class="callout ok mt-12"><b>Paket dahilinde</b>Tüm ürünler stokta ve pakette ise süreç doğrudan depo hazırlığına geçer.</div>`) : ""}
        </div></div>`;
    } else if (j.status === "ceo-onayi-bekliyor") {
      extra = ceoPanel(j);
    } else if (["depo-hazirliginda", "seri-secildi"].includes(j.status) && (role === "warehouse" || role === "admin" || role === "support")) {
      extra = warehouseTable(j) +
        `<div class="actions mb-12">
          <button class="btn btn-primary" data-act="create-waybill" ${allSerials(j) ? "" : "disabled"}>Sevk İrsaliyesi Oluştur</button>
        </div>
        ${allSerials(j) ? "" : `<div class="callout warn"><b>Seri numarası eksik</b>Tüm ürünler için Logo'dan seri seçilmeden irsaliye oluşmaz.</div>`}`;
    } else if (j.status === "teknik-kontrol-bekliyor") {
      extra = checkPanel(j);
    } else if (j.status === "zimmet-formu-bekliyor" || j.status === "tamamlandi") {
      extra = itemsTable(j, "view") + (j.waybill ? waybillCard(j) : "") + formCard(j);
    } else if (["sevk-irsaliyesi-olusturuldu", "merkeze-ulasti"].includes(j.status)) {
      extra = itemsTable(j, "view");
      if (j.waybill) extra += waybillCard(j);
      if (j.status === "merkeze-ulasti") {
        extra += `<div class="callout ok mb-12"><b>Yeni Ekipman Teslim Alındı</b>${escapeHtml(e.name)} için hazırlanan ${j.items.length} ekipman merkeze ulaştı.</div>
          <div class="actions mb-12"><button class="btn btn-primary" data-act="start-check">Teslim al ve kontrole geç</button></div>`;
      }
    } else {
      extra = itemsTable(j, "view");
      if (j.waybill) extra += waybillCard(j);
    }
    return `${crumb([{ t: "İşe Başlangıç", h: "#/ise-baslangic" }, { t: j.no }])}
      ${pageHead(`${e ? e.name : ""} — işe başlangıç`, `${j.no} · ${p ? p.name : ""}`, actions)}
      ${stepper(ONB_STEPS, idx)}
      ${nowBox(j)}
      ${integBar()}
      ${personBlock(e, p ? `<div class="callout info mt-12"><b>${escapeHtml(p.name)}</b>Title ile otomatik eşleşti.</div>` : "")}
      ${extra}
      ${historyList(j)}`;
  }

  function waybillCard(j) {
    return `<div class="card mb-12"><div class="card-h"><h3>Sevk irsaliyesi</h3>
      <span class="integ-pill"><i class="dot"></i>Logo ERP → Sevk İrsaliyesi Oluşturuldu</span></div>
      <div class="card-b">
        <dl class="dl">
          <dt>İrsaliye no</dt><dd class="mono">${escapeHtml(j.waybill || "—")}</dd>
          <dt>Tarih</dt><dd>${escapeHtml(j.waybillDate || "—")}</dd>
          <dt>Hedef</dt><dd>${escapeHtml(j.waybillTarget || "Genel Merkez")}</dd>
          <dt>Durum</dt><dd>${badge(j.status, j.process, j)}</dd>
        </dl>
        <div class="doc-actions mt-12">
          <button class="btn" data-act="view-waybill">İrsaliyeyi Görüntüle</button>
          <button class="btn btn-primary" data-act="print-waybill">PDF İndir / Yazdır</button>
        </div>
      </div></div>`;
  }

  function formCard(j) {
    const created = !!j.formNo;
    const e = emp(j.toEmployeeId || j.employeeId);
    const waiting = awaitingPersonnel(j);
    const signed = !!j.signedAt;
    const method = j.signMethod || state.signMethod;
    const canApprove = waiting && ["personnel", "support", "admin"].includes(user().role);
    const previewOn = !!state.form.signPreview && state.form.signJob === j.id;
    let approval = "";
    if (waiting) {
      approval = `<div class="callout warn mt-12"><b>Personel onayı bekleniyor</b>Form ${escapeHtml(e ? e.name : "teslim alana")} gönderildi. Süreç, dijital imza veya elektronik onay tamamlanmadan kapanmaz.</div>
        ${canApprove ? `<div class="card mt-12" style="border:0;box-shadow:none"><div class="card-b" style="padding:0">
          ${method === "dijital-imza" ? `
            <p class="muted mb-12">Teslim alan olarak kutuya tıklayıp dijital imzanızı atın, ardından onaylayın.</p>
            <button type="button" class="sign-box ${previewOn ? "signed" : ""}" data-act="sign-preview">${previewOn ? escapeHtml(e ? e.name : "") : "İmza için tıklayın"}</button>
            <div class="actions mt-12">
              <button class="btn btn-primary" data-act="emp-approve" data-m="dijital-imza" ${previewOn ? "" : "disabled"}>İmzala ve onayla</button>
            </div>` : method === "elektronik-onay" ? `
            <p class="muted mb-12">Teslim alan olarak zimmet formunu elektronik onaylayın. Onay kaydı sistemde saklanır.</p>
            <div class="actions">
              <button class="btn btn-primary" data-act="emp-approve" data-m="elektronik-onay">Elektronik onay ver</button>
            </div>` : `
            <p class="muted mb-12">PDF çıktısı alındı. Teslim alan ıslak imza attıktan sonra süreci tamamlayın.</p>
            <div class="actions">
              <button class="btn" data-act="print-form">PDF Yazdır</button>
              <button class="btn btn-primary" data-act="emp-approve" data-m="pdf">İmza alındı — onayla</button>
            </div>`}
        </div></div>` : `<p class="muted mt-12">Onay için sağ üstten <b>Personel (Teslim Alan)</b> rolüne geçin veya bildirimden formu açın.</p>`}`;
    } else if (signed) {
      approval = `<div class="callout ok mt-12"><b>Personel onayladı</b>${escapeHtml(j.signedBy || (e ? e.name : ""))} · ${escapeHtml(j.signedAt)} · ${signMethodLabel(j.signMethod)}
        ${j.signatureText ? `<div class="sign-box signed mt-12">${escapeHtml(j.signatureText)}</div>` : ""}
      </div>`;
    }
    return `<div class="card mb-12"><div class="card-h"><h3>Zimmet formu</h3>
      ${waiting ? `<span class="integ-pill warn"><i class="dot"></i>Personel onayı bekleniyor</span>` : signed ? `<span class="integ-pill"><i class="dot"></i>Onaylandı</span>` : ""}</div><div class="card-b">
      ${created ? `<div class="grid-2b">
        <div>
          <h3 style="font-size:13px;margin:0 0 8px">Çalışan bilgileri</h3>
          <dl class="dl">
            <dt>Ad Soyad</dt><dd>${escapeHtml(e ? e.name : "")}</dd>
            <dt>Sicil No</dt><dd>${escapeHtml(e ? e.sicil : "")}</dd>
            <dt>Departman</dt><dd>${escapeHtml(e ? e.dept : "")}</dd>
          </dl>
        </div>
        <div>
          <h3 style="font-size:13px;margin:0 0 8px">Teslim bilgileri</h3>
          <dl class="dl">
            <dt>Form no</dt><dd class="mono">${escapeHtml(j.formNo)}</dd>
            <dt>Teslim eden</dt><dd>${escapeHtml(j.deliveredBy || "Ayşe Demir")}</dd>
            <dt>Teslim alan</dt><dd>${escapeHtml(e ? e.name : "")}</dd>
            <dt>Teslim tarihi</dt><dd>${escapeHtml(j.signedAt || j.deliveryDate || "—")}</dd>
            <dt>Onay yöntemi</dt><dd>${signMethodLabel(method)}</dd>
          </dl>
        </div>
      </div>
      <h3 class="mt-12" style="font-size:13px">Asset bilgileri</h3>
      <table class="data"><thead><tr><th>Ürün Adı</th><th>Marka</th><th>Model</th><th>Seri No</th><th>Asset No</th></tr></thead>
      <tbody>${(j.items || []).map((it) => {
        const c = catalog(it.productCode);
        return `<tr><td>${escapeHtml(it.name)}</td><td>${escapeHtml(c ? c.brand : "—")}</td><td>${escapeHtml(c ? c.model : "—")}</td><td class="mono">${escapeHtml(it.serial || "—")}</td><td class="mono">${escapeHtml(it.assetNo || "—")}</td></tr>`;
      }).join("")}</tbody></table>
      <div class="doc-actions mt-12">
        <button class="btn" data-act="print-form">Görüntüle</button>
        <button class="btn" data-act="print-form">PDF Oluştur</button>
        <button class="btn" data-act="print-form">Yazdır</button>
      </div>
      ${approval}` : `<p class="muted mb-12">Sistem zimmet formunu oluşturur ve teslim alana gönderir. Personel dijital imza veya elektronik onay ile tamamlar.</p>
        <div class="sign-opts mb-12">
          <button class="opt-card ${state.signMethod === "dijital-imza" ? "on" : ""}" data-act="sign-m" data-v="dijital-imza"><b>Dijital imza</b><span>Personel e-imza ile onaylar</span></button>
          <button class="opt-card ${state.signMethod === "elektronik-onay" ? "on" : ""}" data-act="sign-m" data-v="elektronik-onay"><b>Elektronik onay</b><span>Uygulama içi onay</span></button>
          <button class="opt-card ${state.signMethod === "pdf" ? "on" : ""}" data-act="sign-m" data-v="pdf"><b>PDF çıktısı</b><span>Islak imza, ardından onay</span></button>
        </div>
        <button class="btn btn-primary" data-act="create-form">Zimmet Formu Oluştur ve Personele Gönder</button>`}
    </div></div>`;
  }

  function checkPanel(j) {
    const c = ensureChecks(j);
    const group = (title, key, items) => `<fieldset class="grp"><legend>${title}</legend>
      ${items.map((it) => `<label class="check"><input type="checkbox" data-act="toggle-check" data-g="${key}" data-i="${it.id}" ${it.done ? "checked" : ""}/><span>${escapeHtml(it.label)}</span></label>`).join("")}
    </fieldset>`;
    return itemsTable(j, "view") +
      `<div class="grid-2b mb-12">
        <div class="card"><div class="card-h"><h3>Teknik kontroller</h3><span class="muted">Opsiyonel</span></div><div class="card-b">
          ${group("Kurulum ve güvenlik", "technical", c.technical)}
        </div></div>
        <div class="card"><div class="card-h"><h3>Fiziksel kontroller</h3><span class="muted">Opsiyonel</span></div><div class="card-b">
          ${group("Doğrulama ve hasar", "physical", c.physical)}
        </div></div>
      </div>
      <div class="card mb-12"><div class="card-h"><h3>Teknik kontrol sonucu</h3></div><div class="card-b">
        <div class="result-pair">
          <button class="result-btn ${j.techResult === "uygun" ? "on-ok" : ""}" data-act="tech-result" data-v="uygun">
            <b>Uygun</b><span>Zimmet oluşturma sürecine geçilir.</span>
          </button>
          <button class="result-btn ${j.techResult === "hasarli" ? "on-bad" : ""}" data-act="tech-result" data-v="hasarli">
            <b>Hasarlı</b><span>Hasarlı ürün raporu oluşur. Ürün depoya döner, yeni ürün talep edilir.</span>
          </button>
        </div>
        ${j.techResult === "hasarli" ? `<label class="fld mt-12"><span class="req">Hasar açıklaması</span><textarea id="damage-note" placeholder="Hasar türü, etkilenen parça…">${escapeHtml(j.damageNote || "")}</textarea></label>` : ""}
        <div class="actions mt-12">
          ${j.techResult === "hasarli"
            ? `<button class="btn btn-danger" data-act="damage-report">Hasarlı Ürün Raporu Oluştur</button>`
            : `<button class="btn btn-primary" data-act="complete-check" ${j.techResult === "uygun" ? "" : "disabled"}>Kontrolü Tamamla — Zimmete Geç</button>`}
        </div>
        ${j.techResult !== "uygun" && j.techResult !== "hasarli" ? `<div class="callout warn mt-12"><b>Sonuç seçilmedi</b>Uygun veya hasarlı seçilmeden süreç ilerletilemez.</div>` : ""}
      </div></div>`;
  }

  function ceoPanel(j) {
    const e = emp(j.employeeId);
    const p = pkg(j.packageId);
    const extras = (j.items || []).filter((it) => it.extra || it.inPackage === false);
    const std = (j.items || []).filter((it) => !it.extra && it.inPackage !== false);
    const role = user().role;
    return `<div class="card mb-12"><div class="card-h"><h3>CO / CEO onay paketi</h3></div><div class="card-b">
      <dl class="dl">
        <dt>Personel</dt><dd>${escapeHtml(e ? e.name : "")}</dd>
        <dt>Title</dt><dd>${escapeHtml(e ? e.title : "")}</dd>
        <dt>Standart paket</dt><dd>${escapeHtml(p ? p.name : "—")}</dd>
      </dl>
      <h3 class="mt-12" style="font-size:13px">Standart ekipman</h3>
      <ul>${std.map((it) => `<li>${escapeHtml(it.equipment)} — ${escapeHtml(it.name)}</li>`).join("")}</ul>
      <h3 class="mt-12" style="font-size:13px">Talep edilen paket dışı ekipman</h3>
      ${extras.map((it) => `<div class="callout warn"><b>${escapeHtml(it.equipment)} — ${escapeHtml(it.name)}</b>
        Neden paket dışında: ${escapeHtml(it.extraReason || "Belirtilmedi")}<br>
        Stok: ${it.stockStatus === "yok" ? "Stokta Yok" : "Stokta (" + it.stockQty + ")"} · ${escapeHtml(it.stockCode)}
      </div>`).join("")}
      <p class="muted">Sistem Destek açıklaması: ${escapeHtml(j.supportNote || "—")}</p>
      ${role === "ceo" || role === "admin" ? `<div class="actions mt-12">
        <button class="btn btn-primary" data-act="ceo-ok">Onayla</button>
        <button class="btn btn-danger" data-act="open-reject">Reddet</button>
      </div>` : `<div class="callout info mt-12"><b>Onay bekleniyor</b>Kayıt ${escapeHtml(j.approver || "Selim Aras")} (CO / CEO) kuyruğunda. SLA: ${j.slaDays || 3} iş günü · son tarih ${escapeHtml(j.slaDue || "—")}. ${slaBadge(j)}</div>`}
      ${approvalHistory(j)}
    </div></div>`;
  }

  function approvalHistory(j) {
    const rows = j.approvalHistory || [];
    if (!rows.length && j.status !== "ceo-onayi-bekliyor" && j.ceoDecision == null) return "";
    const fallback = rows.length ? rows : [
      { step: "Sistem Destek", who: j.createdBy || "—", result: "İletildi", t: j.createdAt || "", note: "" },
      { step: "CO / CEO Onayı", who: j.approver || "Selim Aras", result: j.ceoDecision === "onay" ? "Onaylandı" : j.ceoDecision === "red" ? "Reddedildi" : "Bekliyor", t: j.ceoAt || "", note: j.ceoNote || "" },
    ];
    return `<div class="mt-12"><h3 style="font-size:13px;margin:0 0 8px">Onay geçmişi</h3>
      <div class="approval-steps">${fallback.map((s, i) => {
        const now = s.result === "Bekliyor";
        const done = s.result === "Onaylandı" || s.result === "Onaya gönderildi" || s.result === "İletildi";
        return `<div class="as ${now ? "now" : done ? "done" : ""}"><small>Adım ${i + 1}</small><b>${escapeHtml(s.step)}</b>
          <div class="muted">${escapeHtml(s.who)} · ${escapeHtml(s.result)}</div>
          ${s.t ? `<div class="muted">${escapeHtml(s.t)}</div>` : ""}
          ${s.note ? `<div class="mini-note">${escapeHtml(s.note)}</div>` : ""}
        </div>`;
      }).join("")}</div></div>`;
  }

  function pageOffboardingNew() {
    const hits = ldapHits(state.ldapQ, (e) => e.status === "offboarding" || e.status === "active");
    const selected = state.form.empId ? emp(state.form.empId) : null;
    const owned = selected ? db.zimmetler.filter((z) => z.employeeId === selected.id) : [];
    return `${crumb([{ t: "İşten Ayrılış", h: "#/isten-ayrilis" }, { t: "Yeni kayıt" }])}
      ${pageHead("İşten ayrılış kaydı", "İK, LDAP'tan çalışanı seçer. Sistem aktif zimmetleri getirir.", "")}
      ${integBar()}
      ${!selected ? `<div class="card"><div class="card-b">
        <div class="ldap-banner"><div></div><div><b>LDAP'tan personel bilgileri getirildi</b><span class="muted">Manuel personel kaydı yok</span></div></div>
        <label class="fld">Personel ara<input id="ldap-q" value="${escapeAttr(state.ldapQ)}" placeholder="Ad, sicil, ünvan, lokasyon…" /></label>
        <div class="muted mt-8">${hits.length} kayıt · LDAP dizin</div>
        <div class="ldap-results mt-12">${hits.map((e) => ldapHitButton(e, "pick-emp")).join("") || `<div class="empty-inline">Eşleşen personel yok.</div>`}</div>
      </div></div>` : personBlock(selected) + `<div class="card mb-12"><div class="card-h"><h3>Aktif zimmetler</h3></div>
        ${owned.length ? `<table class="data"><thead><tr><th>Zimmet</th><th>Ekipman</th><th>Seri</th></tr></thead>
          <tbody>${owned.map((z) => `<tr><td class="mono">${z.no}</td><td>${escapeHtml(z.equipment)} · ${escapeHtml(z.name)}</td><td class="mono">${escapeHtml(z.serial)}</td></tr>`).join("")}</tbody></table>`
          : `<div class="empty">Bu çalışanın zimmet kaydı yok.</div>`}
        <div class="card-b"><div class="actions">
          <button class="btn" data-act="clear-emp">Değiştir</button>
          <button class="btn btn-primary" data-act="create-off" ${owned.length ? "" : "disabled"}>İade kaydı oluştur</button>
        </div></div></div>`}`;
  }

  function pageOffboardingList() {
    const list = jobsOf("isten-ayrilis");
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "İşten Ayrılış" }])}
      ${pageHead("İşten Ayrılış / Zimmet İadesi", "İK işten ayrılış kaydı oluşturur. Sistem aktif zimmetleri listeler ve Sistem Destek Uzmanına bildirim gönderir.", (user().role === "hr" || user().role === "admin") ? `<button class="btn btn-primary" data-act="goto" data-to="#/isten-ayrilis/yeni">İade kaydı oluştur</button>` : "")}
      ${integBar()}
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Personel</th><th>Ayrılış</th><th>Zimmet adedi</th><th>Durum</th></tr></thead>
        <tbody>${list.map((j) => {
          const e = emp(j.employeeId);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td><b>${escapeHtml(e ? e.name : "")}</b><div class="muted">${escapeHtml(e ? e.title : "")} · ${escapeHtml(e ? e.sicil : "")}</div></td>
            <td>${escapeHtml(e && e.leaveDate ? e.leaveDate : "—")}</td>
            <td>${j.items.length}</td>
            <td>${badge(j.status, j.process, j)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function pageOffboardingDetail() {
    const j = job(state.id);
    if (!j || j.process !== "isten-ayrilis") return notFound("İşten ayrılış");
    const e = emp(j.employeeId);
    const condLabel = { yeniden: "Yeniden Kullanıma Uygun", hurda: "Kullanılamaz / Hurda", bakim: "Bakım Gerekiyor" };
    let extra = "";
    if (j.status === "isten-ayrilis-bekliyor") {
      extra = `<div class="callout warn mb-12"><b>Yeni Zimmet İadesi</b>${escapeHtml(e.name)}'ın işten ayrılış işlemi nedeniyle ${j.items.length} zimmetli ürünün iadesi bekleniyor.</div>
        ${returnTable(j, false)}
        <button class="btn btn-primary" data-act="start-return">İade kontrolüne al</button>`;
    } else if (j.status === "iade-kontrolunde") {
      extra = returnTable(j, true) +
        `<div class="actions mt-12 mb-12"><button class="btn btn-primary" data-act="complete-return">İadeyi Tamamla</button></div>`;
    } else {
      extra = returnTable(j, false);
      if (j.status === "iade-tamamlandi") {
        extra += `<div class="actions mb-12"><button class="btn btn-primary" data-act="create-return-waybill">Sevk İrsaliyesi Oluştur</button></div>
          <div class="callout info"><b>Hedef: Merkez Depo</b>Logo ERP üzerinden iade sevkiyatı.</div>`;
      }
      if (j.waybill) extra += waybillCard(j);
    }
    return `${crumb([{ t: "İşten Ayrılış", h: "#/isten-ayrilis" }, { t: j.no }])}
      ${pageHead(`${e ? e.name : ""} — zimmet iadesi`, j.no, "")}
      ${stepper(OFF_STEPS, stepIndex(j))}
      ${nowBox(j)}
      ${integBar()}
      ${personBlock(e)}
      ${extra}
      ${historyList(j)}`;
  }

  function returnTable(j, edit) {
    const conds = [
      ["yeniden", "Yeniden Kullanıma Uygun", "on-ok"],
      ["hurda", "Kullanılamaz / Hurda", "on-bad"],
      ["bakim", "Bakım Gerekiyor", "on-warn"],
    ];
    return `<div class="card mb-12"><div class="card-h"><h3>Mevcut zimmetler</h3></div><div class="card-b" style="padding:0">
      ${(j.items || []).map((it) => `<div style="padding:14px 16px;border-bottom:1px solid var(--line-2)">
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div><b>${escapeHtml(it.equipment)}</b> — ${escapeHtml(it.name)}
            <div class="mono muted">${escapeHtml(it.serial || "—")} · ${escapeHtml(it.stockCode)}</div></div>
        </div>
        ${edit ? `<div class="cond-btns mt-12">
          ${conds.map(([k, lab, cls]) => `<button class="btn btn-sm ${it.returnCondition === k ? cls : ""}" data-act="ret-cond" data-iid="${it.id}" data-v="${k}">${lab}</button>`).join("")}
        </div>
        <div class="mt-12">
          <label class="check"><input type="checkbox" data-act="ret-ck" data-iid="${it.id}" data-k="model" ${it.returnChecks && it.returnChecks.model ? "checked" : ""}/><span>Ürün modeli doğrulandı</span></label>
          <label class="check"><input type="checkbox" data-act="ret-ck" data-iid="${it.id}" data-k="serial" ${it.returnChecks && it.returnChecks.serial ? "checked" : ""}/><span>Seri numarası doğrulandı</span></label>
          <label class="check"><input type="checkbox" data-act="ret-ck" data-iid="${it.id}" data-k="accessory" ${it.returnChecks && it.returnChecks.accessory ? "checked" : ""}/><span>Aksesuarlar tam</span></label>
          <label class="check"><input type="checkbox" data-act="ret-ck" data-iid="${it.id}" data-k="damage" ${it.returnChecks && it.returnChecks.damage ? "checked" : ""}/><span>Fiziksel hasar yok</span></label>
        </div>
        <label class="fld mt-12">Not<input data-act="ret-note" data-iid="${it.id}" value="${escapeAttr(it.returnNote || "")}" /></label>`
        : `<p class="muted mt-8">${it.returnCondition ? { yeniden: "Yeniden kullanıma uygun", hurda: "Kullanılamaz / hurda", bakim: "Bakım gerekiyor" }[it.returnCondition] : "Durum henüz seçilmedi"}</p>`}
      </div>`).join("")}
    </div></div>`;
  }

  function pageDevirList() {
    const list = jobsOf("zimmet-devri");
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "Zimmet Devri" }])}
      ${pageHead("Zimmet Devri", "Devir, Cihaz Zimmetleri kaydından başlar. Aynı lokasyon kontrolü zorunludur.", `<button class="btn" data-act="goto" data-to="#/zimmetler">Cihaz zimmetlerinden seç</button>`)}
      ${integBar()}
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Mevcut kullanıcı</th><th>Yeni kullanıcı</th><th>Ekipman</th><th>Lokasyon</th><th>Durum</th></tr></thead>
        <tbody>${list.map((j) => {
          const from = emp(j.employeeId);
          const to = emp(j.toEmployeeId);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td>${escapeHtml(from ? from.name : "")}</td>
            <td>${escapeHtml(to ? to.name : "—")}</td>
            <td>${escapeHtml(j.items[0] ? j.items[0].name : "")}</td>
            <td>${escapeHtml(j.location)}</td>
            <td>${badge(j.status, j.process, j)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function pageDevirDetail() {
    const j = job(state.id);
    if (!j || j.process !== "zimmet-devri") return notFound("Zimmet devri");
    const from = emp(j.employeeId);
    const to = emp(j.toEmployeeId);
    const it = j.items[0];
    let picker = "";
    if (j.status === "yeni-kullanici-bekliyor" || j.status === "lokasyon-uyusmazligi") {
      const hits = ldapHits(state.ldapQ, (e) => e.status === "active" && e.id !== j.employeeId);
      picker = `<div class="card mb-12"><div class="card-h"><h3>Yeni kullanıcı seç</h3></div><div class="card-b">
        <div class="ldap-banner"><div>🔗</div><div><b>LDAP'tan güncel personel bilgileri getirildi</b></div></div>
        ${j.status === "lokasyon-uyusmazligi" ? `<div class="callout danger"><b>Aynı lokasyon değil</b>Mevcut kullanıcı ${escapeHtml(from.location)}, seçilen ${escapeHtml(to ? to.location : "")}. Ürün sistemde bulunamaz. Aynı lokasyondan seçin.</div>` : `<div class="callout ok"><b>Lokasyon kontrolü</b>Aynı lokasyondaysa ürün sistemde bulunabilir. Hedef: ${escapeHtml(from.location)}</div>`}
        <label class="fld">LDAP ara<input id="ldap-q" value="${escapeAttr(state.ldapQ)}" placeholder="Ad, sicil, ünvan, lokasyon…" /></label>
        <div class="muted mt-8">${hits.length} kayıt · LDAP dizin</div>
        <div class="ldap-results mt-12">${hits.map((e) => ldapHitButton(e, "pick-to")).join("") || `<div class="empty-inline">Eşleşen aktif personel yok.</div>`}</div>
        ${to && j.sameLocation && !j.formNo ? `<div class="sign-opts mb-12 mt-12">
          <button class="opt-card ${state.signMethod === "dijital-imza" ? "on" : ""}" data-act="sign-m" data-v="dijital-imza"><b>Dijital imza</b><span>Yeni kullanıcı e-imza ile onaylar</span></button>
          <button class="opt-card ${state.signMethod === "elektronik-onay" ? "on" : ""}" data-act="sign-m" data-v="elektronik-onay"><b>Elektronik onay</b><span>Uygulama içi onay</span></button>
          <button class="opt-card ${state.signMethod === "pdf" ? "on" : ""}" data-act="sign-m" data-v="pdf"><b>PDF çıktısı</b><span>Islak imza, ardından onay</span></button>
        </div>
        <div class="actions mt-12"><button class="btn btn-primary" data-act="complete-devir">Zimmet Formu Oluştur ve Personele Gönder</button></div>` : ""}
      </div></div>`;
    }
    return `${crumb([{ t: "Zimmet Devri", h: "#/zimmet-devri" }, { t: j.no }])}
      ${pageHead("Zimmet devri", j.no, "")}
      ${stepper(TR_STEPS, stepIndex(j))}
      ${nowBox(j)}
      ${integBar()}
      <div class="grid-2b">
        ${personBlock(from)}
        <div class="card mb-12"><div class="card-h"><h3>Ürün</h3></div><div class="card-b">
          <dl class="dl">
            <dt>Ekipman</dt><dd>${escapeHtml(it ? it.name : "")}</dd>
            <dt>Seri</dt><dd class="mono">${escapeHtml(it ? it.serial : "")}</dd>
            <dt>Lokasyon</dt><dd>${escapeHtml(j.location)}</dd>
          </dl>
        </div></div>
      </div>
      ${to ? personBlock(to, `<div class="muted">Yeni kullanıcı</div>`) : ""}
      ${picker}
      ${j.formNo ? formCard(j) : ""}
      ${historyList(j)}`;
  }

  function pageDegisimList() {
    const list = jobsOf("cihaz-degisimi");
    return `${crumb([{ t: "Zimmet", h: "#/dashboard" }, { t: "Cihaz Değişimi" }])}
      ${pageHead("Cihaz Değişimi", "İşe başlangıç ve iadeden bağımsız süreç. Paket dahilindeyse CO/CEO atlanır.", `<button class="btn btn-primary" data-act="goto" data-to="#/cihaz-degisimi/yeni">Değişim talebi</button>`)}
      ${integBar()}
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Personel</th><th>Talep</th><th>Paket kontrolü</th><th>Durum</th></tr></thead>
        <tbody>${list.map((j) => {
          const e = emp(j.employeeId);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td><b>${escapeHtml(e ? e.name : "")}</b></td>
            <td>${escapeHtml(j.requestedEquipment || (j.items[1] ? j.items[1].name : ""))}</td>
            <td>${j.inPackageCheck ? `<span class="stock-ok">Paket Dahilinde</span>` : `<span class="stock-no">Paket Dışı — CO / CEO Onayı Gerekli</span>`}</td>
            <td>${badge(j.status, j.process, j)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function pageDegisimNew() {
    const selected = state.form.empId ? emp(state.form.empId) : null;
    const hits = ldapHits(state.ldapQ, (e) => e.status === "active");
    const owned = selected ? db.zimmetler.filter((z) => z.employeeId === selected.id && z.status === "tamamlandi") : [];
    return `${crumb([{ t: "Cihaz Değişimi", h: "#/cihaz-degisimi" }, { t: "Yeni talep" }])}
      ${pageHead("Cihaz değişim talebi", "Personel LDAP'tan gelir. Mevcut zimmet ve title paketi otomatik gösterilir.", "")}
      ${integBar()}
      ${!selected ? `<div class="card"><div class="card-b">
        <div class="ldap-banner"><div>🔗</div><div><b>LDAP'tan güncel personel bilgileri getirildi</b></div></div>
        <label class="fld">Personel ara<input id="ldap-q" value="${escapeAttr(state.ldapQ)}" placeholder="Ad, sicil, ünvan, lokasyon…" /></label>
        <div class="muted mt-8">${hits.length} kayıt · LDAP dizin</div>
        <div class="ldap-results mt-12">${hits.map((e) => ldapHitButton(e, "pick-emp")).join("") || `<div class="empty-inline">Eşleşen aktif personel yok.</div>`}</div>
      </div></div>` : personBlock(selected) + `<div class="card mb-12"><div class="card-h"><h3>Mevcut zimmetler</h3></div>
        <table class="data"><thead><tr><th>Ekipman</th><th>Seri</th><th></th></tr></thead>
        <tbody>${(owned.length ? owned : db.zimmetler.filter((z) => z.employeeId === selected.id)).map((z) => `<tr>
          <td>${escapeHtml(z.equipment)} · ${escapeHtml(z.name)}</td>
          <td class="mono">${escapeHtml(z.serial)}</td>
          <td><button class="btn btn-sm" data-act="pick-change-item" data-zid="${z.id}">Bunu değiştir</button></td>
        </tr>`).join("")}</tbody></table></div>
        ${state.form.changeZid ? changeRequestForm(selected) : ""}`} `;
  }

  function changeRequestForm(e) {
    const z = zimmet(state.form.changeZid);
    const p = pkgByTitle(e.title);
    const inPkg = p && p.items.some((it) => it.equipment === (state.form.reqEq || z.equipment));
    return `<div class="card mb-12"><div class="card-h"><h3>Yeni cihaz</h3></div><div class="card-b">
      <p>Mevcut: <b>${escapeHtml(z.name)}</b> · ${escapeHtml(z.serial)}</p>
      <label class="fld">Talep edilen ekipman
        <select id="req-eq">${db.logoCatalog.map((c) => `<option value="${c.productCode}" ${c.equipment === z.equipment ? "selected" : ""}>${escapeHtml(c.equipment)} — ${escapeHtml(c.name)}</option>`).join("")}</select>
      </label>
      <label class="fld">Neden<textarea id="chg-reason" placeholder="Arıza, performans, kayıp…"></textarea></label>
      <div class="actions mt-12"><button class="btn btn-primary" data-act="create-change">Talep oluştur</button></div>
    </div></div>`;
  }

  function pageDegisimDetail() {
    const j = job(state.id);
    if (!j || j.process !== "cihaz-degisimi") return notFound("Cihaz değişimi");
    const e = emp(j.employeeId);
    const p = pkg(j.packageId);
    let extra = "";
    if (j.status === "sistem-destek-kontrolunde" || j.status === "reddedildi") {
      extra = itemsTable(j, "support") +
        `<div class="card mb-12"><div class="card-b">
          ${j.status === "reddedildi" ? `<div class="callout danger"><b>Talep reddedildi — Destek'e döndü</b>${escapeHtml(j.ceoNote || "Gerekçe belirtilmedi")}. Talebi güncelleyip yeniden onaya gönderebilir veya iptal edebilirsiniz.</div>` : ""}
          ${j.inPackageCheck
            ? `<div class="callout ok"><b>Paket Dahilinde</b>CO / CEO onayına gönderilmez. Doğrudan depo sürecine geçer.</div>`
            : `<div class="callout warn"><b>Paket Dışı — CO / CEO Onayı Gerekli</b>${escapeHtml(j.requestedEquipment || "")} title paketinde yok.</div>`}
          <p class="muted">${escapeHtml(j.changeReason || "")}</p>
          <div class="actions mt-12">
            ${j.inPackageCheck
              ? `<button class="btn btn-primary" data-act="send-wh">Depo Sürecine Gönder</button>`
              : `<button class="btn btn-primary" data-act="send-ceo">CO / CEO Onayına Gönder</button>`}
          </div>
        </div></div>`;
    } else if (j.status === "ceo-onayi-bekliyor") extra = ceoPanel(j);
    else if (["depo-hazirliginda", "seri-secildi"].includes(j.status)) {
      extra = warehouseTable(j) + `<div class="actions mb-12"><button class="btn btn-primary" data-act="create-waybill" ${allSerials(j) ? "" : "disabled"}>Sevk İrsaliyesi Oluştur</button></div>`;
    } else if (j.status === "merkeze-ulasti") {
      extra = itemsTable(j, "view") + waybillCard(j) +
        `<button class="btn btn-primary mb-12" data-act="start-check">Teslim al ve kontrole geç</button>`;
    } else if (j.status === "teknik-kontrol-bekliyor") extra = checkPanel(j);
    else if (["zimmet-formu-bekliyor", "tamamlandi"].includes(j.status)) extra = itemsTable(j, "view") + (j.waybill ? waybillCard(j) : "") + oldDevicePanel(j) + formCard(j);
    else extra = itemsTable(j, "view") + (j.waybill ? waybillCard(j) : "");
    return `${crumb([{ t: "Cihaz Değişimi", h: "#/cihaz-degisimi" }, { t: j.no }])}
      ${pageHead(`${e ? e.name : ""} — cihaz değişimi`, j.no, "")}
      ${stepper(CH_STEPS, stepIndex(j))}
      ${nowBox(j)}
      ${integBar()}
      ${personBlock(e, p ? `<div class="callout info mt-12"><b>${escapeHtml(p.name)}</b></div>` : "")}
      ${extra}
      ${historyList(j)}`;
  }

  function oldDevicePanel(j) {
    if (j.process !== "cihaz-degisimi") return "";
    const old = (j.items || []).find((it) => /mevcut/i.test(it.equipment));
    if (!old) return "";
    const conds = [
      ["yeniden", "Yeniden Kullanıma Uygun", "on-ok"],
      ["bakim", "Bakım Gerekiyor", "on-warn"],
      ["hurda", "Kullanılamaz / Hurda", "on-bad"],
    ];
    return `<div class="card mb-12"><div class="card-h"><h3>Mevcut cihaz — teslim al</h3></div><div class="card-b">
      <div class="callout warn"><b>İş kuralı</b>Yeni cihaz teslim edilmeden değişim tamamlanamaz. Mevcut cihazın durumu belirlenmeden süreç kapatılamaz.</div>
      <p><b>${escapeHtml(old.name)}</b> · <span class="mono">${escapeHtml(old.serial || "—")}</span></p>
      <div class="cond-btns mt-12">
        ${conds.map(([k, lab, cls]) => `<button class="btn btn-sm ${old.returnCondition === k ? cls : ""}" data-act="ret-cond" data-iid="${old.id}" data-v="${k}">${lab}</button>`).join("")}
      </div>
      ${old.returnCondition ? `<div class="callout ok mt-12"><b>Durum seçildi</b>Asset durumu bu sonuca göre güncellenir. Eski zimmet kapanır, yeni zimmet oluşur, geçmiş korunur.</div>` : ""}
    </div></div>`;
  }

  function pagePaketler() {
    return `${crumb([{ t: "Tanımlar", h: "#/dashboard" }, { t: "Ekipman Paketleri" }])}
      ${pageHead("Ekipman Paketleri", "Title / ünvana göre standart ekipman setleri. İşe başlangıçta otomatik gelir.", `<button class="btn btn-primary" data-act="goto" data-to="#/paketler/yeni">Yeni paket</button>`)}
      <div class="card"><table class="data">
        <thead><tr><th>Paket adı</th><th>Title</th><th>Ekipman</th><th>Durum</th><th></th></tr></thead>
        <tbody>${db.packages.map((p) => `<tr data-act="goto" data-to="#/paketler/${p.id}">
          <td><b>${escapeHtml(p.name)}</b><div class="muted">${escapeHtml(p.description || "")}</div></td>
          <td>${escapeHtml(p.title)}</td>
          <td>${p.items.map((i) => `${i.equipment} ×${i.qty}`).join(", ")}</td>
          <td>${p.active ? badge("tamamlandi") : `<span class="badge st-draft">Pasif</span>`}</td>
          <td><button class="btn btn-sm" data-act="goto" data-to="#/paketler/${p.id}">Düzenle</button></td>
        </tr>`).join("")}</tbody>
      </table></div>`;
  }

  function pagePaketDetail() {
    const isNew = state.id === "yeni";
    if (isNew && !state.form.pkgDraft) {
      state.form.pkgDraft = { id: "new", name: "", title: "", description: "", active: true, items: [{ equipment: "Laptop", productCode: "NB-LNV-T14", qty: 1, note: "" }] };
    }
    const p = isNew ? state.form.pkgDraft : pkg(state.id);
    if (!p) return notFound("Paket");
    const titles = [...new Set(db.employees.map((e) => e.title))];
    return `${crumb([{ t: "Ekipman Paketleri", h: "#/paketler" }, { t: isNew ? "Yeni" : p.name }])}
      ${pageHead(isNew ? "Yeni ekipman paketi" : p.name, "Title eşleşmesi işe başlangıçta otomatik paket getirir.", "")}
      <div class="card mb-12"><div class="card-b">
        <div class="form-grid">
          <label class="fld">Paket adı<input id="pkg-name" value="${escapeAttr(p.name)}" /></label>
          <label class="fld">Title / ünvan
            <input id="pkg-title" list="title-list" value="${escapeAttr(p.title)}" />
            <datalist id="title-list">${titles.map((t) => `<option value="${escapeAttr(t)}">`).join("")}</datalist>
          </label>
          <label class="fld full">Açıklama<input id="pkg-desc" value="${escapeAttr(p.description || "")}" /></label>
          <label class="fld">Durum
            <select id="pkg-active"><option value="1" ${p.active ? "selected" : ""}>Aktif</option><option value="0" ${!p.active ? "selected" : ""}>Pasif</option></select>
          </label>
        </div>
      </div></div>
      <div class="card mb-12"><div class="card-h"><h3>Ekipman</h3><button class="btn btn-sm" data-act="pkg-add-row">Satır ekle</button></div>
        <table class="data"><thead><tr><th>Ekipman</th><th>Logo ürün</th><th>Adet</th><th>Açıklama</th></tr></thead>
        <tbody>${p.items.map((it, i) => `<tr>
          <td><input value="${escapeAttr(it.equipment)}" data-pkg-i="${i}" data-pkg-f="equipment" /></td>
          <td><select data-pkg-i="${i}" data-pkg-f="productCode">${db.logoCatalog.map((c) => `<option value="${c.productCode}" ${c.productCode === it.productCode ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select></td>
          <td><input type="number" min="1" value="${it.qty}" data-pkg-i="${i}" data-pkg-f="qty" style="width:72px" /></td>
          <td><input value="${escapeAttr(it.note || "")}" data-pkg-i="${i}" data-pkg-f="note" /></td>
        </tr>`).join("")}</tbody></table>
      </div>
      <button class="btn btn-primary" data-act="save-pkg">Kaydet</button>`;
  }

  function pageOnaylarim() {
    const role = user().role;
    const rows = db.jobs.filter((j) => {
      if (role === "personnel") return awaitingPersonnel(j);
      if (role === "ceo" || role === "admin") return j.status === "ceo-onayi-bekliyor" || awaitingPersonnel(j);
      if (role === "support") return ["sistem-destek-kontrolunde", "reddedildi"].includes(j.status) || awaitingPersonnel(j);
      return false;
    });
    return `${crumb([{ t: "İş Takibi", h: "#/dashboard" }, { t: "Onaylarım" }])}
      ${pageHead("Onaylarım", role === "personnel" ? "Size gönderilen zimmet formlarını dijital imza veya elektronik onay ile tamamlayın." : "Sizden beklenen ekipman, paket dışı, CO/CEO ve personel zimmet onayları.", "")}
      <div class="card"><table class="data">
        <thead><tr><th>Talep No</th><th>Personel</th><th>Talep Türü</th><th>Açıklama</th><th>Tarih</th><th>SLA</th><th>Durum</th><th>Aksiyon</th></tr></thead>
        <tbody>${rows.map((j) => {
          const e = emp(j.employeeId);
          const extra = (j.items || []).filter((i) => i.extra).map((i) => i.equipment).join(", ");
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td>${escapeHtml(e ? e.name : "")}</td>
            <td>${PROCESS_TR[j.process]}</td>
            <td>${escapeHtml(extra || j.changeReason || j.supportNote || (awaitingPersonnel(j) ? "Zimmet formu — personel onayı" : "Paket / ekipman onayı"))}</td>
            <td>${escapeHtml((j.createdAt || "").slice(0, 10))}</td>
            <td>${slaBadge(j)}</td>
            <td>${badge(j.status, j.process, j)}</td>
            <td><button class="btn btn-sm" data-act="goto" data-to="${jobHref(j)}">Görüntüle</button>
              ${(role === "ceo" || role === "admin") && j.status === "ceo-onayi-bekliyor" ? `<button class="btn btn-sm btn-primary" data-act="goto" data-to="${jobHref(j)}">Onayla</button>` : ""}
            </td>
          </tr>`;
        }).join("") || `<tr><td colspan="8"><div class="empty">Bekleyen onayınız yok.</div></td></tr>`}</tbody>
      </table></div>`;
  }

  function pageIslerim() {
    const name = user().name;
    const f = state.jobFilters;
    const rows = db.jobs.filter((j) => {
      if (f.status !== "all" && j.status !== f.status) return false;
      if (f.q) {
        const e = emp(j.employeeId);
        if (!`${j.no} ${e ? e.name : ""} ${PROCESS_TR[j.process]}`.toLowerCase().includes(f.q.toLowerCase())) return false;
      }
      return (j.history || []).some((h) => h.who === name) || j.createdBy === name ||
        (user().role === "ceo" && j.status === "ceo-onayi-bekliyor") ||
        (user().role === "warehouse" && ["depo-hazirliginda", "seri-secildi"].includes(j.status)) ||
        (user().role === "personnel" && awaitingPersonnel(j)) ||
        user().role === "admin" || user().role === "support";
    });
    return `${crumb([{ t: "İş Takibi", h: "#/dashboard" }, { t: "Tüm İşlerim" }])}
      ${pageHead("Tüm İşlerim", "Dahil olduğunuz işe başlangıç, iade, devir ve değişim süreçleri.", "")}
      <div class="filters">
        <input id="job-q" placeholder="Personel / iş no" value="${escapeAttr(f.q)}" />
        <select id="job-proc">
          <option value="all">Süreç türü</option>
          ${Object.entries(PROCESS_TR).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}
        </select>
        <select id="job-st-sel">
          <option value="all" ${f.status === "all" ? "selected" : ""}>Durum</option>
          ${Object.entries(STATUS_TR).map(([k, v]) => `<option value="${k}" ${f.status === k ? "selected" : ""}>${v}</option>`).join("")}
        </select>
      </div>
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Süreç</th><th>Personel</th><th>Lokasyon</th><th>Bekleyen aksiyon</th><th>SLA</th><th>Durum</th><th>Tarih</th></tr></thead>
        <tbody>${rows.map((j) => {
          const e = emp(j.employeeId);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td>${PROCESS_TR[j.process]}</td>
            <td>${escapeHtml(e ? e.name : "")}</td>
            <td>${escapeHtml(j.location)}</td>
            <td class="muted">${escapeHtml(contextFor(j).expected)}</td>
            <td>${slaBadge(j)}</td>
            <td>${badge(j.status, j.process, j)}</td>
            <td>${escapeHtml((j.createdAt || "").slice(0, 16))}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function pageOnayBeklenenler() {
    const rows = db.jobs.filter((j) => ["ceo-onayi-bekliyor", "sistem-destek-kontrolunde", "depo-hazirliginda"].includes(j.status));
    return `${crumb([{ t: "İş Takibi", h: "#/dashboard" }, { t: "Onay Beklenenler" }])}
      ${pageHead("Onay Beklenenler", "Süreçte duran zimmet ve paket dışı talepler.", "")}
      <div class="card"><table class="data">
        <thead><tr><th>İş No</th><th>Süreç</th><th>Personel</th><th>Bekleyen</th><th>Durum</th></tr></thead>
        <tbody>${rows.map((j) => {
          const e = emp(j.employeeId);
          const c = contextFor(j);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td>${PROCESS_TR[j.process]}</td>
            <td>${escapeHtml(e ? e.name : "")}</td>
            <td>${escapeHtml(c.waiting)}</td>
            <td>${badge(j.status, j.process, j)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>`;
  }

  function pageRaporlar() {
    const tiles = [
      { id: "onay-bekleyen", l: "Onay Bekleyen Zimmetler", n: db.jobs.filter((j) => ["ceo-onayi-bekliyor", "sistem-destek-kontrolunde"].includes(j.status)).length },
      { id: "ise-baslangic", l: "İşe Başlangıç Zimmetleri", n: jobsOf("ise-baslangic").length },
      { id: "isten-ayrilis", l: "İşten Ayrılışlar", n: jobsOf("isten-ayrilis").length },
      { id: "cihaz-degisimi", l: "Cihaz Değişimleri", n: jobsOf("cihaz-degisimi").length },
      { id: "zimmet-devri", l: "Zimmet Devirleri", n: jobsOf("zimmet-devri").length },
      { id: "depo", l: "Depo Transferleri", n: db.jobs.filter((j) => j.waybill).length },
      { id: "oos", l: "Stokta Olmayan Ekipmanlar", n: db.jobs.reduce((n, j) => n + (j.items || []).filter((i) => i.stockStatus === "yok" || i.stockQty === 0).length, 0) },
      { id: "durum", l: "Zimmet Durumları", n: db.zimmetler.length },
    ];
    let table = "";
    if (state.report === "oos") {
      const lines = [];
      db.jobs.forEach((j) => (j.items || []).forEach((it) => {
        if (it.stockStatus === "yok" || it.stockQty === 0) lines.push({ j, it, e: emp(j.employeeId) });
      }));
      table = `<table class="data"><thead><tr><th>İş</th><th>Personel</th><th>Ekipman</th><th>Logo</th><th>Süreç</th></tr></thead>
        <tbody>${lines.map((x) => `<tr data-act="goto" data-to="${jobHref(x.j)}"><td class="mono">${x.j.no}</td><td>${escapeHtml(x.e ? x.e.name : "")}</td><td>${escapeHtml(x.it.name)}</td><td class="mono">${escapeHtml(x.it.stockCode)}</td><td>${PROCESS_TR[x.j.process]}</td></tr>`).join("")}</tbody></table>`;
    } else if (state.report === "durum") {
      table = `<table class="data"><thead><tr><th>Zimmet No</th><th>Personel</th><th>Tür</th><th>Ekipman</th><th>Durum</th></tr></thead>
        <tbody>${db.zimmetler.map((z) => `<tr data-act="goto" data-to="#/zimmetler/${z.id}">
          <td class="mono">${z.no}</td><td>${escapeHtml((emp(z.employeeId) || {}).name || "")}</td><td>${TYPE_TR[z.type]}</td><td>${escapeHtml(z.equipment)}</td><td>${badge(z.status)}</td>
        </tr>`).join("")}</tbody></table>`;
    } else if (state.report === "depo") {
      const rows = db.jobs.filter((j) => j.waybill);
      table = `<table class="data"><thead><tr><th>İrsaliye</th><th>İş</th><th>Hedef</th><th>Tarih</th><th>Durum</th></tr></thead>
        <tbody>${rows.map((j) => `<tr data-act="goto" data-to="${jobHref(j)}"><td class="mono">${j.waybill}</td><td>${j.no}</td><td>${escapeHtml(j.waybillTarget || "")}</td><td>${escapeHtml(j.waybillDate || "")}</td><td>${badge(j.status)}</td></tr>`).join("")}</tbody></table>`;
    } else {
      const proc = ["ise-baslangic", "isten-ayrilis", "cihaz-degisimi", "zimmet-devri"].includes(state.report) ? state.report : null;
      const rows = proc ? jobsOf(proc) : db.jobs.filter((j) => ["ceo-onayi-bekliyor", "sistem-destek-kontrolunde"].includes(j.status));
      table = `<table class="data"><thead><tr><th>İş No</th><th>Süreç</th><th>Personel</th><th>Durum</th><th>Tarih</th></tr></thead>
        <tbody>${rows.map((j) => `<tr data-act="goto" data-to="${jobHref(j)}">
          <td class="mono">${j.no}</td><td>${PROCESS_TR[j.process]}</td><td>${escapeHtml((emp(j.employeeId) || {}).name || "")}</td><td>${badge(j.status, j.process, j)}</td><td>${escapeHtml((j.createdAt || "").slice(0, 16))}</td>
        </tr>`).join("")}</tbody></table>`;
    }
    return `${crumb([{ t: "İş Takibi", h: "#/dashboard" }, { t: "Raporlar" }])}
      ${pageHead("Raporlar", "Onay, süreç ve stok takibi.", "")}
      ${integBar()}
      <div class="report-grid">${tiles.map((t) => `<button class="report-tile" data-act="report" data-v="${t.id}">
        <div class="n">${t.n}</div><div class="l">${t.l}</div>
      </button>`).join("")}</div>
      <div class="card"><div class="card-h"><h3>${tiles.find((t) => t.id === state.report)?.l || "Rapor"}</h3></div>
        <div class="table-wrap">${table}</div></div>`;
  }

  function pageDepo() {
    const rows = db.jobs.filter((j) => ["depo-hazirliginda", "seri-secildi"].includes(j.status));
    return `${crumb([{ t: "Süreçler", h: "#/dashboard" }, { t: "Depo Hazırlık" }])}
      ${pageHead("Depo hazırlık ve sevkiyat", "Onaylanan veya doğrudan ilerleyen talepler. Seri numarası Logo ERP'den seçilir; sevk irsaliyesi Logo'da oluşur.", "")}
      ${integBar()}
      <div class="card"><table class="data">
        <thead><tr><th>Talep No</th><th>Personel</th><th>Süreç</th><th>Kalem</th><th>Seri</th><th>Durum</th></tr></thead>
        <tbody>${rows.map((j) => {
          const e = emp(j.employeeId);
          const ready = allSerials(j);
          return `<tr data-act="goto" data-to="${jobHref(j)}">
            <td class="mono">${j.no}</td>
            <td><b>${escapeHtml(e ? e.name : "")}</b></td>
            <td>${PROCESS_TR[j.process]}</td>
            <td>${(j.items || []).length}</td>
            <td>${ready ? `<span class="stock-ok">Tümü seçildi</span>` : `<span class="stock-no">Seri eksik</span>`}</td>
            <td>${badge(j.status, j.process, j)}</td>
          </tr>`;
        }).join("") || `<tr><td colspan="6"><div class="empty">Depo kuyruğu boş.</div></td></tr>`}</tbody>
      </table></div>`;
  }

  function pageAssetler() {
    const st = state.query.status || "all";
    const q = (state.q || "").toLowerCase();
    const rows = db.assets.filter((a) => {
      if (st !== "all" && a.status !== st) return false;
      if (q && !`${a.no} ${a.name} ${a.serial}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const statuses = ["In Stock", "Reserved", "In Transfer", "Ready For Assignment", "Assigned", "Returned", "Ready For Reassignment", "Maintenance", "Retired", "Lost", "Stolen"];
    return `${crumb([{ t: "Süreçler", h: "#/dashboard" }, { t: "Assetler" }])}
      ${pageHead("Asset durum yönetimi", "Tanımsız durum geçişine izin verilmez. Her değişiklik kullanıcı, tarih ve açıklama ile audit log'a yazılır.", "")}
      <div class="filters">
        <button class="chip ${st === "all" ? "on" : ""}" data-act="goto" data-to="#/assetler">Tümü</button>
        ${statuses.map((s) => `<button class="chip ${st === s ? "on" : ""}" data-act="goto" data-to="#/assetler?status=${encodeURIComponent(s)}">${s}</button>`).join("")}
      </div>
      <div class="card"><table class="data">
        <thead><tr><th>Asset No</th><th>Ürün</th><th>Seri</th><th>Durum</th><th>Zimmetli</th><th>Depo / Lokasyon</th></tr></thead>
        <tbody>${rows.map((a) => {
          const e = emp(a.employeeId);
          return `<tr data-act="goto" data-to="#/assetler/${a.id}">
            <td class="mono">${a.no}</td>
            <td><b>${escapeHtml(a.name)}</b><div class="muted">${escapeHtml(a.brand)} · ${escapeHtml(a.model)}</div></td>
            <td class="mono">${escapeHtml(a.serial)}</td>
            <td>${assetBadge(a.status)}</td>
            <td>${e ? escapeHtml(e.name) : "—"}</td>
            <td>${escapeHtml(a.warehouse)} · ${escapeHtml(a.location)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>
      <div class="pager"><span>${rows.length} asset</span></div></div>`;
  }

  function pageAssetDetail() {
    const a = db.assets.find((x) => x.id === state.id);
    if (!a) return notFound("Asset");
    const e = emp(a.employeeId);
    const allowed = db.assetTransitions.filter((t) => t.from === a.status);
    const role = user().role;
    const canAct = role === "support" || role === "admin" || (role === "warehouse" && a.status === "Reserved");
    return `${crumb([{ t: "Assetler", h: "#/assetler" }, { t: a.no }])}
      ${pageHead(a.no, `${a.name} · ${a.serial}`, "")}
      ${integBar()}
      <div class="grid-2b">
        <div class="card mb-12"><div class="card-h"><h3>Asset bilgileri</h3>
          <span class="integ-pill"><i class="dot"></i>Logo ERP ürün kartı</span></div>
          <div class="card-b">
            <dl class="dl">
              <dt>Ürün</dt><dd>${escapeHtml(a.name)}</dd>
              <dt>Marka / Model</dt><dd>${escapeHtml(a.brand)} · ${escapeHtml(a.model)}</dd>
              <dt>Seri No</dt><dd class="mono">${escapeHtml(a.serial)}</dd>
              <dt>Maliyet</dt><dd>${fmtMoney(a.cost)}</dd>
              <dt>Durum</dt><dd>${assetBadge(a.status)}</dd>
              <dt>Depo</dt><dd>${escapeHtml(a.warehouse)}</dd>
              <dt>Lokasyon</dt><dd>${escapeHtml(a.location)}</dd>
              <dt>Zimmetli</dt><dd>${e ? escapeHtml(e.name) : "—"}</dd>
            </dl>
          </div></div>
        <div class="card mb-12"><div class="card-h"><h3>İzin verilen geçişler</h3></div><div class="card-b">
          ${allowed.length ? allowed.map((t) => `<div class="callout info"><b>${escapeHtml(t.action)}</b>${escapeHtml(t.from)} → ${escapeHtml(t.to)} · ${escapeHtml(t.role)}
            ${canAct && ((role === "warehouse" && t.role.indexOf("Depo") >= 0) || role !== "warehouse")
              ? `<div class="mt-8"><button class="btn btn-sm btn-primary" data-act="asset-move" data-to="${escapeAttr(t.to)}" data-ev="${escapeAttr(t.action)}">${escapeHtml(t.action)}</button></div>` : ""}
          </div>`).join("") : `<div class="empty-inline">Bu durumdan tanımlı geçiş yok (Lost / Stolen uç durum).</div>`}
          ${!canAct ? `<p class="muted">Bu rol için durum değiştirme yetkisi yok.</p>` : ""}
        </div></div>
      </div>
      <div class="card"><div class="card-h"><h3>Durum geçmişi</h3></div><div class="card-b">
        ${(a.history && a.history.length) ? `<ul class="timeline">${a.history.slice().reverse().map((h) => `<li>
          <div class="when">${escapeHtml(h.t)} · ${escapeHtml(h.who)}</div>
          <div class="what">${escapeHtml(h.ev)}${h.note ? `<div class="muted">${escapeHtml(h.note)}</div>` : ""}</div>
        </li>`).join("")}</ul>` : `<p class="muted">Kayıtlı geçiş yok.</p>`}
      </div></div>`;
  }

  function pageOnayKurallari() {
    const isNew = state.id === "yeni";
    if (isNew) {
      return `${crumb([{ t: "Onay Kuralları", h: "#/onay-kurallari" }, { t: "Yeni kural" }])}
        ${pageHead("Yeni onay kuralı", "Kurallar parametrik tanımlanır. Süreçlere sabit kodlanmaz.", "")}
        <div class="card"><div class="card-b">
          <div class="form-grid">
            <label class="fld"><span class="req">Kural adı</span><input id="ar-name" placeholder="Örn. Paket dışı notebook" /></label>
            <label class="fld"><span class="req">Süreç</span>
              <select id="ar-proc">${db.approvalProcesses.map((p) => `<option>${escapeHtml(p)}</option>`).join("")}</select>
            </label>
            <label class="fld">SLA (iş günü)<input id="ar-sla" type="number" value="3" min="1" /></label>
            <label class="fld">Durum<select id="ar-active"><option value="1">Aktif</option><option value="0">Pasif</option></select></label>
            <label class="fld full">Kriterler (kullanıcı / ürün / operasyon / finansal)<textarea id="ar-crit" placeholder="Örn. Ürün grubu = Monitör ve tutar > 50.000 TL"></textarea></label>
            <label class="fld full">Onay seviyeleri (virgülle, sıralı)<input id="ar-levels" placeholder="Yönetici Onayı, Direktör Onayı, CO / CEO Onayı" /></label>
          </div>
          <div class="actions mt-12"><button class="btn btn-primary" data-act="save-rule">Kaydet</button></div>
        </div></div>`;
    }
    return `${crumb([{ t: "Tanımlar", h: "#/dashboard" }, { t: "Onay Kuralları" }])}
      ${pageHead("Parametrik onay yönetimi", "Her süreç için onay açık/kapalı yönetilir. Tek ve çok seviyeli yapı, varsayılan SLA 3 iş günü.", `<button class="btn btn-primary" data-act="goto" data-to="#/onay-kurallari/yeni">Yeni kural</button>`)}
      <div class="callout info"><b>SLA ve eskalasyon</b>1. iş günü hatırlatma · 2. iş günü ikinci hatırlatma · 3. iş günü otomatik eskalasyon (LDAP üst yönetici). Kanallar: uygulama içi, e-posta, görev listesi.</div>
      <div class="card mb-12"><div class="card-h"><h3>Süreç bazlı onay anahtarı</h3></div>
        <table class="data"><thead><tr><th>Süreç</th><th>Onay</th></tr></thead>
        <tbody>${db.approvalProcesses.map((p) => {
          const rule = db.approvalRules.find((r) => r.process === p);
          const on = rule ? rule.active : false;
          return `<tr><td>${escapeHtml(p)}</td><td>${on ? `<span class="stock-ok">Aktif</span>` : `<span class="muted">Pasif</span>`}</td></tr>`;
        }).join("")}</tbody></table></div>
      <div class="card"><div class="card-h"><h3>Kurallar</h3></div>
        <table class="data"><thead><tr><th>Kural</th><th>Süreç</th><th>Seviyeler</th><th>SLA</th><th>Durum</th></tr></thead>
        <tbody>${db.approvalRules.map((r) => `<tr>
          <td><b>${escapeHtml(r.name)}</b><div class="muted">${escapeHtml(r.criteria)}</div><div class="mini-note">${escapeHtml(r.example)}</div></td>
          <td>${escapeHtml(r.process)}</td>
          <td>${r.levels.length ? r.levels.join(" → ") : "Onaysız"}</td>
          <td>${r.slaDays} iş günü</td>
          <td>
            <label class="toggle"><input type="checkbox" data-act="toggle-rule" data-rid="${r.id}" ${r.active ? "checked" : ""}/> ${r.active ? "Aktif" : "Pasif"}</label>
          </td>
        </tr>`).join("")}</tbody></table></div>`;
  }

  function pageYetkiler() {
    const p = db.permissions;
    const cols = ["support", "warehouse", "ceo", "hr", "admin"];
    const labels = { support: "Destek", warehouse: "Depo", ceo: "CO/CEO", hr: "İK", admin: "Yönetici" };
    const table = (title, rows) => `<div class="card mb-12"><div class="card-h"><h3>${title}</h3></div>
      <table class="data matrix"><thead><tr><th>Yetki</th>${cols.map((c) => `<th>${labels[c]}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${escapeHtml(r.name)}</td>${cols.map((c) => `<td>${r[c] ? "●" : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return `${crumb([{ t: "Tanımlar", h: "#/dashboard" }, { t: "Yetkilendirme" }])}
      ${pageHead("Yetkilendirme", "Menü, ekran, buton, asset statü geçişi, rapor ve dashboard yetkileri parametrik yönetilir.", "")}
      ${table("Menü / ekran yetkileri", p.menus)}
      ${table("Buton yetkileri", p.buttons)}
      <div class="card"><div class="card-h"><h3>Asset statü geçiş yetkileri</h3></div>
        <table class="data"><thead><tr><th>Mevcut</th><th>Aksiyon</th><th>Yeni</th><th>Rol</th></tr></thead>
        <tbody>${db.assetTransitions.map((t) => `<tr><td>${t.from}</td><td>${t.action}</td><td>${t.to}</td><td>${t.role}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function pageAudit() {
    return `${crumb([{ t: "İzleme", h: "#/dashboard" }, { t: "Audit Log" }])}
      ${pageHead("Audit log", "Onay ve durum hareketleri silinemez / değiştirilemez. İşlem no, süreç, adım, onaycı, sonuç, ret nedeni, önceki/sonraki durum.", "")}
      <div class="card"><table class="data">
        <thead><tr><th>Tarih</th><th>İşlem No</th><th>Süreç</th><th>Adım</th><th>Kullanıcı</th><th>Sonuç</th><th>Önceki</th><th>Sonraki</th><th>Açıklama</th></tr></thead>
        <tbody>${db.auditLogs.map((l) => `<tr>
          <td class="nowrap">${escapeHtml(l.t)}</td>
          <td class="mono">${escapeHtml(l.no)}</td>
          <td>${escapeHtml(l.process)}</td>
          <td>${escapeHtml(l.step)}</td>
          <td>${escapeHtml(l.who)}</td>
          <td>${escapeHtml(l.result)}</td>
          <td>${escapeHtml(l.from)}</td>
          <td>${escapeHtml(l.to)}</td>
          <td>${escapeHtml(l.note)}</td>
        </tr>`).join("")}</tbody>
      </table></div>`;
  }

  function notFound(what) {
    return `${pageHead(what + " bulunamadı", "")}<div class="card"><div class="empty"><h4>Kayıt yok</h4><p><a href="#/dashboard">Özete dön</a></p></div></div>`;
  }

  /* ---------- documents ---------- */
  function warehouseByName(name) {
    return db.warehouses.find((w) => w.name === name) || { name: name || "—", address: "", district: "", phone: "" };
  }
  function openDoc(html) {
    const w = window.open("", "_blank");
    if (!w) { toast("Açılır pencere engellendi", "err"); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  }
  function printChrome(title, inner) {
    return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
      <style>
        body{margin:0;background:#e8eaed;font:13px/1.45 "Segoe UI",sans-serif;color:#1c2430}
        .toolbar{position:sticky;top:0;display:flex;justify-content:space-between;padding:10px 16px;background:#101820;color:#fff}
        .toolbar button{padding:8px 14px;border:0;border-radius:6px;background:#0f5f73;color:#fff;cursor:pointer}
        .sheet{width:210mm;min-height:297mm;margin:18px auto;background:#fff;padding:14mm;box-shadow:0 8px 28px rgba(16,24,32,.18)}
        table{width:100%;border-collapse:collapse} th,td{border:1px solid #101820;padding:6px 8px;text-align:left}
        th{background:#f3f5f7;font-size:10px;text-transform:uppercase}
        @media print{.toolbar{display:none!important}.sheet{margin:0;box-shadow:none;width:auto}}
      </style></head><body>
      <div class="toolbar"><b>${escapeHtml(title)}</b><span><button onclick="window.print()">Yazdır / PDF</button></span></div>
      <div class="sheet">${inner}</div></body></html>`;
  }
  function printWaybill(j) {
    const e = emp(j.employeeId);
    const from = warehouseByName("IT Deposu");
    const to = warehouseByName(j.waybillTarget || "Merkez Depo");
    const rows = (j.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(it.stockCode)}</td><td>${escapeHtml(it.name)}</td><td>${escapeHtml(it.serial || "—")}</td><td>1</td></tr>`).join("");
    openDoc(printChrome("Sevk İrsaliyesi " + (j.waybill || ""), `
      <h2>SEVK İRSALİYESİ</h2>
      <p><b>Logo ERP → Sevk İrsaliyesi Oluşturuldu</b> · ${escapeHtml(j.waybill || "—")}<br>
      Personel: ${escapeHtml(e ? e.name : "")} · Süreç: ${PROCESS_TR[j.process]} · ${escapeHtml(j.no)}</p>
      <p>Gönderen: ${escapeHtml(from.name)} — ${escapeHtml(from.address)}<br>
      Alıcı / hedef: ${escapeHtml(to.name)} — ${escapeHtml(to.address)}</p>
      <table><thead><tr><th>#</th><th>Stok kodu</th><th>Mal</th><th>Seri no</th><th>Adet</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:24px;color:#5d6b7a;font-size:11px">Mock belge. Gerçek irsaliye Logo ERP e-İrsaliye ile kesilir.</p>`));
  }
  function printForm(j) {
    const e = emp(j.employeeId);
    const rows = (j.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(it.equipment)}</td><td>${escapeHtml(it.name)}</td><td>${escapeHtml(it.serial || "—")}</td></tr>`).join("");
    openDoc(printChrome("Zimmet Formu " + (j.formNo || j.no), `
      <h2>ZİMMET FORMU</h2>
      <p>${escapeHtml(e ? e.name : "")} · ${escapeHtml(e ? e.title : "")} · Sicil ${escapeHtml(e ? e.sicil : "")}<br>
      Form: ${escapeHtml(j.formNo || "—")} · ${PROCESS_TR[j.process]}</p>
      <table><thead><tr><th>#</th><th>Ekipman</th><th>Ürün</th><th>Seri no</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:32px">Teslim alan imza: ______________________ &nbsp; Teslim eden: ${escapeHtml(user().name)}</p>`));
  }

  function renderModal() {
    const m = state.modal;
    if (!m) return "";
    if (m.type === "serial") {
      const j = job(state.id);
      const it = j && j.items.find((x) => x.id === m.iid);
      const c = it && catalog(it.productCode);
      const f = state.serialFilters;
      const match = (val, q) => String(val || "").toLowerCase().includes(String(q || "").toLowerCase());
      const rows = serialRowsFor(it).filter((r) =>
        match(r.name, f.name) &&
        match(r.serial, f.serial) &&
        match(r.stockCode + " " + r.productCode, f.code) &&
        match(r.warehouse, f.warehouse) &&
        match(String(r.qty), f.stock) &&
        match(r.stockStatus, f.status)
      );
      const colFilter = (id, placeholder, val) =>
        `<input id="${id}" class="col-filter" placeholder="${placeholder}" value="${escapeAttr(val)}" />`;
      return `<div class="modal-back" data-act="close-modal"><div class="modal xl" data-act="stop">
        <div class="modal-h"><h3>Seri seç</h3><button class="btn btn-ghost" data-act="close-modal">Kapat</button></div>
        <div class="modal-b">
          <div class="logo-banner"><div></div><div>
            <b>Logo ERP'den seri ve stok bilgileri getirildi</b>
            <span class="muted">${escapeHtml(it ? it.name : "")} · ${escapeHtml(c ? c.stockCode : "")} · mevcut stok ${c ? c.qty : 0} adet</span>
          </div></div>
          <div class="table-wrap serial-table">
            <table class="data">
              <thead>
                <tr>
                  <th>Ürün adı</th>
                  <th>Ürün / stok kodu</th>
                  <th>Seri numarası</th>
                  <th>Depo</th>
                  <th>Mevcut stok</th>
                  <th>Stok durumu</th>
                  <th></th>
                </tr>
                <tr class="filter-row">
                  <th>${colFilter("sf-name", "Ürün adı ara", f.name)}</th>
                  <th>${colFilter("sf-code", "Kod ara", f.code)}</th>
                  <th>${colFilter("sf-serial", "Seri no ara", f.serial)}</th>
                  <th>${colFilter("sf-wh", "Depo ara", f.warehouse)}</th>
                  <th>${colFilter("sf-stock", "Stok ara", f.stock)}</th>
                  <th>${colFilter("sf-status", "Durum ara", f.status)}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>${rows.length ? rows.map((r) => `<tr class="${it && it.serial === r.serial ? "picked" : ""}">
                <td><b>${escapeHtml(r.name)}</b><div class="muted">${escapeHtml(r.brand)}${r.model ? " · " + escapeHtml(r.model) : ""}</div></td>
                <td class="mono">${escapeHtml(r.stockCode)}<div class="muted">${escapeHtml(r.productCode)}</div></td>
                <td class="mono">${escapeHtml(r.serial)}</td>
                <td>${escapeHtml(r.warehouse)}</td>
                <td class="right">${r.qty} adet</td>
                <td>${r.qty > 0 ? `<span class="stock-ok">${escapeHtml(r.stockStatus)}</span>` : `<span class="stock-no">Stokta Yok</span>`}</td>
                <td><button class="btn btn-sm btn-primary" data-act="set-serial" data-v="${escapeAttr(r.serial)}">${it && it.serial === r.serial ? "Seçili" : "Seç"}</button></td>
              </tr>`).join("") : `<tr><td colspan="7"><div class="empty"><h4>Kayıt bulunamadı</h4><p>Filtrelere uyan seri yok. Logo stokta seri yoksa alternatif ürün seçin.</p></div></td></tr>`}</tbody>
            </table>
          </div>
          <div class="pager"><span>${rows.length} seri · Logo ERP</span>
            ${(f.name || f.serial || f.code || f.warehouse || f.stock || f.status) ? `<button class="btn btn-sm" data-act="clear-serial-filters">Filtreleri temizle</button>` : ""}
          </div>
        </div>
      </div></div>`;
    }
    if (m.type === "alt") {
      const alts = db.logoCatalog.filter((c) => c.qty > 0);
      return `<div class="modal-back" data-act="close-modal"><div class="modal wide" data-act="stop">
        <div class="modal-h"><h3>Alternatif ekipman seç</h3><button class="btn btn-ghost" data-act="close-modal">Kapat</button></div>
        <div class="modal-b">
          <div class="logo-banner"><div>📦</div><div><b>Logo ERP stoktan alternatif</b></div></div>
          <table class="data"><thead><tr><th>Ürün</th><th>Stok kodu</th><th>Stok</th><th></th></tr></thead>
          <tbody>${alts.map((c) => `<tr>
            <td><b>${escapeHtml(c.equipment)}</b><div class="muted">${escapeHtml(c.name)}</div></td>
            <td class="mono">${escapeHtml(c.stockCode)}</td>
            <td>${c.qty}</td>
            <td><button class="btn btn-sm btn-primary" data-act="set-alt" data-code="${c.productCode}">Seç</button></td>
          </tr>`).join("")}</tbody></table>
        </div>
      </div></div>`;
    }
    if (m.type === "extra") {
      return `<div class="modal-back" data-act="close-modal"><div class="modal wide" data-act="stop">
        <div class="modal-h"><h3>Paket dışı ekipman ekle</h3><button class="btn btn-ghost" data-act="close-modal">Kapat</button></div>
        <div class="modal-b">
          <div class="callout warn"><b>CO / CEO Onayı Gerekli</b>Paket dışına çıkan her kalem onaya gider.</div>
          <table class="data"><thead><tr><th>Ürün</th><th>Stok</th><th></th></tr></thead>
          <tbody>${db.logoCatalog.map((c) => `<tr>
            <td>${escapeHtml(c.equipment)} — ${escapeHtml(c.name)}</td>
            <td>${c.qty > 0 ? "Stokta" : "Stokta Yok"}</td>
            <td><button class="btn btn-sm" data-act="add-extra" data-code="${c.productCode}">Ekle</button></td>
          </tr>`).join("")}</tbody></table>
          <label class="fld mt-12">Neden paket dışında?<input id="extra-why" placeholder="Gerekçe" /></label>
        </div>
      </div></div>`;
    }
    if (m.type === "reject") {
      return `<div class="modal-back" data-act="close-modal"><div class="modal" data-act="stop">
        <div class="modal-h"><h3>Talebi reddet</h3><button class="btn btn-ghost" data-act="close-modal">Kapat</button></div>
        <div class="modal-b">
          <div class="callout danger"><b>Ret sonrası</b>İşlem Sistem Destek Uzmanına döner. Uzman talebi güncelleyebilir veya iptal edebilir.</div>
          <label class="fld"><span class="req">Ret nedeni</span><textarea id="reject-why" placeholder="Neden reddedildiği net yazılmalıdır."></textarea></label>
        </div>
        <div class="modal-f">
          <button class="btn" data-act="close-modal">Vazgeç</button>
          <button class="btn btn-danger" data-act="ceo-no">Reddet</button>
        </div>
      </div></div>`;
    }
    if (m.type === "cancel") {
      return `<div class="modal-back" data-act="close-modal"><div class="modal" data-act="stop">
        <div class="modal-h"><h3>Talebi iptal et</h3><button class="btn btn-ghost" data-act="close-modal">Kapat</button></div>
        <div class="modal-b">
          <div class="callout warn"><b>Süreç sonlandırılır</b>İptal edilen talep yeniden açılamaz. Yeni talep oluşturulmalıdır.</div>
          <label class="fld">Açıklama<textarea id="cancel-why" placeholder="İptal gerekçesi"></textarea></label>
        </div>
        <div class="modal-f">
          <button class="btn" data-act="close-modal">Vazgeç</button>
          <button class="btn btn-danger" data-act="confirm-cancel">İptal et</button>
        </div>
      </div></div>`;
    }
    return "";
  }

  function currentJob() { return job(state.id); }

  function page() {
    const r = state.route;
    const id = state.id;
    if (r === "dashboard") return pageDashboard();
    if (r === "zimmetler" && id) return pageZimmetDetail();
    if (r === "zimmetler") return pageZimmetler();
    if (r === "ise-baslangic" && id === "yeni") return pageOnboardingNew();
    if (r === "ise-baslangic" && id) return pageOnboardingDetail();
    if (r === "ise-baslangic") return pageOnboardingList();
    if (r === "isten-ayrilis" && id === "yeni") return pageOffboardingNew();
    if (r === "isten-ayrilis" && id) return pageOffboardingDetail();
    if (r === "isten-ayrilis") return pageOffboardingList();
    if (r === "zimmet-devri" && id) return pageDevirDetail();
    if (r === "zimmet-devri") return pageDevirList();
    if (r === "cihaz-degisimi" && id === "yeni") return pageDegisimNew();
    if (r === "cihaz-degisimi" && id) return pageDegisimDetail();
    if (r === "cihaz-degisimi") return pageDegisimList();
    if (r === "paketler" && id) return pagePaketDetail();
    if (r === "paketler") return pagePaketler();
    if (r === "onaylarim") return pageOnaylarim();
    if (r === "islerim") return pageIslerim();
    if (r === "onay-beklenenler") return pageOnayBeklenenler();
    if (r === "raporlar") return pageRaporlar();
    if (r === "depo") return pageDepo();
    if (r === "assetler" && id) return pageAssetDetail();
    if (r === "assetler") return pageAssetler();
    if (r === "onay-kurallari") return pageOnayKurallari();
    if (r === "yetkiler") return pageYetkiler();
    if (r === "audit") return pageAudit();
    return pageDashboard();
  }

  function render() {
    parseRoute();
    const active = document.activeElement;
    const aid = active && active.id;
    const start = active && typeof active.selectionStart === "number" ? active.selectionStart : null;
    const end = active && typeof active.selectionEnd === "number" ? active.selectionEnd : null;
    document.getElementById("root").innerHTML = layout(page());
    if (aid) {
      const el = document.getElementById(aid);
      if (el) {
        el.focus();
        if (start != null && el.setSelectionRange) {
          try { el.setSelectionRange(start, end); } catch (err) {}
        }
      }
    }
  }

  function itemsFromPackage(p) {
    return p.items.map((it, i) => {
      const c = catalog(it.productCode);
      const qty = c ? c.qty : 0;
      return {
        id: "ni-" + Date.now() + "-" + i,
        equipment: it.equipment,
        productCode: it.productCode,
        name: c ? c.name : it.equipment,
        stockCode: c ? c.stockCode : "",
        qty: it.qty,
        inPackage: true,
        extra: false,
        extraReason: "",
        stockStatus: qty > 0 ? "stokta" : "yok",
        stockQty: qty,
        warehouse: c ? c.warehouse : "IT Deposu",
        serial: null,
      };
    });
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el) {
      if (!ev.target.closest("#notif-pop") && !ev.target.closest("[data-act=toggle-notif]") && state.notifOpen) {
        state.notifOpen = false; render();
      }
      return;
    }
    const act = el.getAttribute("data-act");
    if (act === "stop") { ev.stopPropagation(); return; }
    if (act === "goto") { go(el.getAttribute("data-to")); return; }
    if (act === "toggle-notif") { state.notifOpen = !state.notifOpen; render(); return; }
    if (act === "read-notif") {
      const n = db.notifications.find((x) => x.id === el.getAttribute("data-nid"));
      if (n) n.unread = false;
      return;
    }
    if (act === "close-modal") { if (el.classList.contains("modal")) return; state.modal = null; render(); return; }
    if (act === "job-st") { state.jobFilters.status = el.getAttribute("data-v"); render(); return; }
    if (act === "report") { state.report = el.getAttribute("data-v"); render(); return; }
    if (act === "sign-m") { state.signMethod = el.getAttribute("data-v"); render(); return; }
    if (act === "pick-emp") { state.form.empId = el.getAttribute("data-eid"); state.ldapQ = ""; render(); return; }
    if (act === "clear-emp") { state.form = {}; render(); return; }
    if (act === "create-onb") {
      const e = emp(state.form.empId);
      const p = pkgByTitle(e.title);
      const start = (document.getElementById("onb-start") || {}).value;
      const delivery = (document.getElementById("onb-delivery") || {}).value;
      if (!e || !p) { toast("Paket veya personel eksik", "err"); return; }
      if (!start || !delivery) { toast("İşe giriş tarihi ve cihaz teslim tarihi zorunludur.", "err"); return; }
      const nj = {
        id: "job-onb-" + Date.now(),
        no: nextJobNo("IB"),
        process: "ise-baslangic",
        employeeId: e.id,
        packageId: p.id,
        status: "sistem-destek-kontrolunde",
        location: e.location,
        createdAt: nowStamp(),
        createdBy: user().name,
        startDate: start,
        deliveryDate: delivery,
        slaDays: 3,
        slaDue: "2026-08-22",
        slaStatus: "ok",
        approver: "Ayşe Demir",
        supportNote: "",
        waybill: null,
        waybillTarget: "Genel Merkez",
        needsCeo: false,
        history: [],
        items: itemsFromPackage(p),
      };
      addHist(nj, "LDAP'tan personel seçildi", e.name);
      addHist(nj, "Ekipman paketi otomatik getirildi", p.name);
      addHist(nj, "İşe başlangıç talebi oluşturuldu", "Sistem Destek kontrolüne düştü");
      audit({ no: nj.no, process: "İşe Başlangıç", step: "Personel seçimi", result: "Oluşturuldu", from: "—", to: "Sistem Destek Kontrolünde", note: e.name + " · LDAP" });
      db.jobs.unshift(nj);
      db.notifications.unshift({ id: "n-" + Date.now(), title: "İşe Başlangıç Talebi Oluşturuldu", body: e.name + " — " + p.name, t: "şimdi", unread: true, to: "#/ise-baslangic/" + nj.id, roles: ["support", "admin"] });
      state.form = {};
      toast("Talep oluşturuldu — Sistem Destek kontrolünde");
      go("#/ise-baslangic/" + nj.id);
      return;
    }
    if (act === "open-alt") { state.modal = { type: "alt", iid: el.getAttribute("data-iid") }; render(); return; }
    if (act === "open-extra") { state.modal = { type: "extra" }; render(); return; }
    if (act === "open-serial") {
      state.serialFilters = { name: "", serial: "", code: "", warehouse: "", stock: "", status: "" };
      state.modal = { type: "serial", iid: el.getAttribute("data-iid") };
      render(); return;
    }
    if (act === "clear-serial-filters") {
      state.serialFilters = { name: "", serial: "", code: "", warehouse: "", stock: "", status: "" };
      render(); return;
    }
    if (act === "set-alt") {
      const j = currentJob();
      const it = j.items.find((x) => x.id === state.modal.iid);
      const c = catalog(el.getAttribute("data-code"));
      if (it && c) {
        it.alternativeOf = it.name;
        it.productCode = c.productCode;
        it.name = c.name;
        it.stockCode = c.stockCode;
        it.stockQty = c.qty;
        it.stockStatus = c.qty > 0 ? "stokta" : "yok";
        it.equipment = c.equipment;
        const p = pkg(j.packageId);
        it.inPackage = !!(p && p.items.some((x) => x.equipment === c.equipment));
        it.extra = !it.inPackage;
        addHist(j, "Alternatif ekipman seçildi", c.name);
        toast("Alternatif bağlandı: " + c.name);
      }
      state.modal = null; render(); return;
    }
    if (act === "add-extra") {
      const j = currentJob();
      const c = catalog(el.getAttribute("data-code"));
      const why = (document.getElementById("extra-why") || {}).value || "Paket dışı talep";
      if (j && c) {
        j.items.push({
          id: "ex-" + Date.now(),
          equipment: c.equipment,
          productCode: c.productCode,
          name: c.name,
          stockCode: c.stockCode,
          qty: 1,
          inPackage: false,
          extra: true,
          extraReason: why,
          stockStatus: c.qty > 0 ? "stokta" : "yok",
          stockQty: c.qty,
          warehouse: c.warehouse,
          serial: null,
        });
        j.needsCeo = true;
        addHist(j, "Paket dışı ekipman eklendi", c.name);
        toast("Paket dışı kalem eklendi — CO/CEO onayı gerekir", "err");
      }
      state.modal = null; render(); return;
    }
    if (act === "set-serial") {
      const j = currentJob();
      const it = j.items.find((x) => x.id === state.modal.iid);
      if (it) it.serial = el.getAttribute("data-v");
      if (allSerials(j) && j.status === "depo-hazirliginda") {
        j.status = "seri-secildi";
        addHist(j, "Tüm seri numaraları seçildi", "Logo ERP");
      }
      state.modal = null;
      toast("Seri bağlandı");
      render(); return;
    }
    if (act === "send-ceo") {
      const j = currentJob();
      const note = (document.getElementById("support-note") || {}).value;
      if (note) j.supportNote = note;
      j.status = "ceo-onayi-bekliyor";
      j.needsCeo = true;
      addHist(j, "CO / CEO onayına gönderildi", j.supportNote);
      toast("CO / CEO onay kuyruğuna düştü");
      render(); return;
    }
    if (act === "send-wh") {
      const j = currentJob();
      const note = (document.getElementById("support-note") || {}).value;
      if (note) j.supportNote = note;
      if ((j.items || []).some((it) => it.stockStatus === "yok" || it.stockQty === 0)) {
        toast("Stokta olmayan kalem var. Alternatif seçin veya paket dışına alın.", "err");
        return;
      }
      j.status = "depo-hazirliginda";
      addHist(j, "Sistem Destek kontrolü tamamlandı", "Depo sürecine gönderildi");
      toast("Depo sorumlusu kuyruğuna düştü");
      render(); return;
    }
    if (act === "ceo-ok") {
      const j = currentJob();
      j.status = "depo-hazirliginda";
      j.ceoDecision = "onay";
      j.ceoAt = nowStamp();
      j.approvalHistory = j.approvalHistory || [];
      j.approvalHistory.push({ step: "CO / CEO Onayı", who: user().name, result: "Onaylandı", t: nowStamp(), note: "" });
      addHist(j, "CO / CEO onayladı", "Talep depo hazırlık sürecine yönlendirildi");
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "CO / CEO Onayı", result: "Onaylandı", from: "Onay Bekliyor", to: "Depo Hazırlığında" });
      db.notifications.unshift({ id: "n-" + Date.now(), title: "Talep Onaylandı", body: (emp(j.employeeId) || {}).name + " — depo hazırlığına düştü", t: "şimdi", unread: true, to: jobHref(j), roles: ["support", "warehouse", "admin"] });
      toast("Onaylandı — depo hazırlığı");
      render(); return;
    }
    if (act === "open-reject") { state.modal = { type: "reject" }; render(); return; }
    if (act === "cancel-job") { state.modal = { type: "cancel" }; render(); return; }
    if (act === "confirm-cancel") {
      const j = currentJob();
      const why = (document.getElementById("cancel-why") || {}).value || "İptal";
      j.status = "iptal-edildi";
      addHist(j, "Talep iptal edildi", why);
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "İptal", result: "İptal Edildi", from: "—", to: "İptal Edildi", note: why });
      state.modal = null;
      toast("Süreç sonlandırıldı", "err");
      render(); return;
    }
    if (act === "submit-draft") {
      const j = currentJob();
      const start = (document.getElementById("onb-start") || {}).value;
      const delivery = (document.getElementById("onb-delivery") || {}).value;
      if (!start || !delivery) { toast("İşe giriş ve cihaz teslim tarihi zorunludur.", "err"); return; }
      j.startDate = start;
      j.deliveryDate = delivery;
      j.status = "sistem-destek-kontrolunde";
      addHist(j, "Taslak gönderildi", "Sistem Destek kontrolüne düştü");
      toast("Sistem Destek kontrolüne iletildi");
      render(); return;
    }
    if (act === "tech-result") {
      const j = currentJob();
      j.techResult = el.getAttribute("data-v");
      render(); return;
    }
    if (act === "damage-report") {
      const j = currentJob();
      const note = (document.getElementById("damage-note") || {}).value;
      if (!note) { toast("Hasar açıklaması zorunludur.", "err"); return; }
      j.damageNote = note;
      j.damageReportNo = "HZR-2026-" + (40 + db.jobs.length);
      (j.items || []).forEach((it) => { it.serial = null; it.stockStatus = "yok"; });
      j.status = "depo-hazirliginda";
      j.techResult = null;
      j.checks = defaultChecks();
      addHist(j, "Hasarlı ürün raporu oluşturuldu", j.damageReportNo + " · " + note);
      addHist(j, "Ürün depoya iade · yeni ürün talep edildi", "Depo hazırlık yeniden başladı");
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "Teknik kontrol", result: "Hasarlı", from: "Teknik Kontrolde", to: "Depo Hazırlığında", note: note });
      db.notifications.unshift({ id: "n-" + Date.now(), title: "Depo Hazırlığı Bekliyor", body: "Hasarlı ürün yerine yeni ürün — " + (emp(j.employeeId) || {}).name, t: "şimdi", unread: true, to: jobHref(j), roles: ["warehouse", "admin"] });
      toast("Hasarlı ürün raporu oluştu — depo süreci yeniden başladı", "err");
      render(); return;
    }
    if (act === "create-off") {
      const e = emp(state.form.empId);
      const owned = db.zimmetler.filter((z) => z.employeeId === e.id);
      const nj = {
        id: "job-off-" + Date.now(),
        no: nextJobNo("IA"),
        process: "isten-ayrilis",
        employeeId: e.id,
        status: "isten-ayrilis-bekliyor",
        location: e.location,
        createdAt: nowStamp(),
        createdBy: user().name,
        waybill: null,
        waybillTarget: "Merkez Depo",
        history: [],
        items: owned.map((z, i) => ({ id: "off-" + i, equipment: z.equipment, name: z.name, serial: z.serial, stockCode: "", productCode: "", returnCondition: null, returnChecks: { model: false, serial: false, accessory: false, damage: false }, returnNote: "" })),
      };
      e.status = "offboarding";
      addHist(nj, "İK işten ayrılış kaydı oluşturdu", owned.length + " aktif zimmet listelendi");
      db.jobs.unshift(nj);
      db.notifications.unshift({ id: "n-" + Date.now(), title: "İşten Ayrılış Kaydı Oluşturuldu", body: e.name + " — " + owned.length + " zimmet iadesi bekleniyor", t: "şimdi", unread: true, to: "#/isten-ayrilis/" + nj.id, roles: ["support", "admin"] });
      state.form = {};
      toast("İade kaydı oluşturuldu — Sistem Destek'e bildirim gitti");
      go("#/isten-ayrilis/" + nj.id);
      return;
    }
    if (act === "toggle-rule") {
      const r = db.approvalRules.find((x) => x.id === el.getAttribute("data-rid"));
      if (r) { r.active = el.checked; audit({ no: r.id, process: r.process, step: "Onay kuralı", result: r.active ? "Aktif" : "Pasif", note: r.name }); toast("Kural " + (r.active ? "aktif" : "pasif")); }
      render(); return;
    }
    if (act === "save-rule") {
      const name = (document.getElementById("ar-name") || {}).value;
      if (!name) { toast("Kural adı zorunlu", "err"); return; }
      const levels = ((document.getElementById("ar-levels") || {}).value || "").split(",").map((s) => s.trim()).filter(Boolean);
      db.approvalRules.unshift({
        id: "ar-" + Date.now(),
        name,
        process: (document.getElementById("ar-proc") || {}).value,
        active: (document.getElementById("ar-active") || {}).value === "1",
        levels,
        slaDays: Number((document.getElementById("ar-sla") || {}).value || 3),
        criteria: (document.getElementById("ar-crit") || {}).value || "",
        example: "",
      });
      toast("Onay kuralı kaydedildi");
      go("#/onay-kurallari");
      return;
    }
    if (act === "asset-move") {
      const a = db.assets.find((x) => x.id === state.id);
      const to = el.getAttribute("data-to");
      const evn = el.getAttribute("data-ev");
      if (!a) return;
      const allowed = db.assetTransitions.some((t) => t.from === a.status && t.to === to);
      if (!allowed) { toast("Bu durum geçişine izin verilmiyor.", "err"); return; }
      const from = a.status;
      a.status = to;
      a.history = a.history || [];
      a.history.push({ t: nowStamp(), who: user().name, ev: from + " → " + to, note: evn });
      if (to === "Retired") a.warehouse = "Hurda Depo";
      audit({ no: a.no, process: "Asset durum", step: evn, result: to, from, to, note: evn });
      toast(from + " → " + to);
      render(); return;
    }
    if (act === "ceo-no") {
      const j = currentJob();
      const why = (document.getElementById("reject-why") || {}).value;
      if (!why) { toast("Ret nedeni zorunludur.", "err"); return; }
      j.status = "reddedildi";
      j.ceoDecision = "red";
      j.ceoNote = why;
      j.ceoAt = nowStamp();
      j.approvalHistory = j.approvalHistory || [];
      j.approvalHistory.push({ step: "CO / CEO Onayı", who: user().name, result: "Reddedildi", t: nowStamp(), note: why });
      addHist(j, "CO / CEO reddetti", why);
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "CO / CEO Onayı", result: "Reddedildi", from: "Onay Bekliyor", to: "Reddedildi", note: why });
      db.notifications.unshift({ id: "n-" + Date.now(), title: "Talep Reddedildi", body: (emp(j.employeeId) || {}).name + " — " + why, t: "şimdi", unread: true, to: jobHref(j), roles: ["support", "admin"] });
      state.modal = null;
      toast("Reddedildi — Sistem Destek'e döndü", "err");
      render(); return;
    }
    if (act === "create-waybill") {
      const j = currentJob();
      if (!allSerials(j)) { toast("Tüm seriler seçilmeli", "err"); return; }
      j.waybill = "IRS-2026-" + (1200 + db.jobs.filter((x) => x.waybill).length);
      j.waybillDate = nowStamp();
      if (j.process === "isten-ayrilis") {
        j.status = "merkez-depoya-sevk";
        j.waybillTarget = "Merkez Depo";
      } else {
        j.status = "sevk-irsaliyesi-olusturuldu";
        setTimeout(() => {
          if (j.status === "sevk-irsaliyesi-olusturuldu") {
            j.status = "merkeze-ulasti";
            addHist(j, "Ekipmanlar merkeze ulaştı", "Sistem Destek Uzmanına bildirim");
            db.notifications.unshift({
              id: "n-" + Date.now(),
              title: "Yeni Ekipman Teslim Alındı",
              body: `${(emp(j.employeeId) || {}).name} için hazırlanan ${j.items.length} ekipman merkeze ulaştı.`,
              t: "şimdi",
              unread: true,
              to: jobHref(j),
              roles: ["support", "admin"],
            });
            render();
          }
        }, 800);
      }
      addHist(j, "Sevk irsaliyesi oluşturuldu", "Logo ERP · " + j.waybill);
      toast("Logo ERP → Sevk İrsaliyesi Oluşturuldu");
      render(); return;
    }
    if (act === "view-waybill" || act === "print-waybill") { printWaybill(currentJob()); return; }
    if (act === "print-form") { printForm(currentJob()); return; }
    if (act === "start-check") {
      const j = currentJob();
      ensureChecks(j);
      j.status = "teknik-kontrol-bekliyor";
      addHist(j, "Teknik / fiziksel kontrole alındı");
      toast("Kontrol ekranı açıldı");
      render(); return;
    }
    if (act === "toggle-check") {
      const j = currentJob();
      const g = el.getAttribute("data-g");
      const id = el.getAttribute("data-i");
      const item = ensureChecks(j)[g].find((x) => x.id === id);
      if (item) item.done = el.checked;
      return;
    }
    if (act === "complete-check") {
      const j = currentJob();
      if (j.techResult !== "uygun") { toast("Sonuç olarak Uygun seçilmelidir.", "err"); return; }
      j.status = "zimmet-formu-bekliyor";
      addHist(j, "Teknik kontrol sonucu: Uygun", "Zimmet bekliyor");
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "Teknik kontrol", result: "Uygun", from: "Teknik Kontrolde", to: j.process === "cihaz-degisimi" ? "Teslim Bekliyor" : "Zimmet Bekliyor" });
      toast("Kontrol uygun — zimmet formu oluşturulabilir");
      render(); return;
    }
    if (act === "create-form") {
      const j = currentJob();
      if (j.process === "cihaz-degisimi") {
        const old = (j.items || []).find((it) => /mevcut/i.test(it.equipment));
        if (old && !old.returnCondition) {
          toast("Mevcut cihazın durumu belirlenmeden süreç kapatılamaz. Yeni cihaz teslim edilmeden değişim tamamlanamaz.", "err");
          return;
        }
      }
      const e = emp(j.toEmployeeId || j.employeeId);
      j.formNo = "ZM-2026-" + (2000 + db.zimmetler.length);
      j.signMethod = state.signMethod;
      j.deliveredBy = user().name;
      j.signedAt = null;
      (j.items || []).forEach((it, i) => {
        it.assetNo = it.assetNo || ("AST-" + (11000 + db.assets.length + i));
      });
      if (j.process === "zimmet-devri") {
        j.status = "yeni-kullanici-bekliyor";
      } else {
        j.status = "zimmet-formu-bekliyor";
      }
      addHist(j, "Zimmet formu oluşturuldu", j.formNo + " · personele onaya gönderildi · " + signMethodLabel(j.signMethod));
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "Zimmet formu", result: "Personele gönderildi", from: "Zimmet Bekliyor", to: "Zimmet Bekliyor", note: signMethodLabel(j.signMethod) });
      db.notifications.unshift({
        id: "n-" + Date.now(),
        title: "Zimmet formu onayınızı bekliyor",
        body: (e ? e.name : "Teslim alan") + " — " + j.formNo + " · " + signMethodLabel(j.signMethod),
        t: "şimdi",
        unread: true,
        to: jobHref(j),
        roles: ["personnel", "support", "admin"],
      });
      state.form.signPreview = false;
      state.form.signJob = null;
      toast("Form oluşturuldu — " + (e ? e.name : "personel") + " onayına gönderildi");
      render(); return;
    }
    if (act === "sign-preview") {
      const j = currentJob();
      state.form.signPreview = true;
      state.form.signJob = j.id;
      render(); return;
    }
    if (act === "emp-approve") {
      const j = currentJob();
      if (!awaitingPersonnel(j)) { toast("Onay bekleyen form yok", "err"); return; }
      const method = el.getAttribute("data-m") || j.signMethod;
      if (method === "dijital-imza" && !(state.form.signPreview && state.form.signJob === j.id)) {
        toast("Önce imza kutusuna tıklayarak dijital imzanızı atın.", "err");
        return;
      }
      const e = emp(j.toEmployeeId || j.employeeId);
      j.signMethod = method;
      j.signedAt = nowStamp();
      j.signedBy = e ? e.name : user().name;
      j.signatureText = method === "dijital-imza" ? (e ? e.name : user().name) : "";
      j.status = j.process === "zimmet-devri" ? "devir-tamamlandi" : "tamamlandi";
      addHist(j, method === "elektronik-onay" ? "Elektronik onay verildi" : method === "pdf" ? "PDF imzası tamamlandı" : "Dijital imza tamamlandı", j.signedBy + " · " + j.formNo);
      if (j.process === "cihaz-degisimi") {
        addHist(j, "Eski zimmet kapatıldı · yeni zimmet oluşturuldu", "Asset geçmişi korundu");
      }
      (j.items || []).forEach((it, i) => {
        if (j.process === "cihaz-degisimi" && /mevcut/i.test(it.equipment)) return;
        db.zimmetler.unshift({
          id: "zm-n-" + Date.now() + i,
          no: j.formNo,
          jobId: j.id,
          type: j.process === "cihaz-degisimi" ? "degisim" : j.process === "zimmet-devri" ? "devir" : "ise-baslangic",
          employeeId: j.toEmployeeId || j.employeeId,
          equipment: it.equipment,
          name: it.name,
          serial: it.serial || "—",
          location: j.location,
          status: "tamamlandi",
        });
      });
      audit({ no: j.no, process: PROCESS_TR[j.process], step: "Personel onayı", result: "Onaylandı", from: "Zimmet Bekliyor", to: "Tamamlandı", note: signMethodLabel(method) });
      db.notifications.unshift({
        id: "n-" + Date.now(),
        title: "Zimmet formu onaylandı",
        body: (e ? e.name : "") + " · " + j.formNo + " tamamlandı",
        t: "şimdi",
        unread: true,
        to: jobHref(j),
        roles: ["support", "admin"],
      });
      state.form.signPreview = false;
      toast("Personel onayı alındı — zimmet tamamlandı");
      render(); return;
    }
    if (act === "start-return") {
      const j = currentJob();
      j.status = "iade-kontrolunde";
      addHist(j, "İade kontrolüne alındı");
      render(); return;
    }
    if (act === "ret-cond") {
      const j = currentJob();
      const it = j.items.find((x) => x.id === el.getAttribute("data-iid"));
      if (it) it.returnCondition = el.getAttribute("data-v");
      render(); return;
    }
    if (act === "ret-ck") {
      const j = currentJob();
      const it = j.items.find((x) => x.id === el.getAttribute("data-iid"));
      if (it) {
        it.returnChecks = it.returnChecks || { model: false, serial: false, accessory: false, damage: false };
        it.returnChecks[el.getAttribute("data-k")] = el.checked;
      }
      return;
    }
    if (act === "complete-return") {
      const j = currentJob();
      const ok = (j.items || []).every((it) => it.returnCondition);
      if (!ok) { toast("Her ürün için durum seçilmelidir. Durum belirlenmeden süreç kapatılamaz.", "err"); return; }
      j.waybill = "IRS-2026-" + (1300 + db.jobs.filter((x) => x.waybill).length);
      j.waybillDate = nowStamp();
      j.waybillTarget = "Merkez Depo";
      j.status = "merkez-depoya-sevk";
      addHist(j, "İade tamamlandı", "Logo ERP sevk irsaliyesi · " + j.waybill + " · merkez depo");
      (j.items || []).forEach((it) => {
        const map = { yeniden: "Ready For Reassignment", bakim: "Maintenance", hurda: "Retired" };
        const ast = db.assets.find((a) => a.serial === it.serial);
        if (ast && map[it.returnCondition]) {
          const from = ast.status;
          ast.status = map[it.returnCondition];
          ast.employeeId = null;
          ast.warehouse = it.returnCondition === "hurda" ? "Hurda Depo" : "Merkez Depo";
          ast.history = ast.history || [];
          ast.history.push({ t: nowStamp(), who: user().name, ev: from + " → " + ast.status, note: "İade · " + it.returnCondition });
        }
      });
      audit({ no: j.no, process: "İşten Ayrılış", step: "İade Tamamla", result: "Depoya Gönderildi", from: "Kontrol Aşamasında", to: "Depoya Gönderildi", note: j.waybill });
      toast("Sevk irsaliyesi oluşturuldu — asset durumları güncellendi");
      render(); return;
    }
    if (act === "create-return-waybill") {
      const j = currentJob();
      j.waybill = "IRS-2026-" + (1300 + db.jobs.filter((x) => x.waybill).length);
      j.waybillDate = nowStamp();
      j.waybillTarget = "Merkez Depo";
      j.status = "merkez-depoya-sevk";
      addHist(j, "Sevk irsaliyesi oluşturuldu", "Hedef: Merkez Depo · " + j.waybill);
      toast("Logo ERP → Sevk İrsaliyesi Oluşturuldu (Merkez Depo)");
      render(); return;
    }
    if (act === "start-devir") {
      const z = zimmet(el.getAttribute("data-zid"));
      const e = emp(z.employeeId);
      const nj = {
        id: "job-tr-" + Date.now(),
        no: nextJobNo("DV"),
        process: "zimmet-devri",
        employeeId: z.employeeId,
        toEmployeeId: null,
        packageId: null,
        status: "yeni-kullanici-bekliyor",
        location: z.location,
        createdAt: nowStamp(),
        createdBy: user().name,
        sameLocation: true,
        history: [],
        items: [{ id: "td-1", equipment: z.equipment, name: z.name, serial: z.serial, stockCode: "", productCode: "" }],
      };
      addHist(nj, "Zimmet devri başlatıldı", z.no);
      addHist(nj, "Lokasyon kontrolü", "Mevcut lokasyon: " + z.location);
      db.jobs.unshift(nj);
      go("#/zimmet-devri/" + nj.id);
      return;
    }
    if (act === "pick-to") {
      const j = currentJob();
      const to = emp(el.getAttribute("data-eid"));
      const from = emp(j.employeeId);
      j.toEmployeeId = to.id;
      j.sameLocation = from.location === to.location;
      j.status = j.sameLocation ? "yeni-kullanici-bekliyor" : "lokasyon-uyusmazligi";
      addHist(j, j.sameLocation ? "Yeni kullanıcı seçildi" : "Lokasyon uyuşmazlığı", to.name + " · " + to.location);
      render(); return;
    }
    if (act === "complete-devir") {
      const j = currentJob();
      if (!j.sameLocation || !j.toEmployeeId) { toast("Aynı lokasyondaki kullanıcıyı seçin", "err"); return; }
      const to = emp(j.toEmployeeId);
      j.formNo = "ZM-2026-D" + (100 + db.jobs.length);
      j.signMethod = state.signMethod || "dijital-imza";
      j.deliveredBy = user().name;
      j.signedAt = null;
      addHist(j, "Zimmet formu oluşturuldu", j.formNo + " · " + to.name + " onayına gönderildi");
      db.notifications.unshift({
        id: "n-" + Date.now(),
        title: "Zimmet formu onayınızı bekliyor",
        body: to.name + " — devir formu " + j.formNo,
        t: "şimdi",
        unread: true,
        to: jobHref(j),
        roles: ["personnel", "support", "admin"],
      });
      toast("Form oluşturuldu — " + to.name + " onayına gönderildi");
      render(); return;
    }
    if (act === "pick-change-item") { state.form.changeZid = el.getAttribute("data-zid"); render(); return; }
    if (act === "create-change") {
      const e = emp(state.form.empId);
      const z = zimmet(state.form.changeZid);
      const code = (document.getElementById("req-eq") || {}).value;
      const c = catalog(code);
      const p = pkgByTitle(e.title);
      const inPkg = !!(p && p.items.some((x) => x.productCode === code || x.equipment === (c && c.equipment)));
      const nj = {
        id: "job-ch-" + Date.now(),
        no: nextJobNo("DG"),
        process: "cihaz-degisimi",
        employeeId: e.id,
        packageId: p ? p.id : null,
        status: "sistem-destek-kontrolunde",
        location: e.location,
        createdAt: nowStamp(),
        createdBy: user().name,
        changeReason: (document.getElementById("chg-reason") || {}).value || "Değişim talebi",
        requestedEquipment: c ? c.name : "",
        inPackageCheck: inPkg,
        needsCeo: !inPkg,
        waybill: null,
        waybillTarget: "Genel Merkez",
        history: [],
        items: [
          { id: "ch-old", equipment: z.equipment + " (mevcut)", productCode: "", name: z.name, serial: z.serial, stockCode: "", inPackage: true, extra: false, stockStatus: "stokta", stockQty: 1 },
          { id: "ch-new", equipment: (c ? c.equipment : "Laptop") + " (yeni)", productCode: c ? c.productCode : code, name: c ? c.name : "", stockCode: c ? c.stockCode : "", qty: 1, inPackage: inPkg, extra: !inPkg, extraReason: inPkg ? "" : "Title paketinde yok", stockStatus: c && c.qty > 0 ? "stokta" : "yok", stockQty: c ? c.qty : 0, warehouse: "IT Deposu", serial: null },
        ],
      };
      addHist(nj, "Cihaz değişim talebi oluşturuldu");
      addHist(nj, "Paket kontrolü", inPkg ? "Paket dahilinde" : "Paket dışı — CO/CEO onayı gerekir");
      db.jobs.unshift(nj);
      state.form = {};
      toast(inPkg ? "Paket dahilinde — Sistem Destek kontrolünde" : "Paket dışı — CO/CEO onayı gerekecek");
      go("#/cihaz-degisimi/" + nj.id);
      return;
    }
    if (act === "pkg-add-row") {
      const p = state.id === "yeni" ? state.form.pkgDraft : pkg(state.id);
      if (p) p.items.push({ equipment: "Laptop", productCode: "NB-LNV-T14", qty: 1, note: "" });
      render(); return;
    }
    if (act === "save-pkg") {
      const name = (document.getElementById("pkg-name") || {}).value;
      const title = (document.getElementById("pkg-title") || {}).value;
      const description = (document.getElementById("pkg-desc") || {}).value;
      const active = (document.getElementById("pkg-active") || {}).value === "1";
      const items = [...document.querySelectorAll("[data-pkg-i]")].reduce((acc, inp) => {
        const i = Number(inp.getAttribute("data-pkg-i"));
        const f = inp.getAttribute("data-pkg-f");
        acc[i] = acc[i] || { equipment: "", productCode: "", qty: 1, note: "" };
        acc[i][f] = f === "qty" ? Number(inp.value) : inp.value;
        return acc;
      }, []);
      if (state.id === "yeni") {
        const np = { id: "pkg-" + Date.now(), name, title, description, active, items };
        db.packages.push(np);
        state.form.pkgDraft = null;
        toast("Paket oluşturuldu");
        go("#/paketler/" + np.id);
      } else {
        const p = pkg(state.id);
        Object.assign(p, { name, title, description, active, items });
        toast("Paket güncellendi");
        render();
      }
      return;
    }
  });

  document.addEventListener("change", (ev) => {
    if (ev.target.id === "role-switch") { state.roleKey = ev.target.value; render(); return; }
    if (ev.target.id === "f-dept") { state.filters.dept = ev.target.value; render(); return; }
    if (ev.target.id === "f-loc") { state.filters.loc = ev.target.value; render(); return; }
    if (ev.target.id === "f-type") { state.filters.type = ev.target.value; render(); return; }
    if (ev.target.id === "f-status") { state.filters.status = ev.target.value; render(); return; }
    if (ev.target.id === "job-st-sel") { state.jobFilters.status = ev.target.value; render(); return; }
    if (ev.target.id === "job-proc") {
      const v = ev.target.value;
      if (v !== "all") go("#/" + v);
      return;
    }
  });

  document.addEventListener("input", (ev) => {
    if (ev.target.id === "global-search") { state.q = ev.target.value; return; }
    if (ev.target.id === "f-person") { state.filters.person = ev.target.value; render(); return; }
    if (ev.target.id === "f-eq") { state.filters.equipment = ev.target.value; render(); return; }
    if (ev.target.id === "ldap-q") { state.ldapQ = ev.target.value; render(); return; }
    if (ev.target.id === "job-q") { state.jobFilters.q = ev.target.value; render(); return; }
    if (ev.target.id === "sf-name") { state.serialFilters.name = ev.target.value; render(); return; }
    if (ev.target.id === "sf-serial") { state.serialFilters.serial = ev.target.value; render(); return; }
    if (ev.target.id === "sf-code") { state.serialFilters.code = ev.target.value; render(); return; }
    if (ev.target.id === "sf-wh") { state.serialFilters.warehouse = ev.target.value; render(); return; }
    if (ev.target.id === "sf-stock") { state.serialFilters.stock = ev.target.value; render(); return; }
    if (ev.target.id === "sf-status") { state.serialFilters.status = ev.target.value; render(); return; }
    if (ev.target.getAttribute("data-act") === "ret-note") {
      const j = currentJob();
      const it = j && j.items.find((x) => x.id === ev.target.getAttribute("data-iid"));
      if (it) it.returnNote = ev.target.value;
    }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && (ev.target.id === "global-search" || ev.target.id === "f-person" || ev.target.id === "f-eq" || ev.target.id === "job-q")) {
      render();
    }
  });

  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "#/dashboard";
  render();
})();
