/* =============================================
   ĐẠI HỌC CÔNG NGHIỆP VIỆT-HUNG – script.js
   ============================================= */

/* ===== 1. LOADING SCREEN ===== */
window.addEventListener("load", function () {
  const fill = document.getElementById("loadingFill");
  const screen = document.getElementById("loadingScreen");
  let w = 0;
  const t = setInterval(() => {
    w += Math.random() * 18 + 5;
    if (w >= 100) {
      w = 100;
      clearInterval(t);
      setTimeout(() => {
        screen.classList.add("hide");
        setTimeout(() => screen.remove(), 500);
        startCountdown();
        animateNumbers();
      }, 300);
    }
    fill.style.width = w + "%";
  }, 80);
});

/* ===== 2. SCROLL TOP BUTTON ===== */
window.addEventListener("scroll", function () {
  const btn = document.getElementById("scrollTop");
  if (btn) btn.classList.toggle("show", window.scrollY > 300);
});

/* ===== 3. ĐIỀU HƯỚNG TRANG (SPA) ===== */
function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const pg = document.getElementById("page-" + id);
  if (pg) pg.classList.add("active");
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.toggle("active", l.dataset.page === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("nav").classList.remove("open");
  // lazy renders
  if (id === "dashboard") renderDashboard();
  if (id === "thoi-khoa-bieu") renderTKB();
  if (id === "diem-so") renderDiem();
  if (id === "sinh-vien") renderSinhVien();
  if (id === "giang-vien") renderGV();
  if (id === "hoc-phi") renderHocPhi();
  if (id === "thu-vien") renderThuVien();
  if (id === "thong-bao") renderTB("all");
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    showPage(this.dataset.page);
  });
});
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

/* ===== 4. DARK MODE ===== */
document.getElementById("btnDarkMode").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  this.innerHTML = document.body.classList.contains("dark")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

/* ===== 5. MODAL ĐĂNG NHẬP ===== */
document
  .getElementById("btnLogin")
  .addEventListener("click", () => openModal("modalLogin"));
document
  .getElementById("modalClose")
  .addEventListener("click", () => closeModal("modalLogin"));

function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

document.querySelectorAll(".modal-overlay").forEach((o) => {
  o.addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("open");
  });
});

function setLoginTab(el, label) {
  document
    .querySelectorAll(".login-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("inputUser").placeholder = "Mã " + label;
}

function togglePassword() {
  const input = document.getElementById("inputPass");
  const icon = document.getElementById("eyeIcon");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "fas fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fas fa-eye";
  }
}

document
  .getElementById("btnSubmitLogin")
  .addEventListener("click", function () {
    const u = document.getElementById("inputUser").value.trim();
    const p = document.getElementById("inputPass").value.trim();
    if (!u || !p) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "err");
      return;
    }
    closeModal("modalLogin");
    document.getElementById("btnLogin").innerHTML =
      '<i class="fas fa-user-check"></i> ' + u;
    document.getElementById("btnLogin").style.background = "#4caf50";
    document.getElementById("btnLogin").style.color = "white";
    showToast("Đăng nhập thành công! Chào mừng " + u + " 👋", "ok");
  });

/* ===== 6. TOAST ===== */
function showToast(msg, type) {
  const t = document.getElementById("toast");
  t.className = "toast show" + (type ? " toast-" + type : "");
  const icon = type === "ok" ? "✔" : type === "err" ? "✖" : "ℹ";
  t.innerHTML = icon + " " + msg;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ===== 7. GLOBAL SEARCH ===== */
const searchIndex = [
  { label: "Trang chủ", icon: "fa-home", page: "trang-chu" },
  {
    label: "Dashboard tổng quan",
    icon: "fa-tachometer-alt",
    page: "dashboard",
  },
  { label: "Thời khóa biểu", icon: "fa-calendar-alt", page: "thoi-khoa-bieu" },
  { label: "Bảng điểm sinh viên", icon: "fa-chart-bar", page: "diem-so" },
  { label: "Quản lý sinh viên", icon: "fa-user-graduate", page: "sinh-vien" },
  {
    label: "Quản lý giảng viên",
    icon: "fa-chalkboard-teacher",
    page: "giang-vien",
  },
  { label: "Học phí & Thanh toán", icon: "fa-wallet", page: "hoc-phi" },
  { label: "Thư viện điện tử", icon: "fa-book", page: "thu-vien" },
  { label: "Thông báo nhà trường", icon: "fa-bell", page: "thong-bao" },
  { label: "Tuyển sinh 2025", icon: "fa-edit", page: "tuyen-sinh" },
];

function globalSearchFn(e) {
  const q = e.target.value.toLowerCase().trim();
  const dd = document.getElementById("searchDropdown");
  if (!q) {
    dd.classList.remove("open");
    return;
  }
  const results = searchIndex.filter((i) => i.label.toLowerCase().includes(q));
  if (!results.length) {
    dd.innerHTML =
      '<div class="search-result-item" style="color:#aaa">Không tìm thấy kết quả</div>';
    dd.classList.add("open");
    return;
  }
  dd.innerHTML = results
    .map(
      (r) =>
        `<div class="search-result-item" onclick="showPage('${r.page}');document.getElementById('globalSearch').value='';document.getElementById('searchDropdown').classList.remove('open')"><i class="fas ${r.icon}"></i> ${r.label}</div>`,
    )
    .join("");
  dd.classList.add("open");
  if (e.key === "Escape") dd.classList.remove("open");
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-global-wrap"))
    document.getElementById("searchDropdown").classList.remove("open");
});

/* ===== 8. ANIMATE NUMBERS ===== */
function animateNumbers() {
  document.querySelectorAll(".count-num,.kpi-num").forEach((el) => {
    const target = parseInt(el.dataset.target || 0);
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur >= 1000 ? cur.toLocaleString("vi") : cur;
      if (cur >= target) clearInterval(t);
    }, 25);
  });
}

