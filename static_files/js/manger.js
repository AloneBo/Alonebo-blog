$(function () {
    getXSRF()
    window.CURRENT_VIEW = "modify_article"
    initNavClick()
    initHeader()
    initManger()
    initCurrentNav()
    checkLogin()
})

window.addEventListener('load', function (event) {
    document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})

let initCurrentNav = function () {
    let $tmp = $(".manger_nav li a")
    $tmp.removeClass("current_nav_title")
    $tmp.each(function (index, item) {
        let hrefValue = $(this).attr("href")
        if (hrefValue.indexOf(CURRENT_VIEW) !== -1) {
            $(this).addClass("current_nav_title")
        }
    })

}

let getXSRF = function () {
    $.ajax({
        url: '/api/get_xsrf', type: 'get', success: function () {
            console.log('get xsrf code success')
        }, error: function () {
            console.log('get xsrf error')
        }
    })
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

let getCookie = function (name) {
    let r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

let initNavClick = function () {
    $(".manger_nav li a").on("click", function (event) {
        location.href = $(this).attr('href')
        $(".manger_nav li a").removeClass("current_nav_title")
        $(this).addClass("current_nav_title")

        initManger()
        event.preventDefault()
    })
}



let initHashIndex = function () {
    let hash = location.hash
    hash = decodeURI(hash)
    hash = hash.substr(1)

    if (hash.startsWith('view=')) {
        let tmp = hash.substr(hash.indexOf('=') + 1)
        CURRENT_VIEW = tmp
        console.log("view:" + tmp)
    }
}

let initManger = function () {
    initHashIndex()

   if (CURRENT_VIEW == "modify_article") {
        initModifyArticleManger()
   } else if (CURRENT_VIEW == "manger_category") {
        initCategoryManger()
   }
}

let initCategoryManger = function() {
    function success(data) {
        if (data.errcode==1) {
            return console.log(data)
        }
        data.length = Object.keys(data).length;

        let html = template("manger_category", {"data": data})
        $(".manger").html(html)
        console.log(data)

         // 注册点击事件
        $(".manger_category tbody .btn-danger").each(function (index) {
            $(this).on("click", function () {
                // console.log(index)
                let value = $(".manger_category tbody td:first-of-type").eq(index).html()
                console.log(value)
                deleteCategory(value)
            })
        })
    }

    function deleteCategory(cate, newCategory) {
        let success = function (data) {
            if (data.errcode == 1){
                return console.log(data)
            }
            console.log(data)
            console.log("删除成功")
           location.reload() // 删除成功 直接刷新本页面
        }

        let error = function (error) {
            console.log(error)
        }
        if (!cate) return console.log('cate null')
        $.ajax({
            url: '/api/modify_category?is_delete=True',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                category: cate,
            }),
            headers: {
                "Cache-Control": "no-cache",
                "X-XSRFToken": getCookie("_xsrf"),
            },
            contentType: 'application/json',
            success: success,
            error: error
        })
    }

    function error(err) {
        console.log(err)
    }
    $.ajax({
        url: '/api/get_category',
        dataType: 'json',
        success: success,
        error: error
    })
}

let initModifyArticleManger = function () {
    // 获取数据
    function success(data) {
        console.log(data)
        data.length = Object.keys(data).length;

        let html = template("modify_article", {"data": data})
        $(".manger").html(html)

        // 注册点击事件
        $(".modify_manger tbody .btn-danger").each(function (index) {
            $(this).on("click", function () {
                // console.log(index)
                let value = $(".modify_manger tbody th").eq(index).html()
                deleteArticle(value, $(this))
            })
        })

        $(".modify_manger tbody .btn-success").each(function (index) {
            $(this).on("click", function () {

                let value = $(".modify_manger tbody th").eq(index).html()
                modifyArticle(value)
            })
        })

    }

    function modifyArticle(articleID) {
        location.href = "/write.html#modify_article="+articleID
    }

    function deleteArticle(articleID, $element) {
        console.log("删除：" + articleID)

        console.log()
        // 创建一个对话框 监听确认点击事件
        let result = confirmDeleteAction(articleID)
        if (result) {
            $.ajax({
                url: '/api/delete_article',
                type: 'post',
                error: function (err) {
                    console.log(err)
                },
                headers: {
                    "X-XSRFToken": getCookie("_xsrf"),
                },
                data: JSON.stringify({
                    "article_id": articleID
                }),
                contentType: "application/json", // 提交的类型
                dataType: "json", // 返回的类型
            }).then(function (data) {
                if (data.errcode == 0) {
                    $element.parents("tr").remove()
                    console.log('删除成功')
                } else {
                    console.log(data)
                }
            })
        }
    }

    function confirmDeleteAction(articleID) {
        return confirm("确认删除id为" + articleID + '的文章吗?')
    }

    $.ajax({
        type: 'get',
        url: '/api/get_article_info',
        dataType: 'json',
        success: success,
        error: function (error) {
            console.log(error)
        }
    })

}




let initHeader = function () {
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
    }


    let initHeart = function () {
        let flag = false;
        let heart = document.getElementById("j_header_heart");
        let id = setInterval(function () {
            if (flag) {
                heart.style.visibility = "hidden"
                heart.className = "iconfont icon-heart"
                flag = false
            } else {
                heart.style.visibility = "visible";
                heart.className = "iconfont icon-heart anim_pop_in"
                flag = true
            }

        }, 1400);
        heart.onclick = function () {
            clearInterval(id);
            console.log("clear")
        }
    }

    initHeart()

}