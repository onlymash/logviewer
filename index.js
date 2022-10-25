
let host = 'http://127.0.0.1:1099/'
let num = 0
let page = 1
let line = 15
let len = 0

function getNum() {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            handleNumResult(result)
        }
    }
    req.open('GET', host + 'getlogsize.json', true)
    req.send()
}

function handleNumResult(result) {
    num = result.size
    len = Math.ceil(num / line)
    createNav()
}

function getLog() {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            createCode(result.log)
        }
    }
    var params = 'page=' + page + '&limit=' + line
    req.open('GET', host + 'getlog.json?' + params, true)
    req.send()
}

function createCode(log) {
    var code = document.getElementById('code')
    code.innerText = log
    reRender()
}

function createNavItem(className, text) {
    let span, li
    span = document.createElement("span")
    span.className = "page-link"
    span.appendChild(document.createTextNode(text))
    switch (text) {
        case "Previous":
            span.addEventListener('click', () => setPage(page - 1))
            break
        case "Next":
            span.addEventListener('click', () => setPage(page + 1))
            break
        default:
            span.addEventListener('click', () => setPage(text))
    }
    li = document.createElement("li")
    li.className = className
    li.appendChild(span)
    return li
}

function createNav() {
    let nav = document.getElementById('nav')
    let span = document.createElement('span')
    span.appendChild(document.createTextNode(`共${num}条记录，分${len}页 当前在第${page}页`))
    nav.appendChild(span)
    let ul = document.createElement('ul')
    ul.className = "pagination justify-content-end"
    let start = page > 3 ? page - 2 : 1
    let end = page > len - 3 ? len + 1 : start + 5
    if (page == 1)
        className = "page-item disabled"
    else
        className = "page-item"
    ul.appendChild(createNavItem(className, "Previous"))
    for (i = start; i < end; i++) {
        if (i == page)
            className = "page-item active"
        else
            className = "page-item"
        ul.appendChild(createNavItem(className, i))
    }
    if (page == len)
        className = "page-item disabled"
    else
        className = "page-item"
    ul.appendChild(createNavItem(className, "Next"))
    nav.appendChild(ul)
}


function setPage(_page) {
    page = _page
    getLog()
}

function setLine(_line) {
    line = _line
    len = Math.ceil(num / line)
    page = 1
    getLog()
}

function changeLine() {
    _line = parseInt(document.querySelector("#allPut > div:nth-child(1) > input.form-control").value)
    line = _line
    if (_line <= num && _line > 0) {
        setLine(parseInt(_line))
    } else {
        alert("超出数据范围重新输入")
    }
}

function changePage() {
    _page = parseInt(document.querySelector("#allPut > div:nth-child(2) > input").value)
    if (_page <= len && _page > 0) {
        setPage(_page)
    } else {
        alert("超出页数范围重新输入")
    }
}

function removeElem(elem) {
    let parent = elem.parentElement;
    parent.removeChild(elem)
}

function initPage() {
    getNum()
    getLog()
}

function reRender() {
    removeElem(document.querySelector("#nav > span"))
    removeElem(document.querySelector("#nav > ul"))
    createNav()
}

window.addEventListener("load", initPage, false)
