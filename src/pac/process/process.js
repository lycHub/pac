console.log('process');
var response = {
  articleVo: {title: 'eeee'},
  spiderConversionConfigs: []
}

var articleTypes = ['articleTime', 'author', 'content', 'source', 'title'];

$(function () {
  $('.sx').click(function () {
    var datas = JSON.parse(localStorage.getItem('steps-record'));
    if (!datas) {
      datas = response;
    }
    // console.log('datas', datas);
    var process = new Process('.modal-wrap', {
      initialDatas: datas,
      onInit: function () {
        console.log('init');
        var that = this;
        $( ".modal-wrap" ).dialog({
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
        /*var p = {
          articleVo: {
            title: 'aaaa'
          },
          spiderConversionConfigs: [
            {
              filedName: 'title',
              conversionCode: 5,
              conversionType: '固定值',
              param: "{forceCoverChar: '值'}"
            }
          ]
        }*/
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
        // localStorage.setItem('steps-record', JSON.stringify(params));
      }
    });



    // 初始化调接口
    $.ajax({
      type: 'post',
      url: 'http://192.168.212.48:8080/api/article/conversion',
      contentType: 'application/json',
      data: JSON.stringify(datas),
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
          process.setText(after, 'after');
        }
      }
    });

  });
});