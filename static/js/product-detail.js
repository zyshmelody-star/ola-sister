// =====================
// 商品详情页：轮播图
// =====================
(function() {
  const track  = document.getElementById('carouselTrack');
  const dotsEl = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;

  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  // 生成小圆点
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', '跳转到第' + (i + 1) + '张');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // 触摸滑动支持
  let touchStartX = 0;
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  }

  // 自动播放（4秒）
  let autoTimer = setInterval(() => goTo(current + 1), 4000);

  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    });
  }
})();

// =====================
// 返回按钮：保留筛选状态
// =====================
(function() {
  function buildBackUrl() {
    const cat    = sessionStorage.getItem('ol_filter_category');
    const search = sessionStorage.getItem('ol_filter_search');
    const params = new URLSearchParams();
    if (cat && cat !== 'all') params.set('category', cat);
    if (search) params.set('q', search);
    return '/products/' + (params.toString() ? '?' + params.toString() : '');
  }

  ['backBtn', 'backBtnBottom'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.href = buildBackUrl();
  });
})();
