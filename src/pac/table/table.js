console.log('table');
var baseRow = {
  // group: '并且',
  filedName: 'title',
  filterCode: '1',
  param: ''
};
var rowIndex = -1;
var tableDatas = [];


$(function () {
  /*$( ".modal-wrap" ).dialog({
    width: 630,
    modal: true,
    buttons: [
      {
        text: '取消',
        click: function() {
          $(this).dialog( "close" );
        }
      },
      {
        text: '确定',
        click: function() {

        }
      }
    ]
  });*/
  var table = $('.modal-wrap .table');
  var btns = {
    group: table.find('.group'),
    condition: table.find('.condition'),
    del: table.find('.del'),
    test: table.find('.test'),
  }
  var tbody = table.find('tbody');


  btns.test.click(function () {

  });

  btns.group.click(handleGroupClick);

  function handleGroupClick() {
    rowIndex++;
    tableDatas[rowIndex] = [{ ...baseRow, uuid: 'ff0' }];
    addGroup('row' + rowIndex);

  }

  btns.condition.click(function () {
    if (!tableDatas.length) {
      handleGroupClick();
    }else {
      var uuid = 'ff' + tableDatas[rowIndex].length;
      tableDatas[rowIndex].push({ ...baseRow, uuid: uuid });
      addCondition(rowIndex);
    }
    console.log(tableDatas);
  });


  btns.del.click(function () {
    var lastRow = tbody.find('tr:last');
    var rowKey = lastRow.attr('rowKey');
    var topKey = lastRow.attr('topKey');
    if (rowKey) {
      tableDatas.pop();
      delRow(rowKey, false);
      rowIndex--;
    }else if (topKey) {
      tableDatas[topKey.slice(-1)].pop();
      delRow(topKey, true);
    }
    console.log(tableDatas);
  });
  
  function delRow(key, reduceColspan) {
    tbody.find('tr:last').remove();
    if (reduceColspan) {
      tbody.find(`tr[rowKey=${key}] th`).attr('rowspan', tableDatas[key.slice(-1)].length);
    }
  }
  
  
  function addCondition(lastIndex) {
    var rowspan = tableDatas[lastIndex].length;
    var lastKey = 'row' + lastIndex;
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

    tableDatas[trKey.slice(-1)][index]['filterCode'] = val;
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
    var trKey = $(this).attr('trKey').slice(-1);
    var index = $(this).attr('index') || 0;
    // console.log('trKey', trKey, index);
    tableDatas[trKey][index][type] = $(this).val();
    console.log('tableDatas', tableDatas);
  }
});

