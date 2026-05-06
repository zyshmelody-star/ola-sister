// 通用：初始化页签高亮
(function() {
  const path = window.location.pathname;
  const tab  = new URLSearchParams(window.location.search).get('tab');

  const isAbout = (path === '/' || path === '/index.html') && tab === 'about';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isProducts = btn.classList.contains('tab-products');
    const isAboutBtn = btn.classList.contains('tab-about');

    if (isAbout) {
      btn.classList.toggle('active', isAboutBtn);
    } else {
      // 商品页签在：首页、/products/ 及其子页面
      btn.classList.toggle('active', isProducts);
    }
  });
})();
