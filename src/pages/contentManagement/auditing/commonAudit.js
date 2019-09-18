
$(function () {
    var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
    var info = null;
    var doms = {
        id:$('.auditing .questionId'),
        questionPrice:$('.auditing .questionPrice'),
        fieldName:$('.auditing .fieldName'),
        questionStatus:$('.auditing .questionStatus'),
        questionerPhone:$('.auditing .questionerPhone'),
        answerManPhone:$('.auditing .answerManPhone'),
        questionTime:$('.auditing .questionTime'),
        isAnonymous:$('.auditing .isAnonymous'),
        questionContent:$('.auditing .questionContent'),

        approveStatus:$('.auditing .approveStatus'),
        approveTime:$('.auditing .approveTime'),
        approveManName:$('.auditing .approveManName'),
        approveContent:$('.auditing .approveContent'),

        answerStatus:$('.auditing .answerStatus'),
        answerContent:$('.auditing .answerContent'),
        answerTime:$('.auditing .answerTime'),
        refuseAnswerReason:$('.auditing .refuseAnswerReason'),

        answerApproveStatus:$('.auditing .answerApproveStatus'),
        answerApproveTime:$('.auditing .answerApproveTime'),
        answerApproveManName:$('.auditing .answerApproveManName'),
        answerApproveContent:$('.auditing .answerApproveContent')
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
            doms.id.html(info.id)
            doms.questionPrice.html(info.questionPrice)
            doms.fieldName.html(info.fieldName)
            doms.questionStatus.html(statusName[info.questionStatus])
            doms.questionerPhone.html(info.questionerPhone)
            doms.answerManPhone.html(info.answerManPhone)
            doms.questionContent.html(info.questionContent)
            doms.questionTime.html(moment(info.questionTime).format('YYYY-MM-DD HH:mm'))
            doms.isAnonymous.html(info.isAnonymous==1?'是':'否')

            doms.approveStatus.html(info.approveStatus ==1? '审核通过':'审核不通过')
            if (info.approveTime) {
                doms.approveTime.html(moment(info.approveTime).format('YYYY-MM-DD HH:mm'))
            }
            
            doms.approveManName.html(info.approveManName)
            if(info.approveContent){
                doms.approveContent.show()
                doms.approveContent.text(info.approveContent)
            }
            if(info.questionStatus==0){
                document.title = '待支付'
                $('.platformAudit').hide()
            }else if(info.questionStatus==1){
                document.title = '待审核'
            }else if(info.questionStatus==2){
                document.title = '待回答'
                $('.answerAudit').show()
                $('.answering').html('等待答主回答中。。。')
            }else if(info.questionStatus==3){
                document.title = '答案待审核'
                $('.answerAuditContent').show()
                $('.platformAuditAnswer').show()
                doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
                doms.answerContent.html(info.answerContent)
                $('.advise').html('等待平台审核答案中。。。').css({'line-height':'80px'})
            }else if(info.questionStatus==4){
                document.title = '已发布'
                if(info.answerType==0){
                    $('.answerAuditContent').show()
                    doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
                    doms.answerContent.html(info.answerContent)
                }else{
                    $('.answerAuditContent').show()
                    $('.platformAuditAnswer').show()
                    doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
                    doms.answerContent.html(info.answerContent)
                    doms.answerApproveStatus.html(info.answerApproveStatus ==1? '审核通过':'审核不通过')
                    if (info.answerApproveTime) {
                        doms.answerApproveTime.html(moment(info.answerApproveTime).format('YYYY-MM-DD HH:mm'))
                    }
                    
                    doms.answerApproveManName.html(info.answerApproveManName)
                }
            }else if(info.questionStatus==5){
                document.title = '审核驳回'
            }else if(info.questionStatus==6){
                document.title = '答案审核不通过'
                $('.platformAudit').show()
                $('.answerAuditContent').show()
                $('.platformAuditAnswer').show()
                $('.adviceContent,.adviceContent1').css({'padding-top':'15px'})
                doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
                doms.answerContent.html(info.answerContent)

                doms.answerApproveStatus.html(info.answerApproveStatus ==1? '审核通过':'审核不通过')
                if (info.answerApproveTime) {
                    doms.answerApproveTime.html(moment(info.answerApproveTime).format('YYYY-MM-DD HH:mm'))
                }
                
                doms.answerApproveManName.html(info.answerApproveManName)
                doms.answerApproveContent.html(info.answerApproveContent)
            }else if(info.questionStatus==7){ //修改拒绝回答退回
                document.title = '拒绝回答退回'
                $('.answerAudit').show()
                $('.answering').css({'line-height':'1'})
                doms.answerStatus.html('拒绝回答')
                doms.answerTime.html(moment(info.answerTime).format('YYYY-MM-DD HH:mm'))
                doms.refuseAnswerReason.html(info.refuseAnswerReason)
            }else if(info.questionStatus==8){
                document.title = '提问超时退回'
            }
            var hgt = $('.questionContent').outerHeight()
            $('.question').css({
                'height':hgt+'px',
                'line-height':hgt+'px'
            })
            var hgt1 = $('.adviceContent').outerHeight()
            $('.advice').css({
                'height':hgt1+'px',
                'line-height':hgt1+'px'
            })
            var hgt2 = $('.answerContent1').outerHeight()
            $('.answer1').css({
                'height':hgt2+'px',
                'line-height':hgt2+'px'
            })
            var hgt3 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt3+'px',
                'line-height':hgt3+'px'
            })
            var hgt4 = $('.answerContent2').outerHeight()
            $('.answer2').css({
                'height':hgt4+'px',
                'line-height':hgt4+'px'
            })
        });
    }

    //点击返回
    $('.btnBack').click(function () {
        history.back();
    })

})
