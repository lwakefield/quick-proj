<template>
    <div class="app">
        <header class="app-header">
            <select-add-project :projects="projects"></select-add-project>

            <form class="form-inline" v-if="!auth">
                <input type="text" class="form-control" v-model="user.email" placeholder="email">
                <input type="password" class="form-control" v-model="user.password" placeholder="password">
                <button class="btn btn-primary" @click.stop.prevent="register">Signup</button>
                <button class="btn btn-primary" @click.stop.prevent="login">Login</button>
            </form>
            <p v-else>Hey there,
                <em>{{userName}}</em>
            </p>
        </header>

        <div class="card-list-wrapper" v-el:card-list-wrapper>
            <div class="card-list">
                <task v-for="t in taskPaths" :task-path="t"></task>
            </div>
        </div>

    </div>
</template>

<script>
    import Project from './components/Project';
    import Task from './components/Task';
    import SelectAddProject from './components/SelectAddProject';
    import Firebase from 'firebase';
    import {
        objectGet
    } from 'jshelpme';

    export default {
        components: {
            Project,
            Task,
            SelectAddProject
        },
        data() {
            return {
                projects: [],
                project: undefined,
                taskPaths: [],
                user: {},
                auth: {},
                ProjectsFireBase: undefined,
                RootFireBase: new Firebase('https://vivid-torch-9375.firebaseio.com/')
            };
        },
        computed: {
            userName() {
                return objectGet(this.auth, 'password.email');
            },
            authId() {
                return objectGet(this.auth, 'auth.uid', '');
            }
        },
        methods: {
            updateFireBase() {
                this.projects = [];
                if (!this.auth) {
                    this.ProjectsFireBase = undefined;
                    return;
                }

                this.ProjectsFireBase = this.RootFireBase.child(`projects/${this.authId}`);
                this.fireBaseSyncArray(this.ProjectsFireBase, 'projects');
                let unwatch = this.$watch('projects', newVal => {
                    let projId = objectGet(newVal, '0.id', '');
                    this.taskPaths = [`/projects/${this.authId}/${projId}`];
                    unwatch();
                });
            },
            register() {
                this.RootFireBase.createUser(this.user)
                    .then(userData => {
                        this.login();
                    }).catch(error => {
                        console.log(error);
                    });
            },
            login() {
                this.RootFireBase.authWithPassword(this.user)
                    .then(auth => {
                        this.auth = auth;
                        this.updateFireBase();
                    }).catch(error => {
                        console.log(error);
                    });
            }
        },
        events: {
            selectProject(projectId) {
                this.taskPaths = [projectId];
            },
            addProject(projectName) {
                if (!projectName) return;

                this.ProjectsFireBase.push({
                    title: projectName
                });
            },
            selectTask(taskId) {
                let index = this.taskPaths.findIndex(t => !taskId.includes(t));
                if (index !== -1) {
                    this.taskPaths.splice(index);
                }
                this.taskPaths.push(taskId);
                let el = this.$els.cardListWrapper;
                this.$nextTick(() => {
                    el.scrollLeft = el.scrollWidth;
                });
            },
            deselectTask(taskId) {
                if (this.taskPaths && this.taskPaths[0] === taskId) return;
                let index = this.taskPaths.findIndex(t => taskId === t);
                this.taskPaths.splice(index);
            },
            archiveProject(project) {
                this.ProjectsFireBase.child(project.id).update({
                    archived: true
                });
            }
        },
        ready() {
            this.RootFireBase.onAuth(auth => {
                this.auth = auth;
                this.updateFireBase();
            });
            this.RootFireBase.offAuth(auth => {
                this.auth = {};
            });
        }
    };
</script>

<style>
    @import './assets/bootstrap.css';
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
        justify-content: space-around;
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
