<template>
    <div class="app">
        <header class="app-header">
            <div class="dropdown select-project" :class="{open: searchProject}">
                <input type="text" class="form-control" placeholder="Select a project" 
                    v-model="searchProject" 
                    @keyup="handleSearchProjectKey($event)">
                <div class="dropdown-menu">
                        <a class="dropdown-item" href="#"
                            v-for="p in filteredSearchProjects"
                            :class="{active: $index === activeSearchProject}">{{ p.title }}</a>
                        <a class="dropdown-item" href="#" 
                                :class="{active: activeSearchProject === filteredSearchProjects.length}">
                                Create Project <em>{{searchProject}}</em>
                        </a>
                </div>
            </div>
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
    import Firebase from 'firebase';

    export default {
        components: {
            Project,
            Task
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
        computed: {
            filteredSearchProjects() {
                return this.projects.filter(p => p.title.includes(this.searchProject));
            }
        },
        methods: {
            handleSearchProjectKey(event) {
                if (!this.searchProject) {
                    this.activeSearchProject = 0;
                    return;
                }

                let index = this.activeSearchProject;
                if (event.keyIdentifier === 'Down') {
                    index = index === this.filteredSearchProjects.length ? 0 : index + 1;
                    this.activeSearchProject = index;
                } else if (event.keyIdentifier === 'Up') {
                    index = index === 0 ? this.filteredSearchProjects.length : index - 1;
                    this.activeSearchProject = index;
                } else if (event.keyIdentifier === 'Enter') {
                    if (index < this.filteredSearchProjects.length) {
                        this.project = this.filteredSearchProjects[index];
                        this.taskPaths = [`/projects/${this.project.id}`];
                    } else {
                        this.addProject();
                    }
                    this.searchProject = '';
                }
            },
            addProject() {
                if (!this.searchProject) return;

                this.ProjectsFireBase.push({
                    title: this.searchProject
                });
                this.searchProject = '';
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
    
    .select-project {
        max-width: 32rem;
    }
    
    .select-project .dropdown-menu {
        width: 100%;
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
