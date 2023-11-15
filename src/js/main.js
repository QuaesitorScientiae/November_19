import nav from './modules/navscript';
import slider from './modules/slider';

window.addEventListener('DOMContentLoaded', () => {    
    'use strict';
    nav();
    slider ('.movie__info__cover','horizontal', '.prevBtn', '.nextBtn');
});
