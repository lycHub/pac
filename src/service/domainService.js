(function (w) {
  $.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json'
  });
  function DomainService() {
    this.prefix = '/qa/field/';
  }

  DomainService.prototype = {
    constructor: DomainService,

    // 获取领域列表
    getDomainList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'list.htm',
        data: JSON.stringify(params),
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

    // 启用领域
    enableDomain: function (id, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'enable/' + id + '.htm',
        // data: JSON.stringify({ id: id }),
        success: function(res){
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },

    // 禁用领域
    disableDomain: function (id, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'disable/' + id + '.htm',
        // data: JSON.stringify({ id: id }),
        success: function(res){
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },


    // 新增领域
    addDomain: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'save.htm',
        data: JSON.stringify(params),
        success: function(res){
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },

    // 修改领域
    updateDomain: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'update.htm',
        data: JSON.stringify(params),
        success: function(res){
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          if (cb) {
            cb(error);
          }
        }
      });
    },


    // 获取详情
    getDomainDetail: function (id, cb) {
      $.ajax({
        url: this.prefix + 'info/' + id + '.htm',
        // data: JSON.stringify({ id: id }),
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

  w.DomainService = DomainService;
})(window)