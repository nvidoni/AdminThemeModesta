<?php

/**
 * AdminThemeModestaHelpers.php
 * 
 * Rendering helper functions for use with ProcessWire Modesta admin theme.
 * 
 * __('FOR TRANSLATORS: please translate the file /wire/templates-admin/default.php rather than this one.'); 
 *
 */ 

class AdminThemeModestaHelpers extends WireData {

    public function checkExtension() {
        if(!extension_loaded('iconv')) {
            $this->error('Warning: iconv extension is not loaded! It\'s used for date formatting in admin theme settings.');
        }
    }

	public function __construct() {
		$renderType = $this->input->get->admin_theme_render;
		if($renderType && $this->wire('user')->isSuperuser()) {
			if($renderType == 'templates') echo $this->renderTemplatesNav();
			if($renderType == 'fields') echo $this->renderFieldsNav();
			exit; 
		}
	}

    /**
	 * Render admin theme name in the footer
	 *
	 * @return string
	 *
	 */
    public function renderThemeName() {
        if($this->wire('adminTheme')->modestaThemeName == 1) {
            $info = AdminThemeModesta::getModuleInfo();
		    return ' / ' . $info['title'];
        }
    }

	/**
	 * Perform a translation, based on text from shared admin file: /wire/templates-admin/default.php
	 * 
	 * @param string $text
	 * @return string
	 *
	 */
	public function _($text) {
		return __($text, $this->wire('config')->paths->root . 'wire/templates-admin/default.php'); 
	}

	/**
	 * Get the title for the current admin page
	 *
	 * @return string
	 *
	 */
	public function getHeadline() {
		$headline = $this->wire('processHeadline');
		if(!$headline) $headline = $this->wire('page')->get('title|name');
		$headline = $this->_($headline);
		return $headline;
	}

    /**
	 * Render site name in the header
	 *
	 * @return string
	 *
	 */
	public function renderSitename() {
        return $this->wire('adminTheme')->modestaSitename;
	}

    /**
	 * Render date in the header
	 *
	 * @return string
	 *
	 */
    public function renderDate() {
        if($this->wire('adminTheme')->modestaDate == 1) {
            setlocale(LC_ALL, '' . $this->wire('adminTheme')->modestaDateLocale . '');
            if(extension_loaded("iconv")) {
                return "<div class='date'>" . iconv($this->wire('adminTheme')->modestaDateCodePage, 'UTF-8', strftime($this->wire('adminTheme')->modestaDateFormat, strtotime(date("d.m.Y.")))) . "</div>";
            } else {
                return "<div class='date'>" . strftime($this->wire('adminTheme')->modestaDateFormat, strtotime(date("d.m.Y."))) . "</div>";
            }
        }
	}

    /**
	 * Render pages in side panel
	 *
	 * @return string
	 *
	 */
    public function renderPageStatus($status, $template, $limit) {
        $out = '<ul class="list">';
        $pages = $this->wire('pages')->find('template!=' . $template . ', limit=' . $limit . ', sort=-' . $status . '');
        foreach($pages as $page) {
            if ($page->editable()) {
                $out .= '<li><span>' . iconv($this->wire('adminTheme')->modestaDateCodePage, 'UTF-8', strftime($this->wire('adminTheme')->modestaDateFormat, $page->$status)) . '</span><a href="' . $this->wire('config')->urls->admin . 'page/edit/?id=' . $page->id .'">' . $page->title . '</a></li>';
            }
        }
        $out .= '</ul>';
        return $out;
	}

    /**
	 * Render page ID before page title
	 *
	 * @return string
	 *
	 */
    public function renderPageId() {
        if($this->wire('adminTheme')->modestaPageId == 1 && $this->wire('user')->isSuperuser()) {
            if($this->wire('input')->get->id == "") {
                $id = $this->wire('page')->id;
            } else {
                $id = $this->wire('input')->get->id;
            }
            $out = "<div class='id'>ID: <span>" . $id ."</span></div>";
            return $out;
        }
	}

    /**
	 * Render unpublished pages counter
	 *
	 * @return string
	 *
	 */
    public function renderCounter() {
        if($this->wire('adminTheme')->modestaUnpublished == 1) {
            $pages = $this->wire('pages')->find('status=unpublished');
            $counter = 0;
            foreach($pages as $page) {
                if(!$page->is(Page::statusHidden)) {
                    $counter++;
                }
            }
            $out = '';
            if($counter > 0) {
                $out .= '<a class="counter">' . $counter .'</a>';
            }
            return $out;
        }
    }

