<template>
    <input :value="inputValue" @input="inputHandler" :type="type"/>
</template>

<script>
    export default {
        inject: ['form'],
        props: {
            value: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            }
        },
        data() {
            return {
                inputValue: '',
            }
        },
        created () {
            this.inputValue = this.value;
        },
        methods: {
            inputHandler(e) {
                // console.log(e.target.value);
                this.inputValue = e.target.value;

                // 事件名：input => 因为 v-model 的核心就是 @input 监听用户输入事件
                // 父组件就可以直接使用 v-model，不用另外接收此处派发的事件
                this.$emit('input', this.inputValue)
            }
        },
    }
</script>

<style scoped>

</style>