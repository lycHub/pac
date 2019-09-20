function defaultTpl() {
  return '<div class="area step-init"></div>';
}

function textAreaTpl(val) {
  var value = val || '';
  return '<textarea class="area textarea" placeholder="请输入...">'+ value +'</textarea>';
}

 function replaceTextTpl (val, val2, placeholder) {
   var value = val || '';
   var value2 = val2 || '';
    var text = placeholder || '请输入...';
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

}

function stepInfoTpl(val, val2, type, placeholder) {
  return defaultTpl();
}