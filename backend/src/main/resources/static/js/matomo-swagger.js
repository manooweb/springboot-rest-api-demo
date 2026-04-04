(function () {
  const _paq = (globalThis._paq = globalThis._paq || []);
  _paq.push(
    ['disableCookies'],
    ['setDoNotTrack', true],
    ['HeatmapSessionRecording::disable'],
    ['enableLinkTracking'],
    ['trackPageView']);

  (function () {
    const u = 'https://stats.manooweb.fr/';
    _paq.push(
      ['setTrackerUrl', u + 'matomo.php'],
      ['setSiteId', '3']);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.defer = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
  })();
})();

// Inject styles to make the "API home" link in the Swagger description more visible and look like a proper navigation link.
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .renderedMarkdown a[href="/"] {
      font-weight: 600;
      text-decoration: none;
    }

    .renderedMarkdown a[href="/"]:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
})();
