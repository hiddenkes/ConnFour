(function () {
    "use strict";
    //TODO: Maybe get out of the instance if errors start popping up.
    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var nextPage = document.getElementById("pageGame");
            nextPage.addEventListener("click", function () {
                $("#secondary").removeClass("right");
                $("#main").addClass("left");
                $("#traverseMenu").removeClass("traverHidden");
                //WinJS.Navigation.navigate("/pages/game/game.html", {twoplayer: true});
            });

            document.getElementById("onePlayer").addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/game/game.html", { twoplayer: false });
            });
            document.getElementById("twoPlayer").addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/game/game.html", { twoplayer: true });
            });


            document.getElementById("traverseMenu").addEventListener("click", this.goBack.bind(this), false);

            var options = document.getElementById("options");
            options.addEventListener("click", function () {
                WinJS.UI.SettingsFlyout.showSettings("Settings", "/pages/settings/settings.html");
            });

            //Start dropping random pieces.
            this.startDrop();

            this.settings = new Settings();
        },
        goBack: function () {
            $("#secondary").addClass("right");
            $("#main").removeClass("left");
            $("#traverseMenu").addClass("traverHidden");
        },
        startDrop: function () {
            //Clear out droppers:
            $("#droppers").html("");

            this.dropped = [];
            this.cols = Math.floor(window.innerWidth / 100) + 1;
            this.rows = Math.floor(window.innerHeight / 100) + 1;
            for (var i = 0; i < this.cols; i++){
                this.dropped[i] = 0;
            }
            this.dropping = true;
            this.doDrop();
        },
        unload: function () {
            //Stop dropping:
            this.dropping = false;
        },
        doDrop: function () {
            var that = this;
            var genRand = function () {
                var tmp = Math.round(Math.random() * (that.cols - 1));
                if (that.dropped[tmp] >= that.rows) {
                    var tmp = genRand();
                }
                if(tmp){
                    return tmp;
                }else{
                    return 0
                }
            }
            var rand = genRand();
            this.dropped[rand]++;
            var piece = $("<div>").addClass("simdrop");
            piece.css("left", rand * 100 + "px");
            piece.addClass(Math.random() > 0.5  ? "simone" : "simtwo");
            $("#droppers").append(piece);
            var newtop = (window.innerHeight) - (this.dropped[rand] * 100);
            piece.animate({
                top: newtop + "px",
            }, 1000, "easeOutBounce", function () {
                if (that.dropping) {
                    if (that.canDrop()) {
                        that.doDrop();
                    } else if (!that.canDrop()) {
                        if (!that.settings.unlocked("indecisive")) {

                            //Unlock it!
                            that.settings.unlock("indecisive");

                            // Create the message dialog and set its content
                            var msg = new Windows.UI.Popups.MessageDialog("Hello, are you there?\n\nYou let the entire screen fill up with pieces.\nFor your... patience, we've awarded you a bonus theme: \"Indecisive\"");

                            // Add commands and set their command handlers
                            msg.commands.append(new Windows.UI.Popups.UICommand("Awesome!", function () {
                                that.allout();
                            }));

                            // Set the command that will be invoked by default
                            msg.defaultCommandIndex = 0;

                            // Set the command to be invoked when escape is pressed
                            msg.cancelCommandIndex = 0;

                            // Show the message dialog
                            msg.showAsync();
                        } else {
                            that.allout();
                        }
                    }
                }
            });
        },
        allout: function (sub) {
            if (typeof sub !== "number") {
                sub = $("#droppers").children().length
            }
            var thissub = parseInt(sub);
            var that = this;
            $($("#droppers").children()[sub]).animate({
                top: "-100px"
            }, 1500, "easeInQuart", function () {
                if (thissub <= 0) {
                    window.setTimeout(function () {
                        if (that.dropping) {
                            that.startDrop();
                        }
                    }, 1000);
                }
            });
            window.setTimeout(function () {
                if (sub >= 0) {
                    sub--;
                    that.allout(sub);
                }
            }, 180);
        },
        //Check for empty spaces:
        canDrop: function () {
            var droppable = true;
            for (var i = 0; i < this.dropped.length; i++) {
                if (this.dropped[i] >= this.rows) {
                    droppable = false;
                } else {
                    return true;
                }
            }
            return droppable;
        }
    });
})();
