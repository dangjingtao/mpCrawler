// ==UserScript==
// @name           mpCrawler Dev
// @namespace      https://github.com/dangjingtao/mpCrawler
// @version        0.0.1
// @author         Tomz Dang
// @description    获取微信公众号文章发布的文章标题、阅读数、点赞数、评论数，并下载成表格
// @include        *
// @homepage       https://github.com/dangjingtao/mpCrawler#readme
// @match          https://mp.weixin.qq.com/cgi-bin/appmsgpublish*
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.12/dayjs.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @run-at         document-end
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @connect        api.moonshot.cn
// @require        /Users/tao/Desktop/微信公众号/mpCrawler/dist/main.dev.user.js
// ==/UserScript==