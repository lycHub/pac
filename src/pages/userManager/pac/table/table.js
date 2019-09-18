console.log('table');
var baseRow = {
  group: '并且',
  filedName: 'title',
  filterCode: '1',
  param: ''
};
var rowIndex = 0;
var tableDatas = {};


$(function () {
  var table = $('.modal-wrap .table');
  var btns = {
    group: table.find('.group'),
    condition: table.find('.condition'),
    del: table.find('.del'),
    test: table.find('.test'),
  }
  var tbody = table.find('tbody');


  btns.test.click(function () {
    // console.log(format(new Date(2014, 1, 11), 'MM/dd/yyyy'));
    // console.log(+moment().subtract(1, 'M').endOf('month'));

    var obj = {
      '前天': +moment().subtract(1, 'M').endOf('month')
    }
    for (var attr in obj) {
      console.log('attr', attr);
      console.log('val', obj[attr]);
    }
    // console.log(obj);
  });

  btns.group.click(handleGroupClick);

  function handleGroupClick() {
    rowIndex++;
    const trKey = 'row' + rowIndex;
    tableDatas[trKey] = [{ ...baseRow }];
    addGroup(trKey);
    console.log(tableDatas);
  }

  btns.condition.click(function () {
    if ($.isEmptyObject(tableDatas)) {
      handleGroupClick();
    }else {
      var lastKey = 'row' + rowIndex;
      tableDatas[lastKey].push({ ...baseRow });
      // console.log('tableDatas', tableDatas[lastKey]);
      addCondition(lastKey);
    }
    console.log(tableDatas);
  });


  btns.del.click(function () {
    var lastRow = tbody.find('tr:last');
    var rowKey = lastRow.attr('rowKey');
    var topKey = lastRow.attr('topKey');
    if (rowKey) {
      delete tableDatas[rowKey];
      // console.log('rowKey', rowKey, tableDatas);
      delRow(rowKey, false);
    }else if (topKey) {
      tableDatas[topKey].pop();
      // console.log('topKey', topKey, tableDatas);
      delRow(topKey, true);
    }
    console.log(tableDatas);
  });
  
  function delRow(key, reduceColspan) {
    tbody.find('tr:last').remove();
    if (reduceColspan) {
      tbody.find(`tr[rowKey=${key}] th`).attr('rowspan', tableDatas[key].length);
    }
  }
  
  
  function addCondition(lastKey) {
    var rowspan = tableDatas[lastKey].length;
    tbody.find(`tr[rowKey=${lastKey}] th`).attr('rowspan', rowspan);
    tbody.append(conditionTpl(lastKey, rowspan - 1));
  }


  function addGroup(key) {
    tbody.append(groupTpl(key));
  }



  tbody.on('change', 'select[name=filedName]', function () {
    console.log('filedName');
    setVal.call(this, 'filedName');
  });

  tbody.on('change', 'select[name=filterCode]', function () {
    console.log('filterCode');

    var keyName = $(this).attr('keyName');
    var trKey = $(this).attr('trKey');
    var index = $(this).attr('index') || 0;
    var trueIndex = index > 0 ? index - 1 : 0;
    var lastTd = tbody.find(`tr[${keyName}=${trKey}]`).eq(trueIndex).find('td:last');
    var val = $(this).val();
    lastTd.html(lastTdTpl(val, trKey, index));
    // console.log('trKey', trKey);
    // console.log('index', index);
    tableDatas[trKey][index]['filterCode'] = val;
    console.log('filterCode', tableDatas);
  });


  tbody.on('input', 'input[name=param]', function () {
    console.log('param input');
    setVal.call(this, 'param');
  });
  tbody.on('change', 'select[name=param]', function () {
    console.log('param change');
    setVal.call(this, 'param');
  });

  function setVal(type) {
    var trKey = $(this).attr('trKey');
    var index = $(this).attr('index') || 0;
    tableDatas[trKey][index][type] = $(this).val();
    console.log('tableDatas', tableDatas);
  }
});