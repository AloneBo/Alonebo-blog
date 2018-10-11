$(function () {
    initView()
    checkLogin()
    initData()
    initTOCM()
})

let initData = function (success) {
    var hash = location.hash
    hash = decodeURI(hash)
    hash = hash.substr(1)
    console.log(hash)
    var articleName = ""
    if (hash.startsWith('article=')) {
        articleName = hash.substr(hash.indexOf('=') + 1)
        articleName = articleName.trim()
        console.log(articleName)
    }
    console.log('url: ' + "/api/get_article?article=" + articleName,)
    $.ajax({
        url: "/api/get_article?article=" + articleName,
        type: "get",
        dataType: 'json',
    }).then(result => {

        renderArticle(result[0])

    }, (err) => {
        console.log(err)
    })
}

let renderArticle = function (article) {

    let testEditormdView;
    testEditormdView = editormd.markdownToHTML("editormd-view", {
        markdown: article.content_src,//+ "\r\n" + $("#append-test").text(),
        //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
        htmlDecode: "style,script,iframe",  // you can filter tags decode
        //toc             : false,
        tocm: true,    // Using [TOCM]
        //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
        //gfm             : false,
        //tocDropdown     : true,
        // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
        emoji: true,
        taskList: true,
        tex: true,  // 默认不解析
        flowChart: true,  // 默认不解析
        sequenceDiagram: true,  // 默认不解析
        tocStartLevel: 2,
    });
    $('.main_content .loading').remove()
}

var initView = function () {
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

let initTOCM = function () {
    //获取页面向上或者向左卷曲出去的距离的值
    function getScroll() {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    }


    let header = document.getElementsByClassName("header")[0];

    window.onscroll = function () {
        let result = getScroll();
        if (result.top > header.offsetHeight) {

            $('.main_content .editormd-toc-menu').css('top', '5px')
        } else {
            $('.main_content .editormd-toc-menu').css('top', '160px')
        }
    };

    document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
}


var checkLogin = function () {
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