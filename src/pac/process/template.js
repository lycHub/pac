function defaultTpl() {
  return '<div class="area step-init"></div>';
}

function textAreaTpl(params) {
  var value = params.val1 || '';
  return '<textarea class="area textarea" placeholder="请输入...">'+ value +'</textarea>';
}

 function replaceTextTpl (params) {
    var value = params.val1 || '';
    var value2 = params.val2 || '';
    var text = params.placeholder || '请输入...';
    return '<div class="area step-replace">\n' +
      '        <div class="row source">\n' +
      '          <label class="col-md-3">替换内容：</label>\n' +
      '          <textarea class="textarea-source col-md-8" placeholder="请输入...">'+ value +'</textarea>\n' +
      '        </div>\n' +
      '        <div class="row target">\n' +
      '          <label class="col-md-3">替换为：</label>\n' +
      '          <textarea class="textarea-target col-md-8" placeholder="'+ text +'">'+ value2 +'</textarea>\n' +
      '        </div>\n' +
      '      </div>';
};


var tplTypes = {
  textAreaTpl: textAreaTpl,
  replaceTextTpl: replaceTextTpl
}
/*
* val1, val2, placeholder
* */


function stepInfoTpl(type, params) {
  if (!type || type === 'default') {
    return defaultTpl();
  }

  return tplTypes[type](params || {});
}