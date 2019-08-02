# vue 组件化

## 目标
1. 学习 Vue.js 组件化
2. 组件的分类
3. 组件化思想
4. 深入了解 Vue 组件化机制
5. 动态组件
6. 异步组件
7. 递归组件

## 组件的分类

1. 通用组件
    - 基础组件，大部分UI库都是这种组件，比如表单，弹框，布局等等
2. 业务组件
    - 业务需求挂钩，会被复用，比如抽奖，摇一摇等等
3. 页面组件
    - 每个页面都是组件，不会复用，只完成功能

## Vue组件开发

1. 注册
2. 使用
3. 给子组件传递值 -> props
4. 子组件通知父组件 -> 事件($emit, $on)
5. 扩展组件 -> 插槽

### 组件注册与使用

1. 全局注册(方便，一次注册永久使用)
```js
Vue.component('comp', {
    // ... props data methods created mounted ...
});
```

使用
```js
<div>
    <comp></comp>
    <comp></comp>
    <comp></comp>
</div>
```

2. 局部注册(推荐，依赖可追溯)
```js
new Vue({
    el: '#app',
    components: {
        comp: comp
    }
})
```

## props

使用 `v-bind:xxx`(简写 `:xxx`)来传递数据，组件内部通过 `props` 字段接收，使用方面，和挂载在 `this` 上的数据没有什么本质区别

`props` 属于单向数据流，也就是：只能通过父级修改，组件自己不能修改 `props` 的值，只能修改定义在 `data` 里面的数据，如果非要修改，可以通过自定义事件通知父级，由父级来修改

## 事件

组件内部通知外部的变化 `this.$emit`

```html
<template>
    <button @click="handleClick">按钮</button>
</template>

<script>
export default {
    new Vue({
        methods: {
            handleClick(e) {
                this.$emit('click', e)
            }
        }
    })
}
</script>
```

`v-model` 是一个特殊的属性，相当于 `:value` 和 `@input` 俩事件

```html
<my-input
    v-model="inputValue"
></my-input>

<my-input
    :value="inputValue"
    @input="inputValue = $event"
></my-input>
```

## 插槽 `slot`
插槽用来扩展组件的内容

```html

<!-- btn-cmp -->
<button @click="handleClick">
    <slot>按钮</slot>
</button>

<btn-cmp>
    <strong>点我啦</strong>
</btn-cmp>
```

## 组件设计

表单组件，组件分层

1. Form 负责定义校验规则
2. FormItem 负责显示错误信息
3. m-input 负责数据双向绑定
4. 使用 `provide` 和 `inject` 进行内部数据共享

## provide & inject

`provide` 和 `inject` 主要是为高阶组件库/插件 提供用例，并不推荐直接应用于程序代码中

```js
// parent组件 提供数据
const parent = {
    provide() {
        return {
            form: 'parent组件提供的共享数据'
        }
    }
}

// 子组件注入使用
const child = {
    inject: ['form'],
    create() {
        console.log(this.form); // => parent组件提供的共享数据
    }
}
```

## 实现组件的 `v-model`

`v-model` 是一个特殊的属性，相当于 `:value` 和 `@input` 俩事件

```html
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
                this.$emit('input', this.inputValue);

                // 通知 FormItem 校验
                // 不能通过子组件 -> 父组件之间的传值方式，因为在 formItem 组件中，子组件是一个 slot 插槽，
                // 不能在 slot 中接收到子组件 $emit 过来的事件
                // 解决方法：可以用父组件(formItem)自己派发($emit)事件，然后再自己监听($on)事件
                this.$parent.$emit('validate', this.inputValue); // 把最新的值传递给 formItem 进行校验
            }
        },
    }
</script>

<style scoped>

</style>
```

## FormItem

功能：
1. 获取当前输入框的规则
2. 获取输入框的值，对 rule 规则进行匹配，过滤不是自己组件的输入事件
3. 如果输入值和 rule 不匹配，显示错误信息


+ 校验的是当前`input`项的 `value` 值 （当前`input`项为 `props 中 prop` 的值）
    - 比如 `this.prop` 为 `username`，则当前 `input` 项为 `<input name="username" />`
    - `this.prop` 为 `pwd`，则当前 `input` 项为 `<input name="pwd" />`

+ 当前项的规则（`model, rules`）在 `Form` 组件的 `props` 属性中
    - 所以，如果要拿到校验规则，可以进行数据共享（`provide & inject`）
    - `rules: this.form.rules`(该 rules 为 `key=>value` 的形式) 拿到所有的校验规则
    - 而 `rules` 的 `key` 为 `prop`

比如：
```js
// this.form.rules
rules: {
    name: [
        { required: true, message: "请输入名称" },
        { min: 6, max: 10, message: "请输入6~10位用户名" }
    ],
    pwd: [{ required: true, message: "请输入密码" }]
}

// 获取当前 input 项的校验规则
const descriptor = {
    [this.prop]: this.form.rules[this.prop], // { name: [...] }  /  { pwd: [...] }

    // [this.prop] 最终会被解析为对应的值，然后以之作为该对象的key，最终结果为：
    // name: [
    //     { required: true, message: "请输入名称" },
    //     { min: 6, max: 10, message: "请输入6~10位用户名" }
    // ],
    // pwd: [{ required: true, message: "请输入密码" }]
};

// 上述代码等同于以下代码
// const descriptor = {};
// descriptor[this.prop] = this.form.rules[this.prop];

```

