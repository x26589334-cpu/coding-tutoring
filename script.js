// ── 헤더 스크롤 그림자 ──────────────────────
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ── 모바일 메뉴 ────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── 커리큘럼 탭 ────────────────────────────
const tabs = document.getElementById('tabs');
tabs.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t === tab));
    tabs.querySelectorAll('.tabs__panel').forEach(p =>
      p.classList.toggle('is-active', p.dataset.panel === key)
    );
  });
});

// ── FAQ: 하나 열면 나머지 닫기 ──────────────
const faqItems = document.querySelectorAll('#faqList .faq__item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

// ── 스크롤 등장 애니메이션 ──────────────────
const revealTargets = document.querySelectorAll(
  '.card, .teacher, .price, .review, .flow li, .faq__item, .head, .tabs__nav'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealTargets.forEach(el => io.observe(el));

// ── 상담 신청 폼 (데모: 실제 전송 연동 필요) ──
const form = document.getElementById('applyForm');
const formMsg = document.getElementById('formMsg');
// form.name 은 폼 자체의 name 속성이라 input 과 충돌 → elements 로 접근
const nameInput = form.elements.namedItem('name');
const phoneInput = form.elements.namedItem('phone');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  const show = (text, isError) => {
    formMsg.textContent = text;
    formMsg.classList.toggle('is-error', !!isError);
  };

  if (!name) return show('이름을 입력해 주세요.', true);
  if (!/^01[016-9][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone))
    return show('연락처를 010-1234-5678 형식으로 입력해 주세요.', true);

  // TODO: 실제 전송 연동 (예: 구글폼 / 이메일 API / 카카오 알림톡)
  show(`${name}님, 신청이 접수되었습니다. 영업일 기준 1일 내로 연락드릴게요!`, false);
  form.reset();
});

// 전화번호 입력 시 자동 하이픈
phoneInput.addEventListener('input', e => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  e.target.value = d.length < 4 ? d
    : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}`
    : `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
});
