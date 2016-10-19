(function($) {

$(document).ready(function () {
	$('#logo').click(function() {
		window.location.assign('./index.html');
	});

	$('header').find('#news').click(function() {
		window.location.assign('./index.html?f=news');
	}).end().find('#activities').click(function() {
		window.location.assign('./index.html?f=activities');
	}).end().find('#download').click(function() {
		window.location.assign('./index.html?f=download');
	}).end().find('#laws').click(function() {
		window.location.assign('./index.html?f=laws');
	}).end().find('#links').click(function() {
		window.location.assign('./index.html?f=links');
	});

	switch($.getUrlVar('f')) {
		case 'news': 
			showNews();
		break;
		case 'activities': 
			showActivities();
		break;
		case 'download': 
			showDownload();
		break;
		case 'laws': 
			showLaws();
		break;
		case 'links': 
			showLinks();
		break;
		default:
			showIndex();
		break;
	}
});

function showIndex() {
	var $body = $('#body').load('./templete/index.html', function() {
	var	$news = $body.find('#news').load('./templete/news.html', function() {
			newsData.sort(function(a, b){return b.date-a.date});
			var $new = $news.find('#newnews').show();
			var length = newsData.length > 5 ? 5 : newsData.length;
			for (var i=0; i<length; i++) {
				$('<tr><td>'+dateFormat(newsData[i].date)+'</td><td><a href="./index.html?f=news&id='+newsData[i].id+'">'+newsData[i].title+'</a></td></tr>').appendTo($new);
			}
		});
	});
	
}

function showNews() {
	var $body = $('#body').load('./templete/news.html', function() {
		newsData.sort(function(a, b){return b.date-a.date});
		var id = $.getUrlVar('id');
		if(id == null) {
			$temp_news = $body.find('#news');
			for (var i=0; i<newsData.length; i++) {
				var content = newsData[i].content;
				if(content.length > 200)
					content = content.substr(0, 200) + "......";
				
				var $news = $temp_news.clone().show();
				$news.find('#title').html(newsData[i].title).attr('href', './index.html?f=news&id='+newsData[i].id).end()
					.find('#date').html(dateFormat(newsData[i].date)).end()
					.find('#content').html(content).end()
					.find('input[type=button]').click({index: i}, function(e) {
						window.location.assign('./index.html?f=news&id='+newsData[e.data.index].id);
					});
				$body.append($news);
			}
		}else {
			var d;
			for (var i = 0; i < newsData.length; i++){
			  if (newsData[i].id == id){
				  d = newsData[i];
				  break;
			  }
			}
			if(d == null) {
				alert('連結錯誤');
				window.location.assign('./index.html?f=news');
			}
				
			
			$body.find('#news').show().find('#title').html(d.title).end()
				.find('#date').html(dateFormat(d.date)).end()
				.find('#content').html(d.content).end()
				.find('input[type=button]').hide();
		}
	});
}

function showActivities() {
	var stickArr = null;
	$.ajaxSetup ({
		cache: false
	});
	var $body = $('#body').load('./templete/activities.html', function() {
		$timeline = $('#year');
		actData.sort(function(a, b){return b.date-a.date});
		
		for (var i=0; i<actData.length; i++) {
			var year = actData[i].date.toString().slice(0, 4);
			var month = actData[i].date.toString().slice(4, 6);
			
			var $year = $timeline.find('#'+year);
			var $monthline;
			if($year.length == 0)
				$timeline.append('<li id="'+year+'">'+year+'年<ul id="month"><ul></li>');
			
			$monthline = $timeline.find('#'+year).find('#month');
			var $month = $monthline.find('#'+month);
			if($month.length == 0)
				$monthline.append('<li id="'+month+'" value=1>'+month+'月(1)</li>').find('#'+month).click({hash: year+month}, function(e) {
					//window.location.hash = '#'+e.data.hash;
					$('body').animate({
						scrollTop: $('#'+e.data.hash).offset().top
					}, 500);
				});
			else {
				$month.attr('value', parseInt($month.attr('value'))+1).html(month+'月('+$month.attr('value')+')')
			}
			
			$body.append('<div style="height:60px;" id="'+year+month+'"><h3>'+actData[i].name+'</h3></div>');
			for (var j=0; j<actData[i].img.length; j++) {
				$('<div class="frame"><img data-original="./img/'+actData[i].name+'/thumbs/'+actData[i].img[j]+'" class="picture"></div>').appendTo($body);
			}
		}
		$('.picture').showPicture();
		
		stickArr = $body.find('h3');
		$(window).scroll(function() {
			var a = false;
			for(var i=stickArr.length-1; i>=0; i--) {
				var $stick = stickArr.eq(i);
				if($stick.attr('top') < $(window).scrollTop() && a==false) {
					$stick.addClass('sticking');
					a = true;
				}else {
					$stick.removeClass();
					$stick.attr('top', $stick.position().top);
				}
			}
		});
	});
	$.ajaxSetup ({
		cache: true
	});
}

function showDownload() {
	$('#body').load('./templete/download.html', function() {
	});
}

function showLaws() {
	$('#body').load('./templete/laws.html', function() {
		$('#body').find('p:odd').addClass('odd');
	});
}

function showLinks() {
	$('#body').load('./templete/links.html', function() {
		$('#body').find('p:odd').addClass('odd');
	});
}

function dateFormat(date){
	var str = date.toString();
	return str.slice(0,4) + '-' + str.slice(4,6) + '-' + str.slice(6,8);
}

$.extend({
	getUrlVars: function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name) {
		return $.getUrlVars()[name];
	}
});

$.fn.extend({
	showPicture: function() {
		return this.each(function() {
      			var $this = $(this).lazyload({event:"scrollstop", effect: "fadeIn", threshold: 480}).click(function () {	//, event: "scrollstop"
				$('#bigPicture').show().append($('<img src="'+$this.attr("src").replace("/thumbs", "")+'">')).find('#close').one('click', function() {
					$('#bigPicture').hide().find('img').remove();
				});
				$this.attr('src');
			});
		});
	}
});

})(jQuery)