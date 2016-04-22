<template>
    <div class="card-list-wrapper" v-el:card-list-wrapper v-if="auth">
        <div class="card-list">
            <task v-for="t in taskPaths" v-if="!showSettings || $index === 0" :task-path="t" :is-root="$index === 0"></task>
            <project-settings v-if="showSettings && taskPaths" :project-path="taskPaths[0]"></project-settings>
        </div>
    </div>
</template>

<script>
import Task from './Task';
import ProjectSettings from './ProjectSettings';

export default {
    components: {
        Task,
        ProjectSettings
    },
    data() {
        return {
            taskPaths: [],
            showSettings: false,
            project: {}
        };
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
        let path = `/projects/<AUTH_ID>/${this.$route.params.projectId}`;
        this.bindObjectOnAuth('project', path);
        this.taskPaths = [path];
    }
};
</script>

<style scoped>
    .card-list {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .card-list-wrapper {
        overflow-x: scroll;
    }
</style>
