(function () {
  const _paq = (globalThis._paq = globalThis._paq || []);
  _paq.push(
    ['disableCookies'],
    ['setDoNotTrack', true],
    ['HeatmapSessionRecording::disable'],
    ['enableLinkTracking'],
    ['trackPageView'],
  );

  const u = 'https://stats.manooweb.fr/';
  _paq.push(['setTrackerUrl', u + 'matomo.php'], ['setSiteId', '3']);

  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.defer = true;
  g.src = u + 'matomo.js';
  s.parentNode.insertBefore(g, s);
})();
