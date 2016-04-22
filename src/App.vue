<template>
    <main>
        <header>
            <div class="header-left">
                <h1><a v-link="{path: '/'}">Q</a></h1>
            </div>

            <login-or-signup v-if="!auth"></login-or-signup>
            <div v-else>
                <div class="dropdown">
                    <button data-toggle="dropdown">
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <button class="dropdown-item" @click.prevent="logout"> Logout </button>
                    </div>
                </div>
            </div>
        </header>

        <router-view></router-view>

    </main>
</template>

<script>
import LoginOrSignup from './components/LoginOrSignup';

export default {
    components: {
        LoginOrSignup
    },
    methods: {
        logout() {
            this.root.unauth();
            window.location.reload();
        }
    }
};
</script>

<style scoped>
    main {
        margin: 1rem;
    }
    @media (max-width: 992px) {
        main {
            margin: 0.25rem;
        }
    }
    
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .header-left {
        display: flex;
        align-items: center;
    }
    .header-left h1 {
        margin-right: 1rem;
    }
    
    .card-list {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .card-list-wrapper {
        overflow-x: scroll;
    }
</style>
