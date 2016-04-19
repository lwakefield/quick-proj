import Vue from 'vue';
Vue.use(require('vuefire'));
import App from './App';

window.jQuery = require('jquery');
require('!bootstrap/dist/js/umd/dropdown.js');
require('!style!css!sass!./sass/main.scss');
require('!style!css!font-awesome/css/font-awesome.css');

Vue.config.debug = true;

/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {
        App
    }
});
