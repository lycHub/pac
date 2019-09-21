console.log('process');
var currentType = 'a';
var articleType = {
  articleTime: 'a',
  author: 'b',
  content: 'c',
  source: 'd',
  title: 'e'
}

var conversionTypes = [{
  conversionCode: 1,
  conversionType: '添加前缀',
  tpl: {
    type: 'text',
    use: 'textAreaTpl'
  },
  paramKeys: ['prefix']
}, {
  conversionCode: 2,
  conversionType: '添加后缀',
  tpl: {
    type: 'text',
    use: 'textAreaTpl'
  },
  paramKeys: ['postfix']
}, {
  conversionCode: 3,
  conversionType: '文本替换',
  tpl: {
    type: 'replaceText',
    use: 'replaceTextTpl'
  },
  paramKeys: ['newChar', 'oldChar']
}, {
  conversionCode: 4,
  conversionType: '默认值',
  tpl: {
    type: 'text',
    use: 'textAreaTpl'
  },
  paramKeys: ['defaultChar']
}, {
  conversionCode: 5,
  conversionType: '固定值',
  tpl: {
    type: 'text',
    use: 'textAreaTpl'
  },
  paramKeys: ['forceCoverChar']
}, {
  conversionCode: 6,
  conversionType: '正则替换',
  tpl: {
    type: 'replaceReg',
    use: 'replaceTextTpl'
  },
  paramKeys: ['jsRegex', 'replacement']
}];

// 选中的步骤列表
var selectedConversions = [];

// 当前选中的索引
var highlightConversionIndex = -1;


