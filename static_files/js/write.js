$(function () {
    getXSRF()
    let articleID = initHashIndex("modify_article", true)
    let isModifyArticle = parseInt(articleID) > 0 ? true : false
    initModifyArticleData(isModifyArticle, articleID)
    var testEditor = editormd("test-editormd", {
        width: "80%",
        height: 740,
        saveHTMLToTextarea: true,
        emoji: true,
        path: "/lib/markdown/lib/",
        htmlDecode: "style,script,iframe",
        tocm: true,
        syncScrolling: true,
        taskList: true,
        tex: true,
        flowChart: true,
        sequenceDiagram: true,
        toc: true,
        tocStartLevel: 2,
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: "/api/markdown_file_commit?_xsrf="+getCookie('_xsrf'),
    });

    console.log(articleID)
    initBaseView()
    initModifyArticleView(isModifyArticle)
    console.log(isModifyArticle)
    checkLogin()
    initSubmitEvent("#submit_article", testEditor, isModifyArticle, articleID)

});


window.addEventListener('load', function (event) {
    document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})

let initModifyArticleData = function(isModifyArticle, articleID) {
    if(!isModifyArticle && !articleID) {
        return console.log('initModifyArticleData参数警告：'+isModifyArticle+', '+articleID)
    }
    let success = function(data) {
        if (data.errcode == 1) {
            return console.log(data)
        }

        let $title = $('.article_info_box input:nth-child(1)')
        let $summary = $('.article_info_box textarea:nth-child(3)')
        let $category = $('.article_info_box input:nth-child(2)')
        let $mdArea = $('#layout textarea')
        $title.val(data.title)

        $summary.val(data.summary)
        $category.val(data.cate)
        $mdArea.text(data.content_src)
    }
    let error = function(data) {
        console.log(data)
    }
    $.ajax({
        url: '/api/get_article?article_id='+articleID,
        dataType: 'json',

        headers: {
            "Cache-Control": "no-cache",
        },
        success: success,
        error: error
    })
}

let initModifyArticleView = function(isModifyArticle) {
    if (isModifyArticle) {
        $("#submit_article").text('修改')
        $(".header_nav_current").text('更改文章')
    }

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


let initSubmitEvent = function (ele, testEditor, isModify, articleID) {
    function success(data) {
        if (data.errcode == 1) {
            console.log(data)
            return alert( !isModify?"commit error,"+JSON.stringify(data):"update error,"+JSON.stringify(data))
        }
        alert( isModify?"commit success":"update success")
        console.log(data)
    }

    function error(error) {
        console.log(error)
        alert( isModify?"commit success":"update error")
    }
    $(ele).on('click', function (event) {

        let title = $('.article_info_box input:nth-child(1)').val()
        title = title.trim()
        let content = testEditor.getHTML()
        let contentSrc = testEditor.getMarkdown()
        let summary = $('.article_info_box textarea:nth-child(3)').val()

        let category = $('.article_info_box input:nth-child(2)').val()
        category = category.trim()
        if (title && content && contentSrc && category && summary)  {
            submitArticle(title, content, contentSrc, summary, category, success, error, isModify, articleID)
        } else {
            alert('请确保参数都填写了！')
        }

    })
}

let submitArticle = function(title, content, contentSrc, summary, category, onSubmitArticleSuccess, onSubmitArticleError, isModify, articleID) {

    $.ajax({
        url: "/api/article_commit",
        type: "POST",
        headers: {
            "X-XSRFToken": getCookie("_xsrf"),
        },
        data: JSON.stringify({
            'title': title,
            'content': content,
            'content_src': contentSrc,
            'summary': summary,
            'category': category,
            'is_modify': isModify,
            'modify_id': articleID,
        }),
        contentType: "application/json", // 提交的类型
        dataType: "json", // 返回的类型
        success: onSubmitArticleSuccess,
        error: onSubmitArticleError,
    });
}

let initBaseView = function () {
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

let getXSRF = function () {
    $.ajax({
        url: '/api/get_xsrf', type: 'get', success: function () {
            console.log('get xsrf code success')
        }, error: function () {
            console.log('get xsrf error')
        }
    })
}

let getCookie = function (name) {
    let r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}