/* ===== 9. COUNTDOWN TUYỂN SINH ===== */
function startCountdown() {
  const deadline = new Date("2025-07-31T23:59:59");
  function tick() {
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) {
      ["cdDays", "cdHours", "cdMins", "cdSecs"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "0";
      });
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, "0");
    };
    set("cdDays", days);
    set("cdHours", hours);
    set("cdMins", mins);
    set("cdSecs", secs);
  }
  tick();
  setInterval(tick, 1000);
}

/* ===== 10. DASHBOARD ===== */
const khoaData = [
  { ten: "CNTT", sv: 1200, mau: "#0d47a1" },
  { ten: "Kinh tế", sv: 1100, mau: "#1565c0" },
  { ten: "Điện-Điện tử", sv: 900, mau: "#1976d2" },
  { ten: "Cơ điện", sv: 850, mau: "#1e88e5" },
  { ten: "Xây dựng", sv: 600, mau: "#42a5f5" },
  { ten: "Hóa-MT", sv: 400, mau: "#64b5f6" },
];
const eventData = [
  {
    day: "12",
    mon: "T5",
    title: "Hội nghị Khoa học sinh viên",
    time: "08:00 – Hội trường A",
  },
  {
    day: "15",
    mon: "T5",
    title: "Ngày hội Việc làm 2025",
    time: "07:30 – Sân trường",
  },
  {
    day: "18",
    mon: "T5",
    title: "Bảo vệ đồ án tốt nghiệp K21",
    time: "08:00 – Phòng 301",
  },
  {
    day: "20",
    mon: "T5",
    title: "Lễ tốt nghiệp Khoá K21",
    time: "08:00 – Hội trường lớn",
  },
];
const activityData = [
  {
    text: "<strong>Nguyễn Văn An</strong> vừa nộp đơn bảo lưu học kỳ",
    time: "5 phút trước",
  },
  {
    text: "Cập nhật lịch thi HK2 cho <strong>12 lớp</strong>",
    time: "22 phút trước",
  },
  {
    text: "<strong>GV. Trần Minh Đức</strong> đăng tài liệu môn CSDL",
    time: "1 giờ trước",
  },
  {
    text: "Sinh viên <strong>Lê Minh Châu</strong> đóng học phí HK2",
    time: "2 giờ trước",
  },
  { text: "Phòng Đào tạo xuất bản thông báo lịch thi", time: "Hôm qua" },
];
const topSVData = [
  { ten: "Trần Thị Thu Hà", gpa: "3.92", rank: "gold" },
  { ten: "Nguyễn Minh Khôi", gpa: "3.87", rank: "silver" },
  { ten: "Lê Phương Linh", gpa: "3.82", rank: "bronze" },
  { ten: "Phạm Tiến Dũng", gpa: "3.76", rank: "" },
  { ten: "Vũ Thị Ngọc Anh", gpa: "3.71", rank: "" },
];
const progressData = [
  { ten: "Lập trình OOP", pct: 88 },
  { ten: "Cơ sở dữ liệu", pct: 75 },
  { ten: "Mạng máy tính", pct: 92 },
  { ten: "Toán rời rạc", pct: 60 },
  { ten: "Tiếng Anh CN", pct: 83 },
];

