(function (w) {
  function FaqDataTables(options) {
    Options.call(this);
    this.options = this.merge({
      el: null,
      ordering: false,
      searching: false,
      info: false,
      paging: false,
      data: [],
      columns: [],
      columnDefs: [],
      language: {
        emptyTable: '暂无数据'
      },
      renderer: 'bootstrap',
      afterDraw: $.noop
    }, options);
    if (!this.options.el) {
      throw new Error('缺少el');
    }
    this.dataTableIns = null;
    this.init();
  }
  FaqDataTables.prototype = $.extend(Object.create(Options.prototype), {
    constructor: FaqDataTables,
    init: function () {
      var options = this.options;
      // console.log('options', options.data);
      var that = this;
      this.dataTableIns = $(this.options.el).DataTable({
        ordering: options.ordering,
        searching: options.searching,
        info: options.info,
        paging: options.paging,
        renderer: options.renderer,
        data: options.data,
        columns: options.columns,
        columnDefs: options.columnDefs,
        language: options.language,
        drawCallback: function () {
          that.emitEvent('afterDraw', this);
        }
      });
    },
    reDraw: function (data) {
      this.dataTableIns.clear().rows.add(data).draw(false);
    }
  });
  w.FaqDataTables = FaqDataTables;
})(window);