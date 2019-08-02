module.exports = {
    publicPath: '/',
    configureWebpack: {
        devServer: {
            before(app) {
                app.get('/api/goods', function(req, res) {
                    res.json({
                        code: 0,
                        list: [
                            {id: 1, name: 'vue权威指南', price: 55.76},
                            {id: 2, name: 'Javascript权威指南', price: 65.76},
                            {id: 3, name: 'Nodejs权威指南', price: 45.76}
                        ]
                    })
                })
            }
        }
    }
}