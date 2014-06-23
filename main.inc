<body class='<?php echo $helpers->renderBodyClass(); ?>'>

    <div id="wrapper">

        <?php echo $helpers->checkExtension(); ?>

    	<?php echo $helpers->renderAdminNotices($notices); ?>

        <!-- Header -->

    	<div id="header">

            <div class="container ui-helper-clearfix">

                <a class="switch" href="#panel"></a>

    			<a class="logo" href='<?php echo $config->urls->admin?>'><?php echo $helpers->renderSitename(); ?></a>

                <?php echo $helpers->renderDate(); ?>

                <ul class="info">
                    <li><?php echo "<span>" . $user->name . "</span>" . $helpers->renderCounter(); ?></li>
                    <?php if($user->hasPermission('profile-edit')) { ?>
                    <li><i class="fa fa-cog"></i><a href='<?php echo $config->urls->admin; ?>profile/'><?php echo $helpers->_('Profile'); ?></a></li>
                    <li><i class="fa fa-globe"></i><a href='<?php echo $config->urls->root; ?>'><?php echo $helpers->_('View Site'); ?></a></li>
                    <?php } ?>
                    <li><i class="fa fa-arrow-circle-right"></i><a href='<?php echo $config->urls->admin; ?>login/logout/'><?php echo $helpers->_('Logout'); ?></a></li>
                </ul>

                <div id="unpublished" class="modality">
                    <div class="content">
                    <h1><?php echo $helpers->_('Unpublished pages'); ?></h1>
                    <?php echo $helpers->renderUnpublished(); ?>
                	<div class="modality-close"></div>
                    </div>
                </div>

    		</div>

        </div>

        <!-- Navigation -->

        <div id="navigation">

            <div class="container ui-helper-clearfix">

                <?php echo $helpers->renderNavigation(); ?>

            </div>

        </div>

        <!-- Breadcrumbs -->

        <div id="breadcrumbs">

            <div class="container ui-helper-clearfix">

    			<?php echo $helpers->renderBreadcrumbs(); ?>

                <?php echo $searchForm; ?>

    		</div>

        </div>

        <?php if(in_array($page->id, array(2,3,8))) echo $helpers->renderAdminShortcuts(); ?>

        <!-- Title -->

        <div id="title">

            <div class="container ui-helper-clearfix">

                <?php echo $helpers->renderPageId(); ?>

                <h1><?php echo $helpers->getHeadline(); ?></h1>

            </div>

        </div>

        <!-- Content -->

    	<div id="content" class="content">

            <div class="container">

    			<?php

                if(trim($page->summary)) echo "<h2>{$page->summary}</h2>";
    			if($page->body) echo $page->body;
    			echo $content;
    			?>

    		</div>

        </div>

        <!-- Footer -->

    	<div id="footer" class="footer">

            <div class="container ui-helper-clearfix">

                <span>ProcessWire <?php echo $config->version . ' <!--v' . $config->systemVersion; ?>--> &copy; <?php echo date("Y."); ?><?php echo $helpers->renderThemeName(); ?></span>
                <?php
                if($config->debug && $this->user->isSuperuser()) {
                    include($config->paths->root . '/wire/templates-admin/debug.inc');
                    echo "<p>IP: " . $helpers->getIp() . "</p>";
                }
                ?>

            </div>

            <a class="top" href="#"></a>

        </div>

    </div>

    <!-- Panelslider -->

    <div id="panel">

        <div class="content">

        <?php

        if($this->wire('adminTheme')->modestaNumCreated > 0) {
            echo '<h2>' . $helpers->_('Last created pages') . '</h2>';
            echo $helpers->renderPageStatus("created", $this->wire('adminTheme')->modestaTemplate, $this->wire('adminTheme')->modestaNumCreated);
        }

        if($this->wire('adminTheme')->modestaNumModified > 0) {
            echo '<h2>' . $helpers->_('Last modified pages') . '</h2>';
            echo $helpers->renderPageStatus("modified", $this->wire('adminTheme')->modestaTemplate, $this->wire('adminTheme')->modestaNumModified);
        }

        ?>

        </div>

        <div class="content-mobile">

            <h2><?php echo $user->name; ?></h2>

            <ul class="info">
                <?php if($user->hasPermission('profile-edit')) { ?>
                <li><a href='<?php echo $config->urls->admin; ?>profile/'><?php echo $helpers->_('Profile'); ?></a></li>
                <li><a href='<?php echo $config->urls->root; ?>'><?php echo $helpers->_('View Site'); ?></a></li>
                <?php } ?>
                <li><a href='<?php echo $config->urls->admin; ?>login/logout/'><?php echo $helpers->_('Logout'); ?></a></li>
            </ul>

           <h2><?php echo $helpers->_('Navigation'); ?></h2>

            <?php echo $helpers->renderNavigation(); ?>

        </div>

    </div>

</body>