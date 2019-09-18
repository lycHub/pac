(function (w) {
  $.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json'
  });
  function UserService() {
    this.prefix = '/qa/answer_Man/';
    this.approvePrefix = '/qa/approveMan/';
    this.changeInfoPrefix = '/qa/modify_info/';
  }

  UserService.prototype = {
    constructor: UserService,

    // 获取列表
    getAnswerList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'query_Answer_Man_List.htm',
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

    // 查询手机号信息
    searchPhone: function (phoneNumber, cb) {
      $.ajax({
        url: this.prefix + 'get_user_info_by_phone_number.htm',
        data: { phoneNumber: phoneNumber },
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

    // 获取领域列表
    getDomainList: function (cb) {
      $.ajax({
        url: this.prefix + 'get_field_list.htm',
        // data: JSON.stringify({}),
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


    // 新增答主
    addAnswer: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'create_Answer_Man.htm',
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


    // 上传名片
    uploadFile: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'upload_file.htm',
        data: params,
        processData: false ,    // 不处理数据
        contentType: false,    // 不设置内容类型
        // contentType: 'multipart/form-data',
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


    // 获取上传后的图片
    /* getImg: function (path, cb) {
      $.ajax({
        url: this.prefix + 'show_image.htm',
        data: { srcImgPath: path },
        contentType: 'application/x-www-form-urlencoded',
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
    }, */


    // 获取答主详情
    getAnswerInfo: function (id, cb) {
      $.ajax({
        url: this.prefix + 'query_Answer_Man_Info_ById.htm',
        data: { ids: id },
        success: function(res){
          console.log('success', res);
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          console.log('error', error);
          if (cb) {
            cb(error);
          }
        }
      });
    },

    // 获取答主详情
    getAnswerInfoByPhone: function (phone, cb) {
      $.ajax({
        url: this.prefix + 'get_answer_man_by_phone_number.htm',
        data: { phone: phone },
        success: function(res){
          console.log('success', res);
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          console.log('error', error);
          if (cb) {
            cb(error);
          }
        }
      });
    },




    /************ 审核相关 ************/
    // 获取审核列表
    getAnswerCheckList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.prefix + 'answer_Man_Apply_List.htm',
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

       // 获取未通过次数
    getNotPassTimes: function (phoneUserId, cb) {
      $.ajax({
        url: this.approvePrefix + 'countOfNotPassByUserId.htm',
        data: { phoneUserId: phoneUserId },
        // contentType: 'application/x-www-form-urlencoded',
        success: function (res) {
          if (cb) {
            cb(res);
          }
        },
        error: function (error) {
          if (cb) {
            cb(error);
          }
        }
      });
    },

    // 获取未通过次数(答主修改资料审核)
    getNotPassTimesForChangeInfo: function (phoneUserId, cb) {
      $.ajax({
        url: this.changeInfoPrefix + 'countOfNotPass.htm',
        data: { phoneUserId: phoneUserId },
        // contentType: 'application/x-www-form-urlencoded',
        success: function (res) {
          if (cb) {
            cb(res);
          }
        },
        error: function (error) {
          if (cb) {
            cb(error);
          }
        }
      });
    },


    // 修改答主提交审核
    upDateAnswer: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.approvePrefix + 'approveAnswerManInfo.htm',
        data: JSON.stringify(params),
        success: function(res){
          if (cb) {
            cb(res);
          }
        },
        error: function(error){
          console.error('error :', error);
          if (cb) {
            cb(error);
          }
        }
      });
    },
    


    /************ 修改资料审核相关 ************/
    // 获取审核列表
    getChangeInfoCheckList: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.changeInfoPrefix + 'modify_info_List.htm',
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


    // 获取答主修改资料未通过的详情
    getModifyInfo: function (id, cb) {
      $.ajax({
        url: this.changeInfoPrefix + 'query_modify_Info_By_Id.htm',
        data: { id: id },
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

    // 答主修改资料提交审核
    upDateAnswerInfo: function (params, cb) {
      $.ajax({
        type: 'post',
        url: this.changeInfoPrefix + 'update_modify_info.htm',
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
    }
  }

  w.UserService = UserService;
})(window);