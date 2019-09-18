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

var phone = url('?phone');
var userId = url('?userId');
if (!phone || !userId) {
  history.back();
}

var USER_ENUM = ['答主', '普通用户'];

var tableParams = {
  phone: phone,
  userId: userId === 'undefined' ? null: userId,
  orderCode: '',
  sceneType: '',
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
  var formDoms = {
    orderCode: $('.balanceRecord .orderCode'),
    sceneType: $('.balanceRecord .sceneType')
  }

  var btns = {
    resetBtn: $('.balanceRecord .btn-reset'),
    searchBtn: $('.balanceRecord .btn-search'),
    exportBtn: $('.balanceRecord .btn-export'),
  }

  var optionsDom = '<option value="">全部</option>';
  SCENETYPE_ENUM.forEach(function(item, index){
    optionsDom += '<option value='+ index +'>'+ item +'</option>';
  });

  formDoms.sceneType.html(optionsDom);


  var dateRangePicker = new FaqDateRangePicker({
    el: '.balanceRecord .action-date',
    onInit: function() {
      $('.balanceRecord .action-date').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });

  $('.balanceRecord .fa').tooltip();
  
  accountServe.getUserAccountDetail(phone, function(res){
    console.log('phone res:', res);
    $('.balanceRecord .userName em').text(res.name);
    $('.balanceRecord .phone em').text(res.phone);
    $('.balanceRecord .total-income').text(res.totalIncome);
    $('.balanceRecord .total-pay').text(res.totalPay);
    $('.balanceRecord .total-cash').text(res.totalCash);
    $('.balanceRecord .total-amount').text(res.amount);
  });

  
  getList();
  initEvents();

  function initEvents() {
    btns.resetBtn.click(onReset);
    btns.searchBtn.click(onSearch);
    // btns.exportBtn.click(onExport);
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
    // $('.balanceRecord .action-date').data('daterangepicker').setStartDate(moment());
    // $('.balanceRecord .action-date').data('daterangepicker').setEndDate(moment());
    $('.balanceRecord .action-date').val('');
  }


  /* function onExport() {
    updateTableParams();
    // console.log('tableParams :', Qs.stringify(tableParams));
    location.href = '/qa/answer_Man/answer_man_list_export.htm?' + Qs.stringify(tableParams);
  } */

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
      el: '.balanceRecord .paginations',
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
    accountServe.getUserAccountDetailList(tableParams, function (res) {
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
        title: '用户账户余额'
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