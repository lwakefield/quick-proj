<template>
    <form @submit.stop.prevent="$dispatch('addTask', newTask)">
        <div class="input-group">
            <input type="text" class="form-control" placeholder="New Task" v-model="newTask">
            <span class="input-group-btn">
                <button class="btn btn-primary" type="button" @click="$dispatch('addTask', newTask)">+</button>
            </span>
        </div>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                newTask: ''
            };
        }
    };
</script>
