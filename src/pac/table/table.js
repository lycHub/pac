console.log('table');
var str = '!((ff0)||(ff0)&&(ff1)&&(ff2)||(ff0)||(ff0)||(ff0)&&(ff1)||(ff0))';
var response = {
  /*filterExpression: '(ff0)||(ff0)&&(ff1)&&(ff2)||(ff0)||(ff0)||(ff0)&&(ff1)||(ff0)',
  // filterExpression: str,
  formatFilterConfigs: [
    {
      filedName: 'title',
      filterCode: '4',
      param: '',
      varName: 'ff0'
    },
    {
      filedName: 'title',
      filterCode: '3',
      param: '322',
      varName: 'ff0'
    }, {
      filedName: 'source',
      filterCode: '3',
      param: 'ds',
      varName: 'ff1'
    }, {
      filedName: 'author',
      filterCode: '4',
      param: 'dss',
      varName: 'ff2'
    },
    {
      filedName: 'source',
      filterCode: '9',
      param: '',
      varName: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '10',
      param: '',
      varName: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '5',
      param: '32',
      varName: 'ff0'
    }, {
      filedName: 'author',
      filterCode: '3',
      param: '345',
      varName: 'ff1'
    },
    {
      filedName: 'title',
      filterCode: '1',
      param: '',
      varName: 'ff0'
    }
  ]*/
}

var screenTable = null;
$(function () {
  $('.sx').click(function () {
    var screenTable = new ScreenTable('.modal-wrap', {
      initialDatas: response || {},
      onInit: function (tableDatas) {
        // console.log('onInit', tableDatas);
        var that = this;
        $( ".modal-wrap" ).dialog({
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
      },
      /*onChange: function (tableDatas) {
        console.log('onChange', tableDatas);
      }*/
    });






  });


  $('.hx').click(function () {
    response = {
      filterExpression: '(ff0)||(ff0)&&(ff1)&&(ff2)||(ff0)||(ff0)||(ff0)&&(ff1)||(ff0)',
      // filterExpression: str,
      formatFilterConfigs: [
        {
          filedName: 'title',
          filterCode: '4',
          param: '',
          varName: 'f_0'
        },
        {
          filedName: 'title',
          filterCode: '3',
          param: '322',
          varName: 'f_1'
        }, {
          filedName: 'source',
          filterCode: '3',
          param: 'ds',
          varName: 'f_2'
        }, {
          filedName: 'author',
          filterCode: '4',
          param: 'dss',
          varName: 'f_3'
        },
        {
          filedName: 'source',
          filterCode: '9',
          param: '301',
          varName: 'f_4'
        },
        {
          filedName: 'author',
          filterCode: '10',
          param: '201',
          varName: 'f_5'
        },
        {
          filedName: 'author',
          filterCode: '5',
          param: '32',
          varName: 'f_6'
        }, {
          filedName: 'author',
          filterCode: '3',
          param: '345',
          varName: 'f_7'
        },
        {
          filedName: 'title',
          filterCode: '1',
          param: '',
          varName: 'f_8'
        }
      ]
    }
    var screenTable = new ScreenTable('.modal-wrap', {
      initialDatas: response || null,
      onInit: function (tableDatas) {
        // console.log('onInit', tableDatas);
        var that = this;
        $( ".modal-wrap" ).dialog({
          width: 650,
          // modal: true,
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
      },
      onChange: function (tableDatas) {
        console.log('onChange', tableDatas);
      }
    });
  });
});
