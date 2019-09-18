(function (w) {
    $.ajaxSetup({
        dataType: 'json',
        contentType: 'application/json'
    });
    function ProblemService() {
        this.prefix = '/qa/listen_manage/';
    }

    ProblemService.prototype = {
        constructor: ProblemService,

        // 获取旁听列表
        getAudienceList: function (params, cb) {
            $.ajax({
                type: 'get',
                url: this.prefix + 'all_list.htm',
                data: params,
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
        }
    }

    w.ProblemService = ProblemService;
})(window)