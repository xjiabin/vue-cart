<template>
    <div>
        <label v-if="label">{{ label }}：</label>
        <slot></slot>
        <p v-if="validateStatus == 'error'" class="error-msg">{{ errorMsg }}</p>
    </div>
</template>

<script>
    import schema from 'async-validator';

    export default {
        name: 'MFormItem',
        inject: ['form'],
        props: ['label', 'prop'],
        data() {
            return {
                validateStatus: '',
                errorMsg: ''
            }
        },
        created () {
            // 监听组件派发$emit 的事件
            this.$on('validate', this.validate);
        },
        mounted() {
            // 当组件挂载完毕之后，有 prop 属性(需要校验)的，派发一个事件，将自己派发出去
            if (this.prop) {
                this.$parent.$emit('formItemAdd', this);
            }
        },
        methods: {
            /**
             * 校验方法
             * // @param {*} value 子组件传递的值
             */
            validate() {
                // console.log(value);
                // rules: this.form.rules

                return new Promise(resolve => {
                    // 创建一个校验器实例      参数是校验规则
                    const descriptor = { [this.prop]: this.form.rules[this.prop] };

                    // 校验    参数1：要校验的值 {name: value}，参数2：校验结果(回调函数)
                    const validator = new schema(descriptor);
                    validator.validate({[this.prop]: this.form.model[this.prop]}, errors => {
                        if (errors) {
                            this.validateStatus = 'error';
                            this.errorMsg = errors[0].message;

                            resolve(false);
                        } else {
                            this.validateStatus = '';
                            this.errorMsg = '';

                            resolve(true);
                        }
                    })
                })
            }
        },
    }
</script>

<style scoped>
.error-msg {
    color: #f00;
    font-size: 12px;
    margin-top: 0;
}
</style>