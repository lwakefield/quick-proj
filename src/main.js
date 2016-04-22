import Firebase from 'firebase';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';

window.jQuery = require('jquery');
require('!bootstrap/dist/js/umd/dropdown.js');
require('!style!css!sass!./sass/main.scss');
require('!style!css!font-awesome/css/font-awesome.css');

Vue.use(VueFire);
Vue.use(VueRouter);
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
        bindArrayOnAuth(toBind, path) {
            return this.bindOnAuth(toBind, path, true);
        },
        bindObjectOnAuth(toBind, path) {
            return this.bindOnAuth(toBind, path, false);
        },
        bindOnAuth(toBind, path, array = true) {
            this.root.onAuth(auth => {
                if (auth) {
                    path = path.replace('<AUTH_ID>', auth.uid);
                    if (array) this.$bindAsArray(toBind, this.root.child(path));
                    else this.$bindAsObject(toBind, this.root.child(path));
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

let router = new VueRouter();
router.map({
    '/project/:projectId': {
        component: require('./components/TaskList')
    },
    '/': {
        component: require('./components/Home')
    }
});
router.start(require('./App'), '#app');

/* eslint-disable no-new */
//new Vue({
    //el: 'body',
    //components: {
        //App
    //}
//});
