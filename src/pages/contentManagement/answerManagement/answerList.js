var statusName = {'1':'答案待审核','2':'已发布','9':'答案审核不通过'}
//
// var defaultDate = {
//     startDate: moment().startOf('month'),
//     endDate: moment().endOf('month')
// }
var tableParams = {
    answerManPhone: '',
    questionId:'',
    isRecommend:'',
    answerType: '1',
    answerStatus: '1',
    startTime: '',
    endTime: '',
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
        el: '.answerList .action-date',
        // startDate: defaultDate.startDate,
        // endDate: defaultDate.endDate,
        onInit: function () {
            $('.action-date').val('')
        },
        onApply: function (dateRange) {
            tableParams.startTime = +moment(dateRange[0]);
            tableParams.endTime = +moment(dateRange[1]);
        }
    });


    var formDoms = {
        answerManPhone: $('.answerList .answerManPhone'),
        questionId: $('.answerList .questionId'),
        isRecommend: $('.answerList .isRecommend'),
        answerType:$('.answerList .answerType'),
        answerStatus:$('.answerList .answerStatus')
    }

    var btns = {
        resetBtn: $('.btn-reset'),
        searchBtn: $('.btn-search'),
        exportBtn:$('.exportReport')
    }

    initEvents();
    getList();
    onReset();
    function initEvents() {
        btns.resetBtn.click(onReset);
        btns.searchBtn.click(onSearch);
        btns.exportBtn.click(exportReport)
    }


    // 搜索
    function onSearch() {
        for (var attr in formDoms) {
            if (formDoms.hasOwnProperty(attr)) {
                tableParams[attr] = formDoms[attr].val();
            }
        }
        tableParams.isRecommend = tableParams.isRecommend==0?'':tableParams.isRecommend
        reloadList();
    }

    // 重置
    function onReset() {
        tableParams = {
            answerManPhone: '',
            questionId:'',
            isRecommend:'',
            answerType: '1',
            answerStatus: '1',
            startTime: '',
            endTime: '',
            pageNo: 1,
            pageSize: 10
        };
        for (var attr in formDoms) {
            if (formDoms.hasOwnProperty(attr)) {
                formDoms[attr].val('');
            }
        }
        formDoms.isRecommend.val('0')
        formDoms.answerType.val('1')
        formDoms.answerStatus.val('1')
        $('.action-date').val('')
        // tableParams.startTime = defaultDate.startDate.unix();
        // tableParams.endTime = defaultDate.endDate.unix();
        // dateRangePicker.setDate(defaultDate.startDate, 'start');
        // dateRangePicker.setDate(defaultDate.endDate, 'end');
    }

    function loadPagination(total) {
        faqPaginations = new FaqPagination({
            el: '.answerList .paginations',
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
        ProblemService.getAnswerList(tableParams, function (res) {
            tableDatas = res;
            if (oTable) {
                oTable.reDraw(tableDatas.list || []);
            }else {
                oTable = initTable();
            }
            searching = false;
        });
    }
    //导出
    function exportReport() {
        window.location.href= '/qa/answer/answer_export.htm?' +
            'isRecommend='+ tableParams.isRecommend +
            '&answerType='+tableParams.answerType+
            '&questionId='+tableParams.questionId+
            '&answerManPhone='+tableParams.answerManPhone+
            '&answerStatus='+tableParams.answerStatus+
            '&startTime='+tableParams.startTime+
            '&endTime='+tableParams.endTime+
            '&pageNo='+tableParams.pageNo+
            '&pageSize='+tableParams.pageSize
    }

    function initTable() {
        return new FaqDataTables({
            el: '.table-wrap .table',
            data: tableDatas.list || [],
            columns: [{
                data: 'id',
                title: '答案ID'
            }, {
                data: 'questionContent',
                title: '对应问题'
            },{
                data: 'questionId',
                title: '关联问题ID',
                render: function(data) {
                    var detailLink = '../auditing/commonAudit.html?id='+data
                    return '<a href="'+ detailLink + '" class="btn btn-link" type="button">'+ data+'</a>';
                }
            }, {
                data: null,
                title: '答主',
                render: function(data) {
                    var detailLink = '../../userManager/answerInfo/answerInfo.html?id='+data.answerManId
                    var dataStr = JSON.stringify(data);
                    return '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link" type="button">'+ data.answerManPhone+'</a>';
                }
            },  {
                data: 'answerTime',
                title: '回答时间',
                render: function (time) {
                    return moment(new Date(time)).format('YYYY-MM-DD HH:mm');
                }
            },{
                data: 'listenTotal',
                title: '旁听量'
            }, {
                data: 'answerType',
                title: '答案来源',
                render: function(data) {
                    return data == 0?'平台':'答主';
                }
            }, {
                data: 'isRecommend',
                title: '栏目',
                render: function(data) {
                    return  data == 0?'全部':'全部,推荐';
                }
            }, {
                data: 'isFrist',
                title: '首页展示',
                render: function(data) {
                    return data == 0?'否':'是';
                }
            },{
                data: null,
                title: '审核人/审核时间',
                render: function(data) {
                    var name = data.approveManName==null? '': data.approveManName
                    var time = data.answerApproveTime == null||0? '': moment(new Date(data.answerApproveTime)).format('YYYY-MM-DD HH:mm')
                    return '<div>'+ name +'</div>'+'<div>'+time+'</div>'
                }
            },{
                data: 'status',
                title: '答案状态',
                render: function(data) {
                    return statusName[data]
                }
            },{
                data: null,
                title: '操作',
                render: function(data, type, row) {
                    var dataStr = JSON.stringify(data);
                    var recommendCo = data.isRecommend==0?'推荐':'取消推荐'
                    var detailLink =''
                    if(data.status==1){
                        detailLink = '../answerReviewed/answerReviewed.html?id='+data.id
                        return '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link" type="button">'+ '审核' +'</a>';
                    }else if(data.status ==2){
                        if(data.answerType==1){
                            detailLink = '../published/published.html?id='+data.id
                        }else{
                            detailLink = '../replacer/replacer.html?id='+data.id
                        }
                        return '<a data-info=' + dataStr + ' class="btn btn-link btn-change-status" type="button">'+ recommendCo +'</a>'+
                            '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link" type="button">'+ '查看' +'</a>';
                    }else{
                        detailLink = '../answerAuditFailed/answerAuditFailed.html?id='+data.id
                        return '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link" type="button">'+ '查看' +'</a>';
                    }
                }
            }],
            afterDraw: function(table) {
                if (!faqPaginations) {
                    loadPagination(tableDatas.total);
                }
                $(table[0]).find('.btn-change-status').click(onChangeStatus);
            }
        });
    }
    //改变状态
    function onChangeStatus() {
       var rowInfo = $(this).data('info');
       var form = {
           isRecommend:rowInfo.isRecommend==0?1:0,
           questionId:rowInfo.questionId
       }
        ProblemService.updataStaus(form, function (res) {
            if(res.status==200){
                reloadList()
            }else{
                alert(res.message)
            }
        })
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