<template>
    <div class="app">
        <header class="app-header">
            <select-add-project v-if="auth"></select-add-project>

            <login-or-signup v-if="!auth"></login-or-signup>
            <div v-else>
                <a href="#" @click.prevent="logout">Logout</a>
            </div>
        </header>

        <div class="card-list-wrapper" v-el:card-list-wrapper v-if="auth">
            <div class="card-list">
                <task v-for="t in taskPaths" v-if="!showSettings || $index === 0" :task-path="t" :is-root="$index === 0"></task>
                <project-settings v-if="showSettings && taskPaths" :project-path="taskPaths[0]"></project-settings>
            </div>
        </div>

    </div>
</template>

<script>
import Task from './components/Task';
import SelectAddProject from './components/SelectAddProject';
import LoginOrSignup from './components/LoginOrSignup';
import ProjectSettings from './components/ProjectSettings';
import Firebase from 'firebase';

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
            auth: {},
            showSettings: false
        };
    },
    firebase: {
        root: {
            source: new Firebase('https://vivid-torch-9375.firebaseio.com/'),
            asObject: true
        }
    },
    methods: {
        logout() {
            this.$firebaseRefs.root.unauth();
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
        this.$firebaseRefs.root.onAuth(auth => {
            if (auth) {
                let root = this.$firebaseRefs.root;
                this.$bindAsArray('projects', root.child(`/projects/${auth.uid}`));
                this.auth = auth;
                this.$firebaseRefs.projects.once('child_added', snap => {
                    let key = snap.key();
                    let auth = this.auth;
                    this.$dispatch('selectTask', `/projects/${auth.uid}/${key}`);
                });
            } else {
                this.auth = undefined;
                if (this.$firebaseRefs.projects) this.$unbind('projects');
                this.taskPaths = [];
            }
        });
    }
};
</script>

<style>
    * {
        box-sizing: border-box;
    }
    
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 4px;
        height: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: rgba(0, 0, 0, .5);
        -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
    
    .app {
        margin: 1rem;
    }
    
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .card-list {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .card-list-wrapper {
        overflow-x: scroll;
    }
</style>
