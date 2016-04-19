<template>
    <form class="form-inline">
        <input type="text" class="form-control" v-model="user.email" placeholder="email">
        <input type="password" class="form-control" v-model="user.password" placeholder="password">
        <button class="btn btn-primary" @click.stop.prevent="signup">Signup</button>
        <button class="btn btn-primary" @click.stop.prevent="login">Login</button>
    </form>
</template>

<script>
    import Firebase from 'firebase';
    export default {
        data() {
            return {
                user: {
                    email: '',
                    password: ''
                }
            };
        },
        firebase: {
            root: {
                source: new Firebase('https://vivid-torch-9375.firebaseio.com/'),
                asObject: true
            }
        },
        methods: {
            signup() {
                this.$firebaseRefs.root.createUser(this.user)
                    .then(userData => {
                        this.user = {};
                        this.login();
                    });
            },
            login() {
                this.$firebaseRefs.root.authWithPassword(this.user)
                    .then(auth => {
                        this.user = {};
                    });
            }
        }
    };
</script>
