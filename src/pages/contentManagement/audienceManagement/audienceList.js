
// var defaultDate = {
//     startDate: moment().startOf('month'),
//     endDate: moment().endOf('month')
// }
var tableParams = {
    id: '',
    listenerPhone:'',
    questionerPhone:'',
    answerManPhone: '',
    listenBeginTime: '',
    listenEndTime: '',
    pageNo: 1,
    pageSize: 10
};

var oTable = null;
var faqPaginations = null;
var tableDatas = [];

// 是否正在search(防重复)
var searching = false;

var ProblemService = new ProblemService();
$(function () {
    var dateRangePicker = new FaqDateRangePicker({
        el: '.audienceList .action-date',
        // startDate: defaultDate.startDate,
        // endDate: defaultDate.endDate,
        onInit: function () {
            $('.action-date').val('')
        },
        onApply: function (dateRange) {
            tableParams.listenBeginTime = +moment(dateRange[0]);
            tableParams.listenEndTime = +moment(dateRange[1]);
        }
    });


    var formDoms = {
        id: $('.audienceList .id'),
        listenerPhone: $('.audienceList .listenerPhone'),
        questionerPhone: $('.audienceList .questionerPhone'),
        answerManPhone:$('.audienceList .answerManPhone'),
    }

    var btns = {
        resetBtn: $('.btn-reset'),
        searchBtn: $('.btn-search'),
    }

    initEvents();
    getList();
    onReset();
    function initEvents() {
        btns.resetBtn.click(onReset);
        btns.searchBtn.click(onSearch);
    }


    // 搜索
    function onSearch() {
        for (var attr in formDoms) {
            if (formDoms.hasOwnProperty(attr)) {
                tableParams[attr] = formDoms[attr].val();
            }
        }
        reloadList();
    }

    // 重置
    function onReset() {
        tableParams = {
            id: '',
            listenerPhone:'',
            questionerPhone:'',
            answerManPhone: '',
            listenBeginTime: '',
            listenEndTime: '',
            pageNo: 1,
            pageSize: 10
        };
        for (var attr in formDoms) {
            if (formDoms.hasOwnProperty(attr)) {
                formDoms[attr].val('');
            }
        }
        $('.action-date').val('')
        // tableParams.startTime = defaultDate.startDate.unix();
        // tableParams.endTime = defaultDate.endDate.unix();
        // dateRangePicker.setDate(defaultDate.startDate, 'start');
        // dateRangePicker.setDate(defaultDate.endDate, 'end');
    }

    function loadPagination(total) {
        faqPaginations = new FaqPagination({
            el: '.audienceList .paginations',
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

    // 获取列表
    function getList() {
        if (searching) return;
        searching = true;
        ProblemService.getAudienceList(tableParams, function (res) {
            tableDatas = res;
            if (oTable) {
                oTable.reDraw(tableDatas.list || []);
            }else {
                oTable = initTable();
            }
            searching = false;
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
                title: '旁听用户'
            }, {
                data: null,
                title: '关联答案ID',
                render: function(data, type, row) {
                    var dataStr = JSON.stringify(data);
                    var detailLink =''
                    if(data.answerType==1){
                        detailLink = '../published/published.html?id='+data.answerId
                    }else {
                        detailLink = '../replacer/replacer.html?id='+data.answerId
                    }
                    return '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link" type="button">'+ data.answerId +'</a>';
                }
            },  {
                data: 'listenMoney',
                title: '旁听金额'
            },{
                data: 'questionerPhone',
                title: '提问用户'
            }, {
                data: 'answerManPhone',
                title: '答主手机号'
            }],
            afterDraw: function(table) {
                if (!faqPaginations) {
                    loadPagination(tableDatas.total);
                }
                // $(table[0]).find('.btn-change-status').click(onChangeStatus);
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