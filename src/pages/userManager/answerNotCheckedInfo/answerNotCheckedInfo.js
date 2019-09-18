var STATUS_ENUM = ['待审核', '未通过', '通过'];

var id = url('?id');

var userServe = new UserService();
$(function () {
  if (id) {
    userServe.getAnswerInfo(id, function (res) {
      if (res.status === '200') {
        var info = res.response || {};
        console.log('info :', info);
        $('.answerNotCheckedInfo .phoneNumber').text(info.phoneNumber);
        $('.answerNotCheckedInfo .company').text(info.company);
        $('.answerNotCheckedInfo .userName').text(info.userName);
        $('.answerNotCheckedInfo .nickName').text(info.nickName);
        $('.answerNotCheckedInfo .job').text(info.job);
        $('.answerNotCheckedInfo .workYear').text(info.workYear + '年');
        var money = info.questionMoney > 0 ? info.questionMoney + '元' : '免费';
        $('.answerNotCheckedInfo .questionMoney').text(money);
        $('.answerNotCheckedInfo .card img').attr('src', info.cardAddress);
        $('.answerNotCheckedInfo .personalProfile').text(info.personalProfile);

        // 审核信息
        $('.answerNotCheckedInfo .check-status').text(STATUS_ENUM[info.status]);
        if (info.approveTime) {
          $('.answerNotCheckedInfo .check-time').text(moment(new Date(info.approveTime)).format('YYYY-MM-DD HH:mm'));  // 2019-06-04 15:24
        }

        if (info.approveMan) {
          $('.answerNotCheckedInfo .check-man').text(info.approveMan);
        }
        $('.answerNotCheckedInfo .check-reason').val(info.approveContent);
        getDomain(info.fieldId);
      }
    });
  }else {
    history.back();
  }


  function getDomain(fieldArr) {
    var str = '';
    if (!fieldArr.length) {
      return str;
    }else{
      userServe.getDomainList(function (res) {
        fieldArr.forEach(function(item){
          var domain = _.find(res, {id: item});
          var label = domain ? domain.fieldName : '';
          str += label + ',';
        });
        $('.answerNotCheckedInfo .selected-domain').text(str.slice(0, -1));
      });
    }
  }



  
   // 点击图片放大
   $('.answerNotCheckedInfo .card img').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });


  $('.answerNotCheckedInfo .back').click(function () {
    history.back();
  });

});