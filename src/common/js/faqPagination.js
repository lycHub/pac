(function (w) {
  function FaqPagination(options) {
    Options.call(this);
    this.options = this.merge({
      el: null,
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      showGoInput: true,
      showNavigator: true,
      showGoButton: true,
      className: 'paginationjs-big',    // 'paginationjs-theme-blue paginationjs-big'
      ellipsisText: '•••',
      prevText : '上页',
      nextText : '下页',
      triggerPagingOnInit: false,
      changeLen: true,
      afterInit: $.noop,
      afterPaging: $.noop
    }, options);

    if (!this.options.el) {
      throw new Error('缺少el');
    }
    
    // 处理dataSource
    var arr = [];
    if (this.options.total) {
      for (var a = 0; a < this.options.total; a++) {
        arr.push(a);
      }
    }
    
    this.options.dataSource = arr;
    
    this.paginationIns = null;
    this.init();
  }
  
  FaqPagination.prototype = $.extend(Object.create(Options.prototype), {
    constructor: FaqPagination,
    
    destory: function () {
      if (this.paginationIns) {
        // $(this.options.el).remove('.select');
        this.paginationIns.pagination('destroy');
        $(this.options.el).empty();
        this.paginationIns = null;
      }
    },
    
    init: function () {
      var el = $(this.options.el);
      var html = '<ul class="pagination"></ul>';
      if (this.options.changeLen) {
        html += '<select class="select"><option value="10">10条/页</option><option value="15">15条/页</option><option value="20">20条/页</option><option value="30">30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option></select>';
      }
      el.html(html);
      this.initPage(el.find('.pagination'));
      this.initSelect(el.find('select'));
    },
    initPage: function (container) {
      var options = this.options;
      var that = this;
      this.paginationIns = container.pagination({
        dataSource: options.dataSource,
        // totalNumber: options.total,
        pageNumber: options.pageNumber,
        pageSize: options.pageSize,
        showGoInput: options.showGoInput,
        showNavigator: options.showNavigator,
        showGoButton: options.showGoButton,
        className: options.className,
        ellipsisText: options.ellipsisText,
        prevText: options.prevText,
        nextText: options.nextText,
        triggerPagingOnInit: options.triggerPagingOnInit,
        afterInit: function () {
          that.emitEvent('afterInit');
        },
        afterPaging: function (page) {
          that.emitEvent('afterPaging', page);
        }
      });
    },
    initSelect: function (select$) {
      if (this.options.changeLen) {
        var that = this;
        select$.val(that.options.pageSize);
        select$.change(function () {
          that.emitEvent('afterPageSizeChange', Number($(this).val()) || 10);
        });
      }
    }
  });
  w.FaqPagination = FaqPagination;
})(window);