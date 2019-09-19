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
      uuid: 'ff0'
    },
    {
      filedName: 'title',
      filterCode: '3',
      param: '322',
      uuid: 'ff0'
    }, {
      filedName: 'source',
      filterCode: '3',
      param: 'ds',
      uuid: 'ff1'
    }, {
      filedName: 'author',
      filterCode: '4',
      param: 'dss',
      uuid: 'ff2'
    },
    {
      filedName: 'source',
      filterCode: '9',
      param: '',
      uuid: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '10',
      param: '',
      uuid: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '5',
      param: '32',
      uuid: 'ff0'
    }, {
      filedName: 'author',
      filterCode: '3',
      param: '345',
      uuid: 'ff1'
    },
    {
      filedName: 'title',
      filterCode: '1',
      param: '',
      uuid: 'ff0'
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
          height: 500,
          modal: true,
          resizable: false,
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


  $('.hx').click(function () {
    response = {
      filterExpression: '(ff0)||(ff0)&&(ff1)&&(ff2)||(ff0)||(ff0)||(ff0)&&(ff1)||(ff0)',
      // filterExpression: str,
      formatFilterConfigs: [
        {
          filedName: 'title',
          filterCode: '4',
          param: '',
          uuid: guid()
        },
        {
          filedName: 'title',
          filterCode: '3',
          param: '322',
          uuid: guid()
        }, {
          filedName: 'source',
          filterCode: '3',
          param: 'ds',
          uuid: guid()
        }, {
          filedName: 'author',
          filterCode: '4',
          param: 'dss',
          uuid: guid()
        },
        {
          filedName: 'source',
          filterCode: '9',
          param: '',
          uuid: guid()
        },
        {
          filedName: 'author',
          filterCode: '10',
          param: '',
          uuid: guid()
        },
        {
          filedName: 'author',
          filterCode: '5',
          param: '32',
          uuid: guid()
        }, {
          filedName: 'author',
          filterCode: '3',
          param: '345',
          uuid: guid()
        },
        {
          filedName: 'title',
          filterCode: '1',
          param: '',
          uuid: guid()
        }
      ]
    }
    var screenTable = new ScreenTable('.modal-wrap', {
      initialDatas: response || null,
      onInit: function (tableDatas) {
        // console.log('onInit', tableDatas);
        var that = this;
        $( ".modal-wrap" ).dialog({
          width: 630,
          modal: true,
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
