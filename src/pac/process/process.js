console.log('process');
var response = {
  articleVo: {title: 'eeee'},
  spiderConversionConfigs: []
}


$(function () {
  $('.sx').click(function () {
    var datas = JSON.parse(localStorage.getItem('steps-record'));
    if (!datas) {
      datas = response;
    }
    console.log('datas', datas);
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
        // localStorage.setItem('steps-record', JSON.stringify(params));
      }
    });


    /*// 设值
    setTimeout(function () {
      process.setText('aaa', 'after');
    }, 1000);*/
  });



/*
  $('.hx').click(function () {
    response = {
      articleVo: {title: 'e'},
      before: 'aa',
      after: 'bb',
      spiderConversionConfigs: [
        {
          conversionCode: 2,
          conversionType: '添加后缀',
          filedName: 'title',
          param: { postfix: 'bbb' }
        },
        {
          conversionCode: 1,
          conversionType: '添加前缀',
          filedName: 'title',
          param: { prefix: 'aaa' }
        },

        {
          conversionCode: 3,
          conversionType: '文本替换',
          filedName: 'title',
          param: { newChar: 'aaa', oldChar: 'bbb' }
        },
        {
          conversionCode: 5,
          conversionType: '固定值',
          filedName: 'title',
          param: { forceCoverChar: 'aaa' }
        },
      ]
    }
    var process = new Process('.modal-wrap', {
      initialDatas: response,
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


    /!*!// 设值
    setTimeout(function () {
      process.setText('aaa', 'after');
    }, 1000);*!/
  });*/


});