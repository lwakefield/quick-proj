<template lang="jade">
    .card.task
        header.card-header: .card-header-content
            span {{ task.title }}
            .btn-group
                button.btn.btn-sm.btn-secondary(
                    v-if="isRoot",
                    @click="$dispatch('toggleSettings')"
                ): i.fa.fa-cog
                button.btn.btn-sm.btn-secondary(
                    v-if="!isRoot"
                    @click="$dispatch('deselectTask', taskPath)"
                ): i.fa.fa-times

        .card-block: form(@submit.stop.prevent="addTask"): .input-group
            input(type="text", placeholder="New Task", v-model="newTask").form-control
            span.input-group-btn: button.btn.btn-primary(@click="addTask") +

        .task-list-options

            span Show Status:&nbsp;
            .btn-group
                button.btn.btn-sm.btn-secondary(
                    v-for="f in statusFilter.types",
                    :class="{active: statusFilter.active.includes(f)}",
                    @click="toggleFilter('status', f)"
                ) {{ f }}

            | &nbsp;

            span Show Priority:&nbsp;
            .btn-group
                button.btn.btn-sm.btn-secondary(
                    v-for="f in priorityFilter.types",
                    :class="{active: priorityFilter.active.includes(f)}",
                    @click="toggleFilter('priority', f)"
                ) {{ f }}

        ul.list-group.list-group-flush
            li.list-group-item(
                v-for="child in childTasks | orderBy orderTasks | filterBy filterTasks",
                :class="{active: `${this.taskPath}/tasks/${child['.key']}` === selectedTask}"
            )
                .task-list-item
                    div.task-list-item-left(@click.stop="")
                        select.task-option(v-model="child.priority", @change.capture="updateTaskPriority(child)")
                            option !!!
                            option !!
                            option !
                            option
                        select.task-option(v-model="child.status", @change.capture="updateTaskStatus(child)")
                            option ✔
                            option ?
                            option
                        span.child-task-title - {{ child.title }}
                    .task-list-item-right
                        .task-options.dropdown
                            button(data-toggle="dropdown"): i.fa.fa-ellipsis-v
                            .dropdown-menu.dropdown-menu-right
                                button.dropdown-item(@click="deleteTask(child)") Delete
                        span.pill.task-count {{ getTaskCount(child) }}
                        button.select-task(@click="selectTask(child)"): i.fa.fa-angle-right
</template>

<script>
import Firebase from 'firebase';
import Task from './Task.vue';
export default {
    name: 'task',
    components: {
        Task
    },
    props: ['taskPath', 'isRoot'],
    data() {
        return {
            newTask: '',
            selectedTask: '',
            priorityFilter: {
                types: ['!!!', '!!', '!', ''],
                active: ['!!!', '!!', '!', '']
            },
            statusFilter: {
                types: ['✔', '?', ''],
                active: ['?', '']
            }
        };
    },
    firebase: {
        root: {
            source: new Firebase('https://vivid-torch-9375.firebaseio.com'),
            asObject: true
        }
    },
    methods: {
        orderTasks(a, b) {
            return b.priority.length - a.priority.length;
        },
        filterTasks(a) {
            return this.statusFilter.active.includes(a.status) &&
                this.priorityFilter.active.includes(a.priority);
        },
        toggleFilter(type, val) {
            let active = this[`${type}Filter`].active;
            let index = active.indexOf(val);
            if (index !== -1) active.splice(index, 1);
            else active.push(val);
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
        deleteTask(task) {
            this.$firebaseRefs.task.child(`tasks/${task['.key']}`).remove();
        },
        selectTask(task) {
            this.$dispatch('selectTask', `${this.taskPath}/tasks/${task['.key']}`);
            this.selectedTask = `${this.taskPath}/tasks/${task['.key']}`;
        },
        updateTaskPriority(task) {
            this.$firebaseRefs.task.child(`tasks/${task['.key']}`).update({
                priority: task.priority
            });
        },
        updateTaskStatus(task) {
            this.$firebaseRefs.task.child(`tasks/${task['.key']}`).update({
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
        align-items: center;
        margin: 0 1rem 0.5rem;
    }
    .task-list-options button:focus,
    .task-list-options button:active {
        outline: none;
        background: none;
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
        align-items: center;
    }
    .child-task-title {
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
        /*width: 400px;*/
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
