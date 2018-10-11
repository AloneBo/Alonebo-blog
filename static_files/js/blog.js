$(function () {
    initData()
    initTOCM()
})

let initData = function (success) {
    var hash = location.hash
    hash = decodeURI(hash)
    hash = hash.substr(1)
    console.log(hash)
    let articleName = ""
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
        markdown: article.content,//+ "\r\n" + $("#append-test").text(),
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

