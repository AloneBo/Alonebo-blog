window.onload = function () {
    initValue()
    initView()
    initNav()
    initRecentPosts()
    initLastChangeTime()
    initCategoryNav()
    initIndexNav()
    checkLogin()
    getArticles()
    test()


};

 // window.addEventListener('load', function (event) {
 //        console.log('heihie')
 //        document.querySelector('header').style.background = 'url("http://ogw467yh1.bkt.clouddn.com/bg_header2.png") no-repeat center'
 //        // $('header').style("background", "url(\"http://ogw467yh1.bkt.clouddn.com/bg_header2.png\") no-repeat center;")
 // })

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

let initView = function () {
    let SHOW_USER_AREA_POP = true;
    document.getElementById("j_user_name").onclick = function (event) {
        if (SHOW_USER_AREA_POP) {
            document.getElementsByClassName("user_menu_pop")[0].style.visibility = "visible";
            document.getElementsByClassName("user_menu_pop")[0].className = "user_menu_pop anim_pop_in";
            SHOW_USER_AREA_POP = false;
            // window.event.stopPropagation();
            event.stopPropagation();

        } else {
            document.getElementsByClassName("user_menu_pop")[0].style.visibility = "hidden";
            document.getElementsByClassName("user_menu_pop")[0].className = "user_menu_pop";
            SHOW_USER_AREA_POP = true;
            // window.event.stopPropagation();
            event.stopPropagation();
        }

    };
    document.getElementById("j_user_name").onmouseout = function () {
        console.log("ha");
    };
    window.onclick = function (event) {
        if (SHOW_USER_AREA_POP === false) {
            document.getElementsByClassName("user_menu_pop")[0].style.visibility = "hidden";
            document.getElementsByClassName("user_menu_pop")[0].className = "user_menu_pop";
            SHOW_USER_AREA_POP = true;
            // window.event.stopPropagation();
            event.stopPropagation();
        }
    };


    (function () {
        let flag = false;
        let heart = document.getElementById("j_header_heart");
        let id = setInterval(function () {
            if (flag) {
                heart.style.visibility = "hidden";
                heart.className = "iconfont icon-heart"
                flag = false;
            } else {
                heart.style.visibility = "visible";
                heart.className = "iconfont icon-heart anim_pop_in";
                flag = true;
            }

        }, 1400);
        heart.onclick = function () {
            clearInterval(id);
            console.log("clear");
        };
    })();
}

let checkLogin = function () {
    let val = $("#j_login").text();
    console.log(val);
    if (val == "退出登陆") {
        $("#j_login").on("click", function () {
            $.ajax({
                url: "/api/exit_login",
                type: "get",
                dataType: 'json',
                success: function (data) {
                    console.log("登陆成功：" + data.errcode);
                    location.href = "login.html"
                },
                error: function () {
                    console.log("退出失败");
                    location.href = "login.html"
                },
            });

            return false;
        });
    }
    $.ajax({
        url: "/api/check_login",
        type: "get",
        dataType: 'json',
        success: function (data) {
            console.log("ok" + data.errcode);
            if (0 === data.errcode) {
                $(".user_menu_pop a").eq(2).html('<em class="iconfont icon-logout"></em>退出登陆');
                $(".user_area").show();
                $(".login_area").hide();
                $(".write_blog").show();
            } else {
                $(".user_menu_pop a").eq(2).html('<em class="iconfont icon-logout"></em>登陆帐号');
                $(".user_area").hide();
                $(".login_area").show();
                $(".write_blog").hide();
            }
        }
    });

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
        console.log("article")
        console.dir(result)
        if (result) {
            console.log('ok')
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