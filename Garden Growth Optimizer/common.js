// Highlight the active tab based on current page
const page = document.body.dataset.page;
document.querySelectorAll('.tabs .tab-link').forEach(a=>{
  const href = a.getAttribute('href');
  const name = href.split('/').pop().replace('.html','');
  const isHome = (name==='index' && page==='home');
  a.classList.toggle('active', isHome || name===page);
});
    