    /**
	 * Render unpublished pages
	 *
	 * @return string
	 *
	 */
    public function renderUnpublished() {
        if($this->wire('adminTheme')->modestaUnpublished == 1) {
            $pages = $this->wire('pages')->find('status=unpublished');
            $out = '';
            if($pages->getTotal() > 0) {
                $out = '<ul class="list">';
                foreach($pages as $page) {
                    if(!$page->is(Page::statusHidden)) {
                        $out .= '
                            <li><a class="tooltip" href="' . $this->wire('config')->urls->admin . 'page/edit/?id=' . $page->id .'"  title="' . iconv($this->wire('adminTheme')->modestaDateCodePage, 'UTF-8', strftime($this->wire('adminTheme')->modestaDateFormat, $page->created)) . '">' . $page->title . '</a><a class="edit" href="' . $this->wire('config')->urls->admin . 'page/edit/?id=' . $page->id .'">Edit</a></li>';
                    }
                }
                $out .= '</ul>';
            }
            return $out;
        }
    }

    /**
	 * Get user IP address
	 *
	 * @return string
	 *
	 */
    public function getIp() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

	/**
	 * Render a list of breadcrumbs (list items), excluding the containing <ul>
	 *
	 * @param bool $appendCurrent Whether to append the current title/headline to the breadcrumb trail (default=true)
	 * @return string
	 *
	 */
	public function renderBreadcrumbs($appendCurrent = true) {
		$out = "<ul>";
		foreach($this->wire('breadcrumbs') as $breadcrumb) {
			$title = $this->_($breadcrumb->title);
			$out .= "<li><a href='{$breadcrumb->url}'>{$title}</a><i class='fa fa-angle-right'></i></li>";
		}
		if($appendCurrent) $out .= "<li class='title'>" . $this->getHeadline() . "</li>";
        $out .= "</ul>";
        return $out;
	}

	/**
	 * Render the populated shortcuts head button or blank when not applicable
	 *
	 * @return string
	 *
	 */
	public function renderAdminShortcuts() {
	
		$user = $this->wire('user');
		$config = $this->wire('config');
		
		if($user->isGuest() || !$user->hasPermission('page-edit')) return '';
	
		$language = $user->language && $user->language->id && !$user->language->isDefault() ? $user->language : null;
		$url = $config->urls->admin . 'page/add/';
		$out = '';
	
		foreach(wire('templates') as $template) {
			$parent = $template->getParentPage(true); 
			if(!$parent) continue; 
			if($parent->id) {
				// one parent possible	
				$qs = "?parent_id=$parent->id";
			} else {
				// multiple parents possible
				$qs = "?template_id=$template->id";
			}
			$label = $template->label;
			if($language) $label = $template->get("label$language");
			if(empty($label)) $label = $template->name; 
			$out .= "<li><a href='$url$qs'>$label</a></li>";
		}
	
		if(empty($out)) return '';
	
		$label = $this->_('Add New');

		$out = "
            <div class='templateButton'>
                <button class='dropdown-toggle'><i class='fa fa-angle-down'></i> $label</button>
                <ul class='dropdown-menu'>$out</ul>
            </div>
        ";
	
		return $out; 
	}
	
	/**
	 * Render runtime notices div#notices
	 *
	 * @param Notices $notices
	 * @return string
	 *
	 */
	public function renderAdminNotices($notices) {
	
		if(!count($notices)) return '';
		$config = $this->wire('config');
	
		$out = "<ul id='notices' class='ui-widget'>";
	
		foreach($notices as $n => $notice) {
	
			$class = 'ui-state-highlight NoticeMessage';
			$text = $notice->text; 
			$icon = '';
	
			if($notice->flags & Notice::allowMarkup) {
				// leave $text alone
			} else {
				// unencode entities, just in case module already entity encoded otuput
				if(strpos($text, '&') !== false) $text = html_entity_decode($text, ENT_QUOTES, "UTF-8"); 
				// entity encode it
				$text = $this->wire('sanitizer')->entities($text); 
			}
	
			if($notice instanceof NoticeError || $notice->flags & Notice::warning) {
				$class = 'ui-state-error'; 
				if($notice->flags & Notice::warning) {
					$class .= ' NoticeWarning';
					$icon = 'warning';
				} else {
					$class .= ' ui-priority-primary NoticeError';
					$icon = 'exclamation-triangle'; 
				}
			}
	
			if($notice->flags & Notice::debug) {
				$class .= ' ui-priority-secondary NoticeDebug';
				$icon = 'gear';
			}
	
			if(!$icon) $icon = 'check-square';
	
			if($notice->class && $config->debug) $text = "{$notice->class}: $text";
	
			$remove = $n ? '' : "<a class='notice-remove' href='#'><i class='fa fa-times-circle'></i></a>";
	
			$out .= "\n\t\t<li class='$class'><div class='container'><p>$remove<i class='fa fa-$icon'></i> {$text}</p></div></li>";
		}
	
		$out .= "\n\t</ul><!--/notices-->";
		return $out; 
	}

