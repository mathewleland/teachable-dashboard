// some data is coming in as html encoded strings, so we need to decode them
export function decodeHtml(html: string) {
  const tempEl = document.createElement('div');
  tempEl.innerHTML = html;
  return tempEl.textContent || tempEl.innerText;
}
