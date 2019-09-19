(function (w) {
  function FaqDataTables(el, options) {
    if (!el) {
      throw new Error('缺少el');
    }
    Options.call(this);
    this.el = el;

    this.tableIns = null;
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