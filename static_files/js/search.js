$(function () {
    let keyword = initHashIndex("keyword", true)
    console.log(keyword)
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


window.addEventListener('load', function (event) {
     document.querySelector('header').style.background = 'url("/images/bg_header.jpeg") no-repeat center'
})