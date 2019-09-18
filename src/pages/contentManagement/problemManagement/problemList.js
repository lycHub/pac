// var statusName = [{id:0,name:'待支付',url:'../auditing/commonAudit.html?id='}, {id:1,name:'待审核',url:'../auditing/auditing.html?id='}, {id:2,name:'待回答',url:'../auditing/commonAudit.html?id='}, {id:3,name:'答案待审核',url:'../auditing/commonAudit.html?id='}, {id:4,name:'已发布',url:'../auditing/commonAudit.html?id='}, {id:5,name:'审核驳回',url:'../auditing/commonAudit.html?id='}, {id:6,name:'答案审核不通过',url:'../auditing/commonAudit.html?id='}, {id:7,name:'拒绝回答退回',url:'../auditing/commonAudit.html?id='}, {id:8,name:'提问超时退回',url:'../auditing/commonAudit.html?id='}]
var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
// var defaultDate = {
//     startDate: moment().startOf('month'),
//     endDate: moment().endOf('month')
// }
var tableParams = {
    id: '',
    questionerPhone:'',
    answerManPhone:'',
    fieldId: '',
    questionStatus: 1,
    startTime: '',
    endTime: '',
    pageNum: 1,
    pageSize: 10,
    sort: "question_time",
    order: "asc"
};

var oTable = null;
var faqPaginations = null;
var tableDatas = [];
var STATUS_ENUM = [];

// 是否正在search(防重复)
var searching = false;
// 点击的行信息
var rowInfo = null;

var ProblemService = new ProblemService();
$(function () {
    var dateRangePicker = new FaqDateRangePicker({
        el: '.problemList .action-date',
        // startDate: defaultDate.startDate,
        // endDate: defaultDate.endDate,
        onInit: function () {
            $('.action-date').val('')
        },
        onApply: function (dateRange) {
            tableParams.startTime = +moment(dateRange[0]);
            tableParams.endTime = +moment(dateRange[1]);

        },
        clickCancel:function() {
            $('.action-date').val('')
        }
    });


    var formDoms = {
        id: $('.problemList .questionId'),
        questionerPhone: $('.problemList .questionerPhone'),
        answerManPhone: $('.problemList .answerManPhone'),
        questionStatus:$('.problemList .questionStatus'),
        fieldId:$('.problemList .fieldId')
    }

    var btns = {
        resetBtn: $('.btn-reset'),
        searchBtn: $('.btn-search'),
        exportBtn:$('.exportReport')
    }

    // var modalDoms = {
    //     modalBody: $('.domain-modal .modal-body'),
    //     modalConfirmBtn: $('.domain-modal .modal-footer .btn:last')
    // }

    initEvents();
    getList();
    getFilds();
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
        if( formDoms.questionStatus.val()==1){
            tableParams.order = 'asc'
        }else{
            tableParams.order = 'desc'
        }
        reloadList();
    }

    // 重置
    function onReset() {
        tableParams = {
            id: '',
            questionerPhone:'',
            answerManPhone:'',
            fieldId: '',
            questionStatus: 1,
            startTime: '',
            endTime: '',
            pageNum: 1,
            pageSize: 10,
            sort: 'question_time',
            order: 'asc'
        };
        for (var attr in formDoms) {
            if (formDoms.hasOwnProperty(attr)) {
                formDoms[attr].val('');
            }
        }
        formDoms.questionStatus.val(1)
        $('.action-date').val('')
        // tableParams.startTime = defaultDate.startDate.unix();
        // tableParams.endTime = defaultDate.endDate.unix();
        // dateRangePicker.setDate(defaultDate.startDate, 'start');
        // dateRangePicker.setDate(defaultDate.endDate, 'end');
    }

    function loadPagination(total) {
        faqPaginations = new FaqPagination({
            el: '.problemList .paginations',
            total: total,
            pageNumber: tableParams.pageNum,
            pageSize: tableParams.pageSize,
            afterPaging: function(page) {
                tableParams.pageNum = page;
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
        ProblemService.getQuestionList(tableParams, function (res) {
            if (!res) return;
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
        tableParams.order = formDoms.questionStatus.val()==1?'asc':'desc'
        window.location.href= '/qa/question/export.htm?' +
            'id='+ tableParams.id +
            '&fieldId='+tableParams.fieldId+
            '&questionerPhone='+tableParams.questionerPhone+
            '&answerManPhone='+tableParams.answerManPhone+
            '&questionStatus='+tableParams.questionStatus+
            '&startTime='+tableParams.startTime+
            '&endTime='+tableParams.endTime+
        '&pageNum='+tableParams.pageNum+
        '&pageSize='+tableParams.pageSize+
         '&order='+tableParams.order+
        '&sort='+tableParams.sort
    }
    //获取所有非禁用领域
    function getFilds(){
        ProblemService.getDomainList(null,function (res) {
            STATUS_ENUM = res.map(function(item,index){
                return {
                    id:item.id,
                    fieldName: item.fieldName
                }
            });
            var str = '';
            for(var i in STATUS_ENUM){
                str += '<option value="'+STATUS_ENUM[i].id+'">'+STATUS_ENUM[i].fieldName+'</option>'
            }
            formDoms.fieldId.append(str)
        });
    }


    function initTable() {
        return new FaqDataTables({
            el: '.table-wrap .table',
            data: tableDatas.list || [],
            columns: [{
                data: 'id',
                title: '问题ID'
            }, {
                data: 'questionContent',
                title: '问题内容'
            },{
                data: 'questionerPhone',
                title: '提问用户手机号'
            }, {
                data: 'questionTime',
                title: '问题发起时间',
                render: function (time) {
                    return moment(new Date(time)).format('YYYY-MM-DD HH:mm');
                }
            },  {
                data: 'answerManPhone',
                title: '答主手机号'
            },{
                data: 'questionApproveTime',
                title: '问题审核时间',
                render: function (data) {
                    var time = data ==0||null?'': moment(new Date(data)).format('YYYY-MM-DD HH:mm');
                    return time
                }
            }, {
                data: 'fieldName',
                title: '领域'
            }, {
                data: 'questionStatus',
                title: '状态',
                render: function(data) {
                    return statusName[data];
                }
            }, {
                data: 'approveManName',
                title: '审核人'
            },{
                data: null,
                title: '操作',
                render: function(data, type, row) {
                    var recommendCo = data.isRecommend==0?'推荐':'取消推荐'
                    var check = data.questionStatus ==1? '审核':'查看'
                    var detailLink =''
                    if(data.questionStatus ==1){
                        detailLink = '../auditing/auditing.html?id='+data.id
                    }else{
                        detailLink = '../auditing/commonAudit.html?id='+data.id
                    }
                    var dataStr = JSON.stringify(data);
                    if(data.questionStatus==4){
                        return '<a data-info=' + dataStr + ' class="btn btn-link btn-change-status" type="button">'+ recommendCo +'</a>'+
                            '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link " type="button">'+ check +'</a>';
                    }else{
                        return '<a href="'+ detailLink + '" data-info=' + dataStr + ' class="btn btn-link " type="button">'+ check +'</a>';
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
            questionId:rowInfo.id
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
        tableParams.pageNum = 1;
        if(faqPaginations){
            faqPaginations.destory();
            faqPaginations = null;
        }
        getList();
    }
});