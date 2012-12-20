// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    //Current App:
    var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;

    //Set up settings instance:
    var settings = new Settings();

    //Theme List:
    var themes = [
        //Standard Themes:
        { value: "standard", name: "Standard" },
        { value: "gray", name: "Shades of Gray" },
        { value: "dark", name: "Dark" },
        //Unlockable:
        { value: "indecisive", name: "&#9734; Indecisive", unlock: "indecisive" },
        //Purchased:
        { value: "blue", name: "&#9733; Blue", purchase: "themePack1" },
        { value: "green", name: "&#9733; Green", purchase: "themePack1" },
        { value: "retro", name: "&#9733; Retro", purchase: "themePack1" },
        { value: "rny", name: "&#9733; Red and Yellow", purchase: "themePack1" },
        { value: "contrast", name: "&#9733; Contrast", purchase: "themePack1" },
        { value: "hell", name: "&#9733; Hell", purchase: "themePack1" },
    ];

    WinJS.UI.Pages.define("/pages/settings/settings.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("buyThemes").addEventListener("click", this.buyThemes.bind(this), false);

            // Initialize the in-app purchasing
            inAppPurchase();
            //Put in the theme list:
            generateThemeList();
            //Push all the values:
            updateValues();

            $("input[name=difficultyRadio]").click(diffucltyChange);
            $("input[name=firstmoveRadio]").click(firstmoveChange);
            document.getElementById("themeMusic").addEventListener("change", musicChange, false);
            document.getElementById("moveSounds").addEventListener("change", soundsChange, false);
            document.getElementById("themeSelect").addEventListener("change", themeChange, false);
        },

        buyThemes: function(){
            var licenseInformation = currentApp.licenseInformation;
            if (!licenseInformation.productLicenses.lookup("themePack1").isActive) {
                currentApp.requestProductPurchaseAsync("themePack1", false).done(
                    function () {
                        if (licenseInformation.productLicenses.lookup("themePack1").isActive) {
                            //TODO: Success
                        } else {
                            //TODO: Error.
                        }
                    },
                    function () {
                        //TODO: Error
                    });
            } else {
                //You already have it. Fail silently, or remove button.
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function diffucltyChange() {
        settings = settings.set("difficulty", $("input[name=difficultyRadio]:checked").val());
    }
    function firstmoveChange() {
        settings = settings.set("firstmove", parseInt($("input[name=firstmoveRadio]:checked").val(), 10));
    }
    function themeChange() {
        settings = settings.set("theme", document.getElementById("themeSelect").value);
    }
    function musicChange() {
        settings = settings.set("music", document.getElementById("themeMusic").winControl.checked);
    }
    function soundsChange() {
        settings = settings.set("sounds", document.getElementById("moveSounds").winControl.checked);
    }

    function updateValues() {
        //FirstMove
        document.getElementById(settings.s.firstmove + "Move").checked = true;
        //Difficulty
        document.getElementById(settings.s.difficulty + "Diff").checked = true;
        //Theme
        document.getElementById("themeSelect").value = settings.s.theme;
        //Music
        document.getElementById("themeMusic").winControl.checked = settings.s.music;
        //Sounds
        document.getElementById("moveSounds").winControl.checked = settings.s.sounds;
    }

    function generateThemeList() {
        var licenseInformation = currentApp.licenseInformation;

        //Clear out the select:
        var select = document.getElementById("themeSelect");
        select.innerHTML = "";

        //TODO: Add stars here?
        for (var i = 0; i < themes.length; i++) {
            if ((themes[i].unlock && !settings.unlocked(themes[i].unlock)) || (themes[i].purchase && !licenseInformation.productLicenses.lookup(themes[i].purchase).isActive)) {
                //Don't render.
            } else {
                var node = document.createElement("option");
                node.value = themes[i].value;
                node.innerHTML = themes[i].name;
                select.appendChild(node);
            }
        }
    }

    function inAppPurchase() {
        currentApp.licenseInformation.addEventListener("licensechanged", inAppPurchaseRefreshScenario);

        var licenseInformation = currentApp.licenseInformation;
        if (licenseInformation.productLicenses.lookup("themePack1").isActive) {
            document.getElementById("buyThemes").style.visibility = "hidden";
        } else {
            document.getElementById("buyThemes").style.visibility = "visible";
        }
    }

    function inAppPurchaseRefreshScenario() {
        var licenseInformation = currentApp.licenseInformation;
        if (licenseInformation.isActive) {
            // license status is active - check the trial status
            if (licenseInformation.isTrial) {
                //Lock up the options!
                console.log && console.log("You have only a trial license. You need a full license to make an in-app purchase.", "sample", "error");
            } else {
                //TODO: unlock options
            }
        } else {
            console.log && console.log("You don't have active license.", "sample", "error");
        }
    }

})();
