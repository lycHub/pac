var fileMaxSize = 1048576 * 2;  // 2M
var fileValidType = /^image\/(png|jpg|jpeg)$/;

var id = url('?id');
if (!id) {
  history.back();
}
var formParams = {
  id: '',
  phoneNumber: '',
  company: '',
  userName: '',
  nickName: '',
  job: '',
  workYear: 0,
  questionMoney: 0,
  fieldId: [],
  personalProfile: '',
  approveContent: '',
  status: 2,
  listenMoney: 3,       // 写死
  register: 1,          // 写死
  phoneUserId: '',
  cardAddress: ''
}

var userServe = new UserService();
$(function () {
  var formDoms = {
    phoneNumber: $('.answerCheck .phoneNumber'),
    company: $('.answerCheck .company'),
    userName: $('.answerCheck .userName'),
    nickName: $('.answerCheck .nickName'),
    job: $('.answerCheck .job'),
    workYear: $('.answerCheck .workYear'),
    questionMoney: $('.answerCheck .questionMoney'),
    approveContent: $('.answerCheck .approveContent'),
    personalProfile: $('.answerCheck .personalProfile'),
  }


  

  var radioWrap = $('.answerCheck .radio');


  var personalProfileDom = $('.answerCheck .personalProfile-wrap');

  personalProfileDom.find('.personalProfile').on('input', function(){
    personalProfileDom.find('.word-count .current-num').text($(this).val().length);
  });

  var tipModal = {
    body: $('.answerCheck-tip-modal .modal-body'),
    confirmBtn: $('.answerCheck-tip-modal .btn-comfirm')
  }

  tipModal.confirmBtn.click(function(){
    $('.answerCheck-tip-modal').modal('hide');
    userServe.upDateAnswer(formParams, function (res) {
      console.log('upDateAnswer :', res);
      if (res.status === '200') {
        // alert('答主审核成功');
        history.back();
      }else {
        alert(res.message || '答主审核失败');
      }
    });
  });

  


  userServe.getAnswerInfo(id, function (res) {
    if (res.status === '200') {
      var info = res.response || {};
      console.log('info', info);
      formParams.id = info.id;
      formDoms.phoneNumber.text(info.phoneNumber);
      formParams.phoneNumber = info.phoneNumber;
      formDoms.company.val(info.company);
      formParams.company = info.company;
      formDoms.userName.text(info.userName);
      formParams.userName = info.userName;
      formDoms.nickName.val(info.nickName);
      formParams.nickName = info.nickName;
      formDoms.job.val(info.job);
      formParams.job = info.job;
      formDoms.workYear.val(info.workYear);
      formParams.workYear = info.workYear;
      formDoms.questionMoney.val(info.questionMoney);
      formParams.questionMoney = info.questionMoney;
      formDoms.personalProfile.val(info.personalProfile);
      formParams.personalProfile = info.personalProfile;
      personalProfileDom.find('.word-count .current-num').text(info.personalProfile.length || 0);
      formParams.cardAddress = info.cardAddress;
      $('.answerCheck .card-wrap .card').attr('src', info.cardAddress);
      formParams.register = info.register;
      // console.log('formParams :', formParams);
      // 回显领域
      getDomain(info.fieldId);

      // 显示未通过次数
      showNotPassTimes(info.phoneUserId);

      /* // 更新status
      var statusDom = radioWrap.find('.status');
      statusDom.removeAttr('checked');
      if (STATUS_ENUM[info.status] === '禁用') {
        statusDom.last().prop('checked', true);
      }else {
        statusDom.first().prop('checked', true);
      } */
    }
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
        $('.answerCheck .selected-domain').text(str.slice(0, -1));
      });
    }
  }


  function showNotPassTimes(phoneUserId) {
    formParams.phoneUserId = phoneUserId;
    userServe.getNotPassTimes(phoneUserId, function(res){
      $('.answerCheck .not-pass').text('(' + res + '次)');
    });
  }


  radioWrap.first().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 2;
      $('.answerCheck .not-pass-reason').hide();
      // $('.answerCheck .form').data('bootstrapValidator').updateStatus("approveContent",  "stringLength",  null );
      $('.answerCheck .form').bootstrapValidator('disableSubmitButtons', false);
    });
  });

  radioWrap.last().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 1;
      $('.answerCheck .not-pass-reason').show();
    });
  });


  $('.answerCheck .upload').click(function () {
    $('.answerCheck .upload-input').click();
  });


  $('.answerCheck .upload-input').fileupload({
    // url: '/qa/upload/upload_single_file.htm',
    dataType: 'json',
    autoUpload: false,
    add: function (e, data) {
      var valid = checkFile(data.originalFiles[0]);
      if(valid) {
        data.formData = new FormData();
        data.url = '/qa/answer_Man/upload_file.htm';
        data.submit();
      }else{
        alert('请上传符合类型和大小的文件');
      }
    },
    done: function (e, data) {
      var result = data.result;
      
      if (result.status === '200') {
        $('.answerCheck .card').attr('src', 'http://mfs.mysteelcdn.com/' + result.response);
        formParams.cardAddress = result.response;
      }
    },
    fail: function (e, data) {
      console.log('fail', e);
      console.log('fail', data);
    }
  });


  // 检测文件大小和类型
  function checkFile(file) {
    return fileValidType.test(file.type) && file.size < fileMaxSize;
  }


   // 点击图片放大
   $('.answerCheck .card-wrap .card').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });



  var bootstrapValidator = $('.answerCheck .form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      company: {
        validators: {
          notEmpty: {
            message: '公司不能为空',
          },
          stringLength: {
            min: 1,
            max: 20
          },
          /* regexp: {
            regexp: /^[\w\d\u4e00-\u9fa5]+$/,
            message: '只能输入中文、字母或数字'
          } */
        }
      },
      nickName: {
        validators: {
          notEmpty: {
            message: '昵称不能为空',
          },
          stringLength: {
            min: 1,
            max: 20
          },
          /* regexp: {
            regexp: /^[\w\d\u4e00-\u9fa5]+$/,
            message: '只能输入中文、字母或数字'
          } */
        }
      },
      job: {
        validators: {
          notEmpty: {
            message: '职位不能为空',
          },
          stringLength: {
            min: 1,
            max: 20
          },
          /* regexp: {
            regexp: /^[\w\d\u4e00-\u9fa5]+$/,
            message: '只能输入中文、字母或数字'
          } */
        }
      },
      workYear: {
        validators: {
          notEmpty: {
            message: '请输入从业年限',
          },
          regexp: {
            regexp: /^[1-9](\d)?0?$/,
            message: '请填写1~100的数字'
          }
        }
      },
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
      approveContent: {
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

    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        if (attr !== 'phoneNumber' && attr !== 'userName') {
          formParams[attr] = formDoms[attr].val();
        }
      }
    }
    var type = formParams.status === 2 ? '通过' : '不通过';
   /*  if (type === '不通过' && !formParams.approveContent) {
      alert('请填写不通过理由');
    }else{
      tipModal.body.text('答主审核' + type + '?');
      $('.answerCheck-tip-modal').modal('show');
    } */
    tipModal.body.text('答主审核' + type + '?');
    $('.answerCheck-tip-modal').modal('show');
    $(this).bootstrapValidator('disableSubmitButtons', false);
  });

  $('.answerCheck .back').click(function () {
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