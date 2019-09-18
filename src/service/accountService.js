(function (w) {
  /* $.ajaxSetup({
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded'
  }); */
  function AccountService() {
    this.prefix = '/qa/user_amount/';
    this.prefix_sys = '/qa/sys_amount/';
  }

  AccountService.prototype = {
    constructor: AccountService,

    // 获取用户账户列表
    getUserAccountList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'list.htm',
        data: params,
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


    // 用户账户明细的累计值
    getUserAccountDetail: function (phone, cb) {
      $.ajax({
        url: this.prefix + 'detail.htm',
        data: { phone: phone },
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


    // 用户账户明细列表
    getUserAccountDetailList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'detail_list.htm',
        data: params,
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


    /*************** 资金总览相关 *****************/

    // 资金总览累计值
    getSysAccountDetail: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix_sys + 'detail.htm',
        data: params,
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


    // 资金总览明细列表
    getSysAccountDetailList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix_sys + 'list.htm',
        data: params,
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

  w.AccountService = AccountService;
})(window);