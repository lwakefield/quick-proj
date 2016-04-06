<template>
    <div class="card task">
        <header class="card-header">
            <span>{{ task.title }}</span> 
            <button class="btn btn-sm btn-secondary" @click="$dispatch('deselectTask', taskPath)">x</button>
        </header>

        <div class="card-block">
            <form @submit.stop.prevent="addTask">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="New Task" v-model="newTask">
                    <span class="input-group-btn">
                        <button class="btn btn-primary" type="button" @click="addTask">+</button>
                    </span>
                </div>
            </form>
        </div>

        <span class="caret"></span>
        <div class="task-list-options">
            <div class="dropdown" @click="menuOpen = !menuOpen" :class="{open: menuOpen}">
                <button class="dropdown-toggle"></button>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="#" 
                        @click.prevent="deleteSelectedTask" 
                        :class="{disabled: !selectedTask}">Delete Selected Task</a>
                </div>
            </div>
        </div>

        <ul class="list-group list-group-flush">
            <li class="task-list-item list-group-item" 
                v-for="child in task.tasks | orderBy 'priority' -1 order" 
                :class="{active: $key === selectedTask}" 
                @click="selectTask($key)">
                <div @click.stop>
                    <select class="task-option" v-model="child.priority" @change="updateTaskPriority($key)">
                        <option>!!!</option>
                        <option>!!</option>
                        <option>!</option>
                        <option></option>
                    </select>
                    <select class="task-option" v-model="child.status" @change="updateTaskStatus($key)">
                        <option>✔</option>
                        <option>?</option>
                        <option></option>
                    </select>
                    <span>{{ child.title }}</span>
                </div>
                <span class="label label-default label-pill">{{ getTaskCount(child) }}</span>
            </li>
        </ul>

    </div>
</template>

<script>
    import Firebase from 'firebase';
    import Task from './Task.vue';
    export default {
        name: 'task',
        components: {
            Task
        },
        props: ['taskPath'],
        data() {
            return {
                newTask: '',
                TaskFireBase: new Firebase(`https://vivid-torch-9375.firebaseio.com/${this.taskPath}/`),
                task: {},
                selectedTask: '',
                menuOpen: false
            };
        },
        methods: {
            getTaskCount(task) {
                return task.tasks ? Object.keys(task.tasks).length : 0;
            },
            addTask() {
                if (!this.newTask) return;

                this.TaskFireBase.child('tasks').push({
                    title: this.newTask.trim(),
                    priority: '',
                    status: ''
                });
                this.newTask = '';
            },
            deleteSelectedTask() {
                if (!this.selectedTask) return;

                this.TaskFireBase.child(`tasks/${this.selectedTask}`).remove();
                this.$dispatch('deselectTask', `${this.taskPath}/tasks/${this.selectedTask}`);
                this.selectedTask = '';
            },
            selectTask(taskId) {
                this.$dispatch('selectTask', `${this.taskPath}/tasks/${taskId}`);
                this.selectedTask = taskId;
            },
            updateTaskPriority(taskId) {
                let task = this.task.tasks[taskId];
                this.TaskFireBase.child(`tasks/${taskId}`).update({
                    priority: task.priority
                });
            },
            updateTaskStatus(taskId) {
                let task = this.task.tasks[taskId];
                this.TaskFireBase.child(`tasks/${taskId}`).update({
                    status: task.status
                });
            }
        },
        ready() {
            this.fireBaseSyncObject(this.TaskFireBase, 'task');
        }
    };
</script>

<style>
    .task-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .task-list-options {
        display: flex;
        justify-content: flex-end;
    }
    
    .task-list-options .dropdown-toggle {
        border: none;
        background: none;
    }
    
    .task-option {
        background: none;
        border: none;
        border-bottom: 1px solid LightGrey;
        appearance: none;
    }
</style>
