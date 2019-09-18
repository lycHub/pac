
$(function () {
    var statusName = ['待支付', '待审核', '待回答', '答案待审核', '已发布', '审核驳回', '答案审核不通过', '拒绝回答退回','提问超时退回']
    var info = null;
    var doms = {
        id:$('.replyAnswer .questionId'),
        questionPrice:$('.replyAnswer .questionPrice'),
        fieldName:$('.replyAnswer .fieldName'),
        questionStatus:$('.replyAnswer .questionStatus'),
        questionerPhone:$('.replyAnswer .questionerPhone'),
        answerManPhone:$('.replyAnswer .answerManPhone'),
        questionTime:$('.replyAnswer .questionTime'),
        isAnonymous:$('.replyAnswer .isAnonymous'),
        questionContent:$('.replyAnswer .questionContent'),

        answerUserName:$('.replyAnswer .answerUserName'),
        answerContent:$('.replyAnswer .answerContent'),

        isRecommend:$('.replyAnswer .isRecommend'),
        isFrist:$('.replyAnswer .isFrist'),
    }
    var isRecommend = 0;
    var isFrist = 0;
    var isNum = 0;
    var wordsLen = 0;
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var problemService = new ProblemService();
    getInfo()
    getLoginInfo()
    function getLoginInfo() {
        problemService.getLoginInfo(function (res) {
            $('.userName').html(res.name)
        })
    }
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

            doms.answerUserName.text(info.answerUserName)
            doms.answerContent.find('textarea').val(info.answerContent)

            doms.isFrist.find('input').eq(info.isFrist==1? 0:1).attr('checked',true)
            doms.isRecommend.find('.recommend input').attr('checked',info.isRecommend==1? true:false)

            isRecommend = info.isRecommend
            isFrist = info.isFrist

            isNum = info.isFrist

            wordsLen = doms.answerContent.find('textarea').val().length
            $('.idea .num span').html(wordsLen)
            var hgt = $('.questionContent').outerHeight()
            $('.question').css({
                'height':hgt+'px',
                'line-height':hgt+'px'
            })
            var hgt1 = $('.answerContent').outerHeight()
            $('.advice').css({
                'height':hgt1+'px',
                'line-height':hgt1+'px'
            })
        });
    }
    // 推荐
    $('.recommend').click(function(){
        if($(this).find('input').is(':checked')){
            isRecommend = 1
        }else{
            isRecommend = 0

        }
    })
    //切换显示
    var flag = isNum ;
    $('.isFrist .radio').click(function(){
        var i = $('.isFrist .radio').index(this)
        if(i == flag){
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
                            isFrist = isNum==0?1:0
                            // $('.isFrist .radio').eq(inverse(i)).find('input').attr('checked',false)
                            // $('.isFrist .radio').eq(i).find('input').attr('checked',true)
                        }
                    },
                    "取消": {
                        className: "btn-primary",
                        callback: function () {
                            // $('.isFrist .radio').eq(i).find('input').attr('checked',false)
                            // $('.isFrist .radio').eq(inverse(i)).find('input').attr('checked',true)
                        }
                    }
                },
            });
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
                            isFrist = isNum==0?0:1
                            // $('.isFrist .radio').eq(inverse(i)).find('input').attr('checked',false)
                            // $('.isFrist .radio').eq(i).find('input').attr('checked',true)

                        }
                    },
                    "取消": {
                        className: "btn-primary",
                        callback: function () {
                            // $('.isFrist .radio').eq(i).find('input').attr('checked',false)
                            // $('.isFrist .radio').eq(inverse(i)).find('input').attr('checked',true)
                        }
                    }
                },
            });
        }

    })
    //编辑答案
    $('.idea textarea').on("propertychange input", function() {
        wordsLen = $(this).val().replace(/\s/g, '').length;
        $('.idea .num span').html(wordsLen)
    })
    //点击返回
    $('.btnBack').click(function () {
        history.back();
    })
    //点击提交
    $('.submit').on('click',function(){
        if(wordsLen >= 30 && wordsLen <= 2000){
            editBusiness()
        }else{
        $('.tip').show()
            var hgt2 = $('.answerContent').outerHeight()
            $('.advice').css({
                'height':hgt2+'px',
                'line-height':hgt2+'px'
            })
            return;
        }
    })
    function editBusiness() {
          var form = {
                  answerContent:doms.answerContent.find('textarea').val(),
                  id: doms.id.html(),
                  isFrist:isFrist,
                  isRecommend:isRecommend,
                  submit:true
            }
        bootbox.dialog({
            message: "提交后将自动发布，无需再次审核答案",
            title: '提示',
            className: "modalCon",
            buttons: {
                success: {
                    label: "确认",
                    className: "btn-primary",
                    callback: function () {
                        problemService.saveAnswerByAdmin(form,function(res){
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

    //点击保存
    $('.save').click(function(){
        var form = {
                answerContent:doms.answerContent.find('textarea').val(),
                id: doms.id.html(),
                submit:false
        }
        problemService.saveAnswerByAdmin(form,function(res){
            if (res.status == 200) {
                alert('保存成功')
                window.location.href = '../problemManagement/problemList.html'
            } else {
                alert(res.message)
            }
        })

    })


})
