var initTableTpl = `<div class="screen-wrap">
    <div class="caption clearfix">
      <div class="btn-group" role="group">
        <button class="btn group">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          新建分组
        </button>
        <button class="btn condition">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          新建条件
        </button>
        <button class="btn del">
          <span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>
          删除
        </button>
      </div>
      <div class="select">
        <span>当满足以下条件时：</span>
        <select name="acquisitionType">
          <option value="0">采集该数据</option>
          <option value="1">不采集该数据</option>
        </select>
      </div>
    </div>


    <div class="screen-table-wrap">
      <table class="table table-striped table-bordered table-hover text-align-center screen-table">
        <thead>
        <tr>
          <th class="min80">组间关系</th>
          <td class="min80">组内关系</td>
          <td>字段名称</td>
          <td class="min120">条件</td>
          <td class="min100">值</td>
        </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>`;



/*var times = {
  '前天': +moment().subtract(2, 'd'),
  '昨天': +moment().subtract(1, 'd'),
  '今天': +moment(),
  '明天': +moment().add(1, 'd'),
  '后天': +moment().add(2, 'd'),
  '上周今天': +moment().subtract(1, 'w'),
  '上周一': +moment().subtract(1, 'w').startOf('week'),
  '上周日': +moment().subtract(1, 'w').endOf('week'),
  '上月今天': +moment().subtract(1, 'M'),
  '上月第一天': +moment().subtract(1, 'M').startOf('month'),
  '上月最后一天': +moment().subtract(1, 'M').endOf('month'),
}*/

var times = [{
  key: '101',
  label: '前天'
}, {
  key: '102',
  label: '昨天'
}, {
  key: '103',
  label: '今天'
}, {
  key: '104',
  label: '明天'
}, {
  key: '105',
  label: '后天'
}, {
  key: '201',
  label: '上周今天'
}, {
  key: '202',
  label: '上周一'
}, {
  key: '203',
  label: '上周日'
}, {
  key: '301',
  label: '上月今天'
}, {
  key: '302',
  label: '上月第一天'
}, {
  key: '303',
  label: '上月最后天'
}];


var filedNameOpts = {
  title: '标题',
  content: '内容',
  source: '来源',
  author: '作者',
  articleTime: '文字发表时间',
  targetUrl: '文章链接',
}

function generatefieldNameSelect(selected) {
  var value = selected || '';
  var opts = '';
  for (var attr in filedNameOpts) {
    var opt = `<option value="${attr}">`;
    if (attr === value) {
      opt = `<option value="${attr}" selected>`;
    }
    opts += `${opt}${filedNameOpts[attr]}</option>`;
  }
  return opts;
}



var filterCodeOpts = ['', '空', '非空', '包含', '不包含', '等于', '不等于', '大于', '小于', '时间等于', '时间早于', '时间晚于'];

function generatefiledCodeSelect(selected) {
  var value = selected || '';
  var opts = '';
  filterCodeOpts.forEach(function (item, key) {
    if (item) {
      var opt = `<option value="${key}">`;
      if (key == value) {
        opt = `<option value="${key}" selected>`;
      }
      opts += `${opt}${item}</option>`;
    }
  });
  return opts;
}


function groupTableTpl(key) {
  return `<tr rowKey="${key}">
          <th>或者</th>
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" trKey="${key}" keyName="rowKey">${generatefieldNameSelect()}</select>
          </td>
          <td>
            <select name="filterCode" class="form-control" trKey="${key}" keyName="rowKey">${generatefiledCodeSelect()}</select>
          </td>
          <td></td>
        </tr>`;
}

function conditionTableTpl(key, index) {
  return `<tr topKey="${key}" index="${index}">
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefieldNameSelect()}</select>
          </td>
          <td>
            <select name="filterCode" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefiledCodeSelect()}</select>
          </td>
          <td></td>
        </tr>`;
}


var strats = {};

// 无内容
var emptyStrat = ['1', '2'];

// 输入框
var inputStrat = ['3', '4', '5', '6', '7', '8'];

var defaultStrat = defaultTableTpl;

emptyStrat.forEach(key => {
  strats[key] = emptyTableTpl;
});
inputStrat.forEach(key => {
  strats[key] = inputTableTpl;
});
// trKey="${key}" index="${index}"

function emptyTableTpl(key, index, val) {
  return `<input placeholder="值" trKey="${key}" index="${index}" value="${val}" class="form-control hide" name="param" />`;
}
function inputTableTpl(key, index, val) {
  return `<input placeholder="值" trKey="${key}" index="${index}" value="${val}" class="form-control" name="param" />`;
}
function defaultTableTpl(key, index, val) {
  var options = '';
  times.forEach(function (item) {
    // options += `<option value="${item.key}">${item.label}</option>`;
    var opt = `<option value="${item.key}">`;
    if (item.key == val) {
      opt = `<option value="${item.key}" selected>`;
    }
    options += `${opt}${item.label}</option>`;
  });
  // console.log('options', options);
  return `<select name="param" class="form-control" trKey="${key}" index="${index}">${options}</select>`;
}



function lastTdTpl(type, key, index, val) {
  var value = val || '';
  return strats[type] ? strats[type](key, index, value) : defaultStrat(key, index, value);
}