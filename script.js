// ============================================================
// Helpers
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// Terminal typing effect (hero)
// ============================================================
const TERMINAL_LINES = [
  '$ whoami',
  'gurjyot-singh',
  '',
  '$ cat profile.yaml',
  'role: Cloud Engineer / DevOps Engineer (seeking)',
  'focus: [Kubernetes, Docker, CI/CD, AWS, Azure]',
  'status: build passing \u2713'
];

function typeTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  if (prefersReducedMotion) {
    body.innerHTML = '<pre>' + TERMINAL_LINES.join('\n') + '</pre>';
    return;
  }

  const pre = document.createElement('pre');
  body.innerHTML = '';
  body.appendChild(pre);

  let lineIndex = 0;
  let charIndex = 0;
  let currentText = '';

  function step() {
    if (lineIndex >= TERMINAL_LINES.length) {
      // blinking cursor at the end
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      pre.appendChild(cursor);
      return;
    }

    const line = TERMINAL_LINES[lineIndex];

    if (charIndex < line.length) {
      currentText += line[charIndex];
      charIndex++;
      pre.textContent = currentText;
      setTimeout(step, line.startsWith('$') ? 38 : 16);
    } else {
      currentText += '\n';
      pre.textContent = currentText;
      lineIndex++;
      charIndex = 0;
      setTimeout(step, 220);
    }
  }

  step();
}

// ============================================================
// Pipeline nav: scroll-spy + progress fill + smooth scroll
// ============================================================
function initPipelineNav() {
  const nodes = Array.from(document.querySelectorAll('.pipeline-node'));
  const sections = nodes
    .map((n) => document.getElementById(n.dataset.target))
    .filter(Boolean);
  const fill = document.getElementById('pipelineFill');

  if (!nodes.length || !sections.length || !fill) return;

  function setActive(index) {
    nodes.forEach((n, i) => {
      n.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    const pct = nodes.length > 1 ? (index / (nodes.length - 1)) * 100 : 0;
    fill.style.width = pct + '%';
  }

  // Click to scroll
  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const target = document.getElementById(node.dataset.target);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // Scroll-spy via IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    }
  );

  sections.forEach((s) => observer.observe(s));

  // Set initial state
  setActive(0);
}

// ============================================================
// Live "status check" clock in the monitor section
// ============================================================
function initLiveClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;

  function update() {
    const now = new Date();
    const formatted = now.toLocaleString(undefined, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    el.textContent = '· last check ' + formatted;
  }

  update();
  setInterval(update, 30000);
}

// ============================================================
// Footer year
// ============================================================
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  typeTerminal();
  initPipelineNav();
  initLiveClock();
  setFooterYear();
});
