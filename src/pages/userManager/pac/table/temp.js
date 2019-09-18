var arr = [
  [{
    filedName: 'title',
    filterCode: '1',
    param: 'aa'
  }],
  [{
    filedName: 'source',
    filterCode: '2',
    param: 'bb'
  }, {
    filedName: 'time',
    filterCode: '2',
    param: '1234545653258'
  }, {
    filedName: 'source',
    filterCode: '2',
    param: 'bb'
  }],
  [{
    filedName: 'source',
    filterCode: '2',
    param: 'bb'
  }],
  [{
    filedName: 'time',
    filterCode: '2',
    param: '1234545653258'
  }]
];
//表达式
var exp = arr.map((item,i)=>{
  return '('+item.map((_,idx)=>'f_'+i+'_'+idx).join(' && ')+')';
}).join(' || ');
//降维
var flated = arr.flatMap((item,i)=>{
  return item.map((iitem,idx)=>{
    iitem.id = `f_${i}_${idx}`;
    return iitem;
  });
});
//反解析
var newArr = exp.split('||')
  .map(item=>item.match(/\((.*)\)/).last())
  .map(item=>item.split('&&').map(iitem=>iitem.trim()).map(iitem=>flated.find(iiitem=>iiitem.id == iitem)))