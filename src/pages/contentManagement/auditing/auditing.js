
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
        approveContent:$('.auditing .approveContent')
    }
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var problemService = new ProblemService();
    var replyAnswerUrl = '../replyAnswer/replyAnswer.html?id='+id
    $('.replyAnswer').attr('href',replyAnswerUrl)
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
            // var hgt2 = $('.answer-content').outerHeight()
            // $('.answer').css({
            //     'height':hgt2+'px',
            //     'line-height':hgt2+'px'
            // })
        });
    }

$('.pass input').on('click',function(){
    if($(this).next('span').html() == '不通过'){
        $('.idea').show()
        var hgt3 = $('.adviceContent').outerHeight()
        $('.advice').css({
            'height':hgt3+'px',
            'line-height':hgt3+'px'
        })
    }else{
        $('.idea').hide()
         hgt3 = $('.adviceContent').outerHeight()
        $('.advice').css({
            'height':hgt3+'px',
            'line-height':hgt3+'px'
        })
    }
})

    //编辑平台不通过意见
    $('.idea textarea').on("propertychange input", function() {
        if($('.idea textarea').val().replace(/\s/g, '') != ''){
            $('.idea').find('.verify').hide()
            var hgt4 = $('.adviceContent').outerHeight()
            $('.advice').css({
                'height':hgt4+'px',
                'line-height':hgt4+'px'
            })
        }else{
            $('.idea').find('.verify').show()
            var hgt5 = $('.adviceContent').outerHeight()
            $('.advice').css({
                'height':hgt5+'px',
                'line-height':hgt5+'px'
            })
        }
    })
    //点击返回
  $('.btnBack').click(function () {
      history.back();
  })

    // 数据格式转换 json转formData
    function formData (data) {
        var ret = ''
        for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }


    //点击弹窗
$('.submit').on('click',function(){
    if($('.pass').find('input[type="radio"]:checked').next('span').html()=='不通过'&& !$('.idea textarea').val().replace(/\s/g, '').length){
        $('.idea').find('.verify').show()
        var hgt6 = $('.adviceContent').outerHeight()
        $('.advice').css({
            'height':hgt6+'px',
            'line-height':hgt6+'px'
        })
        return;
    }else{
        editBusiness()
    }
})
    function editBusiness() {
        var con = $("input[type='radio']:checked").next().html()
        var form = {}
        if(con=='通过'){
            form = {
                approveStatus:true,
                id:Number(doms.id.html())
            }
        }else{
            form = {
                approveContent:doms.approveContent.val(),
                approveStatus:false,
                id:Number(doms.id.html())
             }
        }
        bootbox.dialog({
            message: "问题审核" + con,
            title: '提示',
            className: "modalCon",
            buttons: {
                success: {
                    label: "确认",
                    className: "btn-primary",
                    callback: function () {
                        problemService.submitApprove(formData(form),function(res){
                            if (res.status == 200) {
                                alert('提交成功')
                                window.location.href = '../problemManagement/problemList.html'
                            } else {
                                alert(res.message)
                            }
                        })
                    }
                },
                "取消": {
                    className: "btn-primary",
                    callback: function () {

                    }
                }
            },
        });
    }



})