function renderDashboard() {
  // Chart bars
  const maxSV = Math.max(...khoaData.map((k) => k.sv));
  document.getElementById("chartBars").innerHTML = khoaData
    .map(
      (k) => `
    <div class="bar-row">
      <div class="bar-label">${k.ten}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${((k.sv / maxSV) * 100).toFixed(1)}%;background:${k.mau}">${k.sv.toLocaleString("vi")}</div></div>
      <div class="bar-count">${k.sv.toLocaleString("vi")} SV</div>
    </div>`,
    )
    .join("");

  // Events
  document.getElementById("eventList").innerHTML = eventData
    .map(
      (e) => `
    <div class="event-item">
      <div class="event-date"><div class="e-day">${e.day}</div><div class="e-mon">${e.mon}/2025</div></div>
      <div class="event-body"><div class="e-title">${e.title}</div><div class="e-time"><i class="fas fa-clock"></i> ${e.time}</div></div>
    </div>`,
    )
    .join("");

  // Activities
  document.getElementById("activityList").innerHTML = activityData
    .map(
      (a) => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-text">${a.text}</div>
      <div class="activity-time">${a.time}</div>
    </div>`,
    )
    .join("");

  // Top SV
  document.getElementById("topSVList").innerHTML = topSVData
    .map(
      (s, i) => `
    <div class="top-sv-item">
      <div class="top-sv-rank ${s.rank}">${i + 1}</div>
      <div class="top-sv-name">${s.ten}</div>
      <div class="top-sv-gpa">${s.gpa}</div>
    </div>`,
    )
    .join("");

  // Progress
  document.getElementById("progressList").innerHTML = progressData
    .map(
      (p) => `
    <div class="prog-item">
      <div class="prog-head"><span>${p.ten}</span><span>${p.pct}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${p.pct}%"></div></div>
    </div>`,
    )
    .join("");

  // Animate KPI numbers
  document.querySelectorAll(".kpi-num").forEach((el) => {
    const target = parseInt(el.dataset.target || 0);
    if (!target) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur >= 1000 ? cur.toLocaleString("vi") : cur;
      if (cur >= target) clearInterval(t);
    }, 20);
  });
}

/* ===== 11. THỜI KHÓA BIỂU ===== */
const monHoc = {
  M1: { ten: "Toán cao cấp", gv: "TS. Phạm Quang", phong: "P.301", loai: "ly" },
  M2: { ten: "Lập trình OOP", gv: "ThS. Trần Đức", phong: "Lab.2", loai: "th" },
  M3: { ten: "Vật lý ĐC", gv: "TS. Lê Hải", phong: "P.202", loai: "ly" },
  M4: { ten: "Cơ sở dữ liệu", gv: "ThS. Vũ Mai", phong: "Lab.1", loai: "th" },
  M5: { ten: "Tiếng Anh CN", gv: "ThS. Hoàng Anh", phong: "P.101", loai: "ly" },
  M6: { ten: "Mạng máy tính", gv: "TS. Đỗ Khánh", phong: "P.401", loai: "ly" },
};
// [thu(0=T2..5=T7), tiet_bat_dau, so_tiet, ma_mon]
const lichHoc = [
  [0, 1, 2, "M1"],
  [0, 3, 3, "M2"],
  [1, 1, 2, "M3"],
  [1, 6, 3, "M4"],
  [2, 1, 2, "M5"],
  [2, 4, 2, "M1"],
  [3, 3, 3, "M2"],
  [3, 6, 2, "M6"],
  [4, 1, 2, "M3"],
  [4, 6, 2, "M5"],
  [5, 1, 3, "M4"],
];

function renderTKB() {
  const SO_TIET = 10,
    SO_THU = 6;
  const cells = Array.from({ length: SO_TIET }, () => Array(SO_THU).fill(null));
  lichHoc.forEach(([thu, start, len, key]) => {
    for (let t = 0; t < len; t++) {
      const idx = start - 1 + t;
      if (idx < SO_TIET)
        cells[idx][thu] =
          t === 0
            ? { ...monHoc[key], rowspan: len, isFirst: true }
            : { skip: true };
    }
  });

  let lyCount = 0,
    thCount = 0;
  const tbody = document.getElementById("tkbBody");
  let html = "";
  for (let t = 0; t < SO_TIET; t++) {
    html += "<tr>";
    html += `<td class="tkb-tiet">${t + 1}</td>`;
    for (let d = 0; d < SO_THU; d++) {
      const c = cells[t][d];
      if (!c) {
        html += "<td></td>";
      } else if (c.skip) {
        /* rowspan */
      } else {
        if (c.loai === "ly") lyCount++;
        else thCount++;
        html += `<td rowspan="${c.rowspan}"><div class="tkb-cell ${c.loai === "th" ? "th" : ""}">
          <span class="tkb-mon">${c.ten}</span>
          <span class="tkb-gv">${c.gv}</span>
          <span class="tkb-phong"><i class="fas fa-door-open"></i> ${c.phong}</span>
        </div></td>`;
      }
    }
    html += "</tr>";
  }
  tbody.innerHTML = html;

  const ms = document.getElementById("tkbMiniStats");
  if (ms)
    ms.innerHTML = `
    <div class="tkb-mini-stat"><i class="fas fa-book"></i> Số môn: <strong>${Object.keys(monHoc).length}</strong></div>
    <div class="tkb-mini-stat"><i class="fas fa-chalkboard"></i> Lý thuyết: <strong>${lyCount} buổi</strong></div>
    <div class="tkb-mini-stat"><i class="fas fa-flask"></i> Thực hành: <strong>${thCount} buổi</strong></div>
    <div class="tkb-mini-stat"><i class="fas fa-door-open"></i> Phòng: P.101, P.202, P.301, P.401, Lab.1, Lab.2</div>
  `;
  showToast("Đã tải thời khóa biểu!", "ok");
}

function printTKB() {
  window.print();
}

/* ===== 12. ĐIỂM SỐ ===== */
const monDiem = [
  {
    ma: "IT3010",
    ten: "Lập trình hướng đối tượng",
    tc: 3,
    cc: 9.0,
    gk: 7.5,
    ck: 8.0,
  },
  { ma: "IT3020", ten: "Cơ sở dữ liệu", tc: 3, cc: 8.5, gk: 8.0, ck: 7.5 },
  { ma: "IT3030", ten: "Mạng máy tính", tc: 3, cc: 7.0, gk: 6.5, ck: 7.0 },
  { ma: "MA1010", ten: "Giải tích", tc: 4, cc: 8.0, gk: 7.0, ck: 6.5 },
  { ma: "MA1020", ten: "Đại số tuyến tính", tc: 3, cc: 9.5, gk: 8.5, ck: 9.0 },
  {
    ma: "PE1010",
    ten: "Triết học Mác-Lênin",
    tc: 3,
    cc: 9.0,
    gk: 8.0,
    ck: 8.5,
  },
  { ma: "IT4010", ten: "Kiến trúc máy tính", tc: 3, cc: 7.5, gk: 7.0, ck: 6.0 },
  {
    ma: "EN1010",
    ten: "Tiếng Anh chuyên ngành",
    tc: 3,
    cc: 8.0,
    gk: 7.5,
    ck: 8.5,
  },
];
const lichSuHK = [
  { hk: "HK1 – 2021/2022", tc: 20, gpa: 3.15, xep: "Khá" },
  { hk: "HK2 – 2021/2022", tc: 20, gpa: 3.28, xep: "Khá" },
  { hk: "HK1 – 2022/2023", tc: 22, gpa: 3.35, xep: "Giỏi" },
  { hk: "HK2 – 2022/2023", tc: 22, gpa: 3.42, xep: "Giỏi" },
];
let diemTab = "bang";

const tinhTong = (cc, gk, ck) => +(cc * 0.1 + gk * 0.3 + ck * 0.6).toFixed(1);
const diem4 = (d) => {
  d = +d;
  return d >= 9
    ? 4
    : d >= 8
      ? 3.5
      : d >= 7
        ? 3
        : d >= 6.5
          ? 2.5
          : d >= 5.5
            ? 2
            : d >= 5
              ? 1.5
              : d >= 4
                ? 1
                : 0;
};
const diemChu = (d) => {
  d = +d;
  return d >= 9
    ? "A+"
    : d >= 8.5
      ? "A"
      : d >= 8
        ? "B+"
        : d >= 7
          ? "B"
          : d >= 6.5
            ? "C+"
            : d >= 5.5
              ? "C"
              : d >= 5
                ? "D+"
                : d >= 4
                  ? "D"
                  : "F";
};
const xepLoai = (g) => {
  g = +g;
  return g >= 3.6
    ? "Xuất sắc"
    : g >= 3.2
      ? "Giỏi"
      : g >= 2.5
        ? "Khá"
        : g >= 2
          ? "Trung bình"
          : "Yếu";
};

function renderDiem() {
  let tongTC = 0,
    tongD4TC = 0;
  const rows = monDiem.map((m, i) => {
    const tong = tinhTong(m.cc, m.gk, m.ck);
    const dat = tong >= 4;
    tongTC += m.tc;
    tongD4TC += diem4(tong) * m.tc;
    return `<tr>
      <td>${i + 1}</td><td><strong>${m.ma}</strong></td><td>${m.ten}</td>
      <td style="text-align:center">${m.tc}</td>
      <td style="text-align:center">${m.cc}</td>
      <td style="text-align:center">${m.gk}</td>
      <td style="text-align:center">${m.ck}</td>
      <td style="text-align:center"><strong style="color:#0d47a1">${tong}</strong></td>
      <td style="text-align:center"><strong>${diemChu(tong)}</strong></td>
      <td style="text-align:center"><span class="tag ${dat ? "tag-xanh" : "tag-do"}">${dat ? "Đạt" : "Không đạt"}</span></td>
    </tr>`;
  });
  document.getElementById("diemBody").innerHTML = rows.join("");

  const gpa = (tongD4TC / tongTC).toFixed(2);
  document.getElementById("diemSummary").innerHTML = `
    <span>Tổng số TC: <strong>${tongTC}</strong></span>
    <span>GPA (hệ 4): <strong>${gpa}</strong></span>
    <span>Xếp loại: <strong style="color:#c62828">${xepLoai(gpa)}</strong></span>
    <span>Môn đạt: <strong>${monDiem.filter((m) => tinhTong(m.cc, m.gk, m.ck) >= 4).length}/${monDiem.length}</strong></span>
  `;
  renderBieuDo();
  renderLichSuHK();
}

function switchDiemTab(tab, btn) {
  diemTab = tab;
  document
    .querySelectorAll(".diem-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("diemTabBang").style.display =
    tab === "bang" ? "block" : "none";
  document.getElementById("diemTabBieuDo").style.display =
    tab === "bieu-do" ? "block" : "none";
  document.getElementById("diemTabLichSu").style.display =
    tab === "lich-su" ? "block" : "none";
}

function renderBieuDo() {
  const colors = [
    "#0d47a1",
    "#1565c0",
    "#1976d2",
    "#1e88e5",
    "#42a5f5",
    "#64b5f6",
    "#0288d1",
    "#00838f",
  ];
  const maxH = 180;
  const cols = monDiem
    .map((m, i) => {
      const tong = tinhTong(m.cc, m.gk, m.ck);
      const h = (tong / 10) * maxH;
      return `<div class="bd-col">
      <div class="bd-val">${tong}</div>
      <div class="bd-bar" style="height:${h}px;background:${colors[i]}" title="${m.ten}: ${tong}"></div>
      <div class="bd-label">${m.ma}</div>
    </div>`;
    })
    .join("");
  document.getElementById("bieuDoWrap").innerHTML =
    `<h3 style="margin-bottom:16px;color:var(--xanh)">Biểu đồ điểm theo môn học</h3><div class="bieu-do-bars">${cols}</div>`;
}

function renderLichSuHK() {
  document.getElementById("lichSuHK").innerHTML = lichSuHK
    .map(
      (h) => `
    <div class="hk-item">
      <div><div class="hk-ten">${h.hk}</div><div class="hk-tc"><i class="fas fa-book"></i> ${h.tc} tín chỉ</div></div>
      <div style="text-align:right"><div class="hk-gpa">${h.gpa}</div><div class="hk-xep">${h.xep}</div></div>
    </div>`,
    )
    .join("");
}

/* ===== 13. SINH VIÊN ===== */
let danhSachSV = [
  {
    ma: "VH2021001",
    ten: "Nguyễn Văn An",
    ns: "15/03/2003",
    lop: "CNTT-K20A",
    khoa: "CNTT",
    email: "an.nv@viethung.edu.vn",
    gpa: "3.42",
    tt: "Đang học",
  },
  {
    ma: "VH2021002",
    ten: "Trần Thị Bình",
    ns: "22/07/2003",
    lop: "CNTT-K20A",
    khoa: "CNTT",
    email: "binh.tt@viethung.edu.vn",
    gpa: "3.28",
    tt: "Đang học",
  },
  {
    ma: "VH2021003",
    ten: "Lê Minh Châu",
    ns: "08/01/2003",
    lop: "CĐT-K19A",
    khoa: "Cơ điện",
    email: "chau.lm@viethung.edu.vn",
    gpa: "3.55",
    tt: "Đang học",
  },
  {
    ma: "VH2021004",
    ten: "Phạm Thị Dung",
    ns: "30/09/2003",
    lop: "KT-K21A",
    khoa: "Kinh tế",
    email: "dung.pt@viethung.edu.vn",
    gpa: "2.91",
    tt: "Bảo lưu",
  },
  {
    ma: "VH2021005",
    ten: "Hoàng Văn Em",
    ns: "14/06/2002",
    lop: "CĐT-K19A",
    khoa: "Cơ điện",
    email: "em.hv@viethung.edu.vn",
    gpa: "3.10",
    tt: "Đang học",
  },
  {
    ma: "VH2021006",
    ten: "Vũ Thị Phương",
    ns: "03/11/2003",
    lop: "CNTT-K20B",
    khoa: "CNTT",
    email: "phuong.vt@viethung.edu.vn",
    gpa: "3.68",
    tt: "Đang học",
  },
  {
    ma: "VH2021007",
    ten: "Đặng Quang Giang",
    ns: "19/04/2002",
    lop: "KT-K21A",
    khoa: "Kinh tế",
    email: "giang.dq@viethung.edu.vn",
    gpa: "1.85",
    tt: "Thôi học",
  },
  {
    ma: "VH2021008",
    ten: "Bùi Thị Hương",
    ns: "25/08/2003",
    lop: "CNTT-K20B",
    khoa: "CNTT",
    email: "huong.bt@viethung.edu.vn",
    gpa: "3.15",
    tt: "Đang học",
  },
  {
    ma: "VH2021009",
    ten: "Ngô Minh Khoa",
    ns: "12/02/2003",
    lop: "CĐT-K19A",
    khoa: "Cơ điện",
    email: "khoa.nm@viethung.edu.vn",
    gpa: "3.40",
    tt: "Đang học",
  },
  {
    ma: "VH2021010",
    ten: "Đinh Thị Lan",
    ns: "07/12/2002",
    lop: "KT-K21A",
    khoa: "Kinh tế",
    email: "lan.dt@viethung.edu.vn",
    gpa: "3.22",
    tt: "Đang học",
  },
  {
    ma: "VH2021011",
    ten: "Trương Văn Mạnh",
    ns: "18/05/2003",
    lop: "CNTT-K20A",
    khoa: "CNTT",
    email: "manh.tv@viethung.edu.vn",
    gpa: "2.78",
    tt: "Đang học",
  },
  {
    ma: "VH2021012",
    ten: "Phan Thị Ngọc",
    ns: "29/10/2003",
    lop: "CNTT-K20B",
    khoa: "CNTT",
    email: "ngoc.pt@viethung.edu.vn",
    gpa: "3.82",
    tt: "Đang học",
  },
];
let svTrang = 1,
  svPerPage = 8,
  svFilterText = "",
  svKhoa = "",
  svTT = "";

function renderSinhVien() {
  const ds = danhSachSV.filter(
    (sv) =>
      (sv.ten.toLowerCase().includes(svFilterText.toLowerCase()) ||
        sv.ma.toLowerCase().includes(svFilterText.toLowerCase()) ||
        sv.email.toLowerCase().includes(svFilterText.toLowerCase())) &&
      (!svKhoa || sv.khoa === svKhoa) &&
      (!svTT || sv.tt === svTT),
  );
  // Stats
  document.getElementById("svDangHoc").textContent = danhSachSV.filter(
    (s) => s.tt === "Đang học",
  ).length;
  document.getElementById("svBaoLuu").textContent = danhSachSV.filter(
    (s) => s.tt === "Bảo lưu",
  ).length;
  document.getElementById("svThoiHoc").textContent = danhSachSV.filter(
    (s) => s.tt === "Thôi học",
  ).length;
  document.getElementById("svTong").textContent = danhSachSV.length;

  const total = Math.ceil(ds.length / svPerPage);
  if (svTrang > total) svTrang = 1;
  const chunk = ds.slice((svTrang - 1) * svPerPage, svTrang * svPerPage);

  document.getElementById("sinhVienBody").innerHTML = chunk
    .map(
      (sv, i) => `
    <tr>
      <td><input type="checkbox" class="sv-check"/></td>
      <td><strong>${sv.ma}</strong></td>
      <td>${sv.ten}</td>
      <td>${sv.ns}</td>
      <td>${sv.lop}</td>
      <td>${sv.khoa}</td>
      <td>${sv.email}</td>
      <td><strong style="color:#0d47a1">${sv.gpa}</strong></td>
      <td><span class="tag ${sv.tt === "Đang học" ? "tag-xanh" : sv.tt === "Bảo lưu" ? "tag-vang" : "tag-do"}">${sv.tt}</span></td>
      <td>
        <button class="action-btn edit" onclick="showToast('Đang mở hồ sơ ${sv.ten}','')"><i class="fas fa-eye"></i></button>
        <button class="action-btn edit" onclick="showToast('Chỉnh sửa ${sv.ma}','')"><i class="fas fa-pen"></i></button>
        <button class="action-btn del" onclick="xoaSV('${sv.ma}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`,
    )
    .join("");

  document.getElementById("svCountText").textContent =
    `Hiển thị ${chunk.length} / ${ds.length} sinh viên`;
  renderPagination("svPagination", svTrang, total, (p) => {
    svTrang = p;
    renderSinhVien();
  });
}