+ 使用 `async-validator` 插件进行校验
```js
import Schema from 'async-validator'

validate(value) {
    // ...
    // ...

    // 创建一个校验器实例      参数是校验规则
    const validator = new Schema(descriptor);

    // 校验    参数1：要校验的值 {name: value}，参数2：校验结果(回调函数)
    validator.validate({[this.prop]: value}, errors => { // 如果 errors 存在就校验失败
        if (errors) {
            // 校验失败
            console.log(errors);
            // todo sth.
        } else {
            // todo sth.
        }
    }

})
```

```html
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
        methods: {
            /**
             * 校验方法
             * @param {*} value 子组件传递的值
             */
            validate(value) {
                // console.log(value);
                // rules: this.form.rules

                // 创建一个校验器实例      参数是校验规则
                const descriptor = { [this.prop]: this.form.rules[this.prop] };

                // 校验    参数1：要校验的值 {name: value}，参数2：校验结果(回调函数)
                const validator = new schema(descriptor);
                validator.validate({[this.prop]: value}, errors => {
                    if (errors) {
                        this.validateStatus = 'error';
                        this.errorMsg = errors[0].message;
                    } else {
                        this.validateStatus = '';
                        this.errorMsg = '';
                    }
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
```

## Form

```html
<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        // 将自身实例提供出去，进行数据共享
        provide() {
            return {
                form: this
            }
        },
        props: { // 接收属性
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
```

## 组件使用

```html
<template>
    <div>
        <!-- 自定义表单插件 -->
        <m-form :model="ruleForm" :rules="rules" ref="loginForm">
            <m-form-item label="用户名" prop="name">
                <m-input v-model="ruleForm.name" type="text"></m-input>
            </m-form-item>
            <m-form-item label="密码" prop="pwd">
                <m-input v-model="ruleForm.pwd" type="password"></m-input>
            </m-form-item>
            <m-form-item>
                <el-button type="primary" @click="submitForm()">登录</el-button>
            </m-form-item>
        </m-form>
    </div>
</template>

<script>
import MInput from "./Input.vue";
import MFormItem from "./FormItem.vue";
import MForm from "./Form.vue";

export default {
    components: {
        MInput,
        MFormItem,
        MForm
    },
    data() {
        return {
            ruleForm: {
                name: "",
                pwd: ""
            },
            rules: {
                name: [
                    { required: true, message: "请输入名称" },
                    { min: 6, max: 10, message: "请输入6~10位用户名" }
                ],
                pwd: [{ required: true, message: "请输入密码" }]
            }
        };
    },
    methods: {
        submitForm() {
            // todo sth.
        }
    }
};
</script>

<style scoped>
</style>
```

## Form 的全局校验

1. 当 FormItem 挂载完毕之后，将自己通过`$emit`事件派发出去(需要校验的表单项才需要派发出去)
```js
mounted() {
    if (this.prop) {
        this.$parent.$emit('formItemAdd', this);
    }
}
```

2. Form 组件接收 FormItem 的事件
```js
created() {
    // 保存所有需要校验的表单项
    this.fields = [];
    this.$on('formItemAdd', item => this.fields.push(item));
}
```

3. 使用 `Promise` 改造 FormItem 的 validate 方法
> 由于所有表单项的校验都是异步的，所以当多个表单项在校验的时候，需要知道每一个表单项的校验结果.

> 当所有校验结果出来之后，再一起处理

```js
validate() {
    return new Promise(resolve => {
        // 创建一个校验器实例      参数是校验规则
        const descriptor = { [this.prop]: this.form.rules[this.prop] };

        // 校验    参数1：要校验的值 {name: value}，参数2：校验结果(回调函数)
        const validator = new schema(descriptor);
        validator.validate({[this.prop]: value}, errors => {
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
```

4. Form 对外提供一个全局表单校验函数 validate
```js
async validate(callback) {
    // 将 FormItem 数组转换为validate() 返回的Promise数组
    const tasks = this.fields.map(item => item.validate());  // item.validate() ₁
    // 获取所有结果 统一处理
    const results = await Promise.all(tasks);

    // 所有valid为true时，才算校验通过
    const ret = results.every(valid => {
        return valid
    });
    // console.log(ret);
    callback && callback(ret);
}
```

5. 修改FormItem的校验函数validate
> step 4. 中，转换为Promise函数的时候，没有传 value。所以在 FromItem 中的 validate(value) { ... }是拿不到值的

由于只有 input 才知道输入的value。而在使用组件的时候，我们用 `v-model` 对 `input` 进行双向数据绑定。<br>

```html
    ...
    <m-input v-model="ruleForm.name" type="text"></m-input>
    ...
```

而 `ruleForm` 又是 Form 的`props`所接受的属性(model)。并且form对外provide了自身实例
```js
props: ['model'],
provide() {
    return { form: this }
}
```

所以在 FormItem中可以使用 `this.form.model` 获取对应表单项的值

```js
validate() {
    return new Promise(resolve => {
        // 创建一个校验器实例      参数是校验规则
        const descriptor = { [this.prop]: this.form.rules[this.prop] };

        // 校验    参数1：要校验的值 {name: value}，参数2：校验结果(回调函数)
        const validator = new schema(descriptor);
        //                              此处修改value值
        validator.validate({ [this.prop]: this.form.model[this.prop] }, errors => {
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
```

6. 使用全局校验

```js
submitForm() {
    this.$refs.loginForm.validate(valid => {
        if (valid) {
            alert("提交登录！");
        } else {
            console.log("校验失败");
            return false;
        }
    });
},
```
