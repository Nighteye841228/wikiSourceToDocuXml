<template>
    <div class="column is-12">
        <div class="content">
            <b-button class="is-primary is-light" expanded static>{{ filename }}
            </b-button>
        </div>

    </div>
</template>

<script>

export default {
    name: 'FileOrder',
    data: function() {
        return {
        };
    },
    props: ['filename', 'content', 'index'],
    methods: {

    }
};
</script>


<style scoped>

.modal-card-body {
  height: 550px;
  overflow: auto;
}
</style>
