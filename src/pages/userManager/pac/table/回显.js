function restoreRes(response) {
  var rows = response.filterExpression.split('||').map(row => row.split('&&').map(function(item) {
    return response.formatFilterConfigs.find(function (val) {
      return val.uuid === item.replace(/\(|\)/g, '');
    });
  }));
  console.log('rows', rows);
}


