document.addEventListener('DOMContentLoaded', () => {
  /* 1) 인트로 끝나면 본문 보여주기 (원치 않으면 이 블록 삭제) */
  setTimeout(() => {
    const intro   = document.getElementById('intro');
    const content = document.getElementById('content');
    if (intro)   intro.style.display = 'none';
    if (content) content.style.display = 'block';
  }, 3000);

  /* 2) 스크롤 애니메이션: .Introduction, .Me */
  const io = new IntersectionObserver((entries/*, ob*/) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
         } else {
        // 화면에서 완전히 벗어나면 → 다시 숨김
        entry.target.classList.remove('is-visible');
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  const slideTargets = document.querySelectorAll('.Introduction, .Me');
  slideTargets.forEach((el, i) => {
    el.classList.add('slide-in-left');        // 초기 상태 클래스 부여
    el.style.setProperty('--delay', `${i * 120}ms`);
    io.observe(el);
  });

  /* 3) 탭 전환: Certificate / Myprojects */
  const buttons  = document.querySelectorAll('.Projects_button a');
  const sections = document.querySelectorAll('.Certification, .Career'); // ← 여기 수정!

  // 초기 상태: Certificate만 보이게
  sections.forEach(sec => sec.classList.remove('active-section'));
  const first = document.getElementById('Certificate');
  if (first) first.parentElement.classList.add('active-section');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // 페이지 점프 막고 탭 전환
      sections.forEach(sec => sec.classList.remove('active-section'));

      const targetId = btn.getAttribute('href').slice(1); // "#id" → "id"
      const target   = document.getElementById(targetId);
      if (target) target.parentElement.classList.add('active-section');
    });
  });
});