/* Loads the Three.js stages only on a wide screen with motion allowed.
   Phones and prefers-reduced-motion keep the still cut-outs. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;

if (!reduce && !phone) {
  import('./stage.bundle.js')
    .then((mod) => mod.mountAll())
    .catch(() => {});
}
