$(function () {
    getXSRF()
    initClick()
});

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

let initClick = function () {
    $("#j_login_button").on("click", function () {
        let name = $("#j_input_name").val();
        let passwd = $("#j_input_passwd").val();
        console.log("click");
        $.ajax({
            url: "/api/login",
            type: "POST",
            data: JSON.stringify({'user_name': name, 'user_passwd': passwd}),
            headers: {
                "X-XSRFToken": getCookie("_xsrf"),
            },
            contentType: "application/json", // 提交的类型
            dataType: "json", // 返回的类型
            success: onSubminArticleSuccess,
            error: onSubminArticleError,
        });
    });

}

let onSubminArticleSuccess = function (data) {
    console.log("success");
    location.href = "index.html"
}

let onSubminArticleError = function () {
    alert("登陆失败");
}