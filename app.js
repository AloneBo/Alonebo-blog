const express = require('express')
const path = require('path')
const request = require('request')
let app = express()

app.use('/', express.static(path.join(__dirname, './static_files/')))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录


app.engine('html', require('express-art-template'))



function getData(url) {
    return new Promise(function (resolve, reject) {
        request(url,function(error, response, categoryBody){
            if(!error && response.statusCode == 200){
                resolve(response.body)
            } else {
                reject(response.body)
            }
        })
    })
}

app.get('/index.html', function (req, res) {
    console.log('/ xxx')
    console.log(req.originalUrl)

    let categoryBody = null
    let recentPostBody = null
    let articleBody = null
    getData("https://alonebo.top/api/get_category").
    then(function (body) {
        categoryBody = body

        return getData("https://alonebo.top/api/get_recent_posts")
    }).then(function (body) {
        recentPostBody = body

        return getData("https://alonebo.top/api/get_article?page_index=1")
    }).then(function (body) {
        articleBody = body

        res.render('index.html', {
            data_category: JSON.parse(categoryBody),
            data_recent_posts: JSON.parse(recentPostBody),
            data_articles: JSON.parse(articleBody),
        })
    })
})

app.get('/index.html', function (req, res) {
    console.log('/ index.html.2#index=*')
    res.send('ok')
})



app.listen(9005, function () {
    console.log('running...')
})
