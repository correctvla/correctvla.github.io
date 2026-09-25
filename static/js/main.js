// Entry point: wires data to independent modules.
import { TAXONOMY, SIM, ROBOT, EXAMPLES, DEMOS } from './data.js';
import * as charts from './charts.js';
import { initExplainer } from './explainer.js';
import { initGallery } from './gallery.js';
import { initNav, initLightbox } from './ui.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

charts.taxonomy($('chart-taxonomy'), TAXONOMY);
charts.success($('chart-success'), SIM.success);
charts.funnel($('chart-funnel'), SIM.funnel);
charts.perTask($('chart-pertask'), SIM.perTask);
charts.robot($('chart-robot'), ROBOT);

initExplainer($('explainer'), EXAMPLES);
initGallery($('gallery'), DEMOS, { autoplay: !reducedMotion });
initNav($('topnav'), document.querySelector('.hero'));
initLightbox($('lightbox'));

if (reducedMotion) document.querySelectorAll('.hero video').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
