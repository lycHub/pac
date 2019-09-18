
$(function () {
    var statusName = {'1':'答案待审核','2':'已发布','9':'答案审核不通过'}
    var info = null;
    var doms = {
        answerId:$('.answerReviewed .answerId'),
        answerStatus:$('.answerReviewed .answerStatus'),
        answerName:$('.answerReviewed .answerName'),
        answerManPhone:$('.answerReviewed .answerManPhone'),
        questionId:$('.answerReviewed .questionId'),
        questionContent:$('.answerReviewed .questionContent'),

        questionApproveStatus:$('.answerReviewed .questionApproveStatus'),
        approveTime:$('.answerReviewed .approveTime'),
        approveManName:$('.answerReviewed .approveManName'),

        answerTime:$('.answerReviewed .answerTime'),
        wordNumber:$('.answerReviewed .wordNumber'),
        editAnswer:$('.answerReviewed .editAnswer'),

        isRecommend:$('.answerReviewed .isRecommend'),
        isFirst:$('.answerReviewed .isFirst'),
    }
    var isRecommend = 0;
    var isFirst = 0;
    var answerApproveStatus = 1;
    var wordsLen = 0;
    var frameUrl = $('#main_frame').context.URL
    var num = frameUrl.indexOf('id=')+3
    var id = frameUrl.substring(num)
    var problemService = new ProblemService();
    getInfo()
    //获取信息
    function getInfo(){
        problemService.getInfo(id, function (res) {
            info = res;
            doms.answerId.html(info.answerId)
            doms.answerStatus.html(statusName[info.answerStatus])
            doms.answerName.html(info.answerName)
            doms.answerManPhone.html(info.answerManPhone)
            doms.questionId.html(info.questionId)
            doms.questionContent.html(info.questionContent)

            doms.questionApproveStatus.html(info.questionApproveStatus ==1?'审核通过':'审核不通过')
            doms.approveTime.html(moment(info.approveTime).format('YYYY-MM-DD HH:mm'))
            doms.approveManName.html(info.approveManName)

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

    //编辑答案
    $('.editAnswer textarea').on("propertychange input", function() {
       // $(this).val()
        wordsLen = doms.editAnswer.find('textarea').val().length;
        doms.wordNumber.html(wordsLen)
        $(this).parent().next().hide()
        var hgt7 = $('.answerContent').outerHeight()
        $('.answer').css({
            'height':hgt7+'px',
            'line-height':hgt7+'px'
        })
    })
    //编辑平台不通过意见
    $('.idea textarea').on("propertychange input", function() {
        if($('.idea textarea').val()!=''){
            $('.idea').find('.verify').hide()
            var hgt4 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt4+'px',
                'line-height':hgt4+'px'
            })
        }else{
            $('.idea').find('.verify').show()
            var hgt5 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt5+'px',
                'line-height':hgt5+'px'
            })
        }
    })
    //切换通过样式
    $('.pass input').on('click',function(){
        if($(this).next('span').html() == '不通过'){
            answerApproveStatus = 0
            $('.idea').show()
            var hgt3 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt3+'px',
                'line-height':hgt3+'px'
            })
        }else{
            answerApproveStatus = 1
            $('.idea').hide()
            hgt3 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt3+'px',
                'line-height':hgt3+'px'
            })
        }
    })
    //点击返回
    $('.btnBack').click(function () {
        history.back();
    })

    //点击提交
    $('.submit').on('click',function(){
        if($('.isPass').find('input[type="radio"]:checked').next('span').html()=='不通过'&&$('.idea textarea').val()==''){
            $('.idea').find('.verify').show()
           var hgt4 = $('.adviceContent1').outerHeight()
            $('.advice1').css({
                'height':hgt4+'px',
                'line-height':hgt4+'px'
            })
            return;
        }else{
            editBusiness()
        }

    })
    function editBusiness() {
        var form = {
            approveContent:$('.idea').find('textarea').val(),
            answerId: doms.answerId.html(),
            isFirst:isFirst,
            isRecommend:isRecommend,
            approveStatus:answerApproveStatus
        }
        var con ='';
        if(answerApproveStatus==1){
            con = '审核通过则问答内容直接发布'
        }else{
            con = '审核未通过则变为答案审核被拒状态'
        }

        bootbox.dialog({
            message: con,
            title: '提示',
            className: "modalCon",
            buttons: {
                success: {
                    label: "确认",
                    className: "btn-primary",
                    callback: function () {
                        problemService.aprroveSubmit(form,function(res){
                            if (res.status == 200) {
                                alert('提交成功')
                                history.back();
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

    // 数据格式转换 json转formData
     function formData (data) {
        var ret = ''
        for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }
    //点击保存
    $('.save').click(function(){
        var val = doms.editAnswer.find('textarea').val().replace(/\s/g, '');
        if(val.length >= 30 && val.length <= 2000){
            var form = {
                editAnswerConent: val,
                answerId: Number(doms.answerId.html()),
            }
            problemService.editAnswer(formData(form),function(res){
                if (res.status == 200) {
                    alert('保存成功')
                } else {
                    alert(res.message || '保存失败')
                }
            })
        }else{
            $(this).prev().show()
            var hgt6 = $('.answerContent').outerHeight()
            $('.answer').css({
                'height':hgt6+'px',
                'line-height':hgt6+'px'
            })
        }
    })


})
