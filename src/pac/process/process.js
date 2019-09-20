console.log('process');
$(function () {
  $(".modal-wrap").dialog({
    width: 450,
    // height: 500,
    modal: true,
    resizable: false,
    closeOnEscape: false,
    title: "数据处理",
    buttons: [
      {
        text: '取消',
        click: function() {

        }
      },
      {
        text: '确定',
        click: function() {

        }
      }
    ]
  });

  var el = $('.modal-wrap');



  el.find('.pc-process .fa').tooltip({
    position: { my: "left+10", at: "right" },
    classes: {
      "ui-tooltip": "pc-process-tip"
    }
  });
});