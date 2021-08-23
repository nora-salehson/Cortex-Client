<html>
    <head>
        <title>Project Cortex</title>

        <link rel="stylesheet" href="styles/fonts.min.css">
        <link rel="stylesheet" href="styles/client.min.css">

        <?php
            if(isset($_GET["theme"]))
                echo '<link rel="stylesheet" href="styles/themes/' . $_GET["theme"] . '.min.css">';
        ?>
        
        <link rel="icon" type="image/x-icon" href="favicon.ico">
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">

        <link rel="manifest" href="manifest.json">

        <script type="text/javascript">
            const key = "<?= (isset($_GET["key"])?($_GET["key"]):("Cake")) ?>";
            
            const theme = <?= (isset($_GET["theme"])?('"' . $_GET["theme"] . '"'):("null")) ?>;
        </script>
    </head>
    <body>
        <section id="client" class="<?= (isset($_GET["theme"])?($_GET["theme"]):("default")) ?>">
            <section id="client-loader">
                <div class="client-loader-container">
                    <div class="client-loader-logo"></div>

                    <div id="client-loader-text">Waiting for client...</div>
                </div>
            </section>
        </section>

        <section id="client-development" style="display: none">
            <div class="client-development">
                DEVELOPER PLAYGROUND
            </div>
        </section>

        <script src="scripts/libraries/jquery-3.5.1.min.js"></script>
        <script src="scripts/libraries/jquery-ui-custom.min.js"></script>
        
        <script src="scripts/Client.js"></script>

        <script src="scripts/Client/Utils/Utils.js"></script>
        <script src="scripts/Client/Exceptions/Exceptions.js"></script>
        
        <script src="scripts/Client/ClientLoader.js"></script>
    </body>
</html>
