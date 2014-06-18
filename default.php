<?php

/**
 * default.php
 * 
 * Main markup template file for AdminThemeModesta
 * 
 * __('FOR TRANSLATORS: please translate the file /wire/templates-admin/default.php rather than this one.');
 * 
 * ProcessWire 2.4.x
 * AdminThemeModesta 2014 by Nikola Vidoni
 *
 */

if(!defined("PROCESSWIRE")) die();

if(!isset($content)) $content = '';
	
$searchForm = $user->hasPermission('page-edit') ? $modules->get('ProcessPageSearch')->renderSearchForm() : '';

$config->styles->prepend($config->urls->adminTemplates . "styles/modesta.css?v=1.0");
$config->styles->append($config->urls->root . "wire/templates-admin/styles/font-awesome/css/font-awesome.min.css");
$config->scripts->append($config->urls->root . "wire/templates-admin/scripts/inputfields.js?v=5.0");
$config->scripts->append($config->urls->adminTemplates . "scripts/modesta.js?v=1.0");
	
require_once(dirname(__FILE__) . "/AdminThemeModestaHelpers.php");
$helpers = new AdminThemeModestaHelpers();

?><!DOCTYPE html>
<html lang="<?php echo $helpers->_('en'); 
	/* this intentionally on a separate line */ ?>">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="robots" content="noindex, nofollow" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title><?php echo $helpers->renderBrowserTitle(); ?></title>

	<script type="text/javascript"><?php echo $helpers->renderJSConfig(); ?></script>

	<?php foreach($config->styles as $file) echo "\n\t<link type='text/css' href='$file' rel='stylesheet' />"; ?>

	<?php foreach($config->scripts as $file) echo "\n\t<script type='text/javascript' src='$file'></script>"; ?>

    <style>

        /* Overrides of Modesta standard blue style */

        a,
        #breadcrumbs ul li.title,
        #title .id span,
        #content .WireTabs #_ProcessPageEditView,
        .Inputfields .InputfieldHeader,
        .content .AdminDataList td a,
        .PageList .PageListItemOpen > a.PageListPage,
        .content .nav dt a {
            color: <?php echo $helpers->renderThemeColor(); ?>;
        }

        #navigation,
        .content li.ui-state-default,
        .content .ui-widget-content li.ui-state-default {
        	background: <?php echo $helpers->renderThemeColor(); ?>;
        }

        #navigation ul li a:hover,
        #navigation ul li a.hover {
        	background: rgba(255,255,255,0.4);
        }

        #navigation ul li a,
        #navigation ul li:last-child a {
        	border-color: rgba(255,255,255,0.2);
        }

        .content li.ui-state-default,
        .content .ui-widget-content li.ui-state-default {
        	border-color: <?php echo $helpers->renderThemeColor(); ?>;
        }

	</style>

</head>

<?php
if($user->isGuest() || !$user->isLoggedin()) {
    include $config->paths->adminTemplates . 'login.inc';
} else {
    include $config->paths->adminTemplates . 'main.inc';
}
?>

</html>