(function () {
  var _paq = (window._paq = window._paq || []);
  _paq.push(['disableCookies']);
  _paq.push(['setDoNotTrack', true]);
  _paq.push(['HeatmapSessionRecording::disable']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['trackPageView']);

  (function () {
    var u = 'https://stats.manooweb.fr/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '3']);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.defer = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
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
