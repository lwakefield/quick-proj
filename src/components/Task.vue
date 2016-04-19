<template lang="jade">
    .card.task
        header.card-header: .card-header-content
            span {{ task.title }}
            button.btn.btn-sm.btn-secondary(@click="$dispatch('deselectTask', taskPath)") x
        .card-block: form(@submit.stop.prevent="addTask"): .input-group
            input(type="text", placeholder="New Task", v-model="newTask").form-control
            span.input-group-btn: button.btn.btn-primary(@click="addTask") +
        .task-list-options
            .checkbox: label
                input(type="checkbox", v-model="hideCompleted")
                | Hide Completed
        ul.list-group.list-group-flush
            li.list-group-item(
                v-for="child in childTasks | orderBy priorityCompare | filterBy filterCompletedTasks",
                :class="{active: `${this.taskPath}/tasks/${child['.key']}` === selectedTask}"
            )
                .task-list-item
                    div.task-list-item-left(@click.stop="")
                        select.task-option(v-model="child.priority", @change="updateTaskPriority(child['.key'])")
                            option !!!
                            option !!
                            option !
                            option
                        select.task-option(v-model="child.status", @change="updateTaskStatus(child['.key'])")
                            option ✔
                            option ?
                            option
                        span.child-task-title - {{ child.title }}
                    .task-list-item-right
                        .task-options.dropdown
                            button(data-toggle="dropdown") &middot;&middot;&middot;
                            .dropdown-menu.dropdown-menu-right
                                button.dropdown-item(@click="deleteTask(child['.key'])") Delete
                        span.pill.task-count {{ getTaskCount(child) }}
                        button.select-task(@click="selectTask(child['.key'])") &#10140;
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
                selectedTask: '',
                hideCompleted: true
            };
        },
        firebase: {
            root: {
                source: new Firebase('https://vivid-torch-9375.firebaseio.com'),
                asObject: true
            }
        },
        methods: {
            priorityCompare(a, b) {
                return b.priority.length - a.priority.length;
            },
            filterCompletedTasks(a) {
                return !(this.hideCompleted && a.status === '✔');
            },
            getTaskCount(task) {
                return task.tasks ? Object.keys(task.tasks).length : 0;
            },
            addTask() {
                if (!this.newTask) return;

                this.$firebaseRefs.task.child('tasks').push({
                    title: this.newTask.trim(),
                    priority: '',
                    status: ''
                });
                this.newTask = '';
            },
            deleteTask(taskId) {
                this.$firebaseRefs.task.child(`tasks/${taskId}`).remove();
            },
            selectTask(taskId) {
                this.$dispatch('selectTask', `${this.taskPath}/tasks/${taskId}`);
                this.selectedTask = `${this.taskPath}/tasks/${taskId}`;
            },
            updateTaskPriority(taskId) {
                let task = this.task.tasks[taskId];
                this.$firebaseRefs.task.child(`tasks/${taskId}`).update({
                    priority: task.priority
                });
            },
            updateTaskStatus(taskId) {
                let task = this.task.tasks[taskId];
                this.$firebaseRefs.task.child(`tasks/${taskId}`).update({
                    status: task.status
                });
            }
        },
        events: {
            deselectTask(taskPath) {
                if (this.selectedTask === taskPath) this.selectedTask = '';
            }
        },
        created() {
            let root = this.$firebaseRefs.root;
            this.$bindAsObject('task', root.child(this.taskPath));
            this.$bindAsArray('childTasks', root.child(`${this.taskPath}/tasks`));
        }
    };
</script>

<style>
    .card-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .task {
        width: 32rem;
        flex: 1 0 auto;
    }
    .task:not(:last-child) {
        margin-right: 1rem;
    }
    
    @media (max-width: 450px) {
        .task {
            width: calc(100vw - 2rem);
        }
    }

    .task-list-options {
        display: flex;
        justify-content: end;
        margin: 0 1rem;
    }
    
    .task-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .select-task {
        background: none;
        border: none;
        border-left: 1px solid LightGrey;
        padding: 0.5rem;
    }
    .select-task:hover {
        font-weight: bolder;
    }
    .select-task:focus {
        outline: none;
    }
    .task-list-item-left {
        margin-left: 1rem;
        display: flex;
    }
    .child-task-title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 400px;
    }
    .task-list-item-right {
        display: flex;
        align-items: center;
    }
    .task-options span,
    .task-count {
        margin: 0.5rem;
    }
    .task-options button {
        background: none;
        border: none;
        padding: 0.5rem;
    }
    .task-options button:focus {
        outline: none;
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
