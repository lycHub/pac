$(function () {
  var oTable = $('.table-wrap .table').DataTable({
    ordering: false,
    searching: false,
    info: false,
    dom: 't<"table-control-wrap clearfix"ipl>',
    renderer: "bootstrap",
    "pagingType": "full_numbers",
    language: {
      lengthMenu: "显示 _MENU_ 条记录",
      paginate: {
        previous: "上一页",
        next: "下一页",
        first: "首页",
        last: "尾页"
      }
    },
    ajax: {
      url: 'http://127.0.0.1:3000/top/playlist',
      data: function (d) {
        console.log('d', d);
        return {
          cat: '全部',
          limit: 12,
          offset: 1,
          order: 'hot'
        }
      },
      dataSrc: 'playlists'
    },
    columns: [{
      data: 'id',
    }, {
      data: 'name'
    }, {
      data: 'createTime'
    }, {
      data: 'creator.nickname'
    }, {
      data: 'updateTime'
    }, {
      data: 'playCount'
    }, {
      data: null
    }],
    "columnDefs": [
      {
        targets: -1,
        render: function(data, type, row, meta) {
          return '<button>删除</button>';
        }
      }
    ]
  });
});