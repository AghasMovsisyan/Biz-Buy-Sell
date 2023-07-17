var router = (function () {
    var $container;

    /**
     * @param  {string} route
     */
    function loadPage(route) {
        switch (route) {
            case '/':
                loadTemplate('../templates/index.html');
                break;
            case '#/buy':
                loadTemplate('../templates/buy.html');
                break;
            case '#/login':
                loadTemplate('../templates/auth/login.html');
                break;
            case '#/sign-up':
                loadTemplate('../templates/auth/sign-up.html');
                break;
            default:
                if (route.includes('#/view/')) {
                    var cardId = route.split('/')[2];
                    loadCardTemplate(cardId);
                }
                break;
        }
    }

    /**
     * @param  {string} templatePath
     */
    function loadTemplate(templatePath) {
        $.get(templatePath, function (data) {
            $container.html(data);
        });
    }

    /**
     * @param  {string} cardId
     */
    function loadCardTemplate(cardId) {
        $.get('../templates/view.html', function (data) {
            $container.html(data);
            // After the view page is loaded, call a function to display the card information
            cardDisplayModule.fetchCardDetails(cardId);
        });
    }

    /**
     * @param  {string} container
     */
    function init(container) {
        $container = $(container);

        if (window.location.hash) {
            loadPage(window.location.hash);
        } else {
            loadPage('#/');
        }

        $(window).on('hashchange', function () {
            loadPage(window.location.hash);
        });
    }

    return {
        init: init
    };
})();
