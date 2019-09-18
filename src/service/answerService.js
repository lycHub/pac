(function (w) {
    $.ajaxSetup({
        dataType: 'json',
        contentType: 'application/json'
    });
    function ProblemService() {
        this.prefix = '/qa/answer/';
    }

    ProblemService.prototype = {
        constructor: ProblemService,
        // 获取问题列表
        getAnswerList: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'list_page.htm',
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

        //问题推荐或首页
        updataStaus: function (params, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'updata_staus.htm',
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
        //获取信息
        getInfo: function (id, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'query_status_info/'+id+'.htm',
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
        //提交答案审批
        aprroveSubmit: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'aprrove_submit.htm',
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
        //修改答案
        editAnswer: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'edit_answer_content.htm',
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
        //获取旁听量
        listReadzan: function (params, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'list_Read_zan.htm',
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
        //旁听详情
        listenDetail: function (params, cb) {
            $.ajax({
                type: 'post',
                url: this.prefix + 'answer_listen_detail.htm',
                data: params,
                contentType: 'application/x-www-form-urlencoded',
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
        //日志
        answerLog: function (params, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'query_answer_log.htm',
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
        }
    }

    w.ProblemService = ProblemService;
})(window)