console.log('process');
var response = {
  "articleVo": {"title": "e"},
  "spiderConversionConfigs": [{
    "conversionCode": 2,
    "conversionType": "添加后缀",
    "filedName": "title",
    "param": '{"exp":"[-拼接]"}'
  },
    {
      "conversionCode": 1,
      "conversionType": "添加前缀",
      "filedName": "title",
      "param": '{"prefix":"aaa"}'
    }
  ]
}


$(function () {
  $('.sx').click(function () {
    var process = new Process('.modal-wrap', {
      onInit: function () {
        console.log('init');
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
                $(this).dialog("close");
              }
            }
          ]
        });
      },
      onChange: function (params) {
        console.log('onChange', params);
      }
    });


    /*// 设值
    setTimeout(function () {
      process.setText('aaa', 'after');
    }, 1000);*/
  });
});