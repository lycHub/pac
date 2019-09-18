var STATUS_ENUM = ['待审核', '审核不通过'];


var pxType = {
  all: {
    sort: 'apply_time',
    order: 'desc'
  },
  '0': {
    sort: 'apply_time',
    order: 'asc'
  },
  '1': {
    sort: 'apply_time',
    order: 'desc'
  }
}


var tableParams = {
  userName: '',
  phoneNumber: '',
  company: '',
  job: '',
  status: '',
  pageNum: 1,
  pageSize: 10
};


var oTable = null;
var faqPaginations = null;
var tableDatas = null;

// 是否正在search(防重复)
var searching = false;

// 点击的行信息
var rowInfo = null;

// 领域列表
var domainList = [];

var userServe = new UserService();
$(function () {
  var formDoms = {
    userName: $('.answerCheckList .userName'),
    phoneNumber: $('.answerCheckList .phoneNumber'),
    company: $('.answerCheckList .company'),
    job: $('.answerCheckList .job'),
    status: $('.answerCheckList .status')
  }

  var btns = {
    resetBtn: $('.answerCheckList .btn-reset'),
    searchBtn: $('.answerCheckList .btn-search')
  }



  userServe.getDomainList(function (res) {
    // console.log(res);
    // console.log(_.find(res, {id: 1}).fieldName);
    domainList = res || [];
    getList();
  });



  btns.resetBtn.click(onReset);
  btns.searchBtn.click(onSearch);






  // 搜索
  function onSearch() {
    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        tableParams[attr] = formDoms[attr].val();
      }
    }
    reloadList();
  }


  // 重置
  function onReset() {
    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        formDoms[attr].val('');
        tableParams[attr] = '';
      }
    }
  }


  function loadPagination(total) {
    faqPaginations = new FaqPagination({
      el: '.answerCheckList .paginations',
      total: total,
      pageNumber: tableParams.pageNum,
      pageSize: tableParams.pageSize,
      afterPaging: function(page) {
        tableParams.pageNum = page;
        getList();
      },
      afterPageSizeChange: function(pageSize) {
        tableParams.pageSize = pageSize;
        reloadList();
      }
    });
  }


  // 获取列表
  function getList() {
    if (searching) return;
    searching = true;
    var px = pxType['all'];
    if (tableParams.status !== '') {
      px = pxType[tableParams.status];
    }
    var params = $.extend({}, tableParams, px);
    // console.log('params :', params);
    userServe.getAnswerCheckList(params, function (res) {
      if (!res) return;
      tableDatas = res;
      if (oTable) {
        oTable.reDraw(tableDatas.list || []);
      }else {
        oTable = initTable();
      }
      searching = false;
    });
  }


  function initTable() {
    return new FaqDataTables({
      el: '.table-wrap .table',
      data: tableDatas.list || [],
      columns: [{
        data: 'userName',
        title: '用户姓名'
      }, {
        data: 'phoneNumber',
        title: '手机号',
        render: function (data, type, row) {
          var detailLink = '../answerInfo/answerInfo.html?id=' + row.id;
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ data +'</a>';
        }
      },{
        data: 'nickName',
        title: '昵称'
      }, {
        data: 'company',
        title: '公司名称'
      },{
        data: 'job',
        title: '职位'
      },{
        data: 'workYear',
        title: '从业年限'
      },{
        data: 'fieldId',
        title: '擅长领域',
        render: function (data) {
          return getDomainLabelStr(data);
        }
      },{
        data: 'applyTime',
        title: '申请时间',
        render: function (time) {
          return time > 0 ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : '--';
        }
      },{
        data: 'status',
        title: '审核状态',
        render: function (data) {
          return STATUS_ENUM[data];
        }
      },{
        data: null,
        title: '操作',
        render: function(data) {
          // console.log(data);
          var text = '';
          var url = '';
          if (STATUS_ENUM[data.status] === '待审核') {
            text = '审核';
            url = '../answerCheck/answerCheck.html?id=';
          }else {
            text = '查看';
            url = '../answerNotCheckedInfo/answerNotCheckedInfo.html?id=';
          }

          var detailLink = url + data.id;
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ text +'</a>';
        }
      }],
      afterDraw: function() {
        if (!faqPaginations) {
          loadPagination(tableDatas.total);
        }
      }
    });
  }

  // 重新加载数据
  function reloadList() {
    tableParams.pageNum = 1;
    faqPaginations.destory();
    faqPaginations = null;
    getList();
  }

  

  // 将领域id数组转成字符串
  function getDomainLabelStr(fieldArr) {
    var str = '';
    fieldArr.forEach(function(item){
      var domain = _.find(domainList, {id: item});
      var label = domain ? domain.fieldName : '';
      str += label + ',';
    });
    return str.slice(0, -1);
  }
});