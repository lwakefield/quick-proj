<template>
    <div class="app">
        <header class="app-header">
            <select-add-project :projects="projects"></select-add-project>
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

    export default {
        components: {
            Project,
            Task,
            SelectAddProject
        },
        data() {
            return {
                newProject: '',
                searchProject: '',
                activeSearchProject: 0,
                projects: [],
                project: undefined,
                taskPaths: [],
                ProjectsFireBase: new Firebase('https://vivid-torch-9375.firebaseio.com/projects')
            };
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
            this.fireBaseSyncArray(this.ProjectsFireBase, 'projects');
            let unwatch = this.$watch('projects', newVal => {
                if (newVal.length) {
                    this.project = newVal[0];
                    this.taskPaths = [`/projects/${newVal[0].id}`];
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
    
    .card-list {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .card-list-wrapper {
        overflow-x: scroll;
    }
</style>
