//处理列表页面的表格
(function(){
	if($(".dataTable")[0]){
		$(".dataTable").children("thead").find("th").each(function(){
			var text = $(this).html();
			var p = $("<p></p>").html(text).css({"white-space":"nowrap","line-height":"30px","height":"30px","margin":"0","padding":"0"});
			var width = $(this).attr("mwidth");
			if(width){
				width = parseInt(width);
				p.css({"min-width":width + "px"});
			}
			$(this).empty().append(p);
		});
		
		
		
		if(navigator.userAgent.indexOf("Firefox")>0){
			setTimeout(function(){
				var w = $(".dataTable").parent().width() - 1;
				$(".dataTable").css({"width":w + "px"});
			},500);
		}
	}
	
	$(window).resize(function(){
		
		setTimeout(function(){
			$(".ellipsis_div").hide();
			$(".ellipsis_div").each(function(){
				$(this).css({"max-width":$(this).parent().width() + "px"});
				$(".ellipsis_div").show();
			});
		},500);
	});
	
})()



