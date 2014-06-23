var ProcessWireAdminTheme = {

	init: function() {

		var $button = $("#head_button > button.dropdown-toggle").hide();

        this.setupPanel();
        this.setupModal();
        this.setupPagination();
        this.setupThumbs();
        this.setupCloneButton();
		this.setupButtonStates();
		this.setupFieldFocus();
		this.setupTooltips();
		this.setupSearch();
		this.setupDropdowns();
        this.setupTop();
        this.setupMisc();
		this.browserCheck();

		if($button.size() > 0) $button.show();

    },

    setupPanel: function() {

        var $body = $('body'), sliding = false;

        function slideIn(panel, options) {

            var panelWidth = panel.outerWidth(true), bodyAnimation = {}, panelAnimation = {};

            if(panel.is(':visible') || sliding) {
                return;
            }

            sliding = true;

            panel.addClass('panelslider').css({
                position: 'fixed',
                top: 0,
                height: '100%',
                'z-index': 999999
            });

            panel.data(options);

            switch (options.side) {
                case 'left':
                    panel.css({
                        left: '-' + panelWidth + 'px',
                        right: 'auto'
                    });

                bodyAnimation['margin-left'] = '+=' + panelWidth;
                panelAnimation.left = '+=' + panelWidth;

                var windowWidth = $(window).width();
                if(windowWidth < 767) {
                    $('.container').css({
                        width: 1200 + 'px'
                    });
                } else {
                    $('.container').css({
                        width: 95 + '%'
                    });
                }

                $(window).resize(function() {
                    var windowWidth = $(window).width();
                    if(windowWidth < 767) {
                        $('.container').css({
                            width: 1200 + 'px'
                        });
                    } else {
                        $('.container').css({
                            width: 95 + '%'
                        });
                    }
                });

                break;

                case 'right':
                    panel.css({
                        left: 'auto',
                        right: '-' + panelWidth + 'px'
                    });

                bodyAnimation['margin-left'] = '-=' + panelWidth;
                panelAnimation.right = '+=' + panelWidth;

                var windowWidth = $(window).width();
                if(windowWidth < 767) {
                    $('.container').css({
                        width: 1200 + 'px'
                    });
                } else {
                    $('.container').css({
                        width: 95 + '%'
                    });
                }

                $(window).resize(function() {
                    var windowWidth = $(window).width();
                    if(windowWidth < 767) {
                        $('.container').css({
                            width: 1200 + 'px'
                        });
                    } else {
                        $('.container').css({
                            width: 95 + '%'
                        });
                    }
                });

                break;
            }

            $body.animate(bodyAnimation, options.duration);

            panel.show().animate(panelAnimation, options.duration, function() {
                sliding = false;
            });

        }

        $.panelslider = function(element, options) {

            var active = $('.panelslider');

            var defaults = {
                side: 'left',
                duration: 200,
                clickClose: true
            };

            options = $.extend({}, defaults, options);

            if(active.is(':visible') && active[0] != element[0]) {
                $.panelslider.close(function() {
                    slideIn(element, options);
                });
            } else if(!active.length || active.is(':hidden')) {
                slideIn(element, options);
            }
        };

        $.panelslider.close = function(callback) {

            var active = $('.panelslider'), duration = active.data('duration'), panelWidth = active.outerWidth(true), bodyAnimation = {}, panelAnimation = {};

            if(!active.length || active.is(':hidden') || sliding) {
                return;
            }

            sliding = true;

            switch(active.data('side')) {

                case 'left':

                bodyAnimation['margin-left'] = '-=' + panelWidth;
                panelAnimation.left = '-=' + panelWidth;

                $('.container').css({
                    width: 95 + '%'
                });

                break;

                case 'right':

                bodyAnimation['margin-left'] = '+=' + panelWidth;
                panelAnimation.right = '-=' + panelWidth;

                $('.container').css({
                    width: 95 + '%'
                });

                break;
            }

            active.animate(panelAnimation, duration);

            $body.animate(bodyAnimation, duration, function() {

                active.hide();
                active.removeClass('panelslider');

                sliding = false;

                if(callback) {
                    callback();
                }
            });
        };

        $.fn.panelslider = function(options) {

            this.click(function(e) {

                var active = $('.panelslider'), panel = $(this.getAttribute('href'));

                if (active.is(':visible') && panel[0] == active[0]) {
                    $.panelslider.close();
                    $(this).removeClass('active');
                } else {
                    $.panelslider(panel, options);
                    $(this).addClass('active');
                }

                $(document).bind('click keyup', function(e) {

                    var active = $('.panelslider');

                    if(e.type == 'keyup' && e.keyCode != 27) {
                        return;
                    }

                    if(active.is(':visible') && active.data('clickClose')) {
                        $.panelslider.close();
                        $('.switch').removeClass('active');
                    }

                });

                $(document).on('click', '.panelslider', function(e) {
                    e.stopPropagation();
                });

                e.preventDefault();
                e.stopPropagation();

            });

            return this;

        };

        $('.switch').panelslider();

    },

    setupModal: function() {

        $.fn.modality = function(options) {
    		var defaults = {
    			animation: 'slide',
    			animationspeed: 250,
    			overlayClose: true,
    			escClose: true,
    			closeModalClass: 'modality-close'
    		};

    		var options = $.extend({}, defaults, options);

    		return this.each(function() {
    			var modal = $(this),
    				topMeasure = parseInt(modal.css('top')),
    				topOffset = modal.height() + topMeasure,
    				locked = false,
    				marginLeft = Math.round(modal.outerWidth() / -2);


                modalOverlay = $('<div class="modality-overlay" />').insertAfter(modal);

    			modal.bind('modality:open', function() {
    				modalOverlay.unbind('click.modalEvent');
    				$('.' + options.closeModalClass).unbind('click.modalEvent');
    				if (!locked) {
    					lockModal();
    					if (options.animation == "slide") {
    						modal.css({
    							'top': $(document).scrollTop() - topOffset,
    							'opacity': 0,
    							'display': 'block',
    							'margin-left': marginLeft
    						});
    						modalOverlay.fadeIn(options.animationspeed / 2);
    						modal.delay(options.animationspeed / 2).animate({
    							"top": $(document).scrollTop() + topMeasure + 'px',
    							"opacity": 1
    						}, options.animationspeed, unlockModal());
    					}
    					if (options.animation == "fade") {
    						modal.css({
    							'opacity': 0,
    							'display': 'block',
    							'top': $(document).scrollTop() + topMeasure,
    							'margin-left': marginLeft
    						});
    						modalOverlay.fadeIn(options.animationspeed / 2);
    						modal.delay(options.animationspeed / 2).animate({
    							"opacity": 1
    						}, options.animationspeed, unlockModal());
    					}
    					if (options.animation == "none") {
    						modal.css({
    							'display': 'block',
    							'top': $(document).scrollTop() + topMeasure,
    							'margin-left': marginLeft
    						});
    						modalOverlay.css({
    							"display": "block"
    						});
    						unlockModal()
    					}
    				}
    				modal.unbind('modality:open');
    			});

    			modal.bind('modality:close', function() {
    				if (!locked) {
    					lockModal();
    					if (options.animation == "slide") {
    						modalOverlay.delay(options.animationspeed).fadeOut(options.animationspeed);
    						modal.animate({
    							"top": $(document).scrollTop() - topOffset + 'px',
    							"opacity": 0
    						}, options.animationspeed / 2, function() {
    							modal.css({
    								'top': topMeasure,
    								'opacity': 1,
    								'display': 'none'
    							});
    							unlockModal();
    						});
    					}
    					if (options.animation == "fade") {
    						modalOverlay.delay(options.animationspeed).fadeOut(options.animationspeed);
    						modal.animate({
    							"opacity": 0
    						}, options.animationspeed, function() {
    							modal.css({
    								'opacity': 1,
    								'display': 'none',
    								'top': topMeasure
    							});
    							unlockModal();
    						});
    					}
    					if (options.animation == "none") {
    						modal.css({
    							'display': 'none',
    							'top': topMeasure
    						});
    						modalOverlay.css({
    							'display': 'none'
    						});
    					}
    				}
    				modal.unbind('modality:close');
    			});

    			modal.trigger('modality:open')
    			var closeButton = $('.' + options.closeModalClass).bind('click.modalEvent', function(e) {
    				modal.trigger('modality:close')
                    e.preventDefault();
    			});

    			if (options.overlayClose) {
    				modalOverlay.bind('click.modalEvent', function() {
    					modal.trigger('modality:close')
    				});
    			}

    			if (options.escClose) {
    				$('body').keyup(function(e) {
    					if (e.which === 27) {
    						modal.trigger('modality:close');
    					}
    				});
    			}

    			function unlockModal() {
    				locked = false;
    			}

    			function lockModal() {
    				locked = true;
    			}
    		});
    	}

        $('.counter').click(function(e) {
            $('#unpublished').modality();
            e.stopPropagation();
        });

    },

    setupPagination: function() {

        $.fn.pagination = function(options) {

    		var defaults = {
    			pageSize: 10,
    			currentPage: 1,
    		};

    		var options = $.extend(defaults, options);

    		return this.each(function() {

    			var selector = $(this);
                var pageCounter = 1;

    			selector.wrap("<div class='MarkupPager'></div>");

    			selector.children().each(function(i) {

    				if(i < pageCounter * options.pageSize && i >= (pageCounter-1) * options.pageSize) {
    				    $(this).addClass("MarkupPagerItem-" + pageCounter);
    				}
    				else {
    					$(this).addClass("MarkupPagerItem-" + (pageCounter + 1));
    					pageCounter ++;
    				}

    			});

    			selector.children().hide();
    			selector.children(".MarkupPagerItem-" + options.currentPage).show();

    			if(pageCounter <= 1) {
    				return;
    			}

    			var pageNav = "<ul class='MarkupPagerNav'>";

                for (i = 1; i <= pageCounter; i++){
    				if (i == options.currentPage) {
    					pageNav += "<li class='MarkupPagerNavOn MarkupPagerNavItem-" + i + "'><a rel='" + i + "' href='#'>" + i + "</a></li>";
    				}
    				else {
    					pageNav += "<li class='MarkupPagerNavItem-" + i + "'><a rel='" + i + "' href='#'>" + i + "</a></li>";
    				}
    			}
    			pageNav += "</ul>";

                selector.after(pageNav);

    			selector.parent().find(".MarkupPagerNav a").click(function() {

    				var clickedLink = $(this).attr("rel");
    				options.currentPage = clickedLink;

                    $(this).parent("li").parent("ul").parent(".MarkupPagerNav").find("li.MarkupPagerNavOn").removeClass("MarkupPagerNavOn");
                    $(this).parent("li").parent("ul").parent(".MarkupPagerNav").find("a[rel='"+clickedLink+"']").parent("li").addClass("MarkupPagerNavOn");

    				selector.children().hide();
    				selector.find(".MarkupPagerItem-" + clickedLink).show();

    				return false;

                });
    		});
    	}

        $(".list").pagination();

    },

	setupTooltips: function() {

        $.fn.tooltips = function() {

            return this.each(function() {

                var tooltip = '.tooltip-wrapper';

                $(this).hover(function() {

                    var out = '<div class="tooltip-wrapper"><div class="tooltip-arrow"><div class="tooltip-content">' + $(this).attr('title') + '</div></div></div>';

                    $(this).append(out);

                    var tipWidth = $(tooltip).outerWidth();
                    var elementWidth = $(this).width();
                    var marginLeft = (elementWidth / 2) - (tipWidth / 2);

                    $(tooltip).css('margin-left', marginLeft + 'px');

                    $(tooltip).fadeIn(150);

                }, function() {

                    $(tooltip).remove();

                });

            });

        };

        $("a.tooltip").tooltips();

	},

	setupCloneButton: function() {

		if($("body").is(".modal")) return;

        if($('.templateButton').is(':visible')) {
            $('.templateButton').prependTo("#title .container");
        }

		var $buttons = $("#content a:not([id]) button:not([id]), #content button.head_button_clone[id!=]");

		if($buttons.size() == 0 || $.browser.msie) return;

		var $head = $("<div id='head_button'></div>").prependTo("#title .container").show();
		$buttons.each(function() {
			var $t = $(this);
			var $a = $t.parent('a');
			if($a.size()) {
				$button = $t.parent('a').clone();
				$head.append($button);
            } else if($t.is('.head_button_clone')) {
				$button = $t.clone();
				$button.attr('data-from_id', $t.attr('id')).attr('id', $t.attr('id') + '_copy');
				$a = $("<a></a>").attr('href', '#');
				$button.click(function() {
					$("#" + $(this).attr('data-from_id')).click(); // .parents('form').submit();
					return false;
				});
				$head.append($a.append($button));
			}
		});
	},

	setupButtonStates: function() {

		$(".ui-button").hover(function() {
			$(this).removeClass("ui-state-default").addClass("ui-state-hover");
		}, function() {
			$(this).removeClass("ui-state-hover").addClass("ui-state-default");
		}).click(function() {
			$(this).removeClass("ui-state-default").addClass("ui-state-active"); // .effect('highlight', {}, 100); 
		});

		$("a > button").click(function() {
			window.location = $(this).parent("a").attr('href'); 
		}); 
	},

	setupFieldFocus: function() {

		jQuery('#content input[type=text]:visible:enabled:first:not(.hasDatepicker)').each(function() {
			var $t = $(this); 
			if(!$t.val() && !$t.is(".no_focus")) window.setTimeout(function() { $t.focus(); }, 1);
		});

	},

	setupSearch: function() {

		$.widget( "custom.adminsearchautocomplete", $.ui.autocomplete, {
			_renderMenu: function(ul, items) {
				var that = this;
				var currentType = "";
				$.each(items, function(index, item) {
					if (item.type != currentType) {
						ul.append("<li class='ui-widget-header'><a>" + item.type + "</a></li>" );
						currentType = item.type;
					}
					ul.attr('id', 'ProcessPageSearchAutocomplete'); 
					that._renderItemData(ul, item);
				});
			},
			_renderItemData: function(ul, item) {
				if(item.label == item.template) item.template = '';
				ul.append("<li><a href='" + item.edit_url + "'>" + item.label + " <small>" + item.template + "</small></a></li>"); 
			}
		});
		
		var $input = $("#ProcessPageSearchQuery");

        $input.val('Search...');

		$input.adminsearchautocomplete({
			minLength: 2,
			position: { my : "right top", at: "right bottom" },
			source: function(request, response) {
				var url = $input.parents('form').attr('action') + 'for?get=template_label,title&include=all&admin_search=' + request.term;
				$.getJSON(url, function(data) {
					response($.map(data.matches, function(item) {
						return {
							label: item.title,
							value: item.title,
							page_id: item.id,
							template: item.template_label ? item.template_label : '',
							edit_url: item.editUrl,
							type: item.type
						}
					}));
				});
			},
			select: function(event, ui) { }
		}).focus(function() {
            $input.val('');
		}).blur(function() {
            $input.val('Search...');
		});

	},

	dropdownPositionsMonitored: false,

	setupDropdowns: function() {

        $("ul.dropdown-menu").each(function() {
			var $ul = $(this).hide();
			var $a = $ul.siblings(".dropdown-toggle");

			if($a.is("button")) {
				$a.button();
			} else {
				$ul.css({ 'border-top-right-radius': 0 });
			}

			$ul.find('a').click(function() {
				$ul.hide();
				return true;
			});

			var lastOffset = null;

			$a.mouseenter(function() {
				var offset = $a.offset();
				if(lastOffset != null) {
					if(offset.top != lastOffset.top || offset.left != lastOffset.left) {
						$ul.menu('destroy').removeClass('dropdown-ready');
					}
				}
				if(!$ul.hasClass('dropdown-ready')) {
					$ul.css('position', 'absolute');
					$ul.prependTo($('body')).addClass('dropdown-ready').menu();
					var position = { my: 'right top', at: 'right bottom', of: $a };
					var my = $ul.attr('data-my');
					var at = $ul.attr('data-at');
					if(my) position.my = my;
					if(at) position.at = at;
					$ul.position(position).css('z-index', 200);
				}
				$a.addClass('hover');
				$ul.show();
				lastOffset = offset;

			}).mouseleave(function() {
				setTimeout(function() {
					if($ul.is(":hover")) return;
					$ul.find('ul').hide();
					$ul.hide();
					$a.removeClass('hover');
				}, 50);
			});

			$ul.mouseleave(function() {
				if($a.is(":hover")) return;
				$ul.hide();
				$a.removeClass('hover');
			});

		});

		$(document).on('hover', 'ul.dropdown-menu a.has-ajax-items:not(.ajax-items-loaded)', function() {
			var $a = $(this);
			$a.addClass('ajax-items-loaded');
			var url = $a.attr('href');
			var $ul = $a.siblings('ul');

			$.getJSON(url, function(data) {

				if(!ProcessWireAdminTheme.dropdownPositionsMonitored && data.length > 10) {
					ProcessWireAdminTheme.dropdownPositionsMonitored = true;
					var dropdownHover = function() {
						var fromAttr = $a.attr('data-from');
						if(!fromAttr) return;
						var $from = $('#' + $a.attr('data-from'));
						setTimeout(function() {
							var fromLeft = $from.offset().left-1;
							var $ul = $a.parent('li').parent('ul');
							var thisLeft = $ul.offset().left;
							if(thisLeft != fromLeft) $ul.css('left', fromLeft);
						}, 500);
					};
					$(document).on('hover', 'ul.dropdown-menu a', dropdownHover);
				}

				$.each(data, function(n) {
					var item = this;
					var $li = $("<li class='ui-menu-item'><a href='" + url + "edit?id=" + item.id + "'>" + item.name + "</a></li>");
					$ul.append($li);
				});

				dropdownHover();

			});
		});

	},

    setupThumbs: function() {

        $.fn.thumbs = function(method, callback) {

            callback = callback || function() {};

            var elements = this;
            var remaining = $(this).length;

            method = method == 'inside';

            var fn = function(img) {

                var $img = $(img);
                var $div = $img.parent();

                $div.css({
                    overflow: 'hidden',
                    position: $div.css('position') == 'absolute' ? 'absolute' : 'relative'
                });

                $img.css({
                    'position': 'static',
                    'width': 'auto',
                    'height': 'auto',
                    'max-width': '100%',
                    'max-height': '100%'
                });

                var div = { w: $div.width(), h: $div.height(), r: $div.width() / $div.height() };
                var img = { w: $img.width(), h: $img.height(), r: $img.width() / $img.height() };

                $img.css({
                  'max-width': 'none',
                  'max-height': 'none',
                  'width': Math.round((div.r > img.r) ^ method ? '100%' : div.h / img.h * img.w),
                  'height': Math.round((div.r < img.r) ^ method ? '100%' : div.w / img.w * img.h)
                });

                var div = { w: $div.width(), h: $div.height() };
                var img = { w: $img.width(), h: $img.height() };

                $img.css({
                  'position': 'absolute',
                  'left': Math.round((div.w - img.w) / 2),
                  'top': Math.round((div.h - img.h) / 3)
                });

                callbackWrapped(img)

            };

            var callbackWrapped = function(img) {
                remaining--;
                callback.apply(els, [ img, remaining ]);
            };

            return elements.each(function(i) {

                if (this.complete || this.readyState === 'complete') {

                    (function(element) {
                        setTimeout(function() { fn(element) }, 1);
                    })(this);

                } else {

                    (function(element) {
                        $(element).one('load', function() {
                            setTimeout(function() {
                                fn(element);
                            }, 1);
                    }).one('error', function() {
                        callbackWrapped(element)
                    }).end();

                    if (navigator.userAgent.indexOf("Trident/5") >= 0 || navigator.userAgent.indexOf("Trident/6")) {
                        element.src = element.src;
                    }

                    })(this);
                }
            });
        };

        $('#select_images a img').thumbs();

    },

    setupTop: function() {

        $(window).scroll(function() {
    		if ($(this).scrollTop() > 100) {
    			$('.top').fadeIn();
    		} else {
    			$('.top').fadeOut();
    		}
    	});

    	$('.top').click(function(e) {
    		$('html, body').animate({scrollTop : 0},300);
    		e.preventDefault();
            e.stopPropagation();
    	});

    },

    setupMisc: function() {

        $("#notices a.notice-remove").on("click",function() {
            $("#notices").slideUp('fast', function() { $(this).remove(); });
    	});

        $("#_ProcessPageEditView").prepend("<i class='fa fa-globe'></i>");

        $('body.login .InputfieldHeader').click(function() {
            return false;
        });

	},

	browserCheck: function() {
		if($.browser.msie && $.browser.version < 8)
			$("#content .container").html("<h2>ProcessWire does not support IE7 and below at this time. Please try again with a newer browser.</h2>").show();
	}

};

$(document).ready(function() {
    ProcessWireAdminTheme.init();
});