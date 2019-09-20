(function (w) {
  function ScreenTable(el, options) {
    if (!el) {
      throw new Error('缺少el');
    }
    Options.call(this);
    this.el = typeof el === 'string' ? $(el) : el;
    this.options = this.merge({
      initialDatas: null,
      onInit: $.noop,
      onChange: $.noop,
    }, options);


    this.screenTableIns = null;
    this.baseRow = {
      filedName: 'title',
      filterCode: '1',
      param: ''
    };
    this.rowIndex = -1;
    this.tableDatas = [];
    this.acquisitionType = 0;
    this.init();
  }
  ScreenTable.prototype = $.extend(Object.create(Options.prototype), {
    constructor: ScreenTable,
    init: function () {
      this.el.html(initTpl);
      this.initEvts();
      var initialDatas = this.options.initialDatas;
      if (initialDatas && !$.isEmptyObject(initialDatas)) {
        this.renderDatas(initialDatas);
      }
      this.emitEvent('onInit', this.tableDatas);
    },

    renderDatas: function (response) {
      var formatFilterConfigs = response.formatFilterConfigs.slice();
      var filterExpression = response.filterExpression;
      this.acquisitionType = 0;
      if (filterExpression.charAt(0) === '!') {
        filterExpression = filterExpression.slice(2, -1);
        this.acquisitionType = 1;
      }
      this.tableDatas = filterExpression.split('||').map(row => row.split('&&').map(function() {
        return formatFilterConfigs.shift();
      }));
      this.generateTable(this.tableDatas);
      this.el.find('.table select[name = acquisitionType] option').eq(this.acquisitionType).prop('selected', 'selected');
    },




    generateTable: function (rows) {
      var trs = '';
      var that = this;
      rows.forEach(function (row, key) {
        that.rowIndex++;
        row.forEach(function (item, index, arr) {
          if (index === 0) {  //group
            trs += that.generateRow('row' + key, item.filedName, item.filterCode, item.param, index, arr.length);
          }else {   // condition
            trs += that.generateChildRow('row' + key, item.filedName, item.filterCode, item.param, index);
          }
        });
      });
      // console.log('trs', this.rowIndex, trs);
      that.tbody.html(trs);
    },

    generateRow: function (key, filedName, filterCode, param, index, rowspan) {
        return `<tr rowKey="${key}">
              <th rowspan="${rowspan}">或者</th>
              <td>并且</td>
              <td>
                <select name="filedName" class="form-control" trKey="${key}" keyName="rowKey">${generatefieldNameSelect(filedName)}</select>
              </td>
              <td>
                <select name="filterCode" class="form-control" trKey="${key}" keyName="rowKey">${generatefiledCodeSelect(filterCode)}</select>
              </td>
              <td class="min200">${lastTdTpl(filterCode, key, index, param)}</td>
            </tr>`;
      },

    generateChildRow: function (key, filedName, filterCode, param, index) {
      return `<tr topKey="${key}" index="${index}">
            <td>并且</td>
            <td>
              <select name="filedName" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefieldNameSelect(filedName)}</select>
            </td>
            <td>
              <select name="filterCode" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefiledCodeSelect(filterCode)}</select>
            </td>
            <td class="min200">${lastTdTpl(filterCode, key, index, param)}</td>
          </tr>`
    },


    initEvts: function () {
        var table = this.el.find('.table');
        this.tbody = table.find('tbody');
        var btns = {
          group: table.find('.group'),
          condition: table.find('.condition'),
          del: table.find('.del'),
          test: table.find('.test'),
        }

        btns.group.click(this.handleGroupClick.bind(this));
        btns.condition.click(this.handleConditionClick.bind(this));
        btns.del.click(this.handleDelClick.bind(this));
        var that = this;
        table.find('select[name = acquisitionType]').change(function () {
          that.acquisitionType = this.value;
        });
        this.listenValChange();
      },


      listenValChange: function () {
        var that = this;

        this.tbody.on('change', 'select[name=filedName]', function () {
          console.log('filedName');
          that.setVal('filedName', this);
        });

        this.tbody.on('change', 'select[name=filterCode]', function () {
          console.log('filterCode');


          var keyName = $(this).attr('keyName');
          var trKey = $(this).attr('trKey');
          var index = $(this).attr('index') || 0;
          var trueIndex = index > 0 ? index - 1 : 0;
          var lastTd = that.tbody.find(`tr[${keyName}=${trKey}]`).eq(trueIndex).find('td:last');
          var val = $(this).val();
          lastTd.html(lastTdTpl(val, trKey, index));

          // console.log('trKey', trKey);
          // console.log('index', index);

          that.tableDatas[trKey.slice(-1)][index]['filterCode'] = val;
          that.emitEvent('onChange', that.tableDatas);
        });


        this.tbody.on('input', 'input[name=param]', function () {
          console.log('param input');
          that.setVal('param', this);
        });
        this.tbody.on('change', 'select[name=param]', function () {
          console.log('param change');
          that.setVal('param', this);
        });
      },

      setVal: function(type, dom) {
        var trKey = $(dom).attr('trKey').slice(-1);
        var index = $(dom).attr('index') || 0;
        // console.log('trKey', trKey, index);
        this.tableDatas[trKey][index][type] = $(dom).val();
        this.emitEvent('onChange', this.tableDatas);
      },

      handleGroupClick: function() {
        this.rowIndex++;
        // $.extend({}, this.baseRow, { uuid: 'ff0' })
        this.tableDatas[this.rowIndex] = [$.extend({}, this.baseRow, { varName: 'f_0' })];
        this.addGroup('row' + this.rowIndex);
      },


      handleConditionClick: function () {
        if (!this.tableDatas.length) {
          this.handleGroupClick();
        }else {
          var uuid = 'f_' + this.tableDatas[this.rowIndex].length;
          this.tableDatas[this.rowIndex].push($.extend({}, this.baseRow, { varName: uuid }));
          this.addCondition(this.rowIndex);
        }
        // console.log(this.tableDatas);
      },

      handleDelClick: function () {
        var lastRow = this.tbody.find('tr:last');
        var rowKey = lastRow.attr('rowKey');
        var topKey = lastRow.attr('topKey');
        if (rowKey) {
          this.tableDatas.pop();
          this.delRow(rowKey, false);
          this.rowIndex--;
        }else if (topKey) {
          this.tableDatas[topKey.slice(-1)].pop();
          this.delRow(topKey, true);
        }
        // console.log(this.tableDatas);
      },

      delRow: function (key, reduceColspan) {
        this.tbody.find('tr:last').remove();
        if (reduceColspan) {
          this.tbody.find(`tr[rowKey=${key}] th`).attr('rowspan', this.tableDatas[key.slice(-1)].length);
        }
      },

      addGroup: function (key) {
        this.tbody.append(groupTpl(key));
      },
      addCondition: function (lastIndex) {
        var rowspan = this.tableDatas[lastIndex].length;
        var lastKey = 'row' + lastIndex;
        this.tbody.find(`tr[rowKey=${lastKey}] th`).attr('rowspan', rowspan);
        this.tbody.append(conditionTpl(lastKey, rowspan - 1));
      },

      getTableDatas: function () {
        return this.tableDatas.slice();
      },

      // 转参数
      transferParams: function () {
        if (this.tableDatas.length) {
          // 1--不采集 0--采集
          console.log('acquisitionType', this.acquisitionType);
          var datas = this.tableDatas.slice();
          var filterExpression = this.formatExpression(datas);
          if (this.acquisitionType === '1') {
            filterExpression = `!(${filterExpression})`;
          }
          var spiderFilterConfigList = _.flatten(datas);
          return {
            filterExpression: filterExpression,
            spiderFilterConfigList: spiderFilterConfigList
          }
        }
        return {};
      },
      formatExpression: function (arr) {
        return arr.map(function (row) {
          return row.map(function (y) {
            return `(${y.varName})`
          }).join('&&');
        }).join('||');
      }
    });
    w.ScreenTable = ScreenTable;
})(window);