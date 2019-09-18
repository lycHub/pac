$(function () {

    var oTable = null;
    var faqPaginations = null;
    var tableDatas = [];
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var problemService = new ProblemService();
    var tableParams = {
        answerId:Number(id),
        pageNo: 1,
        pageSize: 10
    };
    // 数据格式转换 json转formData
    function formData (data) {
        var ret = ''
        for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }

    getList();
    function getList() {
        problemService.listenDetail(formData(tableParams), function (res) {
            if (!res) return;
            tableDatas = res;
            if (oTable) {
                oTable.reDraw(tableDatas.list || []);
            }else {
                oTable = initTable();
            }
        });
    }
    function initTable() {
        return new FaqDataTables({
            el: '.table-wrap .table',
            data: tableDatas.list || [],
            columns: [{
                data: 'id',
                title: '旁听ID'
            }, {
                data: 'listenTime',
                title: '旁听时间',
                render: function (time) {
                    return moment(new Date(time)).format('YYYY-MM-DD HH:mm');
                }
            },{
                data: 'listenerPhone',
                title: '旁听用户手机号'
            }, {
                data: 'listenMoney',
                title: '旁听金额'
            }],
            afterDraw: function(table) {
                if (!faqPaginations) {
                    loadPagination(tableDatas.total);
                }
                // $(table[0]).find('.btn-change-status').click(onChangeStatus);
            }
        });
    }

    function loadPagination(total) {
        faqPaginations = new FaqPagination({
            el: '.audienceDetails .paginations',
            total: total,
            pageNumber: tableParams.pageNo,
            pageSize: tableParams.pageSize,
            afterPaging: function(page) {
                tableParams.pageNo = page;
                getList();
            },
            afterPageSizeChange: function(pageSize) {
                tableParams.pageSize = pageSize;
                reloadList();
            }
        });
    }
    // 重新加载数据
    function reloadList() {
        tableParams.pageNo = 1;
        if(faqPaginations){
            faqPaginations.destory();
            faqPaginations = null;
        }
        getList();
    }
});