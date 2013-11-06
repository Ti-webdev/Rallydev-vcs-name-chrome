// ==UserScript==
// @name Rallydev copy vcs name
// @description Copy task name to cvs trank name
// @author ti.webdev@gmail.com
// @run-at document-start
// @require https://yandex.st/jquery/2.0.2/jquery.min.js
// @include https://community.rallydev.com/*
// ==/UserScript==

(function() {
	var $ = jQuery.noConflict(true);
	var timer;

	var appendVcsName = function() {
		clearInterval(timer);
		timer = setInterval(function() {
			var $id = $('#detail_table th:has(>div.field-label:contains("ID:"))').next();
			if ($('#vcs-name').length) {
				return;
			}
			if ($id.length === 0) {
				return;
			}
			clearInterval(timer);
			var id = $id.text();
			var us = $('#detail_table th:has(>div.field-label:contains("Work Product:"))').next().children('a').text();
			var name = $('#detail_table th:has(>div.field-label:contains("Name:"))').next().text();
			var result = us.replace('[Continued]', '').replace(/^([^:]+): /, "$1_"+id+'_')+'_'+name;
			result = result.replace(/(does|do)n't/gi, '$1 not');
			result = result.replace(/[+:\s\/]+/g, '-');
			result = result.replace(/_-|-_/g, '_');
			result = result.replace(/--{2,}/g, '-');

			var $idTr = $id.closest('tr');
			var $vcs = $idTr.clone().attr('id', 'vcs-name');
			$vcs.find('th>div.field-label:contains("ID:")').text('CVS Name:')
				.closest('th').next().text(result);
			$vcs.insertBefore($idTr);
		}, 250);
	};

	var start = function() {
		appendVcsName();

		var timeout;
		document.addEventListener("DOMSubtreeModified", function() {
			if(timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(appendVcsName, 500);
		}, false);
	};

	$.fn.ready(start);
	// if ('undefined' !== document.body && document.body) {
	// 	start();
	// }
	// else if ('undefined' !== typeof opera) {
	// 	opera.addEventListener('BeforeEvent.DOMContentLoaded', start, true);
	// }
	// else {
	// 	document.addEventListener('DOMContentLoaded', start, true);
	// }
})();
