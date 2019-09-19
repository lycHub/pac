/*function restoreRes(response) {
  var rows = response.filterExpression.split('||').map(row => row.split('&&').map(function(item) {
    return response.formatFilterConfigs.find(function (val) {
      return val.uuid === item.replace(/\(|\)/g, '');
    });
  }));
  console.log('rows', rows);
}*/


var response = {
  filterExpression: '(ff0)||(ff0)&&(ff1)&&(ff2)||(ff0)||(ff0)||(ff0)&&(ff1)||(ff0)',
  formatFilterConfigs: [
    {
      filedName: 'title',
      filterCode: '4',
      param: '',
      uuid: 'ff0'
    },
    {
      filedName: 'title',
      filterCode: '3',
      param: '322',
      uuid: 'ff0'
    }, {
      filedName: 'source',
      filterCode: '3',
      param: 'ds',
      uuid: 'ff1'
    }, {
      filedName: 'author',
      filterCode: '4',
      param: 'dss',
      uuid: 'ff2'
    },
    {
      filedName: 'source',
      filterCode: '9',
      param: '',
      uuid: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '10',
      param: '',
      uuid: 'ff0'
    },
    {
      filedName: 'author',
      filterCode: '5',
      param: '32',
      uuid: 'ff0'
    }, {
      filedName: 'author',
      filterCode: '3',
      param: '345',
      uuid: 'ff1'
    },
    {
      filedName: 'title',
      filterCode: '1',
      param: '',
      uuid: 'ff0'
    }
  ]
}

restoreRes(response);

function restoreRes(response) {
  var formatFilterConfigs = response.formatFilterConfigs.slice();
  tableDatas = response.filterExpression.split('||').map(row => row.split('&&').map(function() {
    return formatFilterConfigs.shift();
  }));
  generateTable(tableDatas);
}

function generateTable(rows) {
  var trs = '';
  rows.forEach(function (row, key) {
    rowIndex++;
    row.forEach(function (item, index, arr) {
      if (index === 0) {  //group
        trs += generateRow('row' + key, item.filedName, item.filterCode, item.param, index, arr.length);
      }else {   // condition
        trs += generateChildRow('row' + key, item.filedName, item.filterCode, item.param, index);
      }
    });
  });
  console.log('trs', rowIndex, trs);
}

function generateRow(key, filedName, filterCode, param, index, rowspan) {
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
}

function generateChildRow(key, filedName, filterCode, param, index) {
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
}

