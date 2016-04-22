<template>
    <div class="card-list" v-if="auth">
        <a class="card" v-link="`project/${project['.key']}`" v-for="project in projects">
            <div class="card-block">
                <h2 class="card-title"> {{ project.title }} </h2>
                <h3> {{ countTasksInProject(project) }} Tasks</h3>
            </div>
        </a>
        <div class="card new" v-if="newProject">
            <div class="card-block">
                <input type="text" placeholder="Project Name" v-model="newProjectName" @keyup.enter="addProject">
                <small>Hit Enter to create a new Project</small>
            </div>
        </div>
        <a class="card add" href="#" @click.prevent="newProject = !newProject">
            <i class="fa fa-plus"></i>
        </a>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                newProject: false,
                newProjectName: ''
            };
        },
        created() {
            this.bindArrayOnAuth('projects', '/projects/<AUTH_ID>');
        },
        methods: {
            countTasksInProject(project) {
                return project.tasks ? Object.keys(project.tasks).length : 0;
            },
            addProject() {
                this.$firebaseRefs.projects.push({
                    title: this.newProjectName
                }).then(snap => {
                    this.$route.router.go(`project/${snap.key()}`);
                });
            }
        }
    };
</script>

<style scoped>
    .card {
        width: 18rem;
        margin: 1rem;
        text-align: center;
    }
    
    .add.card {
        font-size: 5rem;
    }
    
    .new .card-block {
        display: flex;
        flex-flow: column;
    }
    .new input {
        font-size: 2rem;
    }
    
    .card-list {
        display: flex;
        flex-flow: row wrap;
    }
</style>
