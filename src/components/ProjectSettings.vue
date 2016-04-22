<template lang="jade">
    .card.task
        header.card-header: .card-header-content
            span {{ project ? project.title : '' }} Settings
            button.btn.btn-sm.btn-secondary(@click="$dispatch('toggleSettings')"): i.fa.fa-times

        .card-block
            .card
                .card-header Basic Settings
                .card-block
                    fieldset.form-group
                        label Project Title
                        input.form-control(type="text", v-model="project.title")
                    button.btn.btn-success(@click="update") Save
            .card
                .card-header.bg-danger Danger Zone
                .card-block
                    button.btn.btn-warning(@click="wantsToDelete = true") Delete
                    fieldset.form-group(v-if="wantsToDelete")
                        label Are you sure you want to delete this project?
                        button.btn.btn-danger(@click="delete") Yes
                        button.btn.btn-secondary(@click="wantsToDelete = false") No
</template>

<script>
export default {
    props: ['projectPath'],
    data() {
        return {
            project: {},
            wantsToDelete: false
        };
    },
    methods: {
        update() {
            this.$firebaseRefs.project.update({
                title: this.project.title
            });
        },
        delete() {
            this.$firebaseRefs.project.remove();
            this.$route.router.go('/');
        }
    },
    ready() {
        this.bindObjectOnAuth('project', this.projectPath);
    }
};
</script>
