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
        created () {
            // 保存所有需要校验的表单项
            this.fields = [];
            this.$on('formItemAdd', item => this.fields.push(item));
        },
        methods: {
            async validate(callback) {
                // 将 FormItem 数组转换为validate() 返回的Promise数组
                const tasks = this.fields.map(item => item.validate());
                // 获取所有结果 统一处理
                const results = await Promise.all(tasks);

                const ret = results.every(valid => {
                    return valid
                });
                // console.log(ret);
                callback && callback(ret);
            }
        },
    }
</script>

<style scoped>

</style>