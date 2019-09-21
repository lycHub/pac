(function (w) {
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


function Process(el, options) {
  if (!el) {
    throw new Error('缺少el');
  }
  Options.call(this);
  this.el = typeof el === 'string' ? $(el) : el;
  this.options = this.merge({
    articleVo: { title: 'e' },
    onInit: $.noop,
    onChange: $.noop,
  }, options);



  // 选中的步骤列表
  this.selectedConversions = [];

  // 当前选中的索引
  this.highlightConversionIndex = -1;
  this.init();
}
Process.prototype = $.extend(Object.create(Options.prototype), {
  constructor: Process,
  init: function () {
    this.el.html(initTpl);
    this.initToolTip();
    this.initEvts();
    this.emitEvent('onInit');
  },

  initToolTip: function () {
    this.el.find('.pc-process .fa').tooltip({
      position: { my: "left+10", at: "right" },
      classes: {
        "ui-tooltip": "pc-process-tip"
      }
    });
  },

  initEvts: function () {
      var btns = {
        last: this.el.find('.pc-process .operate-area .btns .last'),
        next: this.el.find('.pc-process .operate-area .btns .next'),
        del: this.el.find('.pc-process .operate-area .btns .del')
      }

      var dropdown = this.el.find('.pc-process .operate-area .btns .dropdown .dropdown-menu');
      var menuTtems = '';
      conversionTypes.forEach(function (item) {
        if (item) {
          menuTtems += '<li><a data-code="'+ item.conversionCode +'">'+ item.conversionType +'</a></li>';
        }
      });
      dropdown.html(menuTtems);

      this.stepPanel = this.el.find('.pc-process .operate-area .list-group');
      this.stepInfo = this.el.find('.pc-process .step-info');
      this.processBefore = this.el.find('.pc-process .process-bef');
      this.processAfter = this.el.find('.pc-process .process-af');

      btns.last.click(this.toLast.bind(this));
      btns.next.click(this.toNext.bind(this));
      btns.del.click(this.onDeleteStep.bind(this));
      dropdown.on('click', 'li', this.onCreateStep.bind(this));

      var that = this;

      this.stepPanel.on('click', 'li', function () {
        that.onChangeStep($(this).index());
      });

      /* 值变化 */
      this.stepInfo.on('blur', '.textarea', function () {
        that.onTextBlur(this.value);
      });
      this.stepInfo.on('blur', '.textarea-source', function () {
        that.onTextSourceBlur(this.value);
      });
      this.stepInfo.on('blur', '.textarea-target', function () {
        that.onTextTargetBlur(this.value);
      });
    },

    // 上移
    toLast: function () {
      if (this.highlightConversionIndex > 0) {
        this.transposition(this.highlightConversionIndex, this.highlightConversionIndex - 1);
      }
    },

    // 下移
    toNext: function () {
      if (this.highlightConversionIndex < this.selectedConversions.length - 1) {
        this.transposition(this.highlightConversionIndex, this.highlightConversionIndex + 1);
      }
    },

    // 换位
    transposition: function (fromIndex, toIndex) {
      this.selectedConversions.splice(toIndex, 1, this.selectedConversions.splice(fromIndex, 1 , this.selectedConversions[toIndex])[0]);
      this.highlightConversionIndex = toIndex;
      this.renderSteps();
    },


    // 删除
    onDeleteStep: function () {
      if (this.selectedConversions.length) {
        this.selectedConversions.splice(this.highlightConversionIndex, 1);
        this.highlightConversionIndex = Math.max(0, this.highlightConversionIndex - 1);
        this.renderSteps();
        this.setTpl(this.selectedConversions[this.highlightConversionIndex]);
      }
    },

    // 新建步骤
    onCreateStep: function (evt) {
      var code = $(evt.target).data('code');
      var stepType = _.find(conversionTypes, { conversionCode: code });
      if (stepType) {
        this.selectedConversions.push($.extend({}, stepType, { param: {} }));
        this.highlightConversionIndex = this.selectedConversions.length - 1;
        this.renderSteps();
        this.setTpl(stepType);
      }
    },

  // 切换步骤
    onChangeStep: function (index) {
      if (this.highlightConversionIndex !== index) {
        this.highlightConversionIndex = index;
        this.renderSteps();
        this.setTpl(this.selectedConversions[this.highlightConversionIndex]);
      }
    },


  // 刷新步骤的dom
    renderSteps: function () {
      var steps = '';
      var that = this;
      this.selectedConversions.forEach(function (item, index) {
        var active = index === that.highlightConversionIndex ? 'active' : '';
        var num = index + 1;
        steps += '<li class="list-group-item  '+ active +'" data-code="'+ item.conversionCode +'">'+ num +'. '+ item.conversionType +'</li>';
      });
      this.stepPanel.html(steps);
    },


    // 设置tpl值
    setTpl: function (currentCovertion) {
      // console.log('currentCovertion', currentCovertion);
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
        this.renderTpl(currentCovertion.tpl, param);
      }else {
        this.renderTpl({ use: 'default' });
      }
    },

    // 更换tpl
    renderTpl: function (tpl, param) {
      // console.log('tpl', tpl, param);
      this.stepInfo.find('.area').remove();
      this.stepInfo.append(stepInfoTpl(tpl.use, param));
    },


    // 普通文本域变化
    onTextBlur: function (value) {
      var currentCoversion = this.selectedConversions[this.highlightConversionIndex];
      currentCoversion.param = this.makeParam(currentCoversion.paramKeys, [value || '']);
      // console.log('currentCoversion', currentCoversion);
      this.onParamChange();
    },

    // 替换框1变化
    onTextSourceBlur: function (value) {
      var currentCoversion = this.selectedConversions[this.highlightConversionIndex];
      var paramCopy = $.extend({}, currentCoversion.param);
      var paramKeys = currentCoversion.paramKeys;
      currentCoversion.param = this.makeParam(paramKeys, [value, paramCopy[paramKeys[1]] || '']);
      // console.log('onTextSourceBlur', currentCoversion);
      this.onParamChange();
    },

    // 替换框2变化
    onTextTargetBlur: function (value) {
      var currentCoversion = this.selectedConversions[this.highlightConversionIndex];
      var paramCopy = $.extend({}, currentCoversion.param);
      var paramKeys = currentCoversion.paramKeys;
      currentCoversion.param = this.makeParam(paramKeys, [paramCopy[paramKeys[0]] || '', value]);
      // console.log('onTextTargetBlur', currentCoversion);
      this.onParamChange();
    },

    // 调接口
    onParamChange: function () {
      // console.log('onParamChange', this.selectedConversions);
      var filedName = '';
      for (var attr in this.articleVo) {
        if (attr) {
          filedName = attr || 'title';
        }
      }
      var param = {
        articleVo: this.articleVo,
        spiderConversionConfigs: []
      };
      this.selectedConversions.forEach(function (item) {
        param.spiderConversionConfigs.push({
          conversionCode: item.conversionCode,
          conversionType: item.conversionType,
          param: item.param,
          filedName: filedName
        });
      });
      this.emitEvent('onChange', param);
    },



    // 组装param
    makeParam: function (paramKeys, values) {
      return _.zipObject(paramKeys, values);
    },


    // 设置文本
    setText: function (text, type) {
      var trueType = type || 'before';
      var trueText = text || '';
      if (trueType === 'before') {
        this.processBefore.find('.area').text(trueText);
      }else {
        this.processAfter.find('.area').text(trueText);
      }
    }
  });
  w.Process = Process;
})(window);