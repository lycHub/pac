//默认每页条数
var FINANCE_TABLE_SIZE = 10;
function getDisplayStart() {
	var displayStart = $.cookie('page_start');
	if (displayStart == 'null' || !displayStart) {
		displayStart = 0;
	} else {
		displayStart = parseInt(displayStart);
		$.cookie('page_start', null);
	}
	return displayStart;
}

function getDisplayPageNo(isClean) {
	if (isClean == undefined) {
		isClean = true;
	}
	var displayPageNo = $.cookie('page_start_no');
	if (displayPageNo == 'null' || !displayPageNo) {
		displayPageNo = 1;
	} else {
		displayPageNo = parseInt(displayPageNo);
		if (isClean == true) {
			$.cookie('page_start_no', null);
		}
	}
	return displayPageNo;
}	
/**
 * dataTables的包装处理
 * @author
 * @param options
 * @returns
 */
function dataTablesWrap(options){
	
	//参数
	var defaults={
		render:"#ajaxListData",	//要将dataTable添加到该元素下,jquery获取元素方式
		basePath:"",//基本的地址一般写${base}
		url:"ajaxListData.do",//请求的默认url
		displayLength:10, //默认每页显示条数
		data:{}, // 请求参数
		seq:{show:true, index:0 }, //显示序号:show:是否显示; index:显示所在的列索引,从0开始
		info: true, //是否显示页码,条数,等详细信息
		lengthChange:false,
		aLengthMenu: [10, 20, 30,50,100],
		// aLengthMenu: [[10, 25, 50, -1], ["10条", "25条", "50条", "All"]],
		order:[],//默认排序字段
		sort:false, //默认部排序
		paging:true,
		columns:[], //数据表的列
		displayStart:0,
		pageCallback:{},
		createdRow:function (row, data, index) {
	        /* 设置表格中的内容默认居中 */
	        $('td', row).addClass("text-center");
	    },
	    fnDrawCallback:function(table){
			//当翻页的时候
	    	if(options.onChangePage) {
	    		//把数据传进给回调函数
				options.onChangePage(table.json.data);
			}
	    	
	    	if (table.json.data && table.json.data.length && table.json.data.length > 0) {
				$(options.render + "_paginate").show();
				$(options.render + "_info").show();
				$(options.render + "_length").show();
			} else {
				$(options.render + "_paginate").hide();
				$(options.render + "_info").hide();
				$(options.render + "_length").hide();
			}
	    	
	    	if (options.definedCallBack != undefined && typeof options.definedCallBack == 'function') {
	    		var _params = {"total":table._iRecordsTotal};
	    		options.definedCallBack(_params);
	    	}
	    	
	    	if (options.showTooltip != undefined) {
	    		$("div.popover").remove();//删除原有的提示信息
	    		$("div.showTooltip").each(function() {
	    			if(!$(this).attr("data-content")){
	    				var _configs = options.showTooltip;
		    			_configs.params = {"primaryId":$(this).attr("primaryId")};
	    				$(this).ftooltips(_configs);
	    			}
    			});
	    	}
	    	
	    	
	    	
	    	
	    	//table._iRecordsTotal;
	    	
	    	var pageSize = table._iDisplayLength;
	    	var totalSize = table._iRecordsTotal;
	    	var totalPage = Math.ceil(totalSize / pageSize);
	    	
	    	$(options.render + "_paginate").append("<div style='float:right' >&nbsp;&nbsp;到第&nbsp;<input style='height:28px;line-height:28px;width:40px;' class='margin text-center' id='changePage' maxPage='"+totalPage+"' type='text'>&nbsp;页&nbsp;&nbsp;<a class='btn btn-default shiny' style='margin-bottom:5px' href='javascript:void(0);' id='dataTable-btn'>确定</a></div>");
	    	var oTable = $(options.render).dataTable();
            $('#dataTable-btn').click(function(e){
            	var redirectpage = $("#changePage").val();
            	if(redirectpage == ""){
            		$("#changePage").focus();
            	}else{
            		var rex = /^\d+$/;
            		if(!rex.test(redirectpage)){
            			alert("页码输入有误，只能输入不大于总页数的正整数");
            		}else{
            			var pageNo = parseInt(redirectpage);
            			var totalPage = $("#changePage").attr("maxPage");
            			if(pageNo <= 0 || pageNo > parseInt(totalPage)){
            				alert("页码输入有误，只能输入不大于总页数的正整数");
            			}else{
            				oTable.fnPageChange( pageNo - 1 );
            			}
            		}
            	}
                /*if($("#changePage").val() && $("#changePage").val()>0){
                    var redirectpage = $("#changePage").val()-1;
                    oTable.fnPageChange( redirectpage );
                }else{
                	alert("页码输入有误，只能输入不大于总页数的正整数");
                }*/
            });
            
            if (typeof options.pageCallback == 'function') {
            	options.pageCallback();
            }
	    
	    },
	};
	
	var options = $.extend(defaults, options);
	var rowNum = {fn:$.noop};
	var argsData = options.columns; 
	
	if(options.seq && options.seq.show) {
		rowNum.fn = function( nRow, aData, iDisplayIndex ) {
			var tableSetings=$(options.render).dataTable().fnSettings();  
	     	var page_start=tableSetings._iDisplayStart;//当前页开始

	     	$('td:eq(' + options.seq.index + ')', nRow).html( iDisplayIndex+1+page_start ); 
	     };
	     
	     argsData.splice(options.seq.index, 0, {"sortable": false, "render":function (data, type, full, meta){return 1;}});
	}
	
	return $(options.render).dataTable({
		order:options.order,
		processing: true,
		paging:options.paging,
	    serverSide: true,
	    ajax:{
	 	   type:"POST",
	 	   url:options.url,
			data:options.data,
			dataSrc:options.dataSrc
	    },
	    info: options.info,
	    bSort:options.sort,
	    createdRow:options.createdRow,
	    fnDrawCallback:options.fnDrawCallback,
	    searching: false,
	    lengthChange: options.lengthChange,
	    aLengthMenu: options.aLengthMenu,
	    sDom:"frtlip",
	    destroy: true,
	    displayLength:options.displayLength,
	    displayStart:options.displayStart,
	    language: {
	         url: options.basePath + "/assets/js/dataTables/Chinese.json"
	     },
	    fnRowCallback: rowNum.fn,
	    columns:argsData,
	    pagingType: "full_numbers"
	});
}