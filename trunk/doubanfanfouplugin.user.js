// Doufan (Douban-Fanfou integration plugin)
// Version 0.3 beta
// Copyright (C) 2007, Li Fanxi <lifanxi (AT) freemindworld.com>
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Douban-Fanfou plugin", and click Uninstall.
//
//
// ==UserScript==
// @name Douban-Fanfou plugin
// @namespace http://www.freemindworld.com/db_ff/
// @description An plugin for the integration of Douban and Fanfou. 注意：目前本插件还在不断改进中，请随时关注http://www.freemindworld.com/db_ff/index.htm上的更新！与作者联系请通过邮件或GTalk:lifanxi@gmail.com
// @include http://www.douban.com/subject/*
// ==/UserScript==

var allLinks, thisLink;
allLinks = document.getElementsByTagName('a');
for (var i = 0; i < allLinks.length; i++)
{
    thisLink = allLinks[i];
    if (thisLink.href.indexOf("doulists") != -1)
      {
        var p = thisLink.parentNode;
        p.innerHTML += " &nbsp; &nbsp; &nbsp; ";
        var btn = document.createElement("a");
        btn.href = "#";
        btn.innerHTML="分享到饭否";
        btn.addEventListener("click", postFanfou,false);
        p.appendChild(btn);   
        break;   
    }   
}


function postFanfou(event)
{
    var title=getTitle();
    if (title == "")
    {
        return false;   
    }
    var notes=getMessage();
    if (notes == "")
    {
        return false;
    }
    var rate = getMyRate();
    var url = getURL();
    var msg = notes + ": " + title;
    if (url != "")
    {
        msg += " (" + url + " )";
    }
    if (rate != "")
    {
        msg += "，我的评价是: " + rate;
    }

    var additional = prompt("预览：\n" + msg + "\n\n你还可以添加一些附注：","");
    if (additional == null)
    {
        alert("放弃分享。");
        return;
    }
    if (additional != "")
        msg += "，" + additional;
    //    alert(msg);   
        GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://api.fanfou.com/statuses/update.xml',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: 'source=DoubanSharing&status=' + encodeURIComponent(msg),
        onload: function(responseDetails) {
        if (responseDetails.status == 200)
            alert("分享成功！\n------------------\n感谢您试用\"豆饭\"，目前\"豆饭\"还在不断完善中，请随时访问\nhttp://www.freemindworld.com/db_ff/index.html获取最新版本！");
        else
        {
                alert('分享失败！\n调试信息:\nreturned status:' + responseDetails.status +
                      ',statusText:' + responseDetails.statusText + '\n' +
                  ',responseHeaders:' + responseDetails.responseHeaders + '\n' +
                  'responseText:\n' + responseDetails.responseText);
        }
        }
        });
}


function getTitle()
{
    var allH1;
    allH1 = document.getElementsByTagName("h1");
    if (allH1.length >= 1)
    {
        return allH1[0].textContent;           
    }
    else
    {
        alert("无法获取资源名称！");       
        return "";
    }
}

function getMessage()
{
    var status;
	status = document.getElementById("interest_section");
	if (status)
	{
		if (status.parentNode.firstChild.tagName=="H2")
		{
			return status.parentNode.firstChild.textContent;
		}
		else
		{
			alert ("无法获取资源状态！请检查有无新版豆饭可解决此问题！");       
			return "";
		}
	}
	alert("您尚未收藏这个资源，请将它加入收藏后再分享到饭否。");
	return "";
}

function getMyRate()
{
    var myrate;
    myrate = document.getElementById("myratebar_5");
    if ((myrate) && (myrate.textContent != ""))
    {
        return "力荐";   
    }
    myrate = document.getElementById("myratebar_4");
    if ((myrate) && (myrate.textContent != ""))
    {
        return "推荐";   
    }
    myrate = document.getElementById("myratebar_3");
    if ((myrate) && (myrate.textContent != ""))
    {
        return "还行";   
    }
    myrate = document.getElementById("myratebar_2");
    if ((myrate) && (myrate.textContent != ""))
    {
        return "较差";   
    }
    myrate = document.getElementById("myratebar_1");
    if ((myrate) && (myrate.textContent != ""))
    {
        return "很差";   
    }
    return "";
}

function getURL()
{
    var allForms;
    allForms = document.getElementsByTagName("form");
    if (allForms.length >= 1)
    {
        for (var i = 0; i < allForms.length; i++)
        {
            if (allForms[i].name == "lzform")
            {
                return allForms[i].action;
            }
   
        }
    }
    else
    {
        return "";
    }   
}
