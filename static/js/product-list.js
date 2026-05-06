// =====================
// 二级商品列表页：筛选 + 搜索
// =====================
(function() {
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const searchInput   = document.getElementById('searchInput');
  const productCards  = document.querySelectorAll('#productGrid .product-card');
  const emptyState    = document.getElementById('emptyState');
  const breadcrumb    = document.getElementById('breadcrumb-current');

  let activeCategory = 'all';

  // 读取URL参数（从首页"查看更多"跳转过来）
  const urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory) {
    activeCategory = urlCategory;
    // 恢复筛选状态（从详情页返回）
    const saved = sessionStorage.getItem('ol_filter_category');
    if (!saved) {
      sessionStorage.setItem('ol_filter_category', urlCategory);
    }
  } else {
    // 恢复上次筛选状态
    const saved = sessionStorage.getItem('ol_filter_category');
    if (saved) activeCategory = saved;
  }

  // 恢复搜索词
  const savedSearch = sessionStorage.getItem('ol_filter_search') || '';

  function applyFilters() {
    const search = (searchInput.value || '').trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
      const cat  = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();

      const catMatch  = activeCategory === 'all' || cat === activeCategory;
      const nameMatch = !search || name.includes(search);

      if (catMatch && nameMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    emptyState.classList.toggle('hidden', visibleCount > 0);

    // 更新面包屑
    if (breadcrumb) {
      breadcrumb.textContent =
        activeCategory === 'all' ? '全部商品' : activeCategory;
    }

    // 同步 URL 参数（不刷新页面）
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (search) params.set('q', search);
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', newUrl);

    // 保存到 sessionStorage（详情页返回时恢复）
    sessionStorage.setItem('ol_filter_category', activeCategory);
    sessionStorage.setItem('ol_filter_search', search);
  }

  function setActiveBtn(category) {
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
  }

  // 初始化筛选按钮状态
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      activeCategory = this.dataset.category;
      setActiveBtn(activeCategory);
      searchInput.value = '';  // 切换分类时清空搜索框
      sessionStorage.removeItem('ol_filter_search');
      applyFilters();
    });
  });

  // 搜索输入
  searchInput.addEventListener('input', applyFilters);

  // 应用初始状态
  setActiveBtn(activeCategory);
  if (savedSearch) searchInput.value = savedSearch;
  applyFilters();
})();
