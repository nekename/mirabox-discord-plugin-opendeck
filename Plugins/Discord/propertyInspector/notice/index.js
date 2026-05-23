/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

// $local Whether internationalization is supported
// $back Whether to decide echo timing independently
// $dom Get document elements - Non-dynamic ones are written here
const $local = true,
  $back = false,
  $dom = {
    main: $('.sdpi-wrapper'),
    logout: $('#logout'),
    logoutdiv: $('#logoutdiv'),
  };

const $propEvent = {
  didReceiveSettings(data) {
    $websocket.getGlobalSettings();
  },
  didReceiveGlobalSettings({ settings }) {
    console.log('Global setting');
    if (!settings.clientSecret) {
      openAuthorization();
    } else {
      logoutdiv.style.display = 'flex';
    }
  },
};

$dom.logout.on('click', () => {
  // $websocket.openUrl('http://127.0.0.1:26432/logout');
  $websocket.setGlobalSettings({ clientId: '', clientSecret: '', accessToken: '' });
});
