var STATUS_ENUM = ['禁用', '启用'];
var tableParams = {
  id: '',
  fieldName: '',
  status: '',
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

// 点击的行信息
var rowInfo = null;

var domainServe = new DomainService();
$(function () {
  var dateRangePicker = new FaqDateRangePicker({
    el: '.domain .action-date',
    onInit: function() {
      $('.domain .action-date').val('');
    },
    onApply: function (dateRange) {
      tableParams.startTime = +moment(dateRange[0]);
      tableParams.endTime = +moment(dateRange[1]);
    }
  });


  var formDoms = {
    id: $('.domain .domain-id'),
    fieldName: $('.domain .domain-fieldName'),
    status: $('.domain .domain-status')
  }

  var btns = {
    resetBtn: $('.domain .btn-reset'),
    searchBtn: $('.domain .btn-search')
  }

  var modalDoms = {
    modalBody: $('.domain-modal .modal-body'),
    modalConfirmBtn: $('.domain-modal .modal-footer .btn:last')
  }

  initEvents();
  getList();


  function initEvents() {
    btns.resetBtn.click(onReset);
    btns.searchBtn.click(onSearch);
    modalDoms.modalConfirmBtn.click(changeStatus);
  }


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
        tableParams[attr] = '';
        formDoms[attr].val('');
      }
    }
    tableParams.startTime = '';
    tableParams.endTime = '';
    // $('.domain .action-date').data('daterangepicker').setStartDate(moment());
    // $('.domain .action-date').data('daterangepicker').setEndDate(moment());
    $('.domain .action-date').val('');
  }


  // 点击改变状态
  function onChangeStatus() {
    rowInfo = $(this).data('info');
    modalDoms.modalBody.text(rowInfo.action + rowInfo.fieldName + '领域?');
    $('.domain-modal').modal('show');
  }


  // 确定改变状态
  function changeStatus() {
    var msg = '';
    var httpType = '';
    if (STATUS_ENUM[rowInfo.status] === '禁用') {
      httpType = 'enableDomain';
      msg = '启用';
    }else {
      httpType = 'disableDomain';
      msg = '禁用';
    }
    domainServe[httpType](rowInfo.id, function (res) {
      if (res.status === '200') {
        reloadList();
        alert(msg + '成功!');
      }else {
        alert(msg + '失败!');
      }
    });
    $('.domain-modal').modal('hide');
  }


  function loadPagination(total) {
    faqPaginations = new FaqPagination({
      el: '.domain .paginations',
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
    domainServe.getDomainList(tableParams, function (res) {
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
        data: 'id',
        title: '领域ID'
      }, {
        data: 'fieldName',
        title: '领域名称'
      }, {
        data: 'createTime',
        title: '创建时间',
        render: renderTime
      }, {
        data: 'createUser',
        title: '创建人'
      }, {
        data: 'lastEditor',
        title: '操作人'
      }, {
        data: 'lastAccess',
        title: '操作时间',
        render: renderTime
      }, {
        data: 'status',
        title: '状态',
        render: function(data) {
          return STATUS_ENUM[data];
        }
      }, {
        data: null,
        title: '操作',
        render: function(data, type, row) {
          if (data.id === 31) {
            console.log('data 31 :', data);
          }
          var info = {
            action: STATUS_ENUM[inverse(data['status'])],
            fieldName: data.fieldName,
            id: data.id
          }
          var detailLink = '../updateDomain/updateDomain.html?id=' + data.id;
          var dataStr = JSON.stringify(info);
          return '<a href="' + detailLink + '" class="btn btn-link btn-edit" type="button">修改</a>' +
            '<button data-info=' + dataStr + ' class="btn btn-link btn-change-status" type="button">'+ info.action +'</button>';
        }
      }],
      afterDraw: function(table) {
        // console.log('afterDraw', table);
        if (!faqPaginations) {
          // console.log('reloadPage');
          loadPagination(tableDatas.total);
        }
        $(table[0]).find('.btn-change-status').click(onChangeStatus);
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