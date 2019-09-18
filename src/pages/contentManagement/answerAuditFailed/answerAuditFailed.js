
$(function () {
    var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
    var info = null;
    var doms = {
        questionId:$('.answerAuditFailed .questionId'),
        questionPrice:$('.answerAuditFailed .questionPrice'),
        fieldName:$('.answerAuditFailed .fieldName'),
        questionStatus:$('.answerAuditFailed .questionStatus'),
        questionerPhone:$('.answerAuditFailed .questionerPhone'),
        answerManPhone:$('.answerAuditFailed .answerManPhone'),
        questionTime:$('.answerAuditFailed .questionTime'),
        isAnonymous:$('.answerAuditFailed .isAnonymous'),
        answerName:$('.answerAuditFailed .answerName'),
        answerType:$('.answerAuditFailed .answerType'),
        answerTime:$('.answerAuditFailed .answerTime'),

        questionContent:$('.answerAuditFailed .questionContent'),
        questionApproveStaus:$('.answerAuditFailed .questionApproveStaus'),
        approveTime:$('.answerAuditFailed .approveTime'),
        approveManName:$('.answerAuditFailed .approveManName'),

        answerTime:$('.answerAuditFailed .answerTime'),
        wordNumber:$('.answerAuditFailed .wordNumber'),
        editAnswer:$('.answerAuditFailed .editAnswer'),

        answerApproveStaus:$('.answerAuditFailed .answerApproveStaus'),
        answerApproveTime:$('.answerAuditFailed .answerApproveTime'),
        answerApproveMan:$('.answerAuditFailed .answerApproveMan'),
        approveContent:$('.answerAuditFailed .approveContent')

    }
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var problemService = new ProblemService();
    getInfo()
    //获取信息
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
            doms.answerType.html(info.answerType ==0?'平台':'答主' )
            doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))

            doms.questionContent.html(info.questionContent)
            doms.questionApproveStaus.html(info.questionApproveStatus==1?'审核通过':'审核不通过')
            doms.approveTime.html(moment(info.approveTime).format('YYYY-MM-DD HH:mm'))
            doms.approveManName.html(info.approveManName)

            doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
            doms.wordNumber.html(info.wordNumber)
            doms.editAnswer.find('textarea').val(info.answerContent)

            doms.answerApproveStaus.html(info.answerApproveStatus==1?'审核通过':'审核不通过')
            doms.answerApproveTime.html(moment(info.answerApproveTime).format('YYYY-MM-DD HH:mm'))
            doms.answerApproveMan.html(info.answerApproveMan)
            doms.approveContent.html(info.approveContent)
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
            var hgt1 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt1+'px',
                'line-height':hgt1+'px'
            })
        });
    }
    //点击返回
    $('.btnBack').click(function () {
        history.back();
    })
})
