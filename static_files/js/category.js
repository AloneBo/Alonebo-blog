$(function () {
    let categoryName = initHashIndex('category', true)
    document.title = "AloneBo " + categoryName
    initCategoryView(categoryName)
})

window.addEventListener('load', function (event) {
     document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})

let initCategoryView = function(categoryName) {
    if (categoryName == undefined || categoryName == "") {
        return console.log('error')
    }
    let success = function(data) {
        if (data.errcode == 1) {
            return console.log(data)
        }
        let html = template("category-article", {'data': data})

        $('.article-container').html(html)

        $('.big-symbol strong:nth-of-type(1)').text(data[0].category)
    }

    let error = function(data) {
        console.log(data)
    }
    $.ajax({
        url: '/api/get_article_by_category?category='+categoryName,
        type: 'get',
        dataType: 'json',
        success: success,
        error: error
    })
}

let initHashIndex = function (name, hasValue) {
    let hash = location.hash
    hash = decodeURI(hash)
    hash = hash.substr(1)
    if (hasValue) {
        if (hash.startsWith(name+'=')) {
            let tmp = hash.substr(hash.indexOf('=') + 1)
            return tmp
        }
    } else {
         if (hash.startsWith(name)) {
            return true

        }
    }
}
