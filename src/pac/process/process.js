console.log('process');

var conversionTypes = ['', '添加前缀', '添加后缀', '文本替换', '默认值', '固定值', '正则替换'];

// 选中的步骤列表
var selectedConversions = [];

// 当前选中的索引
var highlightConversionIndex = -1;


$(function () {
  $(".modal-wrap").dialog({
    width: 450,
    // height: 500,
    modal: true,
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
  conversionTypes.forEach(function (item, index) {
    if (item) {
      menuTtems += '<li><a data-code="'+ index +'">'+ item +'</a></li>';
    }
  });
  dropdown.html(menuTtems);

  var stepPanel = el.find('.pc-process .operate-area .list-group');
  var stepInfo = el.find('.pc-process .step-info');

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
    selectedConversions.push({ code: code, label: conversionTypes[code] });
    highlightConversionIndex = selectedConversions.length - 1;
    renderSteps();
  }

  // 切换步骤
  function onChangeStep() {
    console.log('onChangeStep');
    highlightConversionIndex = $(this).index();
    renderSteps();
  }

  // 删除
  function onDeleteStep() {
    console.log('onDelete');
    if (selectedConversions.length) {
      selectedConversions.splice(highlightConversionIndex, 1);
      highlightConversionIndex = Math.max(0, highlightConversionIndex - 1);
      renderSteps();
    }
  }


  // 刷新步骤的dom
  function renderSteps() {
  // <li class="list-group-item  active">2. Dapibus ac facilisis in</li>
    var steps = '';
    selectedConversions.forEach(function (item, index) {
      var active = index === highlightConversionIndex ? 'active' : '';
      var num = index + 1;
      steps += '<li class="list-group-item  '+ active +'" data-code="'+ item.code +'">'+ num +'. '+ item.label +'</li>';
    });
    stepPanel.html(steps);
  }


  // 普通文本域变化
  function onTextBlur() {
    console.log('onTextBlur');
  }

  // 替换框1变化
  function onTextSourceBlur() {
    console.log('onTextSourceBlur');
  }

  // 替换框2变化
  function onTextTargetBlur() {
    console.log('onTextTargetBlur');
  }
});