<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        provide() {
            return {
                form: this
            }
        },
        props: {
            model: {
                type: Object,
                required: true,
            },
            rules: {
                type: Object
            }
        },
    }
</script>

<style scoped>

</style>