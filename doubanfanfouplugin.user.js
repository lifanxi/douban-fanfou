// Doufan (Douban-Fanfou integration plugin)
// Version 0.4 beta
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
// $Id: doubanfanfouplugin.user.js 9 2007-07-28 11:42:05Z lifanxi $
//
// ==UserScript==
// @name Douban-Fanfou plugin
// @namespace http://www.freemindworld.com/db_ff/
// @description An plugin for the integration of Douban and Fanfou. 
// @include http://www.douban.com/subject/*
// @include http://www.douban.com/people/*/miniblogs*
// @include http://www.douban.com/people/*/contact_miniblogs*
// ==/UserScript==

// Check if the environment is OK
if (ChkEnv())
{
    // We want to know on which page we are staying and do different things.
	var pageUrl = document.location.href;
	if (pageUrl.indexOf("contact_miniblogs") != -1)
	{
		// Friends' Miniblog
		DoContactMiniblog();
	}
	else if (pageUrl.indexOf("miniblogs") != -1)
	{
		// My Miniblog
		DoMiniblog();
	}
	else
	{
		// Resource pages (Books, Movies, Musics)
		DoSubject();
	}
}

// My Miniblog
function DoMiniblog()
{
    var allDivs;
    allDivs = document.getElementsByTagName("div");
    for (var i = 0; i < allDivs.length; i++)
    {
        if (allDivs[i].className == "sbjtd")
        {
            allDivs[i].innerHTML += "&nbsp;&nbsp;";
			allDivs[i].appendChild(MakeTellFanfouBtn());
            break;
        }
    }
}

// Friends' Miniblog()
function DoContactMiniblog()
{
	var allForms;
	allForms = document.getElementsByTagName("form");
	for (var i = 0; i < allForms.length; ++i)
	{
		if (allForms[i].name == "mbform")
		{
			if (allForms[i].childNodes[1].tagName == "DIV")
			{
				allForms[i].childNodes[1].innerHTML += "&nbsp;&nbsp;";
				allForms[i].childNodes[1].appendChild(MakeTellFanfouBtn());
			}
		}
	}
}

// Make the "tell fanfou" button
function MakeTellFanfouBtn()
{
	var btn = document.createElement("input");
	btn.class = "butt";
	btn.type = "button";
	btn.value = "告诉饭否";
	btn.name = "tellfanfou";
	btn.addEventListener("click", PostMiniblogFF, false);
	return btn;
}

function PostMiniblogFF(event)
{
    var data = event.target.form.elements[0].value;
    if (data != "")
    {
		var msg = "通过豆瓣语录说：" + data;
		if (msg.length > 140)
		{
			alert("告诉饭否的语录不能超过132个字。");
			return;
		}
        SendRequest(msg);
    }
    event.target.form.submit();
}

function DoSubject()
{
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
			btn.addEventListener("click", PostFanfou,false);
			p.appendChild(btn);   
			break;   
		}   
	}
}

function PostFanfou(event)
{
    var title=GetTitle();
    if (title == "")
    {
        return false;   
    }
    var notes=GetMessage();
    if (notes == "")
    {
        return false;
    }
    var rate = GetMyRate();
    var url = GetURL();
    var msg = notes + ": " + title;
    if (url != "")
    {
        msg += " (" + url + " )";
    }
    if (rate != "")
    {
        msg += "，我的评价是: " + rate;
    }

    var additional = prompt("预览：\n" + msg + "\n\n你还可以添加一些附注(不超过" + (139-msg.length) + "字)：","");
    if (additional == null)
    {
        alert("放弃分享。");
        return;
    }
    if (additional != "")
        msg += "，" + additional;
    SendRequest(msg);
}
function SendRequest(msg)
{
//    alert(msg + msg.length);
//    return;
	GM_xmlhttpRequest({
        method: 'POST',
				url: 'http://api.fanfou.com/statuses/update.xml',
				headers: {'Content-type': 'application/x-www-form-urlencoded'},
				data: 'source=DoubanSharing&status=' + encodeURIComponent(msg),
				onload: function(responseDetails) {
				if (responseDetails.status == 200)
					alert("分享成功！");
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


function GetTitle()
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
		DoUpdate();
        return "";
    }
}

function GetMessage()
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
			alert ("无法获取资源状态！");
			DoUpdate();
			return "";
		}
	}
	alert("您尚未收藏这个资源，请将它加入收藏后再分享到饭否。");
	return "";
}

function GetMyRate()
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

function GetURL()
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

function ChkEnv()
{
	// Check xmlhttpRequest Support
	if (!GM_xmlhttpRequest)
	{
		alert("您的Greaskmonkey插件不能支持豆饭，请升级该插件或使用豆饭XPI版本。");
		return false;
	}
	// Check for update
	if (GM_setValue && GM_getValue)
	{
		var lastCheck = GM_getValue("DoufanLastUpdate", 0);
		var dateDiff = Date.now()/1000 - lastCheck;
		// Check every 24 hours
		if ((dateDiff > 60*60*24) || (dateDiff < 0))
		{	
			DoUpdate();
		}
	}
	return true;
}

function DoUpdate()
{
	var currentRevision = 4;
	GM_xmlhttpRequest(
		{
		method: 'GET',
		url: 'http://www.freemindworld.com/db_ff/LatestVersion.txt',
		onreadystatechange: function(response) 
			    {
					if ((response.readyState == 4) && (response.status == 200))
					{
						if (parseInt(response.responseText) > currentRevision)
						{
							if (GM_setValue)
							{
								GM_setValue("DoufanLastUpdate", parseInt(Date.now()/1000));
							}
							alert("豆饭出新版本了，确定后会自动打开豆饭网页(http://www.freemindworld.com/db_ff/index.htm)，请升级到最新版本使用。");
							window.open("http://www.freemindworld.com/db_ff/index.htm");
						}
					}
				}
        });
}

