// =====================
// 首页：Tab 切换
// =====================
(function() {
  const tabProducts = document.getElementById('tab-products');
  const tabAbout    = document.getElementById('tab-about');
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const floatNav    = document.getElementById('floatNav');

  function switchTab(tab) {
    if (tab === 'about') {
      tabProducts.classList.add('hidden');
      tabAbout.classList.remove('hidden');
      if (floatNav) floatNav.style.display = 'none';
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === 'about');
      });
    } else {
      tabProducts.classList.remove('hidden');
      tabAbout.classList.add('hidden');
      if (floatNav) floatNav.style.display = '';
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === 'products');
      });
    }
  }

  // 从URL决定初始tab
  const initTab = new URLSearchParams(window.location.search).get('tab') || 'products';
  switchTab(initTab);

  // 覆盖父级 initTabNav 的行为（仅在首页生效）
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.dataset.tab;
      switchTab(tab);
      history.replaceState(null, '', tab === 'about' ? '/?tab=about' : '/');
    });
  });

  // =====================
  // 侧边浮动导航：平滑滚动 + 高亮
  // =====================
  const floatItems = document.querySelectorAll('.float-nav-item');
  const sections = {
    'category-pets': document.getElementById('category-pets'),
    'category-wood': document.getElementById('category-wood'),
  };

  floatItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const target = sections[this.dataset.target];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver 高亮当前分类
  const observerOptions = {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const targetKey = id === 'category-pets' ? 'category-pets' : 'category-wood';
        floatItems.forEach(item => {
          item.classList.toggle('active', item.dataset.target === targetKey);
        });
      }
    });
  }, observerOptions);

  Object.values(sections).forEach(section => {
    if (section) sectionObserver.observe(section);
  });
})();
