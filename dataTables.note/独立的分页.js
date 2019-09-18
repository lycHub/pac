$(function () {
  var tableParams = {
    cat: '全部',
    limit: 10,
    offset: 1,
    order: 'hot'
  };
  
  var oTable = null;
  var faqPaginations = null;
  var tableDatas = null;
  getList();
  
  function onDeleteRow(evt) {
    console.log('onDeleteRow', evt.target.dataset.id);
  }
  
  
  
  
  
  
  function loadPagination(total) {
    console.log('loadPagination', tableParams);
    faqPaginations = new FaqPagination({
      el: '.domain .paginations',
      total: total,
      pageNumber: tableParams.offset,
      pageSize: tableParams.limit,
      afterPaging: function(page) {
        console.log('afterPaging', page);
        tableParams.offset = page;
        getList();
      },
      afterPageSizeChange: function(pageSize) {
        console.log('pageSize', pageSize);
        faqPaginations.destory();
        faqPaginations = null;
        tableParams.offset = 1;
        tableParams.limit = pageSize;
        getList();
      }
    });
  }
  
  
  function getList() {
    $.get('http://127.0.0.1:3000/top/playlist', tableParams, function (res) {
      tableDatas = res;
      if (oTable) {
        console.log('cunzai');
        oTable.clear().rows.add(tableDatas.playlists).draw(false);
      }else {
        console.log('不存在');
        oTable = initTable();
      }
    })
  }
  
  
  
  function initTable() {
    return $('.table-wrap .table').DataTable({
      ordering: false,
      searching: false,
      info: false,
      paging: false,
      renderer: "bootstrap",
      data: tableDatas.playlists,
      columns: [{
        data: null,
        title: "<input type='checkbox' name='checklist' />"
      }, {
        data: 'id',
        title: 'id'
      }, {
        data: 'name',
        title: '歌单名'
      }, {
        data: 'createTime',
        title: '创建时间',
        render: function (data, type, row) {
          var str = new Date(data).toISOString();
          return '<p class="text-primary">' +  str  + '</p>';
        }
      }, {
        data: 'creator.nickname',
        title: '创建人'
      }, {
        data: 'updateTime',
        title: '更新时间'
      }, {
        data: 'playCount',
        title: '播放量'
      }, {
        data: null
      }],
      /*headerCallback: function (head) {
       $(head).addClass('thead');
       },*/
      "columnDefs": [
        {
          targets: 0,
          render: function(data, type, row) {
            return '<input type="checkbox" name="checklist" value="' + row.id + '" />'
          }
        },
        {
          targets: -1,
          render: function(data, type, row, meta) {
            return '<button class="btn btn-delete" data-id=' + row.id + '>删除</button>';
          }
        }
      ],
      initComplete: function () {
        // json是表格数据
        console.log('init');
        // loadPagination(tableDatas.total);
      },
      drawCallback: function () {
        // this.api()  api实例
        console.log('draw');
        if (!faqPaginations) {
          console.log('reloadPage');
          loadPagination(tableDatas.total);
        }
        $(this[0]).find('.btn-delete').click(onDeleteRow);
      }
    });
  }
});