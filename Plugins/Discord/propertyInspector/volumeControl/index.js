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
    rdio1: $('#rdio1'),
    rdio2: $('#rdio2'),
    slider: $('#slider'),
    box: $('#box'),
    temperatureslider: $('#temperatureslider'),
  };
const $propEvent = {
  didReceiveSettings(data) {
    $websocket.getGlobalSettings();
    if (data.settings.rdio === 'input') {
      $dom.rdio1.value = data.settings.rdio;
      $dom.rdio1.checked = true;
      $dom.slider.max = 100;
    } else {
      $dom.rdio2.value = data.settings.rdio;
      $dom.rdio2.checked = true;
      $dom.slider.max = 200;
    }
    $dom.slider.value = data.settings.slider;
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

$dom.rdio1.on('change', (e) => {
  // Input
  $settings.rdio = e.target.value;
  $websocket.sendToPlugin({ rdio: e.target.value });
});

$dom.rdio2.on('change', (e) => {
  // Output
  $settings.rdio = e.target.value;
  $websocket.sendToPlugin({ rdio: e.target.value });
});

$dom.slider.on('change', (e) => {
  $settings.slider = e.target.value;
  $websocket.sendToPlugin({ rdio: $settings.rdio, slider: e.target.value });
});

$dom.logout.on('click', () => {
  // $websocket.openUrl('http://127.0.0.1:26432/logout');
  $websocket.setGlobalSettings({ clientId: '', clientSecret: '', accessToken: '' });
});
