export default {
    methods: {
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            // 查找指定的组件
            // 条件：还有父级并且(找到的组件没有名字或者不是我们要找的组件) 就继续找
            while(parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) { // 找到父组件
                    name = parent.$options.name; // 获取组件名
                }
            }

            // console.log(name, parent);
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params))
            }
        }
    },
}