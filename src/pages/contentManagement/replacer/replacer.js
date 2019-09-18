$(function () {
    var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
    var info = null;
    var doms = {
        questionId:$('.replacer .questionId'),
        questionPrice:$('.replacer .questionPrice'),
        fieldName:$('.replacer .fieldName'),
        questionStatus:$('.replacer .questionStatus'),
        questionerPhone:$('.replacer .questionerPhone'),
        answerManPhone:$('.replacer .answerManPhone'),
        questionTime:$('.replacer .questionTime'),
        isAnonymous:$('.replacer .isAnonymous'),
        answerName:$('.replacer .answerName'),
        answerType:$('.replacer .answerType'),
        answerTime:$('.replacer .answerTime'),

        questionContent:$('.replacer .questionContent'),

        approveManName:$('.replacer .approveManName'),

        answerTime:$('.replacer .answerTime'),
        wordNumber:$('.replacer .wordNumber'),
        editAnswer:$('.replacer .editAnswer'),

        isRecommend:$('.replacer .isRecommend'),
        isFirst:$('.replacer .isFirst'),

    }
    var tableDatas = []
    var isRecommend = 0;
    var isFirst = 0;
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var listReadUrl = '../audienceDetails/audienceDetails.html?id='+id
    $('.listRead').find('a').attr('href',listReadUrl)
    var problemService = new ProblemService();
    getInfo()
    listRead()
    answerLog()
    //tab切换
    $('.nav-tab li').click(function(){
        var i = $('.nav-tab li').index(this)
        $(this).addClass('active').siblings('li').removeClass('active')
        $('.form').eq(i).show().siblings('.form').hide()
    })

    // 推荐
    $('.recommend').click(function(){
        if($(this).find('input').is(':checked')){
            isRecommend = 1
        }else{
            isRecommend = 0

        }
    })
    // 数据信息
    function getInfo(){
        problemService.getInfo(id, function (res) {
            info = res;
            doms.questionId.html(info.questionId)
            doms.questionPrice.html(info.questionPrice)
            doms.fieldName.html(info.fieldName)
            doms.questionStatus.html(statusName[info.questionStatus])
            doms.questionerPhone.html(info.questionerPhone)
            doms.answerManPhone.html(info.answerManPhone)

            doms.questionTime.html(moment(info.questionTime).format('YYYY-MM-DD HH:mm'))
            doms.isAnonymous.html(info.isAnonymous==1?'是':'否')
            doms.answerName.html(info.answerName)
            doms.answerType.html(info.answerType ==0?'代替回答':'答主' )
            doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))

            doms.questionContent.html(info.questionContent)

            doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
            doms.wordNumber.html(info.wordNumber)
            doms.editAnswer.find('textarea').val(info.answerContent)


            doms.isFirst.find('input').eq(info.isFirst==1? 0:1).attr('checked',true)
            doms.isRecommend.find('.recommend input').attr('checked',info.isRecommend==1? true:false)

            isRecommend = info.isRecommend
            isFirst = info.isFirst
            
            var hgt = $('.questionContent').outerHeight()
            $('.question').css({
                'height':hgt+'px',
                'line-height':hgt+'px'
            })
            var hgt1 = $('.answerContent').outerHeight()
            $('.answer').css({
                'height':hgt1+'px',
                'line-height':hgt1+'px'
            })
            var hgt2 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt2+'px',
                'line-height':hgt2+'px'
            })
        });
    }


    //切换显示
//切换显示
    $('.isFirst .radio').first().click(function(){
        if(isFirst == 1){
            return
        }else{
            bootbox.dialog({
                message: "提交后首页显示的提问内容状态将改变，请谨慎选择",
                title: '提示',
                className: "modalCon1",
                closeButton: false,
                buttons: {
                    success: {
                        label: "确认",
                        className: "btn-primary",
                        callback: function () {
                            isFirst = 1
                        }
                    },
                    "取消": {
                        className: "btn-primary",
                        callback: function () {
                            isFirst = 0
                            $('.isFirst .radio:last').find('input')[0].checked = true
                        }
                    }
                },
            });
        }
    })
    $('.isFirst .radio').last().click(function(){
        if(isFirst == 0){
            return
        }else{
            bootbox.dialog({
                message: "提交后首页显示的提问内容状态将改变，请谨慎选择",
                title: '提示',
                className: "modalCon1",
                closeButton: false,
                buttons: {
                    success: {
                        label: "确认",
                        className: "btn-primary",
                        callback: function () {
                            isFirst = 0
                        }
                    },
                    "取消": {
                        className: "btn-primary",
                        callback: function () {
                            isFirst = 1
                            $('.isFirst .radio:first').find('input')[0].checked = true

                        }
                    }
                },
            });
        }
    })
    //点击返回
    $('.btnBack').click(function () {
        history.back();
    })

    //点击提交
    $('.submit').on('click',function(){
        var form = {
            questionId: doms.questionId.html(),
            isFirst:isFirst,
            isRecommend:isRecommend,
        }
        problemService.updataStaus(form,function(res){
            if (res.status == 200) {
                alert('提交成功')
            } else {
                alert(res.message)
            }
        })
    })

    //旁听量
    function listRead() {
        var form = {
            answerId: id
        }
        problemService.listReadzan(form,function(res){
            $('.listRead').find('a').html(res.listenTotal)
            $('.zan').html(res.zan)
        })
    }
    //日志
    function answerLog() {
        var form ={
            answerId: id
        }
        problemService.answerLog(form,function(res){
            if(res){
                tableDatas.push(res)
            }else{
                tableDatas =[]
            }
            initTable()
        })
    }
    function initTable() {
        return new FaqDataTables({
            el: '.table-wrap .table',
            data: tableDatas || [],
            columns: [{
                data: 'approveMan',
                title: '审核人'
            }, {
                data: 'type',
                title: '类型',
                render: function (data) {
                    return data == 0?'替答主回答':'修改答案'
                }
            },{
                data: 'lastAccess',
                title: '操作时间',
                render: function (time) {
                    return moment(new Date(time)).format('YYYY-MM-DD HH:mm');
                }
            }, {
                data: 'answerContent',
                title: '答主答案'
            },{
                data: 'changeAnswerContent',
                title: '管理员修改后答案'
            }],
            afterDraw: function(table) {

            }
        });
    }
})
