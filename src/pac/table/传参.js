// 传参：
function formatTableDatas(arr) {
  var filterExpression = formatExpression(arr);
  console.log('filterExpression', filterExpression);
  var spiderFilterConfigList = _.flatten(arr);
  /*{
    filterExpression,
    spiderFilterConfigList
  }*/
}


function formatExpression(arr) {
  return arr.map(function (row) {
    return row.map(function (y) {
      return `(${y.uuid})`
    }).join('&&');
  }).join('||');
}