$(function () {
  $(".modal-wrap").dialog({
    width: 450,
    // height: 500,
    // modal: true,
    resizable: false,
    closeOnEscape: false,
    title: "数据处理",
    buttons: [
      {
        text: '取消',
        click: function() {

        }
      },
      {
        text: '确定',
        click: function() {

        }
      }
    ]
  });
  var el = $('.modal-wrap');
  el.find('.pc-process .fa').tooltip({
    position: { my: "left+10", at: "right" },
    classes: {
      "ui-tooltip": "pc-process-tip"
    }
  });


  var btns = {
    last: el.find('.pc-process .operate-area .btns .last'),
    next: el.find('.pc-process .operate-area .btns .next'),
    del: el.find('.pc-process .operate-area .btns .del')
  }

  var dropdown = el.find('.pc-process .operate-area .btns .dropdown .dropdown-menu');
  var menuTtems = '';
  conversionTypes.forEach(function (item) {
    if (item) {
      menuTtems += '<li><a data-code="'+ item.conversionCode +'">'+ item.conversionType +'</a></li>';
    }
  });
  dropdown.html(menuTtems);

  var stepPanel = el.find('.pc-process .operate-area .list-group');
  var stepInfo = el.find('.pc-process .step-info');
  var processBefore = el.find('.pc-process .process-bef');
  var processAfter = el.find('.pc-process .process-af');

  initEvents();
  function initEvents() {
    btns.last.click(toLast);
    btns.next.click(toNext);
    btns.del.click(onDeleteStep);
    stepPanel.on('click', 'li', onChangeStep);
    dropdown.on('click', 'li', onCreateStep);

    /* 值变化 */
    stepInfo.on('blur', '.textarea', onTextBlur);
    stepInfo.on('blur', '.textarea-source', onTextSourceBlur);
    stepInfo.on('blur', '.textarea-target', onTextTargetBlur);
  }

  // 上一步
  function toLast() {
    // console.log('toLast');
    if (highlightConversionIndex > 0) {
      transposition(highlightConversionIndex, highlightConversionIndex - 1);
    }
  }

  // 下一步
  function toNext() {
    // console.log('toNext');
    if (highlightConversionIndex < selectedConversions.length - 1) {
      transposition(highlightConversionIndex, highlightConversionIndex + 1);
    }
  }

  function transposition(fromIndex, toIndex) {
    selectedConversions.splice(toIndex, 1, selectedConversions.splice(fromIndex, 1 , selectedConversions[toIndex])[0]);
    highlightConversionIndex = toIndex;
    renderSteps();
  }

  // 新建步骤
  function onCreateStep(evt) {
    var code = $(evt.target).data('code');
    var stepType = _.find(conversionTypes, { conversionCode: code });
    if (stepType) {
      selectedConversions.push($.extend({}, stepType, { param: {} }));
      highlightConversionIndex = selectedConversions.length - 1;
      renderSteps();
      setTpl(stepType);
     /* var param = {};
      if (stepType.tpl.type === 'replaceReg') {
        param.placeholder = '请输入正则表达式...';
      }
      renderTpl(stepType.tpl, param);*/
    }
  }

  // 切换步骤
  function onChangeStep() {
    if (highlightConversionIndex !== $(this).index()) {
      console.log('onChangeStep');
      highlightConversionIndex = $(this).index();
      renderSteps();
      setTpl(selectedConversions[highlightConversionIndex]);
    }
  }

  // 删除
  function onDeleteStep() {
    console.log('onDelete');
    if (selectedConversions.length) {
      selectedConversions.splice(highlightConversionIndex, 1);
      highlightConversionIndex = Math.max(0, highlightConversionIndex - 1);
      renderSteps();
      setTpl(selectedConversions[highlightConversionIndex]);
    }
  }


  // 刷新步骤的dom
  function renderSteps() {
  // <li class="list-group-item  active">2. Dapibus ac facilisis in</li>
    var steps = '';
    selectedConversions.forEach(function (item, index) {
      var active = index === highlightConversionIndex ? 'active' : '';
      var num = index + 1;
      steps += '<li class="list-group-item  '+ active +'" data-code="'+ item.conversionCode +'">'+ num +'. '+ item.conversionType +'</li>';
    });
    stepPanel.html(steps);
  }


  // 设置tpl值
  function setTpl(currentCovertion) {
    console.log('currentCovertion', currentCovertion);
    var keyCount = 0;
    var param = {};
    if (currentCovertion) {
      for (var attr in currentCovertion.param) {
        param['val' + (++keyCount)] = currentCovertion.param[attr];
      }

      if (currentCovertion.tpl.type === 'replaceReg') {
        param.placeholder = '请输入正则表达式...';
      }
      console.log('param', param);
      renderTpl(currentCovertion.tpl, param);
    }else {
      renderTpl({ use: 'default' });
    }
  }

  // 更换tpl
  function renderTpl(tpl, param) {
    // console.log('tpl', tpl, param);
    stepInfo.find('.area').remove();
    stepInfo.append(stepInfoTpl(tpl.use, param));
    // console.log(stepInfoTpl(tpl.use));
  }


  // 普通文本域变化
  function onTextBlur() {
    // console.log('onTextBlur', highlightConversionIndex);
    // console.log('val', this.value);
    var currentCoversion = selectedConversions[highlightConversionIndex];
    currentCoversion.param = makeParam(currentCoversion.paramKeys, [this.value]);
    // console.log('currentCoversion', currentCoversion);
    onParamChange();
  }

  // 替换框1变化
  function onTextSourceBlur() {
    var currentCoversion = selectedConversions[highlightConversionIndex];
    var paramCopy = $.extend({}, currentCoversion.param);
    var paramKeys = currentCoversion.paramKeys;
    currentCoversion.param = makeParam(paramKeys, [this.value, paramCopy[paramKeys[1]]]);
    // console.log('onTextSourceBlur', currentCoversion);
    onParamChange();
  }

  // 替换框2变化
  function onTextTargetBlur() {
    var currentCoversion = selectedConversions[highlightConversionIndex];
    var paramCopy = $.extend({}, currentCoversion.param);
    var paramKeys = currentCoversion.paramKeys;
    currentCoversion.param = makeParam(paramKeys, [paramCopy[paramKeys[0]], this.value]);
    // console.log('onTextTargetBlur', currentCoversion);
    onParamChange();
  }

  function onParamChange() {
    console.log('onParamChange', selectedConversions);
    var param = {
      articleVo: {
        articleTime: 'a'
      },
      spiderConversionConfigs: []
    };
    selectedConversions.forEach(function (item) {
      param.spiderConversionConfigs.push({
        conversionCode: item.conversionCode,
        conversionType: item.conversionType,
        param: item.param,
        filedName: 'articleTime'
      });
    });
    console.log('param', param);
  }



  // 组装param
  function makeParam(paramKeys, values) {
    var result = _.zipObject(paramKeys, values);
    return result;
  }

  function setText(text, type) {
    var trueType = type || 'before';
    var trueText = text || '';
    if (trueType === 'before') {
      processBefore.find('.area').text(trueText);
    }else {
      processAfter.find('.area').text(trueText);
    }
  }
});