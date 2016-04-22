<template>
    <div class="dropdown" :class="{open: search}">
        <input type="text" class="form-control" placeholder="Select a project" v-model="search" @keyup="handleKey($event)">
        <div class="dropdown-menu">
            <a class="dropdown-item" href="#" v-for="p in projects | filterBy search in 'title'" :class="{active: $index === index}" @click.prevent="selectProject(p)">{{ p.title }}</a>
            <a class="dropdown-item" href="#" :class="{active: newProj}" @click.prevent="addProject">
                Create Project
                <em>{{search}}</em>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                index: 0,
                newProj: false
            };
        },
        methods: {
            handleKey(event) {
                if (!this.search) {
                    this.index = 0;
                    return;
                }

                let filtered = this.projects.filter(
                    p => p.title.toLowerCase().includes(this.search.toLowerCase())
                );

                if (event.keyIdentifier === 'Down') {
                    this.index += 1;
                    if (this.index > filtered.length) this.index = 0;
                } else if (event.keyIdentifier === 'Up') {
                    this.index -= 1;
                    if (this.index === -1) this.index = filtered.length;
                } else if (event.keyIdentifier === 'Enter') {
                    if (this.newProj) {
                        this.addProject();
                    } else {
                        let project = filtered[this.index];
                        this.selectProject(project);
                    }
                    this.search = '';
                    this.index = 0;
                } else if (event.keyIdentifier === 'U+001B') {
                    this.search = '';
                    this.index = 0;
                }

                this.newProj = this.index === filtered.length;
            },
            addProject() {
                this.$firebaseRefs.projects.push({
                    title: this.search
                }).then(snap => {
                    let key = snap.key();
                    this.$dispatch('selectTask', `/projects/${this.auth.uid}/${key}`);
                });
            },
            selectProject(project) {
                this.$dispatch('selectTask', `/projects/${this.auth.uid}/${project['.key']}`);
            }
        },
        ready() {
            this.bindOnAuth('projects', '/projects/<AUTH_ID>');
        }
    };
</script>
