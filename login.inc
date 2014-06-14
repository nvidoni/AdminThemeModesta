<body class="login">

    <div class="background"></div>

    <?php echo $helpers->renderAdminNotices($notices); ?>

    <div class="wrapper">

        <div class="title">
            <div class="content">
                <a href='<?php echo $config->urls->root; ?>'><?php echo $helpers->renderSitename(); ?></a>
            </div>
        </div>

        <div class="content">
            <?php echo $content?>
        </div>
    </div>

    <div class="footer">
        <p>ProcessWire <?php echo $config->version . ' <!--v' . $config->systemVersion; ?>--> &copy; <?php echo date("Y."); ?><?php echo $helpers->renderThemeName(); ?></p>
</div>

</body>