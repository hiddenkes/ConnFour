//Universal settings object.

var Settings = function () {
    var applicationData = Windows.Storage.ApplicationData.current;
    this.localSettings = applicationData.localSettings;
    this.get();
    if (typeof this.s === "undefined") {
        this.first();
    }
}

Settings.prototype = {
    //Set the default values.
    first: function () {
        var sets = new Windows.Storage.ApplicationDataCompositeValue();
        //The current theme:
        sets["theme"] = "standard";
        //The difficulty:
        sets["difficulty"] = "normal";
        //Music:
        sets["music"] = true;
        //Sound:
        sets["sounds"] = true;
        //Who moves first. (1=you, 2=comp, 3=random)
        sets["firstmove"] = 1;
        this.localSettings.values["settings"] = sets;
        this.s = this.localSettings.values["settings"];

        //Create empty unlocks store:
        var unlocks = new Windows.Storage.ApplicationDataCompositeValue();
        this.localSettings.values["unlocks"] = unlocks;

        return this;
    },
    //We can use this in the future if we need to add things to our database.
    upgrade: function(){

    },
    //Gets the settings and stores them in this.s.
    get: function () {
        this.s = this.localSettings.values["settings"];
        return this;
    },
    //Set the value of a specific key:
    set: function (key, value) {
        this.s[key] = value;
        this.setAll(this.s);
        return this;
    },
    //Set all of the values:
    setAll: function(all){
        this.localSettings.values["settings"] = all;
        return this;
    },
    //Unlock an item:
    unlock: function (item) {
        var unlocks = this.localSettings.values["unlocks"];
        if (unlocks) {
            //You can't unlock something more than once:
            if (!this.unlocked(item)) {
                unlocks[item] = true;
                this.localSettings.values["unlocks"] = unlocks;
            }
        }
        return this;
    },
    //Check to see if an item is unlocked:
    unlocked: function (item) {
        var unlocks = this.localSettings.values["unlocks"];
        if (unlocks) {
            if (unlocks[item]) {
                return true;
            }
        }
        return false;
    }
}