function filterSinhVien() {
  svFilterText = document.getElementById("searchSinhVien").value;
  svKhoa = document.getElementById("filterKhoa").value;
  svTT = document.getElementById("filterTrangThai").value;
  svTrang = 1;
  renderSinhVien();
}

function toggleCheckAll() {
  const state = document.getElementById("checkAll").checked;
  document.querySelectorAll(".sv-check").forEach((c) => (c.checked = state));
}

function openModalThemSV() {
  ["svHoTen", "svNgaySinh", "svCCCD", "svEmail", "svSDT", "svDiaChi"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    },
  );
  openModal("modalThemSV");
}

function themSinhVien() {
  const ten = document.getElementById("svHoTen").value.trim();
  const ns = document.getElementById("svNgaySinh").value;
  const lop = document.getElementById("svLop").value;
  const khoa = document.getElementById("svKhoa").value;
  const email = document.getElementById("svEmail").value.trim();
  if (!ten || !ns) {
    showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "err");
    return;
  }
  const ma =
    "VH" +
    new Date().getFullYear() +
    String(danhSachSV.length + 1).padStart(3, "0");
  const nsFormat = new Date(ns).toLocaleDateString("vi-VN");
  danhSachSV.push({
    ma,
    ten,
    ns: nsFormat,
    lop,
    khoa,
    email: email || ma.toLowerCase() + "@viethung.edu.vn",
    gpa: "–",
    tt: "Đang học",
  });
  closeModal("modalThemSV");
  renderSinhVien();
  showToast("Đã thêm sinh viên " + ten + "!", "ok");
}

