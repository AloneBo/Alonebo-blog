
$(function () {
    checkLogin()
    initView()
})


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