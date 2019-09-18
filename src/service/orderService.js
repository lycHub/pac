(function (w) {
  function OrderService() {
    this.prefix = '/qa/order/';
  }

  OrderService.prototype = {
    constructor: OrderService,

    // 获取列表
    getOrderList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'list.htm',
        data: Qs.stringify(params),
        // contentType: 'application/x-www-form-urlencoded',
        success: function(res){
          if (cb) {
            cb(res.response);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },

    // 支付详情
    getPayInfo: function (id, cb) {
      $.ajax({
        url: this.prefix + 'querypayrecord/'+ id +'.htm',
        success: function(res){
          if (cb) {
            cb(res.response);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },

   
  }

  w.OrderService = OrderService;
})(window);