function xoaSV(ma) {
  if (!confirm("Bạn có chắc muốn xóa sinh viên " + ma + "?")) return;
  danhSachSV = danhSachSV.filter((s) => s.ma !== ma);
  renderSinhVien();
  showToast("Đã xóa sinh viên " + ma, "ok");
}

/* ===== 14. GIẢNG VIÊN ===== */
let danhSachGV = [
  {
    ma: "GV001",
    ten: "PGS.TS. Nguyễn Thanh Hải",
    hocvi: "PGS.TS",
    bomon: "Khoa học máy tính",
    cn: "Trí tuệ nhân tạo",
    email: "hai.nt@viethung.edu.vn",
    mau: "#0d47a1",
  },
  {
    ma: "GV002",
    ten: "TS. Trần Minh Đức",
    hocvi: "TS",
    bomon: "Khoa học máy tính",
    cn: "Hệ thống thông tin",
    email: "duc.tm@viethung.edu.vn",
    mau: "#1565c0",
  },
  {
    ma: "GV003",
    ten: "ThS. Lê Thị Thu Hà",
    hocvi: "ThS",
    bomon: "Kỹ thuật điện",
    cn: "Tự động hóa",
    email: "ha.lt@viethung.edu.vn",
    mau: "#00838f",
  },
  {
    ma: "GV004",
    ten: "TS. Phạm Văn Quang",
    hocvi: "TS",
    bomon: "Toán – Lý",
    cn: "Đại số tuyến tính",
    email: "quang.pv@viethung.edu.vn",
    mau: "#1976d2",
  },
  {
    ma: "GV005",
    ten: "ThS. Vũ Thị Mai Anh",
    hocvi: "ThS",
    bomon: "Kinh tế",
    cn: "Quản trị kinh doanh",
    email: "anh.vtm@viethung.edu.vn",
    mau: "#4527a0",
  },
  {
    ma: "GV006",
    ten: "GS.TS. Hoàng Đức Toàn",
    hocvi: "GS.TS",
    bomon: "Kỹ thuật điện",
    cn: "Điện tử viễn thông",
    email: "toan.hd@viethung.edu.vn",
    mau: "#1e88e5",
  },
  {
    ma: "GV007",
    ten: "TS. Đỗ Quốc Khánh",
    hocvi: "TS",
    bomon: "Khoa học máy tính",
    cn: "An ninh mạng",
    email: "khanh.dq@viethung.edu.vn",
    mau: "#006064",
  },
  {
    ma: "GV008",
    ten: "ThS. Nguyễn Hồng Nhung",
    hocvi: "ThS",
    bomon: "Kinh tế",
    cn: "Kế toán – Kiểm toán",
    email: "nhung.nth@viethung.edu.vn",
    mau: "#0277bd",
  },
];
let gvViewMode = "grid",
  gvText = "",
  gvBM = "",
  gvHV = "";

