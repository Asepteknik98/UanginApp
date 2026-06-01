function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');

  pages.forEach(page => {
    page.classList.remove('active');
  });

  navItems.forEach(item => {
    item.classList.remove('active');
  });

  const activePage = document.getElementById(pageName);
  if (activePage) {
    activePage.classList.add('active');
  }

  const activeNav = document.querySelector(`[data-page="${pageName}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }

  localStorage.setItem('currentPage', pageName);

  if (pageName === 'chartPage') {
    renderChartPage();
  } else if (pageName === 'moneyPage') {
    renderMoneyPage();
  } else if (pageName === 'settingPage') {
    renderSettingPage();
  }
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageName = item.getAttribute('data-page');
      showPage(pageName);
    });
  });

  const currentPage = localStorage.getItem('currentPage') || 'homePage';
  showPage(currentPage);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initNavigation();
  }, 2100);
});
