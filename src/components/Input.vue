<template>
    <input :value="inputValue" @input="inputHandler" :type="type"/>
</template>

<script>
    import emitter from '../common/emitter';

    export default {
        name: 'MInput',
        mixins: [emitter],
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
                this.$emit('input', this.inputValue);

                // 通知 FormItem 校验
                // 不能通过子组件 -> 父组件之间的传值方式，因为在 formItem 组件中，子组件是一个 slot 插槽，
                // 不能在 slot 中接收到子组件 $emit 过来的事件
                // 解决方法：可以用父组件(formItem)自己派发($emit)事件，然后再自己监听($on)事件
                // this.$parent.$emit('validate', this.inputValue); // 把最新的值传递给 formItem 进行校验

                this.dispatch('MFormItem', 'validate', this.inputValue); // 使用自定义dispatch向指定组件派发事件
            }
        },
    }
</script>

<style scoped>

</style>