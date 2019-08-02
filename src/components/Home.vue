<template>
    <div class="Home">
        <ul>
            <li v-for="(good, i) in goods" :key="good.id">
                {{ good.name }} - ￥{{ good.price }} - <button @click="addCart(i)">加入购物车</button>
            </li>
        </ul>
        <cart/>
        <form-test />
    </div>
</template>

<script>
import Cart from './Cart.vue';
import FormTest from './FormTest.vue';

export default {
    components: {
        Cart,
        FormTest,
    },
    data() {
        return {
            someValue: 'input value',
            goods: [],
        }
    },
    async created () {
        try {
            const resp = await this.$axios.get('/api/goods');
            this.goods = resp.data.list;
        } catch (error) {
            alert(error);
        }
    },
    methods: {
        addCart(i) {
            let good = this.goods[i];
            this.$bus.$emit('addCart', good);
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
