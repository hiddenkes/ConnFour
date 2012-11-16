﻿(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var nextPage = document.getElementById("pageGame");
            nextPage.addEventListener("click", function () {
                //alert("Sup");
                WinJS.Navigation.navigate("/pages/game/game.html");
            });
        }
    });
})();