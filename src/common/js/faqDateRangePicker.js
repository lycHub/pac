(function (w) {
  function FaqDateRangePicker(options) {
    Options.call(this);
    this.options = this.merge({
      el: null,
      applyClass: 'btn-primary',
      cancelClass: 'btn-primary',
      opens: "left",
      locale: {
        format: 'YYYY-MM-DD',
        separator: " - ",
        applyLabel: "确定",
        cancelLabel: "取消",
        fromLabel: "起始时间",
        toLabel: "结束时间'",
        customRangeLabel: "自定义",
        weekLabel: "W",
        daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        firstDay: 1
      },
      /*ranges: {
        '今天': [moment(), moment()],
        '昨日': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '最近7日': [moment().subtract(6, 'days'), moment()],
        '最近30日': [moment().subtract(29, 'days'), moment()]
      },*/
      // showCustomRangeLabel: false
      onDateChange: $.noop,
      onInit: $.noop
    }, options);

    if (!this.options.el) {
      throw new Error('缺少el');
    }

    this.daterangepickerIns = null;
    this.init();
  }

  FaqDateRangePicker.prototype = $.extend(Object.create(Options.prototype), {
    constructor: FaqDateRangePicker,
    init: function () {
      var options = this.options;
      // console.log('options', options.data);
      var that = this;
      this.daterangepickerIns = $(this.options.el).daterangepicker({
        applyClass: options.applyClass,
        cancelClass: options.cancelClass,
        startDate: options.startDate,
        endDate: options.endDate,
        opens: options.opens,
        locale: options.locale
      }, function(start, end) {
        that.emitEvent('onDateChange', [start, end]);
      }).on('apply.daterangepicker', function(ev, picker){
        that.emitEvent('onApply', [picker.startDate, picker.endDate]);
      });
      that.emitEvent('onInit', this.daterangepickerIns);
    }
  });
  w.FaqDateRangePicker = FaqDateRangePicker;
})(window);