var id = url('?id');
var STATUS_ENUM = ['待审核', '未通过', '通过'];
var userServe = new UserService();
$(function () {
  if (id) {
    userServe.getModifyInfo(id, function (res) {
      if (res.status === '200') {
        var info = res.response || {};
        // console.log('info :', info);
        $('.answerChangeInfo .phoneNumber').text(info.phoneNumber);
        $('.answerChangeInfo .company').text(info.company);
        $('.answerChangeInfo .userName').text(info.userName);
        $('.answerChangeInfo .nickName').text(info.nickName);
        $('.answerChangeInfo .job').text(info.job);
        $('.answerChangeInfo .workYear').text(info.workYear + '年');
        var money = info.questionMoney > 0 ? info.questionMoney + '元' : '免费';
        $('.answerChangeInfo .questionMoney').text(money);
        $('.answerChangeInfo .card img').attr('src', info.cardAddress);
        $('.answerChangeInfo .personalProfile').text(info.personalProfile);

         // 审核信息
         $('.answerChangeInfo .check-status').text(STATUS_ENUM[info.status]);
         if (info.approveTime) {
           $('.answerChangeInfo .check-time').text(moment(new Date(info.approveTime)).format('YYYY-MM-DD HH:mm'));  // 2019-06-04 15:24
         }
 
         if (info.approveMan) {
           $('.answerChangeInfo .check-man').text(info.approveMan);
         }
        //  console.log('reason :', info.reason);
         $('.answerChangeInfo .check-reason').val(info.reason);
         getDomain(info.fieldId || []);
      }
    });
  }else {
    // history.back();
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
        $('.answerChangeInfo .selected-domain').text(str.slice(0, -1));
      });
    }
  }



  
   // 点击图片放大
   $('.answerChangeInfo .card img').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });

  $('.answerChangeInfo .back').click(function () {
    history.back();
  });

});