    /**
	 * Render a single top navigation item for the given page
	 *
	 * This function designed primarily to be called by the renderNavigation() function.
	 *
	 * @param Page $page
	 * @param int $level Recursion level (default=0)
	 * @return string
	 *
	 */
	public function renderNavigationItem(Page $page, $level = 0) {

		$isSuperuser = $this->wire('user')->isSuperuser();
		$showItem = $isSuperuser;
		$children = $page->numChildren && !$level && $page->name != 'page' ? $page->children("check_access=0") : array();
		$adminURL = $this->wire('config')->urls->admin;

        $out = '';

		if(!$showItem) {
			$checkPages = count($children) ? $children : array($page);
			foreach($checkPages as $child) {
				if($child->viewable()) {
					$showItem = true;
					break;
				}
			}
		}

		if(!$showItem) return '';

		$class = strpos(wire('page')->path, $page->path) === 0 ? 'active' : '';
		$title = $this->_(strip_tags((string)$page->get('title|name')));

		$out .= "<li>";

		if(!$level && count($children)) {

			$class = trim("$class dropdown-toggle");
			$out .= "<a href='$page->url' class='$class'>$title</a>";
			$my = 'left-1 top';
			if($page->name == 'access') $my = 'left top';
			$out .= "<ul class='dropdown-menu dropdown-main' data-my='$my' data-at='left bottom'>";

			foreach($children as $child) {

				if($isSuperuser && ($child->id == 11 || $child->id == 16)) {
					// has ajax items

					$addLabel = $this->_('Add New');
					$out .=	"<li><a class='has-ajax-items' data-from='topnav-page-$page' href='$child->url'>" . $this->_($child->title) . "</a><ul>" .
						"<li><a class='add' href='{$child->url}add'><i class='fa fa-plus-circle'></i> $addLabel</a></li>" .
						"</ul></li>";
				} else {
					$out .= $this->renderNavigationItem($child, $level+1);
				}
			}

			$out .= "</ul>";

		} else {
			$class = $class ? " class='$class'" : '';
			$out .= "<a href='$page->url'$class>$title</a>";
		}

		$out .= "</li>";

		return $out;
	}

    /**
	 * Render navigation
	 *
	 * @return string
	 *
	 */

	public function renderNavigation() {

        $out = '<ul class="navigation">';

        $admin = $this->wire('pages')->get(wire('config')->adminRootPageID);

		foreach($admin->children("check_access=0") as $page) {
			if(!$page->viewable()) continue;
			$out .= $this->renderNavigationItem($page);
		}

        $out .=	"</ul>";

        return $out;

    }

	/**
	 * Render the browser <title>
	 *
	 * @return string
	 *
	 */
	public function renderBrowserTitle() {
		$browserTitle = $this->wire('processBrowserTitle'); 
		if(!$browserTitle) $browserTitle = $this->_(strip_tags(wire('page')->get('title|name'))) . ' &bull; ProcessWire';
		if(strpos($browserTitle, '&') !== false) $browserTitle = html_entity_decode($browserTitle, ENT_QUOTES, 'UTF-8'); // we don't want to make assumptions here
		$browserTitle = $this->wire('sanitizer')->entities($browserTitle, ENT_QUOTES, 'UTF-8'); 
		$httpHost = $this->wire('config')->httpHost;
		if(strpos($httpHost, 'www.') === 0) $browserTitle = substr($browserTitle, 4); // remove www
		if(strpos($httpHost, ':')) $httpHost = preg_replace('/:\d+/', '', $httpHost); // remove port
		$browserTitle = $this->wire('sanitizer')->entities($httpHost) . ' &bull; ' . $browserTitle; 
		return $browserTitle; 
	}
	
	/**
	 * Render the class that will be used in the <body class=''> tag
	 *
	 * @return string
	 *
	 */
	public function renderBodyClass() {
		$page = $this->wire('page');
		$bodyClass = $this->wire('input')->get->modal ? 'modal ' : '';
		$bodyClass .= "id-{$page->id} template-{$page->template->name}";
		if(wire('config')->js('JqueryWireTabs')) $bodyClass .= " hasWireTabs";
		return $bodyClass; 
	}
	
	/**
	 * Render the required javascript 'config' variable for the document <head>
	 *
	 * @return string
	 *
	 */
	public function renderJSConfig() {
	
		$config = $this->wire('config'); 
	
		$jsConfig = $config->js();
		$jsConfig['debug'] = $config->debug;
	
		$jsConfig['urls'] = array(
			'root' => $config->urls->root, 
			'admin' => $config->urls->admin, 
			'modules' => $config->urls->modules, 
			'core' => $config->urls->core, 
			'files' => $config->urls->files, 
			'templates' => $config->urls->templates,
			'adminTemplates' => $config->urls->adminTemplates,
			); 
	
		return "var config = " . json_encode($jsConfig);
	}

}
