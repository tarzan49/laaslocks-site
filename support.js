// Open an anchored guide, including direct links to troubleshooting.
function openGuide() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  }
}
window.addEventListener('hashchange', openGuide);
openGuide();

// Stop a tutorial when its guide is closed.
document.querySelectorAll('details.guide').forEach(guide => {
  guide.addEventListener('toggle', () => {
    if (!guide.open) guide.querySelectorAll('video').forEach(video => video.pause());
  });
});
