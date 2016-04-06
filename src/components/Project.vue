<template>
    <div class="card">
        <header class="card-header">
            <span>{{ project.title }}</span> 
            <div class="dropdown" :class="{open: menuOpen}">
                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" @click="menuOpen = !menuOpen"></button>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="#" @click="$dispatch('archiveProject', project)">Archive</a>
                </div>
            </div>
        </header>

        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="task in project.tasks" @click="$dispatch('selectTask', `${this.projectPath}/tasks/${$key}`)">
                {{ task.title }} 
            </li>
        </ul>
    </div>
</template>

<script>
    import Firebase from 'firebase';

    export default {
        props: ['projectPath'],
        data() {
            return {
                newTask: '',
                ProjectFireBase: new Firebase(`https://vivid-torch-9375.firebaseio.com/${this.projectPath}/`),
                project: {},
                tasks: []
            };
        },
        methods: {
            addTask() {
                if (!this.newTask) return;

                // this.TaskFireBase.push({
                    // title: this.newTask
                // });
                this.newTask = '';
            }
        },
        events: {
            'remove-task': function(task) {
                // this.TaskFireBase.child(task.id).remove();
            }
        },
        ready() {
            this.fireBaseSyncObject(this.ProjectFireBase, 'project');
        }
    };
</script>

<style>
</style>
