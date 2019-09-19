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


function groupTpl(key) {
  return `<tr rowKey="${key}">
          <th>或者</th>
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" trKey="${key}" keyName="rowKey">
               <option value="title">标题</option>
              <option value="source">来源</option>
              <option value="author">作者</option>
              <option value="articleTime">时间</option>
            </select>
          </td>
          <td>
            <select name="filterCode" class="form-control" trKey="${key}" keyName="rowKey">
              <option value="1">空</option>
              <option value="2">非空</option>
              <option value="3">包含</option>
              <option value="4">不包含</option>
              <option value="5">等于</option>
              <option value="6">不等于</option>
              <option value="7">大于</option>
              <option value="8">小于</option>
              <option value="9">时间等于</option>
              <option value="10">时间早于</option>
              <option value="11">时间晚于</option>
            </select>
          </td>
          <td class="min200">
            <!--<input placeholder="值" class="form-control hide" name="param" />-->
          </td>
        </tr>`;
}

function conditionTpl(key, index) {
  console.log('index', index);
  return `<tr topKey="${key}" index="${index}">
          <td>并且</td>
          <td>
            <select name="filedName" class="form-control" index="${index}" trKey="${key}" keyName="topKey">
              <option value="title">标题</option>
              <option value="source">来源</option>
              <option value="author">作者</option>
              <option value="articleTime">时间</option>
            </select>
          </td>
          <td>
            <select name="filterCode" class="form-control" index="${index}" trKey="${key}" keyName="topKey">
              <option value="1">空</option>
              <option value="2">非空</option>
              <option value="3">包含</option>
              <option value="4">不包含</option>
              <option value="5">等于</option>
              <option value="6">不等于</option>
              <option value="7">大于</option>
              <option value="8">小于</option>
              <option value="9">时间等于</option>
              <option value="10">时间早于</option>
              <option value="11">时间晚于</option>
            </select>
          </td>
          <td class="min200">
            <!--<input placeholder="值" class="form-control hide" name="param" />-->
          </td>
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

function emptyTpl(key, index) {
  return `<input placeholder="值" trKey="${key}" index="${index}"  class="form-control hide" name="param" />`;
}
function inputTpl(key, index) {
  return `<input placeholder="值" trKey="${key}" index="${index}"  class="form-control" name="param" />`;
}
function defaultTpl(key, index) {
  var options = '';
  for (var attr in times) {
    options += `<option value="${times[attr]}">${attr}</option>`;
  }
  // console.log('options', options);
  return `<select name="param" class="form-control" trKey="${key}" index="${index}">${options}</select>`;
}


function lastTdTpl(type, key, index) {
  return strats[type] ? strats[type](key, index) : defaultStrat(key, index);
}