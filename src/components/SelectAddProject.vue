<template>
    <div class="dropdown select-project" :class="{open: search}">
        <input type="text" class="form-control" placeholder="Select a project" 
            v-model="search" 
            @keyup="handleKey($event)">
        <div class="dropdown-menu">
                <a class="dropdown-item" href="#"
                    v-for="p in filtered"
                    :class="{active: $index === index}">{{ p.title }}</a>
                <a class="dropdown-item" href="#" 
                        :class="{active: index === filtered.length}">
                        Create Project <em>{{search}}</em>
                </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['projects'],
        data() {
            return {
                search: '',
                index: 0
            };
        },
        computed: {
            filtered() {
                return this.projects.filter(p => p.title.includes(this.search));
            }
        },
        methods: {
            handleKey(event) {
                if (!this.search) {
                    this.index = 0;
                    return;
                }

                let index = this.index;
                if (event.keyIdentifier === 'Down') {
                    index = index === this.filtered.length ? 0 : index + 1;
                    this.index = index;
                } else if (event.keyIdentifier === 'Up') {
                    index = index === 0 ? this.filtered.length : index - 1;
                    this.index = index;
                } else if (event.keyIdentifier === 'Enter') {
                    if (index < this.filtered.length) {
                        let project = this.filtered[index];
                        this.$dispatch('selectProject', `/projects/${project.id}`);
                    } else {
                        this.$dispatch('addProject', this.search);
                    }
                    this.search = '';
                } else if (event.keyIdentifier === 'U+001B') { // Escape
                    this.search = '';
                }
            }
        }
    };
</script>

<style>
    .select-project {
        width: 100%;
        max-width: 32rem;
    }
    
    .select-project .dropdown-menu {
        width: 100%;
    }
</style>
