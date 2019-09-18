$(function () {
  var tableParams = {
    cat: '全部',
    limit: 15,
    offset: 1,
    order: 'hot'
  };
  
  var oTable = $('.table-wrap .table').DataTable({
    ordering: false,
    searching: false,
    info: false,
    paging: false,
    // dom: 't<"table-control-wrap clearfix"ipl>',
    renderer: "bootstrap",
    /*  language: {
     lengthMenu: "显示 _MENU_ 条记录",
     paginate: {
     previous: "上一页",
     next: "下一页",
     first: "首页",
     last: "尾页"
     }
     },*/
    ajax: {
      url: 'http://127.0.0.1:3000/top/playlist',
      data: function (d) {
        console.log('d', d);
        return tableParams;
      },
      dataSrc: 'playlists'
    },
    processing: true,
    serverSide: true,
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
          // console.log('row', row);
          return '<button class="btn btn-delete" data-id=' + row.id + '>删除</button>';
        }
      }
    ],
    initComplete: function (settings, json) {
      // json是表格数据
      console.log('init');
      renderPagination(json.total);
    },
    drawCallback: function (settings) {
      // this.api()  api实例
      console.log('draw');
      $(this[0]).find('.btn-delete').click(onDeleteRow);
    }
  });
  
  
  
  function onDeleteRow(evt) {
    console.log('onDeleteRow', evt.target.dataset.id);
  }
  
  
  
  
  function renderPagination(total) {
    var faqPaginations = new FaqPagination({
      el: '.domain .paginations',
      total: total,
      pageNumber: tableParams.offset,
      pageSize: tableParams.limit,
      afterPaging: function(page) {
        console.log('afterPaging', page);
        reloadTable(page);
      }
    });
  }
  
  
  function reloadTable(offset) {
    oTable.settings()[0].ajax.data = {
      cat: '全部',
      limit: 15,
      offset: offset,
      order: 'hot'
    };
    oTable.ajax.reload();
  }
});