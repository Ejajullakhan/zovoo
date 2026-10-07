const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

document.title = document.title || "Zovo Services";
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

/* Reveal-on-scroll */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("in"));
}

/* Reading progress */
const progress = $("#progress");
if (progress) {
  const updateProgress = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/* Mobile navigation */
const menu = $("#menu");
const navLinks = $("#navLinks");
if (menu && navLinks) {
  menu.addEventListener("click", () => navLinks.classList.toggle("open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
}

/* Premium cursor */
const cursor = $("#cursor"), ring = $("#cursorRing");
if (cursor && ring && matchMedia("(pointer:fine)").matches) {
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate3d(${mx}px,${my}px,0)`;
  }, { passive: true });
  const loop = () => {
    rx += (mx - rx) * .15;
    ry += (my - ry) * .15;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    requestAnimationFrame(loop);
  };
  loop();
  $$("a,button,.service-tab,.work,[data-tilt],[data-magnetic]").forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); ring.classList.add("hover"); });
    el.addEventListener("mouseleave", () => { cursor.classList.remove("hover"); ring.classList.remove("hover"); });
  });
  addEventListener("mousedown", () => { cursor.classList.add("click"); ring.classList.add("click"); });
  addEventListener("mouseup", () => { cursor.classList.remove("click"); ring.classList.remove("click"); });
}

/* Tilt cards */
$$("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-7px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

/* Magnetic buttons */
$$("[data-magnetic]").forEach(btn => {
  btn.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * .08}px,${y * .08}px) translateY(-3px)`;
  });
  btn.addEventListener("pointerleave", () => btn.style.transform = "");
});

/* Service page interactions */
const services = [
  {no:"01", kicker:"FULL BUILD", title:"A website that feels made for your brand.", desc:"From structure to responsive build, Zovo turns a rough idea into a clear, polished experience that works across screens.", features:["Responsive layout","Premium motion","Clean interactions","Launch-ready code"]},
  {no:"02", kicker:"HIGH IMPACT", title:"A focused page built to earn the click.", desc:"Landing pages strip away the noise and put one message, one audience and one action in control.", features:["Strong hierarchy","Conversion-first flow","Fast sections","Focused CTA"]},
  {no:"03", kicker:"EXPERIENCE DESIGN", title:"Interfaces that look good because they make sense.", desc:"Wireframes, hierarchy, interaction patterns and visual systems designed around how people actually move through a product.", features:["Wireframes","UI system","Interaction states","Responsive logic"]},
  {no:"04", kicker:"REFRESH", title:"Keep what works. Replace what does not.", desc:"A redesign gives an existing website a new visual language, better structure and a more convincing first impression.", features:["Visual audit","New hierarchy","Modern UI","Migration-friendly"]},
  {no:"05", kicker:"ONGOING", title:"Keep the site sharp after launch.", desc:"Small fixes, content changes, polish and maintenance support so the site keeps feeling intentional over time.", features:["Bug fixes","Content updates","UI polish","Technical upkeep"]}
];

const servicePanel = $("#servicePanel");
if (servicePanel) {
  const switchService = index => {
    const s = services[index];
    $$(".service-tab").forEach((el, i) => el.classList.toggle("active", i === index));
    servicePanel.animate(
      [{opacity:.45, transform:"translateY(8px) scale(.99)"}, {opacity:1, transform:"none"}],
      {duration:420, easing:"cubic-bezier(.16,1,.3,1)"}
    );
    $("#serviceNo").textContent = s.no;
    $("#serviceKicker").textContent = s.kicker;
    $("#serviceTitle").textContent = s.title;
    $("#serviceDesc").textContent = s.desc;
    $("#featureList").innerHTML = s.features.map((x, i) =>
      `<div class="feature"><i style="background:${["var(--green)","var(--cyan)","var(--purple)","var(--yellow)"][i]}"></i>${x}</div>`
    ).join("");
  };
  $$(".service-tab").forEach(btn => btn.addEventListener("click", () => switchService(+btn.dataset.service)));
}

/* Process page interactions */
const process = [
  {kicker:"STEP 01 / DISCOVER", title:"Find the idea worth building.", desc:"We define the audience, goal, message and feel before the visual system starts moving.", tags:["Audience","Goal","Direction","Structure"]},
  {kicker:"STEP 02 / PLAN", title:"Turn the idea into a clear route.", desc:"The page flow, content hierarchy and key interactions are mapped so the build has a purpose.", tags:["Sitemap","Flow","Sections","CTA"]},
  {kicker:"STEP 03 / DESIGN", title:"Give the direction a visual voice.", desc:"Typography, spacing, color, motion and interface details are combined into one consistent system.", tags:["Type","Grid","Color","Motion"]},
  {kicker:"STEP 04 / BUILD", title:"Make the design work for real.", desc:"The experience becomes responsive, interactive and production-ready with clean front-end code.", tags:["HTML","CSS","JavaScript","Responsive"]},
  {kicker:"STEP 05 / POLISH", title:"Remove every rough edge.", desc:"Final testing, spacing fixes, interaction polish and launch checks turn a good build into a finished one.", tags:["QA","Mobile","Performance","Launch"]}
];

const processStage = $("#processStage");
if (processStage) {
  const switchStep = index => {
    const s = process[index];
    $$(".step").forEach((el, i) => el.classList.toggle("active", i === index));
    processStage.animate(
      [{opacity:.45, transform:"translateY(8px)"}, {opacity:1, transform:"none"}],
      {duration:400, easing:"cubic-bezier(.16,1,.3,1)"}
    );
    $("#stepKicker").textContent = s.kicker;
    $("#stepTitle").textContent = s.title;
    $("#stepDesc").textContent = s.desc;
    $("#stageTags").innerHTML = s.tags.map(x => `<span>${x}</span>`).join("");
    $("#stageNo").textContent = String(index + 1).padStart(2, "0");
  };
  $$(".step").forEach(btn => btn.addEventListener("click", () => switchStep(+btn.dataset.step)));
}

/* Contact form */
const contactForm = $("#contactForm");
const toast = msg => {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => el.classList.remove("show"), 2600);
};

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      name: $("#name").value,
      email: $("#email").value,
      project: $("#project").value,
      message: $("#message").value,
      date: new Date().toISOString()
    };
    localStorage.setItem("zovoProjectBrief", JSON.stringify(data));
    toast("Project brief saved on this device.");
    contactForm.reset();
  });
}

/* Active nav link based on current page */
const currentFile = location.pathname.split("/").pop() || "index.html";
$$(".nav-links a").forEach(a => {
  const href = a.getAttribute("href") || "";
  if (href === currentFile || (currentFile === "" && href === "index.html")) {
    a.classList.add("page-nav-current");
  }
});

/* Reduced motion compatibility */
if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
  document.documentElement.style.scrollBehavior = "auto";
}
