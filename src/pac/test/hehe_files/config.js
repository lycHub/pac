//阶段常量
var stages = ["登录","列表","详情"];
//当前阶段,初始是列表
var stage = 1;
//驱动类型

//列表阶段配置
var listStage = {
    driverType :0,
    type:1,
    actionConfigList : [],
};
//详情阶段配置
var detailStage = {
    driverType:1,
    type:2,
    actionConfigList : [],
};
//全局配置
var global = {
    filterExpression : '',
    filterConfigList : []
};
function createAction(code,param){
    return {'actionCode':code,'param': JSON.stringify(param)};
}
//用于计算列表的path
var selectedPath = [];
//当前要捕获的字段
var detailFieldIdx;
//页面是否加载完整
function isPageCompleted(){
    $("#advantageMenu").hide();
    $("#confirmBox [name=msg]").text("页面是否加载完整？");
    $("#confirmBox").show();
    $("#yesBtn").one("click",function(){
        $("#confirmBox").hide();
        bindHoverStyle();
        if(stage == 1){
            $("#listTable,#listTableHeader").show();
            selectList();
        }else{
            $("#detailTable,#detailTableHeader").show();
            selectDetail();
        }
    });
}
//列表配置
function selectList(){
    $("#tipBox [name=msg]").text("请点击列表中的两个链接！");
    $("#tipBox").show();
    //绑定事件
    document.getElementById('mainiframe').contentWindow.document.onclick = function (event) {
    //获取xpath
        var path = getXpath(event.target);
        console.log("被点击的元素：" + path);
        if(event.target.tagName != 'A'){
            layer.msg("请点击链接！当前已点击"+selectedPath.length+"个链接");
            return;
        }
        selectedPath.push(path);
        layer.msg("当前已点击"+selectedPath.length+"个链接");
        if(selectedPath.length == 2){
            var path = computeAllUrl();
            selectedPath = [];
            if(!path){
                //不匹配
                return;
            }else{
                //匹配
                $($X(path)).css("background","green");
                listStage.actionConfigList.push(createAction(8,{xpath:path,name:'url'}));
                listStage.actionConfigList.push(createAction(5,{xpath:path,name:'title'}));
                initListTable( $($X(path)));
                //提示是否完成列表选择
                $("#tipBox").hide();
                $("#confirmBox [name=msg]").text("列表是否选择完毕？");
                $("#confirmBox").show();
                $("#yesBtn").one("click",function(){
                    $("#confirmBox").hide();
                    //解绑点击事件
                    document.getElementById('mainiframe').contentWindow.document.onclick = function(){};
                    bindHoverStyle();
                    //高级配置
                    advantage();
//                     $("#tipBox [name=msg]").text("请点击表格中的任意一条链接！");
//                     $("#tipBox").show();
                });
            }
        }
    };
}
var detailFiledAction = [];
//详情配置
function selectDetail(){
    $("#tipBox [name=msg]").text("点击表格头部字段，再点击页面上的元素！");
    $("#tipBox").show();
    //绑定事件
        document.getElementById('mainiframe').contentWindow.document.onclick = function (event) {
        //获取xpath
         var path = getXpath(event.target);
         var tds = $("#detailTable>tbody>tr>td");
         switch(detailFieldIdx){
            case 0:
                tds.eq(detailFieldIdx).text($($X(path)).text());
                detailFiledAction[detailFieldIdx]=createAction(5,{xpath:path,name:'title'});
                break;
            case 1:
                tds.eq(detailFieldIdx).text($($X(path)).text());
                detailFiledAction[detailFieldIdx]=createAction(5,{xpath:path,name:'source'});
                break;
            case 2:
                tds.eq(detailFieldIdx).text($($X(path)).text());
                detailFiledAction[detailFieldIdx]=createAction(5,{xpath:path,name:'author'});
                break;
            case 3:
                tds.eq(detailFieldIdx).text($($X(path)).text());
                detailFiledAction[detailFieldIdx]=createAction(5,{xpath:path,name:'articleTime'});
                break;
            case 4:
                tds.eq(detailFieldIdx).text($($X(path)).html());
                detailFiledAction[detailFieldIdx]=createAction(6,{xpath:path,name:'content'});
                break;
            default:break;
         }
         $("#tipBox").hide();
         $("#confirmBox [name=msg]").text("是否配置完成？");
         $("#confirmBox").show();
         $("#yesBtn").unbind().one("click",function(){
             $("#confirmBox").hide();
             //解绑点击事件
             document.getElementById('mainiframe').contentWindow.document.onclick = function(){};
             bindHoverStyle();
             for( var idx in detailFiledAction){
                 detailStage.actionConfigList.push(detailFiledAction[idx]);
             }
             $("#finishBtn").show();
             $("#filterBtn").show();
         });
      }
}
//高级配置菜单
function advantage(){
    $("#tipBox [name=msg]").text("请根据左侧弹框提示进行配置，配置完成点击列表中的链接进入详情爬取配置！");
    $("#tipBox").show();
    $("#advantageMenu").show();
}
//根据xpath获取元素
function $X(path){
    var doc = document.getElementById("mainiframe").contentDocument;
    var itr = doc.evaluate(path, doc, null, XPathResult.ANY_TYPE, null);
    var arr = [];
    var tmp;
    while(tmp = itr.iterateNext()){
        arr.push(tmp);
    }
    return arr;
}
//计算列表链接的xpath
function computeAllUrl(){
    var el1 = $($X(selectedPath[0])[0]);
    var el2 = $($X(selectedPath[1])[0]);
    var bothParentPath;
    var rowPath;
    if (el1.parents().length != el2.parents().length) {
        layer.msg("元素不在同一个列表！");
    } else {
        var arr1 = selectedPath[0].match(/(\[\d+])/g);
        var arr2 = selectedPath[1].match(/(\[\d+])/g);
        if (arr1.length != arr2.length) {
            layer.msg("元素不在同一个列表！");
        } else {
            var len = arr1.length;
            var i = 0;
            for (; i < len; i++) {
                if (arr1[i] != arr2[i]) {
                    break;
                }
            }
            var idx = 0;
            var path = selectedPath[0].replace(/(\[\d+])/g, (m) => { if (i == idx++) { return ''; } else { return m; } });
            return path;
        }
    }
}
//iframe初始化
function startInit() {
    //隐藏数据表格
    $("#listTable,#listTableHeader,#detailTable,#detailTableHeader").hide();
    //隐藏tip和confirm
    $("#tipBox,#confirmBox").hide();
    //移除iframe内元素的点击事件
    unbindAllEvent();
    //寻味页面是否完整
    isPageCompleted();
}
//初始化表格
function initListTable($el){
    var tbody = $("#listTable>tbody");
    var html = "";
    $el.each(function(idx,item){
        html+=`<tr><td>${item.text}</td><td onclick="initDetail('${item.href}')" style="cursor:pointer">${item.href}</td></tr>`;
    });
    tbody.empty().html(html);
}
//初始化详情模式
function initDetail(url){
    $.post("/pagespiderjob/render",{url:url},function(data){
        //切换详情阶段
        stage = 2;
        document.getElementById('mainiframe').srcdoc = data.response;
    });
}

