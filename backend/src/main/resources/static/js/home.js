document.addEventListener('DOMContentLoaded', async () => {
  const statusBlock = document.getElementById('api-status');
  const statusDot = document.getElementById('api-status-dot');
  const statusText = document.getElementById('api-status-text');

  if (!statusBlock || !statusDot || !statusText) {
    return;
  }

  const setStatus = (state, label) => {
    statusBlock.classList.remove(
      'status-block--checking',
      'status-block--healthy',
      'status-block--unavailable'
    );

    statusDot.classList.remove(
      'status-dot--checking',
      'status-dot--healthy',
      'status-dot--unavailable'
    );

    statusBlock.classList.add(`status-block--${state}`);
    statusDot.classList.add(`status-dot--${state}`);
    statusText.textContent = label;
  };

  setStatus('checking', 'Checking...');

  try {
    const response = await fetch('/api/v1/health', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const isHealthy =
      data?.status === 'UP' ||
      data?.status === 'OK' ||
      data?.healthy === true;

    if (isHealthy) {
      setStatus('healthy', 'Healthy');
    } else {
      setStatus('unavailable', 'Unhealthy');
    }
  } catch (error) {
    console.error('Health check failed:', error);
    setStatus('unavailable', 'Unavailable');
  }
});
