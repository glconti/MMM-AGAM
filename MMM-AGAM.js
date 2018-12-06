/* global Module */

/* Magic Mirror
 * Module: MMM-AGAM
 *
 * By  Gianluigi Conti
 * MIT Licensed.
 */

Module.register("MMM-AGAM", {
  defaults: {
    header: "Google Asistant",
    maxWidth: "100%",
    updateDelay: 500
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  start: function () {
    Log.info('Starting module: Google Assistant Now');

    this.assistantActive = false;
    this.processing = false;
    this.userQuery = null;

    this.sendSocketNotification('INIT', null);
  },

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
    nextLoad = nextLoad;
    var self = this;
    setTimeout(function () {
      self.getData();
    }, nextLoad);
  },

  getDom: function () {
    Log.log('Updating DOM for GA');
    var wrapper = document.createElement("div");

    if (this.assistantActive == true) {
      if (this.processing == true) {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img><br/>" + this.userQuery;
      } else {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img>";
      }
    } else {
      wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_inactive.png'></img>";
    }
    return wrapper;
  },

  // socketNotificationReceived from helper
  socketNotificationReceived: function (notification, payload) {
    if (notification === "MMM-AGAM-NOTIFICATION_TEST") {
      // set dataNotification
      this.dataNotification = payload;
      this.updateDom();
    }

    var self = this;
    delay = self.config.updateDelay;

    if (notification == 'ON_CONVERSATION_TURN_STARTED') {
      this.assistantActive = true;
      delay = 0;
    } else if (notification == 'ON_CONVERSATION_TURN_FINISHED') {
      this.assistantActive = false;
      this.processing = false;
    } else if (notification == 'ON_RECOGNIZING_SPEECH_FINISHED') {
      this.userQuery = payload;
      this.processing = true;
      delay = 0;
    }

    this.updateDom(delay);
  }

});
