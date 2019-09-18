console.log('8-28');
var REGISTER_ENUM = ['自主', '代注册'];
var tableParams = {
  userName: '',
  phoneNumber: '',
  company: '',
  job: '',
  register: '',
  startTime: '',
  endTime: '',
  pageNum: 1,
  pageSize: 10,
  sort: 'apply_time',
  order: 'desc'
};

var oTable = null;
var faqPaginations = null;
var tableDatas = null;

// 是否正在search(防重复)
var searching = false;

// 点击的行信息
var rowInfo = null;

var userServe = new UserService();
$(function () {
  var dateRangePicker = new FaqDateRangePicker({
    el: '.answerlist .action-date',
    opens: 'right',
    onInit: function() {
      $('.answerlist .action-date').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });



  var formDoms = {
    userName: $('.answerlist .userName'),
    phoneNumber: $('.answerlist .phoneNumber'),
    company: $('.answerlist .company'),
    job: $('.answerlist .job'),
    register: $('.answerlist .register')
  }

  var btns = {
    resetBtn: $('.answerlist .btn-reset'),
    searchBtn: $('.answerlist .btn-search'),
    exportBtn: $('.answerlist .btn-export'),
  }



  initEvents();
  getList();


  function initEvents() {
    btns.resetBtn.click(onReset);
    btns.searchBtn.click(onSearch);
    btns.exportBtn.click(onExport);
  }



  // 搜索
  function onSearch() {
    updateTableParams();
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
    tableParams.startTime = '';
    tableParams.endTime = '';
    // $('.answerlist .action-date').data('daterangepicker').setStartDate(moment());
    // $('.answerlist .action-date').data('daterangepicker').setEndDate(moment());
    $('.answerlist .action-date').val('');
  }


  function onExport() {
    updateTableParams();
    // console.log('tableParams :', Qs.stringify(tableParams));
    location.href = '/qa/answer_Man/answer_man_list_export.htm?' + Qs.stringify(tableParams);
  }

  function updateTableParams() {
    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        tableParams[attr] = formDoms[attr].val();
      }
    }
    // console.log('tableParams :', tableParams);
  }


  function loadPagination(total) {
    faqPaginations = new FaqPagination({
      el: '.answerlist .paginations',
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
    userServe.getAnswerList(tableParams, function (res) {
      if (!res) return;
      tableDatas = res;
      if (!tableDatas) return;
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
        data: 'company',
        title: '公司名称'
      },{
        data: 'job',
        title: '职位'
      },{
        data: 'workYear',
        width: '53px',
        title: '从业年限'
      },{
        data: 'register',
        title: '申请类型',
        width: '53px',
        render: function (data) {
          return REGISTER_ENUM[data];
        }
      },{
        data: 'applyTime',
        title: '申请时间',
        width: '106px',
        render: renderTime
      },{
        data: 'approveTime',
        title: '审核时间',
        width: '106px',
        render: renderTime
      },{
        data: 'approveMan',
        width: '40px',
        title: '审核人'
      },{
        data: 'lastAnswerTime',
        title: '答主回答时间',
        width: '106px',
        render: renderTime
      },{
        data: 'focusOtherNumber',
        title: '关注'
      },{
        data: 'fansNumber',
        title: '粉丝'
      },{
        data: 'zanNumber',
        title: '被赞'
      },{
        data: 'answerListenNumber',
        width: '40px',
        title: '被旁听'
      },{
        data: 'questionAnswerNumber',
        width: '56px',
        title: '回答次数'
      }, {
        data: null,
        title: '余额记录',
        width: '52px',
        render: function(data, type, row) {
          var detailLink = '../balanceRecord/balanceRecord.html?phone=' + row.phoneNumber + '&userId=' + row.phoneUserId;
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">查看</a>';
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


  function renderTime(time) {
    return time > 0 ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : '--';
  }
});