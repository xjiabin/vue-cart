<template>
    <div class="cart">
        <table border="1">
            <tr>
                <th>#</th>
                <th>商品名称</th>
                <th>价格</th>
                <th>数量</th>
            </tr>
            <tr v-for="g in cart" :key="g.id">
                <td><input type="checkbox" name="" id="" v-model="g.active" /></td>
                <td>{{ g.name }}</td>
                <td>{{ g.count }}</td>
                <td>￥{{ (g.price * g.count).toFixed(2) }}</td>
            </tr>
            <tr>
                <td colspan="2">{{ activeCount }}/{{ totalCount }}</td>
                <td colspan="2">￥{{ totalPrice }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cart: []
        }
    },
    created () {
        this.cart = JSON.parse(window.localStorage.getItem('cart')) || [];

        this.$bus.$on('addCart', good => {
            let _g = this.cart.find(v => v.id === good.id);
            if (_g) {
                _g.count += 1;
            } else {
                this.cart.push({
                    ...good,
                    count: 1,
                    active: true
                })
            }
        });
    },
    watch: {
        cart: {
            deep: true, // 深度监听，针对引用类型的数据
            handler (newValue, oldValue) {
                window.localStorage.setItem('cart', JSON.stringify(newValue));            
            }
        }
    },
    computed: {
        activeCount() {
            return this.cart.filter(v => v.active).length;
        },
        totalCount() {
            return this.cart.length;
        },
        totalPrice() {
            let total = 0;
            this.cart.forEach(c => {
                if (c) {
                    total += (c.price * c.count);
                }
            });

            return total.toFixed(2);
        }
    },
};
</script>

<style scoped>
</style>