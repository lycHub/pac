var SCENETYPE_ENUM = [
  '充值',
  '提问支付(余额)',
  '提问支付(微信/支付宝)',
  '提问未审核通过退回',
  '超时回答退回',
  '拒绝回答退回',
  '回答未审核通过退回',
  '回答审核通过',
  '旁听支付(支付宝/微信)',
  '旁听支付(余额)',
  '旁听答主分成',
  '旁听提问者分成',
  '提现待审核',
  '提现审核通过'
];


var IE_ENUM = ['', '+', '-'];


var detailParams = {
  startTime: '',
  endTime: ''
};
var tableParams = {
  phoneSure: '',
  orderCode: '',
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
  $('.sysFundSummary .fa').tooltip();
   var formDoms = {
    orderCode: $('.sysFundSummary .orderCode'),
    phoneSure: $('.sysFundSummary .phoneSure')
  }

  var btns = {
    searchDetailBtn: $('.sysFundSummary .btn-search-detail'),
    resetBtn: $('.sysFundSummary .btn-reset'),
    searchBtn: $('.sysFundSummary .btn-search'),
    exportBtn: $('.sysFundSummary .btn-export'),
  }


var dateRangePickerDetail = new FaqDateRangePicker({
    el: '.sysFundSummary .action-date-detail',
    onInit: function() {
      $('.sysFundSummary .action-date-detail').val('');
    },
    onApply: function (dateRange) {
      detailParams.startTime = +moment(dateRange[0]);
      detailParams.endTime = +moment(dateRange[1]);
    }
  });


  var dateRangePickerList = new FaqDateRangePicker({
    el: '.sysFundSummary .action-date-list',
    onInit: function() {
      $('.sysFundSummary .action-date-list').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });

  $('.sysFundSummary .fa').tooltip();
 

  getDetail();
  getList();
  initEvents();

  function initEvents() {
    btns.resetBtn.click(onReset);
    btns.searchBtn.click(onSearch);
    btns.searchDetailBtn.click(onSearchDetail);
    btns.exportBtn.click(onExport);
  }



  // 搜索详情
  function onSearchDetail() {
    // console.log('detailParams :', detailParams);
    getDetail();
  }


  // 搜索
  function onSearch() {
    updateTableParams();
    // console.log('tableParams :', tableParams);
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
    // $('.sysFundSummary .action-date').data('daterangepicker').setStartDate(moment());
    // $('.sysFundSummary .action-date').data('daterangepicker').setEndDate(moment());
    $('.sysFundSummary .action-date-list').val('');
  }


  function onExport() {
    updateTableParams();
    // console.log('tableParams :', Qs.stringify(tableParams));
    location.href = '/qa/sys_amount/export.htm?' + Qs.stringify(tableParams);
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
      el: '.sysFundSummary .paginations',
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


  // 获取详情总览
  function getDetail() {
    accountServe.getSysAccountDetail(detailParams, function(res){
      console.log('detail:', res);
      $('.sysFundSummary .total-income').text(res.totalIncome);
      $('.sysFundSummary .total-cash').text(res.totalCash);
      $('.sysFundSummary .total-amount').text(res.amount);
      $('.sysFundSummary .total-percentage').text(res.totalPercentage);
    });
  }

  // 获取列表
  function getList() {
    if (searching) return;
    searching = true;
    accountServe.getSysAccountDetailList(tableParams, function (res) {
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
        data: 'createTime',
        title: '时间',
        render: function (time) {
          return time > 0 ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : '--';
        }
      }, {
        data: 'balanceRecordId',
        title: '流水号'
      }, {
        data: 'sceneType',
        title: '类型',
        render: function(data) {
          return SCENETYPE_ENUM[data];
        }
      }, {
        data: 'phone',
        title: '关联用户手机',
        render: function (data, type, row) {
          var detailLink = '../../userManager/balanceRecord/balanceRecord.html?phone=' + row.phone + '&userId=' + row.userId;
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ data +'</a>';
        }
      }, {
        data: 'orderCode',
        title: '关联订单号'
      }, {
        data: 'changeAmount',
        title: '金额变动',
        render: function (data, type, row) {
          return IE_ENUM[row.type] +  data;
        }
      }, {
        data: 'newBalance',
        title: '余额'
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