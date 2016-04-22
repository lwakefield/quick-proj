<template>
    <main>
        <header>
            <div class="header-left">
                <h1>Q</h1>
                <select-add-project v-if="auth"></select-add-project>
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

        <div class="card-list-wrapper" v-el:card-list-wrapper v-if="auth">
            <div class="card-list">
                <task v-for="t in taskPaths" v-if="!showSettings || $index === 0" :task-path="t" :is-root="$index === 0"></task>
                <project-settings v-if="showSettings && taskPaths" :project-path="taskPaths[0]"></project-settings>
            </div>
        </div>

    </main>
</template>

<script>
import Task from './components/Task';
import SelectAddProject from './components/SelectAddProject';
import LoginOrSignup from './components/LoginOrSignup';
import ProjectSettings from './components/ProjectSettings';

export default {
    components: {
        Task,
        SelectAddProject,
        LoginOrSignup,
        ProjectSettings
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
    },
    events: {
        selectTask(taskPath) {
            let index = this.taskPaths.findIndex(p => {
                return !taskPath.includes(p);
            });
            if (index !== -1) this.taskPaths.splice(index);
            this.taskPaths.push(taskPath);
            this.showSettings = false;
        },
        deselectTask(taskPath) {
            let index = this.taskPaths.findIndex(p => p === taskPath);
            this.taskPaths.splice(index);
            this.$broadcast('deselectTask', taskPath);
        },
        toggleSettings() {
            this.showSettings = !this.showSettings;
        },
        deletedProject() {
            this.taskPaths = [];
            this.showSettings = false;
        }
    },
    ready() {
        this.bindOnAuth('projects', '/projects/<AUTH_ID>');

        this.root.onAuth(auth => {
            if (auth) {
                this.$firebaseRefs.projects.once('child_added', snap => {
                    this.$dispatch('selectTask', `/projects/${auth.uid}/${snap.key()}`);
                });
            } else {
                this.taskPaths = [];
            }
        });
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
