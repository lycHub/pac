(function (w) {
    $.ajaxSetup({
        dataType: 'json',
        contentType: 'application/json'
    });
    function ProblemService() {
        this.prefix = '/qa/question/';
        this.answer = '/qa/answer/'
    }

    ProblemService.prototype = {
        constructor: ProblemService,

        // 获取问题列表
        getQuestionList: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'list.htm',
                data: JSON.stringify(params),
                success: function(res){
                    if (cb) {
                        cb(res.response||{});
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
        getDomainList: function (params, cb) {
            $.ajax({
                type: 'get',
                url: '/qa/field/query.htm',
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
        //根据id获取问题表信息
        getInfo: function (id, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'info/'+id+'.htm',
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
        //提交待审核问题
        submitApprove: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'approve.htm',
                data: params,
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
        },
    //待回答状态-保存/提交
        saveAnswerByAdmin: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'saveAnswerByAdmin.htm',
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
        //获取用户名
        getLoginInfo: function (cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'getLoginInfo.htm',
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
        //问题推荐或首页
        updataStaus: function (params, cb) {
            $.ajax({
                type: 'get',
                url: this.answer + 'updata_staus.htm',
                data: params,
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
        }
    },


    w.ProblemService = ProblemService;
})(window)