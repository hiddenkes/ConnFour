// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var settings = new Settings();

    WinJS.UI.Pages.define("/pages/cheats/cheats.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            document.getElementById("cheatSubmit").addEventListener("click", checkCode, false);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            window.clearTimeout(respDelay);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function checkCode() {
        var code = document.getElementById("cheatCode").value;
        var validator = parseInt(code.substring(0,6));
        var master = code.substring(6);

        var d = new Date();
        var KEY = Math.floor(12486 * (d.getWeek() / 5) + d.getYear());

        if (validator % KEY === 0) {
            //For the "unlockFullTrial", we lock down the key even more.
            if (master === "unlockFullTrial" && validator === (KEY * 2)) {
                settings.unlock("fullTrial");
            }
            if (master === "resetSettings") {
                settings.first();
            }
            if (master === "havenofearmypenisishere") {
                
            }

            document.getElementById("cheatCode").value = "";

            displayMessage("Your content has been unlocked! Enjoy!");
        } else {
            displayMessage("The key you entered is not valid");
        }
    }

    var respDelay;
    function displayMessage(message) {
        window.clearTimeout(respDelay);
        document.getElementById("cheatResponse").innerHTML = message;
        respDelay = window.setTimeout(function () {
            if (document.getElementById("cheatResponse")) {
                document.getElementById("cheatResponse").innerHTML = "";
            }
        }, 5000);
    }

})();
