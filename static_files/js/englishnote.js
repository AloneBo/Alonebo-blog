$(function () {
    console.log("data")
    let success = function(data) {
        console.log(data)
        let html = template("test", {"data": data})
        console.log(html)
        $("#customers tbody").append(html)
    }
    $.ajax("/api/english_word_push").success(success)
})