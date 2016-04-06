<template>
    <div class="app">
        <header class="app-header">
            <form class="add-project-form" @submit.stop.prevent="addProject">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="New Project" v-model="newProject">
                    <span class="input-group-btn">
                        <button class="btn btn-primary" type="button" @click="addProject">+</button>
                    </span>
                </div>
            </form>

            <select class="form-control" v-model="project">
                <option v-for="p in projects" v-if="!p.archived" :value="p">{{p.title}}</option>
            </select>
        </header>

        <div class="card-list-wrapper" v-el:card-list-wrapper>
            <div class="card-list">
                <task :task-path=`/projects/${project.id}` v-if="project"></task>

                <task v-for="t in taskPaths" :task-path="t"></task>
            </div>
        </div>

    </div>
</template>

<script>
    import Project from './components/Project';
    import Task from './components/Task';
    import Firebase from 'firebase';

    export default {
        components: {
            Project,
            Task
        },
        data() {
            return {
                newProject: '',
                projects: [],
                project: undefined,
                taskPaths: [],
                ProjectsFireBase: new Firebase('https://vivid-torch-9375.firebaseio.com/projects')
            };
        },
        methods: {
            addProject() {
                if (!this.newProject) return;

                this.ProjectsFireBase.push({
                    title: this.newProject
                });
                this.newProject = '';
            }
        },
        events: {
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
            this.fireBaseSyncArray(this.ProjectsFireBase, 'projects');
            let unwatch = this.$watch('projects', newVal => {
                if (newVal.length) {
                    this.project = newVal[0];
                }
                unwatch();
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
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .task {
        width: 32rem;
        flex: 1 0 auto;
    }
    
    @media (max-width: 450px) {
        .task {
            width: 16rem;
        }
    }
    
    .card-list {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .card-list-wrapper {
        overflow-x: scroll;
    }
</style>
