<template>
    <div>
        <!-- model数据模型 -->
        <el-form :model="ruleForm" :rules="rules" ref="loginForm">
            <!-- prop用于校验 -->
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input v-model="ruleForm.pwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">登录</el-button>
            </el-form-item>
        </el-form>

        <!-- 自定义表单插件 -->
        <m-form :model="ruleForm" :rules="rules" ref="loginForm2">
            <m-form-item label="用户名" props="name">
                <m-input v-model="ruleForm.name" type="text"></m-input>
            </m-form-item>
            <m-form-item label="密码" props="pwd">
                <m-input v-model="ruleForm.pwd" type="password"></m-input>
            </m-form-item>
            <m-form-item>
                <el-button type="primary" @click="submitForm2()">登录</el-button>
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
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    alert("提交登录！");
                } else {
                    console.log("校验失败");
                    return false;
                }
            });
        },
        submitForm2() {}
    }
};
</script>

<style scoped>
</style>