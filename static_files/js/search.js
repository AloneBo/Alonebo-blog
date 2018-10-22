$(function () {
    let keyword = initHashIndex("keyword", true)
    console.log(keyword)
    initSearchView(keyword)
})

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

let initSearchView = function(keyword) {
    if (keyword == undefined || keyword == "") {
        return console.log('error')
    }
    let success = function(data) {
        if (data.errcode == 1) {
            return console.log(data)
        }
        console.log(data)
        is_empty = $.isEmptyObject(data)
        let html = template("search-article", {'data': data, 'is_empty': {'empty': is_empty}})

        $('.container').html(html)

        $('.big-symbol strong:nth-of-type(1)').text('关键字:'+keyword)
    }

    let error = function(data) {
        console.log(data)
    }
    $.ajax({
        url: '/api/search_article?keyword='+keyword,
        type: 'get',
        dataType: 'json',
        success: success,
        error: error
    })
}


window.addEventListener('load', function (event) {
     document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})