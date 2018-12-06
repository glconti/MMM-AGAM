/* Magic Mirror
 * Node Helper: MMM-AGAM
 *
 * By Gianluigi Conti
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const exec = require('child_process').exec;

module.exports = NodeHelper.create({

  initGoogleAssistant: function () {

    var self = this;
    console.log("Initializing Google assistant");

    exec('. $HOME/env/bin/activate && googlesamples-assistant-hotword', function (err, stdout, stderr) {
      if (stdout) {
        self.handleStdOut(stdout);
      }
    });

    console.log("Google assistant ready");
  },

  handleStdOut: function (data) {

    console.log(data);
    console.error(data);

    if (data === 'ON_CONVERSATION_TURN_STARTED') {
      this.sendSocketNotification('ON_CONVERSATION_TURN_STARTED', null);
    } else if (data === 'ON_CONVERSATION_TURN_FINISHED') {
      this.sendSocketNotification('ON_CONVERSATION_TURN_FINISHED', null);
    } else if (data.includes('ON_RECOGNIZING_SPEECH_FINISHED')) {
      var query = data.split(":");
      this.sendSocketNotification('ON_RECOGNIZING_SPEECH_FINISHED', query[1]);
    }
  },

  // Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'INIT') {

      this.initGoogleAssistant();
    }
  }

});
