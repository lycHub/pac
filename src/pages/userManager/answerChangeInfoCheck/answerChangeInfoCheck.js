var STATUS_ENUM = ['禁用', '启用'];
var id = url('?id');
if (!id) {
  history.back();
}
var formParams = {
  id: '',
  answerManId: '',
  phoneNumber: '',
  company: '',
  userName: '',
  nickName: '',
  job: '',
  workYear: 0,
  questionMoney: 0,
  fieldId: [],
  personalProfile: '',
  reason: '',
  status: 2,
  listenMoney: 3,       // 写死
  register: '',
  phoneUserId: '',
  cardAddress: ''
}

var userServe = new UserService();
$(function () {
  var formDoms = {
    phoneNumber: $('.answerChangeInfoCheck .phoneNumber'),
    company: $('.answerChangeInfoCheck .company'),
    userName: $('.answerChangeInfoCheck .userName'),
    nickName: $('.answerChangeInfoCheck .nickName'),
    job: $('.answerChangeInfoCheck .job'),
    workYear: $('.answerChangeInfoCheck .workYear'),
    questionMoney: $('.answerChangeInfoCheck .questionMoney'),
    reason: $('.answerChangeInfoCheck .reason'),
    personalProfile: $('.answerChangeInfoCheck .personalProfile'),
  }

  var radioWrap = $('.answerChangeInfoCheck .radio');


  var personalProfileDom = $('.answerChangeInfoCheck .personalProfile-tr');

  personalProfileDom.find('.personalProfile').on('input', function(){
    personalProfileDom.find('.word-count .current-num').text($(this).val().length);
  });
  
  var tipModal = {
    body: $('.answerChangeInfoCheck-tip-modal .modal-body'),
    confirmBtn: $('.answerChangeInfoCheck-tip-modal .btn-comfirm')
  }

  tipModal.confirmBtn.click(function(){
    $('.answerChangeInfoCheck-tip-modal').modal('hide');
    userServe.upDateAnswerInfo(formParams, function (res) {
      if (res.status === '200') {
        // alert('答主修改资料审核成功');
        history.back();
      }else {
        alert(res.message || '答主修改资料审核失败');
      }
    });
  });

  userServe.getModifyInfo(id, function (res) {
    if (res.status === '200') {
      var info = res.response || {};
      console.log('info', info);
      formParams.id = info.id;
      formDoms.phoneNumber.text(info.phoneNumber);
      formParams.phoneNumber = info.phoneNumber;
      formDoms.company.text(info.company);
      formParams.company = info.company;
      formDoms.userName.text(info.userName);
      formParams.userName = info.userName;
      formDoms.nickName.text(info.nickName);
      formParams.nickName = info.nickName;
      formDoms.job.text(info.job);
      formParams.job = info.job;
      formDoms.workYear.text(info.workYear + '年');
      formParams.workYear = info.workYear;
      formDoms.questionMoney.val(info.questionMoney);
      formParams.questionMoney = info.questionMoney;
      formDoms.personalProfile.val(info.personalProfile);
      formParams.personalProfile = info.personalProfile;
      personalProfileDom.find('.word-count .current-num').text(info.personalProfile.length || 0);
      formDoms.reason.val(info.reason);
      formParams.reason = info.reason;
      formParams.cardAddress = info.cardAddress;
      $('.answerChangeInfoCheck .card-wrap img').attr('src', info.cardAddress);
      formParams.answerManId = info.answerManId;
      formParams.register = info.register;
      // console.log('formParams :', formParams);

      // 回显领域
      getDomain(info.fieldId);

      // 显示未通过次数
      showNotPassTimes(info.phoneUserId);
    }
  });


  radioWrap.first().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 2;
      $('.answerChangeInfoCheck .not-pass-reason').hide();
      $('.answerChangeInfoCheck .form').bootstrapValidator('disableSubmitButtons', false);
    });
  });

  radioWrap.last().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 1;
      $('.answerChangeInfoCheck .not-pass-reason').show();
    });
  });


  function getDomain(fieldArr) {
    formParams.fieldId = fieldArr || [];
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
        $('.answerChangeInfoCheck .selected-domain').text(str.slice(0, -1));
      });
    }
  }


  function showNotPassTimes(phoneUserId) {
    formParams.phoneUserId = phoneUserId;
    userServe.getNotPassTimesForChangeInfo(phoneUserId, function(res){
      $('.answerChangeInfoCheck .not-pass').text('(' + res + '次)');
    });
  }



  
   // 点击图片放大
   $('.answerChangeInfoCheck .card-wrap img').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });



  var bootstrapValidator = $('.answerChangeInfoCheck .form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      questionMoney: {
        validators: {
          notEmpty: {
            message: '请选择提问金额'
          }
        }
      },
      personalProfile: {
        validators: {
          notEmpty: {
            message: '请填写个人简介',
          },
          stringLength: {
            min: 30,
            max: 300
          }
        }
      },
      reason: {
        validators: {
          notEmpty: {
            message: '请填写不通过理由',
          },
          stringLength: {
            max: 30
          }
        }
      }
    }
  });

  bootstrapValidator.on('success.form.bv', function (e) {
    e.preventDefault();
    formParams['personalProfile'] = formDoms['personalProfile'].val();
    formParams['reason'] = formDoms['reason'].val();
    formParams['questionMoney'] = formDoms['questionMoney'].val();


    // console.log('success', formParams);
    var type = formParams.status === 2 ? '通过' : '不通过';
    tipModal.body.text('答主资料审核' + type + '?');
    $('.answerChangeInfoCheck-tip-modal').modal('show');
    $(this).bootstrapValidator('disableSubmitButtons', false);
  });

  $('.answerChangeInfoCheck .back').click(function () {
    history.back();
  });
});

function generateDomainStr(selectedDomains) {
  var domainNames = '';
  selectedDomains.forEach(function (item) {
    domainNames += item.name + '，';
  });
  return domainNames.slice(0, -1);
}