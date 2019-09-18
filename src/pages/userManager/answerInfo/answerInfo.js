var id = url('?id');
var phone = url('?phone');

var userServe = new UserService();
$(function () {
  if (id) {
    getDatas('getAnswerInfo', id);
  }else if(phone) {
    getDatas('getAnswerInfoByPhone', phone);
  }else{
    history.back();
  }


  function getDatas(fn, arg) {

    userServe[fn](arg, function (res) {
      if (res.status === '200') {
        var info = res.response || {};
        $('.answerInfo .phoneNumber').text(info.phoneNumber);
        $('.answerInfo .company').text(info.company);
        $('.answerInfo .userName').text(info.userName);
        $('.answerInfo .nickName').text(info.nickName);
        $('.answerInfo .job').text(info.job);
        $('.answerInfo .workYear').text(info.workYear + '年');
        var money = info.questionMoney > 0 ? info.questionMoney + '元' : '免费';
        $('.answerInfo .questionMoney').text(money);
        $('.answerInfo .card img').attr('src', info.cardAddress);
        $('.answerInfo .personalProfile').text(info.personalProfile);

        getDomain(info.fieldId || []);
      }
    });
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
        $('.answerInfo .selected-domain').text(str.slice(0, -1));
      });
    }
  }



   // 点击图片放大
   $('.answerInfo .card img').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });

  $('.answerInfo .back').click(function () {
    history.back();
  });

});