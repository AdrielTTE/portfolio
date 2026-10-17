// Screenshots that are still loading start transparent and fade in when they
// arrive, instead of popping in. Only images that are not already loaded are
// touched, so a cached or eager image never flickers, and without JS they just
// show as they load.
document
  .querySelectorAll<HTMLImageElement>('.screen img, .frame img, .shots figure img')
  .forEach((img) => {
    if (img.complete && img.naturalWidth > 0) return;
    img.classList.add('is-loading');
    const done = () => img.classList.remove('is-loading');
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

export {};
