function Options() {}

Options.prototype = {
  constructor: Options,
  
  // 合并默认配置
  merge: function (defaultOptions, options) {
    return options ? $.extend({}, defaultOptions, options) : {};
  },
  
  // 触发回调函数
  emitEvent: function(type, args) {
    if (this.options[type]) {
      this.options[type](args);
    }
  }
}