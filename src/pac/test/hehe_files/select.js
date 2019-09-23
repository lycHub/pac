/**
 * 获取传入元素的cssSelector
 * @param dom
 * @returns {string}
 */
function getCssPath(dom) {
    var path = '';
    var isBody = false;
    for (; dom && dom.nodeType == 1 &&!isBody; dom = dom.parentNode) {
        if (dom.tagName == 'BODY') {
            isBody = true;
        }
        var index = 0;
        var hasNext = false;
        for (var sib = dom.previousSibling; sib; sib = sib.previousSibling) {
            if (sib.nodeType == 1
            && sib.tagName == dom.tagName
            &&(dom.id?(sib.id==dom.id):true)
            &&(dom.className?(sib.className==dom.className):true)
            ){
                index++;
            }
        }
        for (var sib = dom.nextSibling; sib; sib = sib.nextSibling) {
            if (sib.nodeType == 1
            && sib.tagName == dom.tagName
            &&(dom.id?(sib.id==dom.id):true)
            &&(dom.className?(sib.className==dom.className):true)
            ){
                hasNext = true;
            }
        }
        var xname = (isBody?'':'>') + dom.tagName.toLowerCase();
        if (dom.id) {
            xname += '#' + dom.id
        } else if (dom.className) {
            xname += '.' + dom.className.replace(new RegExp(/( )/g), '.')
        } else {
            xname += ''
        }
        if(index||hasNext){
            xname += (':eq(' + index + ')')
        }
        path = xname + path
    }
//    if (path.substring(0, 1) == '>') {
//        path = path.replace('>', '')
//    }
    do {
        path = path.replace('..', '.')
    } while (path.indexOf('..') > 0);
    do {
        path = path.replace('.>', '>')
    } while (path.indexOf('.>') > 0);
    var patt = /\.$/;
    //如果是以.结尾则删除
    while (patt.test(path)) {
        path = path.replace(patt, "")
    }
//    //把所有的>替换为空格
//    path = path.replace(new RegExp(/(>)/g), ' ');

    //去除为纯数字的class
    path = path.replace(new RegExp(/\.[\d]+/), '');
    return path;
}


//获取传入元素的xpath
function getXpath(dom) {
    var path = '';
    var isBody = false;
    for (; dom && dom.nodeType == 1 &&!isBody; dom = dom.parentNode) {
        if (dom.tagName == 'BODY') {
            isBody = true;
        }
        var index = 0;
        var hasNext = false;
        for (var sib = dom.previousSibling; sib; sib = sib.previousSibling) {
            if (sib.nodeType == 1
            && sib.tagName == dom.tagName
            &&(dom.id?(sib.id==dom.id):true)
            &&(dom.className?(sib.className==dom.className):true)
            ){
                index++;
            }
        }
        for (var sib = dom.nextSibling; sib; sib = sib.nextSibling) {
            if (sib.nodeType == 1
            && sib.tagName == dom.tagName
            &&(dom.id?(sib.id==dom.id):true)
            &&(dom.className?(sib.className==dom.className):true)
            ){
                hasNext = true;
            }
        }
        var xname = (isBody?'//':'/') + dom.tagName.toLowerCase();
        if (dom.id) {
            xname += '[@id="' + dom.id + '"]';
        } else if (dom.className) {
            xname += '[contains(@class,"' + dom.className.split(" ")[0] + '")]';
        } else {
            xname += ''
        }
        if(index||hasNext){
            xname += ('[' + (index+1 ) + ']')
        }
        path = xname + path
    }
//    if (path.substring(0, 1) == '>') {
//        path = path.replace('>', '')
//    }
    do {
        path = path.replace('..', '.')
    } while (path.indexOf('..') > 0);
    do {
        path = path.replace('.>', '>')
    } while (path.indexOf('.>') > 0);
    var patt = /\.$/;
    //如果是以.结尾则删除
    while (patt.test(path)) {
        path = path.replace(patt, "")
    }
//    //把所有的>替换为空格
//    path = path.replace(new RegExp(/(>)/g), ' ');

    //去除为纯数字的class
    path = path.replace(new RegExp(/\.[\d]+/), '');
    return path;
}
//取消页面点击事件
function unbindAllEvent(){
    $("#mainiframe").contents().find("*").unbind();
    $("#mainiframe").contents().find("*").click(function (event) {
        event.preventDefault();
    });
}
//绑定鼠标悬浮样式
function bindHoverStyle(){
    /**
     * 鼠标进入时自动高亮
     * @param e
     */
    $("#mainiframe").contents().find("*").mouseover(function (e) {
        $(e.target).css('outline', 'dotted 3px #FF5E52');
    });
    /**
     * 鼠标出去时自动取消高亮
     * @param e
     */
    $("#mainiframe").contents().find("*").mouseout(function (e) {
        $(e.target).css('outline','');
    });
}
/**
 * 页面预处理
 */
function pageInit() {
    /**
     * 取消页面点击事件
     */
    unbindAllEvent();

}


/**
 * 自动调整IFrame高度
 */
function changeFrameHeight() {
    var ifm = document.getElementById("mainiframe");
    var h = $(".header").height();
    ifm.height = document.documentElement.clientHeight - h;
}