$(function(){
    $("#detailTableHeader>thead>tr>td").click(function(){
        $("#detailTableHeader>thead>tr>td").removeClass("info");
        var el = $(this);
        el.addClass("info");
        detailFieldIdx = el.index();
    });
    //完成提交配置按钮
    $("#finishBtn").click(function(){
    var data = {
                   url:$("#url").val(),
                   catalogId:$("#catalogId").val(),
                   name:$("#name").val(),
                   newsfeedId:$("#newsfeedId").val(),
                   ownerId:$("#ownerId").val(),
                   name:$("#name").val(),
                   stageList:[listStage,detailStage]
               };
        if(global.filterExpression){
            data.filterExpression
        }
        $.ajax({
        url:"/pagespiderjob/save",
        data: JSON.stringify(data),
        type:"post",
        contentType:"application/json",
        success:function(data){
            if(data.status == 200){
                layer.open({
                  content: data.message,
                  yes:function(){
                    window.location.href="/pagespiderjob/";
                  }
                });
               }else{
                 layer.alert(data.message?data.message:"提交异常！");
               }
            }
        });
    });
    //清空表格按钮
    $("clearTableBtn").click(function(){
        //根据阶段清空对应表格，1.列表；2.详情
        switch(stage){
            case 1:
                $("#listTable>tbody").empty();
                break;
            case 2:
                $("#detailTable>tbody td").empty();
                break;
        }
    });
    //初始化高级菜单按钮
    $("#advantageMenu [name=menuList] button").click(function(){
        $("#advantageMenu [name=menuList]").hide();
    });
    $("#advantageMenu [name=menuList] [name=pagingBtn]").click(function(){
        $("#advantageMenu [name=pagingBox]").show();
    });
    //初始化分页菜单按钮
    $("#advantageMenu [name=pagingBox] [name=selectPagingBtn]").click(function(){
         $("#advantageMenu").hide();
        document.getElementById('mainiframe').contentWindow.document.onclick = function (event) {
         //获取xpath
          var path = getXpath(event.target);
          //清除点击事件
          document.getElementById('mainiframe').contentWindow.document.onclick = function(){};
          //回填xpath
          $("#advantageMenu").show();
          $("#advantageMenu [name=pagingBox] [name=xpath]").val(path);
        }
    });
    $("#advantageMenu [name=pagingBox] [name=noBtn]").click(function(){
        $("#advantageMenu [name=pagingBox]").hide();
        $("#advantageMenu [name=menuList]").show();
    });
    $("#advantageMenu [name=pagingBox] [name=yesBtn]").click(function(){
        $("#advantageMenu [name=pagingBox]").hide();
        $("#advantageMenu [name=menuList]").show();
        var actionList = listStage.actionConfigList;
        var pagingType = $("#advantageMenu [name=pagingBox] [name=pagingType]").val();
        var xpath = $("#advantageMenu [name=pagingBox] [name=xpath]").val();
        var limit = $("#advantageMenu [name=pagingBox] [name=limit]").val();
        var interval = 0.5;
        //3.滚动;4.点击
        //是否已存在分页配置,存在就干掉
        if([3,4].includes(actionList[actionList.length-1]['actionCode'])){
            actionList.pop();
        }
        if(pagingType == 3){
            actionList.push(createAction(Number.parseInt(pagingType),{limit:limit,interval:interval}));
        }else if(pagingType == 4){
            actionList.push(createAction(Number.parseInt(pagingType),{xpath:xpath,limit:limit,interval:interval}));
        }
    });
    //过滤组件模型转换
    function convertFilterConfig(){
        if(global.filterExpression){
            return {
                filterExpression:global.filterExpression,
                spiderFilterConfigList:global.filterConfigList
            };
        }
    }
    //初始化过滤组件
    $("#filterBtn").click(function(){
    var el = '#filterTable';
     var screenTable = new ScreenTable(el, {
          initialDatas: convertFilterConfig() || {},
          onInit: function (tableDatas) {
            // console.log('onInit', tableDatas);
            var that = this;
            $( el ).dialog({
              width: 650,
              // height: 500,
              modal: true,
              resizable: false,
              closeOnEscape: false,
              title: "数据筛选",
              buttons: [
                {
                  text: '取消',
                  click: function() {
                    $(this).dialog("close");
                  }
                },
                {
                  text: '确定',
                  click: function() {
                    var result = that.transferParams();
                    console.log(result);
                    //保存后，把值更新到model
                    if(result != null){
                        global.filterExpression = result.filterExpression;
                        global.filterConfigList = result.spiderFilterConfigList;
                    }
                    $(this).dialog("close");
                  }
                }
              ]
            });
          },
          /*onChange: function (tableDatas) {
            console.log('onChange', tableDatas);
          }*/
        });
    });
});
