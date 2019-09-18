$(function () {
    var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
    var info = null;
    var doms = {
        questionId:$('.published .questionId'),
        questionPrice:$('.published .questionPrice'),
        fieldName:$('.published .fieldName'),
        questionStatus:$('.published .questionStatus'),
        questionerPhone:$('.published .questionerPhone'),
        answerManPhone:$('.published .answerManPhone'),
        questionTime:$('.published .questionTime'),
        isAnonymous:$('.published .isAnonymous'),
        answerName:$('.published .answerName'),
        answerType:$('.published .answerType'),
        answerTime:$('.published .answerTime'),

        questionContent:$('.published .questionContent'),
        questionApproveStatus:$('.published .questionApproveStatus'),
        approveTime:$('.published .approveTime'),
        approveManName:$('.published .approveManName'),

        answerTime1:$('.published .answerTime1'),
        wordNumber:$('.published .wordNumber'),
        editAnswer:$('.published .editAnswer'),

        answerApproveStatus:$('.published .answerApproveStatus'),
        answerApproveTime:$('.published .answerApproveTime'),
        answerApproveMan:$('.published .answerApproveMan'),
        approveContent:$('.published .approveContent'),

        isRecommend:$('.published .isRecommend'),
        isFirst:$('.published .isFirst'),

    }
    var tableDatas = []
    var isRecommend = 0;
    var isFirst = 0;
    var isNum = 0;
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

            doms.questionTime.html(moment(info.questionTime).format('YYYY-MM-DD'))
            doms.isAnonymous.html(info.isAnonymous==1?'是':'否')
            doms.answerName.html(info.answerName)
            doms.answerType.html(info.answerType ==0?'平台':'答主' )
            doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD'))

            doms.questionContent.html(info.questionContent)
            doms.questionApproveStatus.html(info.questionApproveStatus==1?'审核通过':'审核不通过')
            doms.approveTime.html(moment(info.approveTime).format('YYYY-MM-DD'))
            doms.approveManName.html(info.approveManName)

            doms.answerTime1.html(moment(info.answerTime).format('YYYY-MM-DD'))
            doms.wordNumber.html(info.wordNumber)
            doms.editAnswer.find('textarea').val(info.answerContent)

            doms.answerApproveStatus.html(info.answerApproveStatus==1?'审核通过':'审核不通过')
            doms.answerApproveTime.html(moment(info.answerApproveTime).format('YYYY-MM-DD'))
            doms.answerApproveMan.html(info.answerApproveMan)
            doms.approveContent.html(info.approveContent)

            doms.isFirst.find('input[type="radio"]').eq(info.isFirst==1 ? 0:1).attr('checked',true)

            doms.isRecommend.find('.recommend input').attr('checked',info.isRecommend==1? true:false)

            isRecommend = info.isRecommend
            isFirst = info.isFirst

            isNum = info.isFirst
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
                history.back();
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
