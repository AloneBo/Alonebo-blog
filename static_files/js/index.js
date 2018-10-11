window.onload = function () {
    initValue()
    initNav()
    initRecentPosts()
    initLastChangeTime()
    initCategoryNav()
    initIndexNav()
    getArticles()
    test()

    initSearch()
}


let initSearch = function() {
    $('.search button').on('click', function () {
        let key = $('.search input').val()
        console.log('click', key)
        location.href = '/search.html#keyword='+key
    })
    $('.search input').focus(function () {
        $('body').bind('keydown', function (event) {
            if (event.keyCode == "13") {
                console.log('click')
                $('.search button').click()
            }
        })
    })

    $('.search input').blur(function () {
        $('body').unbind('keydown')
    })



}

let initValue = function(){
    window.CURRENT_INDEX = 1
    initHashIndex()
    window.SINGLE_PAGE_SIZE = 6
    window.scroll(0,0)
}


let initHashIndex = function () {
    let hash = location.hash
    hash = decodeURI(hash)
    hash = hash.substr(1)
    if (hash.startsWith('index=')) {
        let tmp = hash.substr(hash.indexOf('=') + 1)
        tmp = parseInt(tmp) || 1
        CURRENT_INDEX = tmp
        console.log("tmp:"+tmp)
    }
}


let initIndexNav = function () {

    var callback = function () {
        $('.page_index li').on("click", function () {
            let index = this.getAttribute('data-index')

            if (index == "0") { // 上一页
                CURRENT_INDEX--;
                console.log("上一页")
                location.href = "/index.html#index="+CURRENT_INDEX;
                flushArticle()
            } else if (index == "-1") { // 下一页
                 CURRENT_INDEX++;
                console.log("下一页")
                location.href = "/index.html#index="+CURRENT_INDEX;
                flushArticle()
            } else {

                if (CURRENT_INDEX != index) {
                    console.log(index)
                    location.href = "/index.html#index="+index;
                    flushArticle()
                }
            }
        })
    }
    initIndexNavData(callback)

}

let flushArticle = function() {
    initValue()
    initIndexNav()
    getArticles()
}

let initIndexNavData = function (callback) {
    $.ajax({
        url: "/api/get_article_count",
        type: "get",
        dataType: 'json',
        success: function (data) {
            let article_count = parseInt(data.article_count)
            data = {"article_count": Math.ceil(article_count / SINGLE_PAGE_SIZE), "current_index": CURRENT_INDEX}
            let html = template("page_index", {"data": data})
            $('.page_index>ul').html(html)
            console.log("page_index:")
            console.log(data)
            callback ? callback() : "";
        },
        error: function (error) {
            console.log(error)
        }
    });
}

let initCategoryNav = function () {
    $.ajax({
        url: "/api/get_category",
        type: "get",
        dataType: 'json',
        success: function (data) {
            let html = template("category", {"data": data})
            $('.categories>ul').append(html)
            console.log("category:")
            console.log(data)
        },
        error: function (error) {
            console.log(error)
        }
    });
}


let initLastChangeTime = function () {
    $.ajax({
        url: "/api/get_last_change_time",
        type: "get",
        dataType: 'json',
        success: function (data) {
            $('.last_change_time p')[0].append('上次更新：' + data.last_change_time)
        },
        error: function (error) {
            console.log(error)
        }
    });
}

let initRecentPosts = function () {
    $.ajax({
        url: '/api/get_recent_posts',
        type: 'get',
        dataType: 'json',
        success: function (result) {
            console.log(result)
            //给每一个元素设置月 和 日
            for (let i in result) {
                let data = result[i].create_time
                result[i].month = data.substring(5, 7);
                result[i].day = data.substring(8, 10);
            }
            let html = template("recent_posts", {'data': result})
            $('.recent_posts>dl').append(html)
        },
        error: function (error) {
            console.log(error)
        },
    })
}

let initNav = function () {
    //获取页面向上或者向左卷曲出去的距离的值
    function getScroll() {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    }

    let fixed_nav = document.getElementById("fixed_nav");
    let header = document.getElementsByClassName("header")[0];
    let content = document.getElementsByClassName("content")[0];
    window.onscroll = function () {
        let result = getScroll();

        if (result.top > (header.offsetHeight - fixed_nav.offsetHeight)) {

            //fixed_nav.style.display="block";
            $("#fixed_nav").slideDown(400);
        } else {

            $("#fixed_nav").fadeOut(100);
        }
    };
}

let getArticles = function () {
    $.ajax({
        url: "/api/get_article?page_index=" + CURRENT_INDEX,
        type: "get",
        dataType: 'json',
    }).then(function (result) {
        if (result) {
            renderArticles(result)
        }
    })
    document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
}

let renderArticles = function (result) {
    let html = template("article", {contents: result})
    $(".articles_container").html(html)
}

let test = function () {
    let html = template("test", {user: {name: 'haha'}})
}