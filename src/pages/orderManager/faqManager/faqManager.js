var STATUS_TYPE_ENUM = ['提问', '旁听'];
var PAY_TYPE_ENUM = ['--', '余额', '支付宝', '微信'];
var STATUS_ENUM = ['提问待支付', '提问待审核', '提问未审核通过', '提问超时退回', '拒绝回答退回', '待回答', '答案待审核', '答案审核不通过', '答案审核通过', '旁听待支付', '订单完成'];

var tableParams = {
  code: '',
  listenerPhone: '',
  questionerPhone: '',
  answerManPhone: '',
  questionId: '',
  answerId: '',
  type: '',
  status: '',
  substatus: '',
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

var orderServe = new OrderService();
$(function () {
  var dateRangePicker = new FaqDateRangePicker({
    el: '.faqManager .action-date',
    opens: 'right',
    onInit: function() {
      $('.faqManager .action-date').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });


  $('.faqManager .status-menu').superfish({
    speed: 'fast',
    delay: 300
  }).find('a').click(function(evt) {
    var status = $(this).data('status');
    var substatus = $(this).data('substatus');
    
    if (substatus || substatus === 0) {
      tableParams.substatus = substatus;
      tableParams.status = status;
      $('.faqManager .first-menu').text(STATUS_ENUM[substatus]);
    }
  });



  var formDoms = {
    code: $('.faqManager .code'),
    listenerPhone: $('.faqManager .listenerPhone'),
    questionerPhone: $('.faqManager .questionerPhone'),
    answerManPhone: $('.faqManager .answerManPhone'),
    questionId: $('.faqManager .questionId'),
    answerId: $('.faqManager .answerId'),
    type: $('.faqManager .type')
  }

  var btns = {
    resetBtn: $('.faqManager .btn-reset'),
    searchBtn: $('.faqManager .btn-search'),
    exportBtn: $('.faqManager .btn-export'),
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
    tableParams.status = '';
    tableParams.substatus = '';
    tableParams.startTime = '';
    tableParams.endTime = '';
    $('.faqManager .first-menu').text('请选择');
    // $('.faqManager .action-date').data('daterangepicker').setStartDate(moment());
    // $('.faqManager .action-date').data('daterangepicker').setEndDate(moment());
    $('.faqManager .action-date').val('');
  }


  function onExport() {
    updateTableParams();
    // console.log('tableParams :', Qs.stringify(tableParams));
    location.href = '/qa/order/export.htm?' + Qs.stringify(tableParams);
  }


  function updateTableParams() {
    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        tableParams[attr] = formDoms[attr].val();
      }
    }
    console.log('tableParams :', tableParams);
  }


  function loadPagination(total) {
    faqPaginations = new FaqPagination({
      el: '.faqManager .paginations',
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
    orderServe.getOrderList(tableParams, function (res) {
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
        title: '创建时间',
        render: function (time) {
          return time > 0 ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : '--';
        }
      }, {
        data: 'code',
        title: '订单编号'
      }, {
        data: 'type',
        title: '订单类型',
        render: function (data) {
          return STATUS_TYPE_ENUM[data];
        }
      }, {
        data: 'listenerPhone',
        title: '旁听人手机',
        render: function (data, type, row) {
          return '<p>'+ row.listenerName +'</p><p>'+ data +'</p>';
        }
      }, {
        data: 'questionerPhone',
        title: '提问人手机',
        render: function (data, type, row) {
          return '<p>'+ row.questionerName +'</p><p>'+ data +'</p>';
        }
      }, {
        data: 'answerManPhone',
        title: '答主手机',
        render: function (data, type, row) {
          var detailLink = '../../userManager/answerInfo/answerInfo.html?phone=' + data;
          return '<p>'+ row.answerManName +'</p><a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ data +'</a>';
        }
      }, {
        data: 'questionId',
        title: '关联问题ID',
        render: function (data, type, row) {
          var detailLink = '../../contentManagement/auditing/commonAudit.html?id=' + data; 
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">'+ data +'</a>';
        }
      }, {
        data: 'answerId',
        title: '关联答案ID',
        render: function (data) {
          return data || '';
        }
      }, {
        data: 'amount',
        title: '订单金额',
        render: function (data) {
          return data + '元';
        }
      }, {
        data: 'payType',
        title: '支付方式',
        render: function (data, type, row) {
          if (data > 1) {
            return '<button class="btn btn-link btn-pay-info" type="button" data-id=' + row.id + '>'+ PAY_TYPE_ENUM[data] +'</button>';
          }else{
            return PAY_TYPE_ENUM[data];
          }
        }
      }, {
        data: 'substatus',
        title: '订单状态',
        render: function(data) {
          return STATUS_ENUM[data];
        }
      }],
      afterDraw: function(table) {
        if (!faqPaginations) {
          loadPagination(tableDatas.total);
        }
        $(table[0]).find('.btn-pay-info').click(onShowPayInfo);
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


  // 查看支付详情
  function onShowPayInfo() {
    var id = $(this).data('id');
    if (id) {
      orderServe.getPayInfo(id, function(res) {
        // console.log('getPayInfo :', res);
        if (res.payNo) {
          var payTime = moment(new Date(res.payTime)).format('YYYY-MM-DD HH:mm');
          $('.pay-info-modal .pay-info').html('<li>商品名称: <span>'+ res.productName +'</span></li><li>交易流水号: <span>'+ res.payNo +'</span></li><li>金额: <span>'+ res.payAmount +'</span></li><li>支付时间: <span>'+ payTime +'</span></li><li>支付账号: <span>'+ res.payName +'</span></li>');
          $('.pay-info-modal').modal('show');
        }else{
          alert('无交易详情');
        }
      });
    }
  }
});