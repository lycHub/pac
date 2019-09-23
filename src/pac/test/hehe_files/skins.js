function createCookie(n, t, i) {
	var r, u;
	i ? (r = new Date, r.setTime(r.getTime() + i * 864e5), u = "; expires=" + r.toGMTString()) : u = "";
	document.cookie = n + "=" + t + u + "; path=/"
}
function readCookie(n) {
	for (var t, r = n + "=",u = document.cookie.split(";"), i = 0; i < u.length; i++) {
		for (t = u[i]; t.charAt(0) == " ";) t = t.substring(1, t.length);
		if (t.indexOf(r) == 0) return t.substring(r.length, t.length)
	}
	return null
}
function eraseCookie(n) {
	createCookie(n, "", -1)
}
function getInternetExplorerVersion() {
	var n = -1,
	t, i;
	return navigator.appName == "Microsoft Internet Explorer" && (t = navigator.userAgent, i = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})"), i.exec(t) != null && (n = parseFloat(RegExp.$1))),
	n
}
function IsMobile()  
{  
	var userAgentInfo = navigator.userAgent;  
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
	var flag = false;  
	for (var v = 0; v < Agents.length; v++) {  
	   if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }  
	}  
	return flag;  
}   
if(IsMobile()){
	var a = document.createElement("meta");
    a.setAttribute("name", "viewport");
    a.setAttribute("content","width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no");
    document.getElementsByTagName("head")[0].insertBefore(a, document.getElementsByTagName("head")[0].childNodes[0]);
}
/*

//# sourceMappingURL=skins.min.js.map
*/
