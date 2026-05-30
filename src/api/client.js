const DEFAULT_TIMEOUT = 10000;

export async function apiFetch(url, { timeout = DEFAULT_TIMEOUT, signal } = {}) {
  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  // Forward an external abort (e.g. a search that's been superseded) to this request.
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (timedOut) throw { type: 'timeout', message: 'The request took too long.' };
    if (err.name === 'AbortError') throw { type: 'aborted', message: 'Request cancelled.' };
    throw { type: 'network', message: 'Could not reach the server.' };
  }
  clearTimeout(timer);

  // fetch resolves even on 4xx/5xx, so we check status ourselves.
  if (!response.ok) {
    throw { type: 'http', status: response.status, message: `Request failed (${response.status}).` };
  }

  try {
    return await response.json();
  } catch {
    throw { type: 'parse', message: 'Received an unexpected response.' };
  }
}