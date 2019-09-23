var initTpl = '<div class="pc-process">\n' +
  '    <div class="sec operates">\n' +
  '      <h5>处理步骤列表</h5>\n' +
  '      <div class="operate-area row">\n' +
  '        <div class="steps col-md-6">\n' +
  '          <div class="panel panel-default">\n' +
  '            <!-- List group -->\n' +
  '            <ul class="list-group">\n' +
  '           <!--   <li class="list-group-item">1. Dapibus ac facilisis in</li>\n' +
  '              <li class="list-group-item  active">2. Dapibus ac facilisis in</li>-->\n' +
  '            </ul>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '        <div class="btns col-md-6">\n' +
  '          <div class="btn-r row up">\n' +
  '            <button class="btn col-md-4 btn-arrow last">\n' +
  '              <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>\n' +
  '              <!--<i class="fa fa-angle-up"></i>-->\n' +
  '            </button>\n' +
  '            <!--<button class="btn col-md-6">新建</button>-->\n' +
  '            <div class="dropdown col-md-6">\n' +
  '              <button class="btn btn-default dropdown-toggle btn-block" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">新建</button>\n' +
  '              <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1"></ul>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '          <div class="btn-r row down">\n' +
  '            <button class="btn col-md-4 btn-arrow next">\n' +
  '              <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>\n' +
  '            </button>\n' +
  '            <button class="btn col-md-6 del">删除</button>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '\n' +
  '    <div class="sec step-info">\n' +
  '      <h5>步骤详情</h5>\n' +
  '      <div class="area step-init"></div>\n' +
  '      <!--<textarea class="area textarea" placeholder="请输入..."></textarea>-->\n' +
  '      <!--<div class="area step-replace">\n' +
  '        <div class="row source">\n' +
  '          <label class="col-md-3">替换内容：</label>\n' +
  '          <textarea class="textarea-source col-md-8" placeholder="请输入..."></textarea>\n' +
  '        </div>\n' +
  '        <div class="row target">\n' +
  '          <label class="col-md-3">替换为：</label>\n' +
  '          <textarea class="textarea-target col-md-8" placeholder="请输入..."></textarea>\n' +
  '        </div>\n' +
  '      </div>-->\n' +
  '    </div>\n' +
  '\n' +
  '    <div class="sec process-bef">\n' +
  '      <h5>处理前</h5>\n' +
  '      <div class="area"></div>\n' +
  '    </div>\n' +
  '\n' +
  '    <div class="sec process-af">\n' +
  '      <h5>\n' +
  '        处理前后\n' +
  '        <i class="fa fa-question-circle" title="此为步骤列表中所有处理结果的总览"></i>\n' +
  '      </h5>\n' +
  '      <div class="area"></div>\n' +
  '    </div>\n' +
  '  </div>';

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
      '          <label class="col-md-3">查找内容：</label>\n' +
      '          <textarea class="textarea-source col-md-8" placeholder="'+ text +'" >'+ value +'</textarea>\n' +
      '        </div>\n' +
      '        <div class="row target">\n' +
      '          <label class="col-md-3">替换为：</label>\n' +
      '          <textarea class="textarea-target col-md-8" placeholder="请输入...">'+ value2 +'</textarea>\n' +
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