function renderGV() {
  const ds = danhSachGV.filter(
    (g) =>
      g.ten.toLowerCase().includes(gvText.toLowerCase()) &&
      (!gvBM || g.bomon === gvBM) &&
      (!gvHV || g.hocvi === gvHV),
  );
  const initials = (n) => {
    const parts = n
      .replace(/^(GS\.|PGS\.|TS\.|ThS\.)\s*/i, "")
      .trim()
      .split(" ");
    return parts.length >= 2
      ? (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  };

  if (gvViewMode === "grid") {
    document.getElementById("gvGrid").style.display = "grid";
    document.getElementById("gvTable").style.display = "none";
    document.getElementById("gvGrid").innerHTML = ds
      .map(
        (g) => `
      <div class="gv-card">
        <div class="gv-av" style="background:${g.mau}">${initials(g.ten)}</div>
        <div class="gv-name">${g.ten}</div>
        <div class="gv-hocvi">${g.hocvi}</div>
        <div class="gv-bomon">${g.bomon}</div>
        <div class="gv-bomon" style="color:#1976d2;font-weight:600">${g.cn}</div>
        <div class="gv-bomon">${g.email}</div>
        <div class="gv-actions">
          <button class="btn-outline" style="padding:5px 12px;font-size:.78rem" onclick="showToast('Chi tiết: ${g.ten}','')"><i class="fas fa-eye"></i> Chi tiết</button>
          <button class="action-btn del" onclick="showToast('Đã xóa GV','ok')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`,
      )
      .join("");
  } else {
    document.getElementById("gvGrid").style.display = "none";
    document.getElementById("gvTable").style.display = "block";
    document.getElementById("gvTableBody").innerHTML = ds
      .map(
        (g) => `
      <tr>
        <td><strong>${g.ma}</strong></td>
        <td><div style="display:flex;align-items:center;gap:10px"><div style="width:34px;height:34px;border-radius:50%;background:${g.mau};color:white;font-size:.75rem;font-weight:800;display:flex;align-items:center;justify-content:center">${initials(g.ten)}</div>${g.ten}</div></td>
        <td><span class="tag tag-xanh">${g.hocvi}</span></td>
        <td>${g.bomon}</td><td>${g.cn}</td><td>${g.email}</td>
        <td>
          <button class="action-btn edit" onclick="showToast('Chi tiết: ${g.ten}','')"><i class="fas fa-eye"></i></button>
          <button class="action-btn del" onclick="showToast('Đã xóa GV','ok')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`,
      )
      .join("");
  }
}

function filterGV() {
  gvText = document.getElementById("searchGV").value;
  gvBM = document.getElementById("filterBoMon").value;
  gvHV = document.getElementById("filterHocViGV").value;
  renderGV();
}

function switchGVView(mode, btn) {
  gvViewMode = mode;
  document
    .querySelectorAll(".view-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderGV();
}

function openModalThemGV() {
  openModal("modalThemGV");
}
function themGiangVien() {
  const ten = document.getElementById("gvHoTen").value.trim();
  if (!ten) {
    showToast("Vui lòng nhập họ tên giảng viên!", "err");
    return;
  }
  closeModal("modalThemGV");
  showToast("Đã thêm giảng viên " + ten, "ok");
}

/* ===== 15. HỌC PHÍ ===== */
const hocPhiData = [
  {
    ma: "VH2021001",
    ten: "Nguyễn Văn An",
    lop: "CNTT-K20A",
    hk: "HK2/2025",
    tong: 7800000,
    da: 7800000,
    han: "15/03/2025",
    tt: "Đã đóng",
  },
  {
    ma: "VH2021002",
    ten: "Trần Thị Bình",
    lop: "CNTT-K20A",
    hk: "HK2/2025",
    tong: 7800000,
    da: 4000000,
    han: "15/03/2025",
    tt: "Đóng một phần",
  },
  {
    ma: "VH2021003",
    ten: "Lê Minh Châu",
    lop: "CĐT-K19A",
    hk: "HK2/2025",
    tong: 8200000,
    da: 0,
    han: "15/03/2025",
    tt: "Chưa đóng",
  },
  {
    ma: "VH2021004",
    ten: "Phạm Thị Dung",
    lop: "KT-K21A",
    hk: "HK2/2025",
    tong: 6500000,
    da: 6500000,
    han: "15/03/2025",
    tt: "Đã đóng",
  },
  {
    ma: "VH2021005",
    ten: "Hoàng Văn Em",
    lop: "CĐT-K19A",
    hk: "HK2/2025",
    tong: 8200000,
    da: 5000000,
    han: "15/03/2025",
    tt: "Đóng một phần",
  },
  {
    ma: "VH2021006",
    ten: "Vũ Thị Phương",
    lop: "CNTT-K20B",
    hk: "HK2/2025",
    tong: 7800000,
    da: 7800000,
    han: "15/03/2025",
    tt: "Đã đóng",
  },
];
let hpText = "",
  hpTT = "";

function renderHocPhi() {
  const ds = hocPhiData.filter(
    (h) =>
      (h.ten.toLowerCase().includes(hpText.toLowerCase()) ||
        h.ma.toLowerCase().includes(hpText.toLowerCase())) &&
      (!hpTT || h.tt === hpTT),
  );
  const fmt = (n) => n.toLocaleString("vi") + "đ";
  document.getElementById("hocPhiBody").innerHTML = ds
    .map(
      (h) => `
    <tr>
      <td><strong>${h.ma}</strong></td><td>${h.ten}</td><td>${h.lop}</td><td>${h.hk}</td>
      <td>${fmt(h.tong)}</td>
      <td style="color:#1b5e20"><strong>${fmt(h.da)}</strong></td>
      <td style="color:${h.tong - h.da > 0 ? "#b71c1c" : "#1b5e20"}"><strong>${fmt(h.tong - h.da)}</strong></td>
      <td>${h.han}</td>
      <td><span class="tag ${h.tt === "Đã đóng" ? "tag-xanh" : h.tt === "Chưa đóng" ? "tag-do" : "tag-vang"}">${h.tt}</span></td>
      <td>
        <button class="action-btn edit" onclick="showToast('Tạo phiếu thu cho ${h.ma}','')"><i class="fas fa-receipt"></i></button>
        <button class="action-btn edit" onclick="showToast('Lịch sử thanh toán ${h.ma}','')"><i class="fas fa-history"></i></button>
      </td>
    </tr>`,
    )
    .join("");
}

function filterHP() {
  hpText = document.getElementById("searchHP").value;
  hpTT = document.getElementById("filterHPTT").value;
  renderHocPhi();
}

/* ===== 16. THƯ VIỆN ===== */
const sach = [
  {
    tieu: "Giáo trình Lập trình Python",
    tg: "Nguyễn Minh Hải",
    loai: "Công nghệ thông tin",
    icon: "📘",
    co: 8,
    tt: "ok",
  },
  {
    tieu: "Cơ sở dữ liệu quan hệ",
    tg: "Trần Thị Hoa",
    loai: "Công nghệ thông tin",
    icon: "📗",
    co: 3,
    tt: "ok",
  },
  {
    tieu: "Mạng máy tính – Tanenbaum",
    tg: "A.Tanenbaum",
    loai: "Kỹ thuật",
    icon: "📙",
    co: 0,
    tt: "no",
  },
  {
    tieu: "Kỹ thuật điện tử số",
    tg: "Phạm Văn Quang",
    loai: "Kỹ thuật",
    icon: "📕",
    co: 5,
    tt: "ok",
  },
  {
    tieu: "Kinh tế học vi mô",
    tg: "TS. Lê Anh Tuấn",
    loai: "Kinh tế",
    icon: "📒",
    co: 12,
    tt: "ok",
  },
  {
    tieu: "Tiếng Anh chuyên ngành IT",
    tg: "Vũ Thị Lan",
    loai: "Ngoại ngữ",
    icon: "📓",
    co: 2,
    tt: "ok",
  },
  {
    tieu: "Giải tích 1 – Bộ Giáo dục",
    tg: "Bộ GD&ĐT",
    loai: "Giáo trình",
    icon: "📔",
    co: 20,
    tt: "ok",
  },
  {
    tieu: "Đại số tuyến tính",
    tg: "GS. Ngô Việt Trung",
    loai: "Giáo trình",
    icon: "📑",
    co: 0,
    tt: "no",
  },
];
let tvText = "",
  tvLoai = "";

function renderThuVien() {
  const ds = sach.filter(
    (s) =>
      (s.tieu.toLowerCase().includes(tvText.toLowerCase()) ||
        s.tg.toLowerCase().includes(tvText.toLowerCase())) &&
      (!tvLoai || s.loai === tvLoai),
  );
  document.getElementById("bookGrid").innerHTML = ds
    .map(
      (s) => `
    <div class="book-card" onclick="showToast('Đang mở: ${s.tieu}','')">
      <div class="book-cover" style="background:${s.tt === "ok" ? "#e3f2fd" : "#fce4ec"}">${s.icon}</div>
      <div class="book-info">
        <div class="book-title">${s.tieu}</div>
        <div class="book-author"><i class="fas fa-user"></i> ${s.tg}</div>
        <span class="book-tag">${s.loai}</span>
        <div class="book-avail ${s.tt}">
          <i class="fas fa-${s.tt === "ok" ? "check-circle" : "times-circle"}"></i>
          ${s.tt === "ok" ? "Còn " + s.co + " cuốn" : "Hết sách"}
        </div>
      </div>
    </div>`,
    )
    .join("");
}

function filterTV() {
  tvText = document.getElementById("searchTV").value;
  tvLoai = document.getElementById("filterTVLoai").value;
  renderThuVien();
}

/* ===== 17. THÔNG BÁO ===== */
const thongBaoData = [
  {
    id: 1,
    loai: "hoc-vu",
    moi: true,
    icon: "hoc-vu",
    fa: "fas fa-graduation-cap",
    tieu: "Lịch thi kết thúc học phần HK2 – 2024/2025",
    mo: "Phòng Đào tạo thông báo lịch thi kết thúc học phần HK2. Sinh viên kiểm tra lịch và phòng thi trên hệ thống trực tuyến.",
    nguoi: "Phòng Đào tạo",
    ngay: "02/05/2025",
    luot: 1254,
  },
  {
    id: 2,
    loai: "su-kien",
    moi: true,
    icon: "su-kien",
    fa: "fas fa-rocket",
    tieu: "Hội thảo Khởi nghiệp & Đổi mới sáng tạo 2025",
    mo: 'Trường tổ chức hội thảo "Startup – Innovation 2025" với sự tham gia của hơn 50 doanh nghiệp và quỹ đầu tư hàng đầu.',
    nguoi: "Đoàn Thanh niên",
    ngay: "01/05/2025",
    luot: 876,
  },
  {
    id: 3,
    loai: "tuyen-sinh",
    moi: false,
    icon: "tuyen-sinh",
    fa: "fas fa-user-plus",
    tieu: "Mở đăng ký xét tuyển đại học chính quy 2025",
    mo: "Nhà trường chính thức mở cổng đăng ký xét tuyển ĐH chính quy 2025 từ 01/05 đến hết 31/07/2025.",
    nguoi: "Phòng Tuyển sinh",
    ngay: "28/04/2025",
    luot: 2341,
  },
  {
    id: 4,
    loai: "quan-ly",
    moi: false,
    icon: "quan-ly",
    fa: "fas fa-file-alt",
    tieu: "Cập nhật Quy chế học vụ áp dụng từ năm 2025",
    mo: "Ban Giám hiệu ban hành quy chế học vụ mới áp dụng từ năm học 2025-2026. Sinh viên và giảng viên cần đọc kỹ trước ngày 15/05.",
    nguoi: "Ban Giám hiệu",
    ngay: "25/04/2025",
    luot: 432,
  },
  {
    id: 5,
    loai: "hoc-vu",
    moi: false,
    icon: "hoc-vu",
    fa: "fas fa-calendar-times",
    tieu: "Thông báo nghỉ lễ 30/4 – 1/5 và lịch học bù",
    mo: "Nhà trường thông báo lịch nghỉ lễ Giải phóng miền Nam 30/4 và lịch học bù cho sinh viên toàn trường.",
    nguoi: "Phòng Đào tạo",
    ngay: "20/04/2025",
    luot: 3120,
  },
  {
    id: 6,
    loai: "su-kien",
    moi: false,
    icon: "su-kien",
    fa: "fas fa-code",
    tieu: "Cuộc thi Lập trình Hackathon VH 2025 – Giải thưởng 50 triệu",
    mo: "Khoa CNTT tổ chức cuộc thi lập trình 24 giờ. Đăng ký trước ngày 10/05. Giải thưởng tổng trị giá 50 triệu đồng.",
    nguoi: "Khoa CNTT",
    ngay: "15/04/2025",
    luot: 684,
  },
];

function renderTB(loai) {
  const ds =
    loai === "all" ? thongBaoData : thongBaoData.filter((t) => t.loai === loai);
  document.getElementById("tbList").innerHTML = ds
    .map(
      (tb) => `
    <div class="tb-item ${tb.moi ? "new" : ""}">
      <div class="tb-icon ${tb.icon}"><i class="${tb.fa}"></i></div>
      <div class="tb-body">
        <div class="tb-title">${tb.tieu}${tb.moi ? '  <span class="tb-new-dot">MỚI</span>' : ""}</div>
        <div class="tb-desc">${tb.mo}</div>
        <div class="tb-meta">
          <span><i class="fas fa-user"></i> ${tb.nguoi}</span>
          <span><i class="fas fa-calendar"></i> ${tb.ngay}</span>
          <span><i class="fas fa-eye"></i> ${tb.luot.toLocaleString("vi")} lượt xem</span>
        </div>
      </div>
      <button class="btn-outline btn-sm" onclick="showToast('Đang mở thông báo...','')"><i class="fas fa-external-link-alt"></i> Xem</button>
    </div>`,
    )
    .join("");
}

function filterTB(loai, btn) {
  document
    .querySelectorAll(".tb-tab")
    .forEach((t) => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderTB(loai);
}

function markAllRead() {
  thongBaoData.forEach((t) => (t.moi = false));
  document.getElementById("badgeTB").style.display = "none";
  renderTB("all");
  showToast("Đã đánh dấu tất cả là đã đọc", "ok");
}

/* ===== 18. PAGINATION ===== */
function renderPagination(id, cur, total, cb) {
  const el = document.getElementById(id);
  if (!el || total <= 1) {
    if (el) el.innerHTML = "";
    return;
  }
  el.innerHTML = Array.from({ length: total }, (_, i) => i + 1)
    .map(
      (p) =>
        `<button class="page-btn ${p === cur ? "active" : ""}" onclick="(${cb.toString()})(${p})">${p}</button>`,
    )
    .join("");
}

/* ===== 19. EXPORT (demo) ===== */
function exportData(type) {
  showToast("Đang xuất file Excel... (chức năng demo)", "");
}

/* ===== 20. TUYỂN SINH ===== */
function dangKyTV() {
  const ten = document.getElementById("tsHoTen").value.trim();
  const sdt = document.getElementById("tsSDT").value.trim();
  if (!ten || !sdt) {
    showToast("Vui lòng điền đầy đủ họ tên và số điện thoại!", "err");
    return;
  }
  showToast(
    "🎉 Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ trong 24h.",
    "ok",
  );
  document.getElementById("tsHoTen").value = "";
  document.getElementById("tsSDT").value = "";
}

/* ===== 21. KHỞI TẠO ===== */
document.addEventListener("DOMContentLoaded", function () {
  showPage("trang-chu");
  // Animate hero numbers after a short delay
  setTimeout(animateNumbers, 800);
});
