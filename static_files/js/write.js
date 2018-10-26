$(function () {
    getXSRF()
    let articleID = initHashIndex("modify_article", true)
    let isModifyArticle = parseInt(articleID) > 0 ? true : false

    
	initModifyArticleData(isModifyArticle, articleID, function(data) {
    	var testEditor = editormd("test-editormd", {
	        width: "80%",
	        height: 740,
	        saveHTMLToTextarea: true,
	        emoji: true,
	        markdown: data,
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
	    initModifyArticleView(isModifyArticle)
	    console.log(isModifyArticle)
	    initSubmitEvent("#submit_article", testEditor, isModifyArticle, articleID)
    })
  

});


window.addEventListener('load', function (event) {
    document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})

let initModifyArticleData = function(isModifyArticle, articleID, callback) {
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
        // $mdArea.text(data.content)
        callback(data.content)
    }
    let error = function(data) {
        console.log(data)
        callback("error")
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
        let content = testEditor.getMarkdown()
        // testEditor.getMarkdown()
        let summary = $('.article_info_box textarea:nth-child(3)').val()

        let category = $('.article_info_box input:nth-child(2)').val()
        category = category.trim()
        if (title && content && category && summary)  {
            submitArticle(title, content, summary, category, success, error, isModify, articleID)
        } else {
            alert('请确保参数都填写了！')
        }

    })
}

let submitArticle = function(title, content, summary, category, onSubmitArticleSuccess, onSubmitArticleError, isModify, articleID) {

    $.ajax({
        url: "/api/article_commit",
        type: "POST",
        headers: {
            "X-XSRFToken": getCookie("_xsrf"),
        },
        data: JSON.stringify({
            'title': title,
            'content': content,
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