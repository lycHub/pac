// https://github.com/websanova/js-url
var STATUS_ENUM = ['禁用', '启用'];
var id = url('?id');
document.title = id ? '修改领域' : '新增领域';

var formParams = {
  fieldName: '',
  fieldDescribe: '',
  status: 1
}

var domainServe = new DomainService();

var detail = {};
$(function () {
  var btnConfirm = $('.updateDomain .btn-confirm');
  var radioWrap = $('.updateDomain .radio');
  var formDoms = {
    fieldName: $('.updateDomain .fieldName'),
    fieldDescribe: $('.updateDomain .fieldDescribe')
  }

  var modalDoms = {
    modalBody: $('.updateDomain-modal .modal-body'),
    modalConfirmBtn: $('.updateDomain-modal .modal-footer .btn:last')
  }


  // 获取详情
  if (id) {
    var statusDom = radioWrap.find('.status');
    btnConfirm.text('修改');
    domainServe.getDomainDetail(id, function (res) {
      detail = res;
      formDoms.fieldName.val(res.fieldName);
      formDoms.fieldDescribe.val(res.fieldDescribe);
      statusDom.removeAttr('checked');
      if (STATUS_ENUM[res.status] === '禁用') {
        formParams.status = 0;
        statusDom.last().prop('checked', true);
      }else {
        formParams.status = 1;
        statusDom.first().prop('checked', true);
      }
    });
  }else{
    btnConfirm.text('新增');
  }

  radioWrap.first().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 1;
    });
  });

  radioWrap.last().click(function (evt) {
    evt.stopPropagation();
    $(this).change(function () {
      formParams.status = 0;
    });
  });


  modalDoms.modalConfirmBtn.click(function () {
    // console.log('fieldName', formParams.fieldName);
    // console.log('fieldDescribe', formParams.fieldDescribe);
    // console.log('status', formParams.status);
    var msg = '';
    var httpType = '';
    var params = {};
    if (id) {
      msg = '修改';
      httpType = 'updateDomain';
      params = $.extend({}, formParams, { id: id, version: detail.version })
    }else {
      msg = '新增';
      httpType = 'addDomain';
      params = formParams;
    }

    domainServe[httpType](params, function (res) {
      if (res.status === '200') {
        // alert(msg + '成功');
        history.back();
      }else {
        alert(msg + '失败');
      }
      $('.updateDomain-modal').modal('hide');
    });
  });


  var bootstrapValidator = $('.updateDomain .form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      fieldName: {
        validators: {
          notEmpty: {
            message: '请填写领域名称'
          },
          stringLength: {
            max: 12
          }
        }
      },
      fieldDescribe: {
        validators: {
          stringLength: {
            max: 500,
            message: '不能超过500字'
          }
        }
      }
    }
  });

  bootstrapValidator.on('success.form.bv', function (e) {
    e.preventDefault();
    console.log('success');
    for (var attr in formDoms) {
      if (formDoms.hasOwnProperty(attr)) {
        formParams[attr] = formDoms[attr].val();
      }
    }
    
    $(this).bootstrapValidator('disableSubmitButtons', false);
    var type = id ? '修改' : '新增';
    modalDoms.modalBody.text(type + formParams.fieldName + '领域?');
    $('.updateDomain-modal').modal('show');
  });


  $('.updateDomain .form .btn-back').click(function () {
    history.back();
  });
});