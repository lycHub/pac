console.log('process');
var response = {
  articleVo: {title: 'eeee'},
  spiderConversionConfigs: []
}

var articleTypes = ['articleTime', 'author', 'content', 'source', 'title'];

$(function () {
  /*$('.sx').click(function () {
    var screenTable = new ScreenTable('.modal-wrap-xs', {
      // initialDatas: response || {},
      onInit: function (tableDatas) {
        // console.log('onInit', tableDatas);
        var that = this;
        $( ".modal-wrap-xs" ).dialog({
          width: 650,
          // height: 500,
          // modal: true,
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
                // console.log(that.getTableDatas());
                console.log(that.transferParams());
              }
            }
          ]
        });
      }
    });
  });*/


  $('.cl').click(function () {
    console.log('cl');
    var datas = JSON.parse(localStorage.getItem('steps-record'));
    if (!datas) {
      datas = response;
    }
    var process = new Process('.modal-wrap-cl', {
      initialDatas: datas,
      onInit: function () {
        var that = this;
        $(".modal-wrap-cl").dialog({
          width: 450,
          // height: 500,
          // modal: true,
          resizable: false,
          closeOnEscape: false,
          title: "数据处理",
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
                // console.log('ok', that.getParam());
                localStorage.setItem('steps-record', JSON.stringify(that.getParam()));
                $(this).dialog("close");
              }
            }
          ]
        });
      },
      onChange: function (params) {
        console.log('onChange', params);
        var that = this;
        $.ajax({
          type: 'post',
          url: 'http://192.168.212.48:8080/api/article/conversion',
          contentType: 'application/json',
          data: JSON.stringify(params),
          success: function(res){
            console.log('ok', res);
            var response = res.response || null;
            var after = '';
            if (response) {
              articleTypes.forEach(function (item) {
                if (response[item] !== 'null') {
                  after = response[item];
                }
              });
              that.setText(after, 'after');
            }
          }
        });
      }
    });
  });
});