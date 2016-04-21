import Firebase from 'firebase';
import Vue from 'vue';
Vue.use(require('vuefire'));
import App from './App';

window.jQuery = require('jquery');
require('!bootstrap/dist/js/umd/dropdown.js');
require('!style!css!sass!./sass/main.scss');
require('!style!css!font-awesome/css/font-awesome.css');

Vue.config.debug = true;

Vue.mixin({
    data() {
        return {
            auth: undefined
        };
    },
    firebase: {
        root: {
            source: new Firebase('https://vivid-torch-9375.firebaseio.com/'),
            asObject: true
        }
    },
    computed: {
        root() {
            return this.$firebaseRefs.root;
        }
    },
    methods: {
        bindOnAuth(toBind, path) {
            this.root.onAuth(auth => {
                if (auth) {
                    path = path.replace('<AUTH_ID>', auth.uid);
                    this.$bindAsArray(toBind, this.root.child(path));
                } else if (this.$firebaseRefs[toBind]) {
                    this.$unbind(toBind);
                }
            });
        }
    },
    created() {
        this.root.onAuth(auth => {
            if (auth) this.auth = auth;
            else this.auth = undefined;
        });
    }
});

/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {
        App
    }
});
