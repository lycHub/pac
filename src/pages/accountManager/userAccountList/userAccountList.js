var USER_ENUM = ['答主', '普通用户'];

var tableParams = {
  name: '',
  phone: '',
  type: '',
  startTime: '',
  endTime: '',
  pageNum: 1,
  pageSize: 10
};

var oTable = null;
var faqPaginations = null;
var tableDatas = null;

// 是否正在search(防重复)
var searching = false;


var accountServe = new AccountService();
$(function () {
  var dateRangePicker = new FaqDateRangePicker({
    el: '.userAccountList .action-date',
    opens: 'right',
    onInit: function() {
      $('.userAccountList .action-date').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });



  var formDoms = {
    name: $('.userAccountList .name'),
    phone: $('.userAccountList .phone'),
    type: $('.userAccountList .type')
  }

  var btns = {
    resetBtn: $('.userAccountList .btn-reset'),
    searchBtn: $('.userAccountList .btn-search'),
    exportBtn: $('.userAccountList .btn-export'),
  }



  getList();
  btns.resetBtn.click(onReset);
  btns.searchBtn.click(onSearch);
  btns.exportBtn.click(onExport);



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
    // $('.userAccountList .action-date').data('daterangepicker').setStartDate(moment());
    // $('.userAccountList .action-date').data('daterangepicker').setEndDate(moment());
    $('.userAccountList .action-date').val('');
  }


  function onExport() {
    updateTableParams();
    // console.log('tableParams :', tableParams);
    location.href = '/qa/user_amount/export.htm?' + Qs.stringify(tableParams);
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
      el: '.userAccountList .paginations',
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
    accountServe.getUserAccountList(tableParams, function (res) {
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
        data: 'name',
        title: '用户姓名'
      }, {
        data: 'phone',
        title: '手机号',
        render: function (data, type, row) {
          var detailLink = '../../userManager/balanceRecord/balanceRecord.html?phone=' + row.phone + '&userId=' + row.userId;
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ data +'</a>';
        }
      }, {
        data: 'lastAccess',
        title: '最近变动时间',
        render: function (time) {
          return time > 0 ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : '--';
        }
      }, {
        data: 'type',
        title: '用户类型',
        render: function (data) {
          return USER_ENUM[data];
        }
      }, {
        data: 'totalIncome',
        title: '累计收入'
      }, {
        data: 'totalPay',
        title: '累计支出'
      }, {
        data: 'totalCash',
        title: '累计提现'
      }, {
        data: 'amount',
        title: '当前余额'
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
});