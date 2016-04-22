<template>
    <main>
        <header>
            <div class="header-left">
                <h1><a href="/">Q</a></h1>
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

        <!--<task-list></task-list>-->
        <router-view></router-view>

    </main>
</template>

<script>
import SelectAddProject from './components/SelectAddProject';
import LoginOrSignup from './components/LoginOrSignup';
import TaskList from './components/TaskList';

export default {
    components: {
        SelectAddProject,
        LoginOrSignup,
        TaskList
    },
    data() {
        return {
            taskPaths: [],
            showSettings: false
        };
    },
    methods: {
        logout() {
            this.root.unauth();
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
