<template>
    <div>
        <label v-if="label">{{ label }}</label>
        <slot></slot>
        <p v-if="validateStatus == 'error'">{{ errorMsg }}</p>
    </div>
</template>

<script>
    export default {
        props: ['label', 'prop'],
        data() {
            return {
                validateStatus: '',
                errorMsg: ''
            }
        },
    }
</script>

<style scoped>

</style>