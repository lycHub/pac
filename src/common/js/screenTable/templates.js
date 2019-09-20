var initTpl = `<table class="table table-striped table-bordered table-hover text-align-center screen-table">
    <caption class="clearfix">
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
    </caption>
    <thead>
    <tr>
      <th>组间关系</th>
      <td>组内关系</td>
      <td>字段名称</td>
      <td>条件</td>
      <td>值</td>
    </tr>
    </thead>
    <tbody>

    </tbody>
  </table>`;



var times = {
  '前天': +moment().subtract(2, 'd'),
  '昨天': +moment().subtract(1, 'd'),
  '今天': +moment(),
  '明天': +moment().add(1, 'd'),
  '后天': +moment().subtract(2, 'd'),
  '上周今天': +moment().subtract(1, 'w'),
  '上周一': +moment().subtract(1, 'w').startOf('week'),
  '上周日': +moment().subtract(1, 'w').endOf('week'),
  '上月今天': +moment().subtract(1, 'M'),
  '上月第一天': +moment().subtract(1, 'M').startOf('month'),
  '上月最后一天': +moment().subtract(1, 'M').endOf('month'),
}


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
      if (key.toString() === value) {
        opt = `<option value="${key}" selected>`;
      }
      opts += `${opt}${item}</option>`;
    }
  });
  return opts;
}


function groupTpl(key) {
  return `<tr rowKey="${key}">
          <th>或者</th>
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" trKey="${key}" keyName="rowKey">${generatefieldNameSelect()}</select>
          </td>
          <td>
            <select name="filterCode" class="form-control" trKey="${key}" keyName="rowKey">${generatefiledCodeSelect()}</select>
          </td>
          <td class="min200"></td>
        </tr>`;
}

function conditionTpl(key, index) {
  return `<tr topKey="${key}" index="${index}">
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefieldNameSelect()}</select>
          </td>
          <td>
            <select name="filterCode" class="form-control" index="${index}" trKey="${key}" keyName="topKey">${generatefiledCodeSelect()}</select>
          </td>
          <td class="min200"></td>
        </tr>`;
}


var strats = {};

// 无内容
var emptyStrat = ['1', '2'];

// 输入框
var inputStrat = ['3', '4', '5', '6', '7', '8'];

var defaultStrat = defaultTpl;

emptyStrat.forEach(key => {
  strats[key] = emptyTpl;
});
inputStrat.forEach(key => {
  strats[key] = inputTpl;
});
// trKey="${key}" index="${index}"

function emptyTpl(key, index, val) {
  return `<input placeholder="值" trKey="${key}" index="${index}" value="${val}" class="form-control hide" name="param" />`;
}
function inputTpl(key, index, val) {
  return `<input placeholder="值" trKey="${key}" index="${index}" value="${val}" class="form-control" name="param" />`;
}
function defaultTpl(key, index, val) {
  var options = '';
  for (var attr in times) {
    options += `<option value="${times[attr]}">${attr}</option>`;
  }
  // console.log('options', options);
  return `<select name="param" class="form-control" trKey="${key}" index="${index}">${options}</select>`;
}


function lastTdTpl(type, key, index, val) {
  var value = val || '';
  return strats[type] ? strats[type](key, index, value) : defaultStrat(key, index, value);
}