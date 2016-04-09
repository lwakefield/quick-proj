import Vue from 'vue';
import App from './App';
import Firebase from 'firebase';
import {
    objectSet,
    objectGet
} from 'jshelpme';
import generatePushID from './generatePushID';

/* eslint-disable no-unused-vars */
class Store {
    static get(key) {
        let path = key.split('.');
        let parentPath = path[0];
        let childPath = path.splice(1).join('.');
        let item = JSON.parse(localStorage[parentPath] || '{}');
        return objectGet(item, childPath);
    }
    static set(key, val) {
        let path = key.split('.');
        let parentPath = path[0];
        let childPath = path.splice(1).join('.');
        let item = JSON.parse(localStorage[parentPath] || '{}');
        objectSet(item, childPath, val);
        localStorage[parentPath] = JSON.stringify(item);
    }
}

class FirebaseOffline extends Firebase {

    constructor(url, prefix = 'offline') {
        super(url);
        // builds the path, strips the protocol and removes empty strings
        // https://my-app-name.firebaseio.com/foo/1234/bar
        //   => app = 'my-app-name'
        //   => path = 'foo.1234.bar'
        let urlSplit = url.split('/').filter((v, i) => i > 0 && v);
        let app = urlSplit[0].split('.')[0];
        let path = urlSplit.splice(1).join('.');

        this._app = app;
        this._path = path;
        this._prefix = prefix;

        this.on('value', snapshot => {
            Store.set(`${this._prefix}_${this._app}.${this._path}`, snapshot.val());
        });

        this.root().child('.info/connected').on('value', snapshot => {
            this.online = snapshot.val();
        });
    }

    // child, parent
    // set, update, remove, push

    set(value, onComplete) {
        if (this.online) super.set(value, onComplete);
        else Store.set(`${this._prefix}_dirty_${this._app}.${this._path}`, value);
    }

    push(value, onComplete) {
        if (this.online) {
            super.push(value, onComplete);
        } else {
            let pushID = generatePushID();
            Store.set(`${this._prefix}_dirty_${this._app}.${this._path}.${pushID}`, value);
        }
    }

}

let fo = new FirebaseOffline('https://vivid-torch-9375.firebaseio.com/foo/1234/bar');
window.fo = fo;
window.FirebaseOffline = FirebaseOffline;
window.Store = Store;

require('offline-plugin/runtime').install();

Vue.config.debug = true;

Vue.mixin({
    methods: {
        fireBaseSyncArray(fireBaseCollection, arrName) {
            let localVar = this.$get(arrName);
            fireBaseCollection.on('child_added', snapshot => {
                let item = snapshot.val();
                item.id = snapshot.key();
                localVar.push(item);
            });
            fireBaseCollection.on('child_changed', snapshot => {
                let newItem = snapshot.val();
                newItem.id = snapshot.key();
                localVar.some((oldItem, index) => {
                    if (oldItem.id === newItem.id) {
                        localVar.$set(index, newItem);
                        return true;
                    }
                });
            });
            fireBaseCollection.on('child_removed', snapshot => {
                let id = snapshot.key();
                localVar.some(item => {
                    if (item.id === id) {
                        localVar.$remove(item);
                        return true;
                    }
                });
            });
        },
        fireBaseSyncObject(fireBaseCollection, objName) {
            fireBaseCollection.on('value', snapshot => {
                let item = snapshot.val();
                item.id = snapshot.key();
                this.$set(objName, item);
            });
        }

    }
});

/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: {
        App
    }
});
