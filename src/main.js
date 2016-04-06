import Vue from 'vue';
import App from './App';

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
