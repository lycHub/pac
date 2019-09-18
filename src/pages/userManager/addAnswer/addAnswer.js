var fileMaxSize = 1048576 * 2;  // 2M
var fileValidType = /^image\/(png|jpg|jpeg)$/;

var formParams = {
  phoneNumber: '',
  company: '',
  userName: '',
  nickName: '',
  job: '',
  workYear: 0,
  questionMoney: 0,
  fieldId: [],
  personalProfile: '',
  listenMoney: 3,       // 写死
  register: 1,          // 写死
  phoneUserId: '',
  cardAddress: ''
}

// 领域列表
var domainList = [];

// 选中的领域id(临时保存)
var tempSelectedDomains = [];

// 选中的领域id
var selectedDomains = [];

var userServe = new UserService();
$(function () {
  var formDoms = {
    phoneNumber: $('.addAnswer .phoneNumber'),
    company: $('.addAnswer .company'),
    userName: $('.addAnswer .userName'),
    nickName: $('.addAnswer .nickName'),
    job: $('.addAnswer .job'),
    workYear: $('.addAnswer .workYear'),
    questionMoney: $('.addAnswer .questionMoney'),
    personalProfile: $('.addAnswer .personalProfile')
  }

  var reg = /\d+/g;
  formDoms.phoneNumber.on('input', function(){
    var val = $(this).val();
    console.log('val :', val);
    if (Number(val)) {
      $(this).val(val.slice(0, 11));
    }else{
      $(this).val(val.slice(0, -1));
    }
  });
  
  var btns = {
    searchUserInfoBtn: $('.addAnswer .searchInfo'),
    selectDomainBtn: $('.addAnswer .select-domain'),
    upLoadBtn: $('.addAnswer .upload')
  }


  var domainSelectModal = {
    header: $('.domain-select-modal .panel-heading'),
    group: $('.domain-select-modal .panel-body .list-group'),
    btn: $('.domain-select-modal .modal-footer .btn-confirm')
  }

  var personalProfileDom = $('.addAnswer .personalProfile-tr');

  personalProfileDom.find('.personalProfile').on('input', function(){
    personalProfileDom.find('.word-count .current-num').text($(this).val().length);
  });



  btns.searchUserInfoBtn.click(onSearchUser);
  btns.selectDomainBtn.click(onSelectDomainBtn);
  btns.upLoadBtn.click(function () {
    $('.addAnswer .upload-input').click();
  });


  // 查询手机号信息
  function onSearchUser() {
    var phone = formDoms.phoneNumber.val();
    if (/^1\d{10}$/.test(phone)) {
      userServe.searchPhone(formDoms.phoneNumber.val(), function (res) {
        console.log('searchPhone', res);
        if (res) {
          formParams.phoneUserId = res.id;
          if (res.companyName) {
            formDoms.company.val(res.companyName);
            formParams.company = res.companyName;
          }
          if (res.name) {
            formDoms.userName.val(res.name).prop('readonly', true);
            formParams.userName = res.name;
          }
          if (res.nikeName) {
            formDoms.nickName.val(res.nikeName);
            formParams.nickName = res.nikeName;
          }
        }else{
          $('.domain-add .modal-body').text('该账号为普通用户/未注册,请先注册');
          $('.domain-add').modal('show');
        }
      });
    }else{
      $('.domain-add .modal-body').text('请输入正确的手机号码');
      $('.domain-add').modal('show');
    }
  }

  // 选择领域
  function onSelectDomainBtn() {
    if (domainList.length) {
      showDomainModal(domainList);
    }else{
      userServe.getDomainList(function (res) {
        domainList = res;
        showDomainModal(domainList);
      });
    }
    
  }

  domainSelectModal.group.on('change', 'input', function () {
    var val = Number($(this).prop('value'));
    if ($(this).prop('checked')) {
      tempSelectedDomains.push({
        id: val,
        name: $(this).prop('name')
      });
    }else {
      var index = _.findIndex(tempSelectedDomains, { id: val });
      if (index !== -1) {
        tempSelectedDomains.splice(index, 1);
      }
    }
    domainSelectModal.header.text(generateDomainStr(tempSelectedDomains));
  });


  // 领域弹窗确定按钮
  domainSelectModal.btn.click(function () {
    selectedDomains = tempSelectedDomains.slice();
    $('.addAnswer .selected-domain-label').text(generateDomainStr(selectedDomains));
    $('.domain-select-modal').modal('hide');
  });


  // 弹窗 隐藏后 触发
  $('.domain-select-modal').on('hidden.bs.modal', function (e) {
    tempSelectedDomains = [];
  });



  // 显示领域选择的弹窗
  function showDomainModal(res) {
    var html = '';
    res.forEach(function (item) {
      var activeIndex = _.findIndex(selectedDomains, { id: item.id });
      html += '<li class="list-group-item" data-active-index='+ activeIndex +'><label><input type="checkbox" name="' + item.fieldName + '" value="' + item.id + '">' + item.fieldName + '</label></li>'
    });
    domainSelectModal.group.html(html);
    updateSelectedDomainDom();
    
  }


  // 每次打开领域弹窗时，回显上次选中的数据
  function updateSelectedDomainDom() {
    domainSelectModal.group.find('li').filter(function(index, item) {
      return $(item).data('activeIndex') !== -1;
    }).find('input').prop('checked', true);
    tempSelectedDomains = selectedDomains.slice();
    domainSelectModal.header.text(generateDomainStr(tempSelectedDomains));
    $('.domain-select-modal').modal('show');
  }



  $('.addAnswer .upload-input').fileupload({
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
        $('.domain-add .modal-body').text('请上传符合类型和大小的文件');
      $('.domain-add').modal('show');
      }
      
      /* var formData = new FormData();
      formData.append('imageFile', data.files[0]);
      userServe.uploadFile(formData, function (res) {
        console.log('uploadFile', res);
      }); */
    },
    done: function (e, data) {
      // console.log('data result', data.result);
      var result = data.result;
      if (result.status === '200') {
        $('.addAnswer .card').attr('src', 'http://mfs.mysteelcdn.com/' + result.response);
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
  $('.addAnswer .card').click(function(){
    var src = $(this).attr('src');
    if (src) {
      $('.big-img-modal .pic img').attr('src', src);
      $('.big-img-modal').modal('show');
    }
  });

 



  var bootstrapValidator = $('.addAnswer .form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      phoneNumber: {
        message: '请输入正确的手机号',
        trigger: 'blur',
        validators: {
          notEmpty: {},
          regexp: {
            regexp: /^1\d{10}$/
          }
        }
      },
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
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空',
          },
          stringLength: {
            min: 1,
            max: 20
          },
          regexp: {
            regexp: /^[\w\d\u4e00-\u9fa5]+$/,
            message: '只能输入中文、字母或数字'
          }
        }
      },
      nickname: {
        validators: {
          notEmpty: {
            message: '昵称不能为空',
          },
          stringLength: {
            min: 1,
            max: 20
          },
         /*  regexp: {
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
         /*  regexp: {
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
            message: '请填写个人简介'
          },
          stringLength: {
            min: 30,
            max: 300
          }
        }
      }
    }
  });

  bootstrapValidator.on('success.form.bv', function (e) {
    e.preventDefault();

    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        formParams[attr] = formDoms[attr].val();
      }
    }
    formParams.fieldId = selectedDomains.map(function (item) {
      return item.id;
    });

    if (!formParams.phoneUserId) {
      $('.domain-add .modal-body').text('该账号为普通用户/未注册,请先注册');
      $('.domain-add').modal('show');
      $(this).bootstrapValidator('disableSubmitButtons', false);
      return;
    }
    if (!formParams.fieldId.length) {
      $('.domain-add .modal-body').text('请选择擅长领域');
      $('.domain-add').modal('show');
      $(this).bootstrapValidator('disableSubmitButtons', false);
      return;
    }

    // console.log('success', formParams);
    userServe.addAnswer(formParams, function (res) {
      if (res.status === '200') {
        $('.domain-add .modal-body').text('新增答主成功');
        $('.domain-add').modal('show');
        history.back();
      }else {
        $('.domain-add .modal-body').text(res.message || '新增答主失败');
        $('.domain-add').modal('show');
      }
    });
    
    $(this).bootstrapValidator('disableSubmitButtons', false);
  });

  $('.addAnswer .back').click(function () {
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

