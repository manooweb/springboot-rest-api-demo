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
