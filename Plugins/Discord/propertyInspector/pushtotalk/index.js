/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

// $local Whether internationalization is supported
// $back Whether to decide echo timing independently
// $dom Get document elements - Non-dynamic ones are written here
const $local = true,
  $back = false,
  $dom = {
    main: $('.sdpi-wrapper'),
    authorizeBtn: $('#authorizeBtn'),
    authorizeBox: $('#authorizeBox'),
    initiateBox: $('#initiateBox'),
    clientId: $('#clientId'),
    open: $('#open'),
    initiateBoxx: $('#initiateBoxx'),
  };
const $propEvent = {
  didReceiveSettings(data) {},
  sendToPropertyInspector(data) {
    // console.log(data);
    if ('access_token' in data) {
      if (!data.access_token) {
        $dom.authorizeBox.style.display = 'block';
      } else {
        $dom.authorizeBox.style.display = 'none';
      }
    }
    if ('status' in data) {
      $dom.authorizeBox.style.display = 'block';
    }
    if (data?.msg == 'RPC_CONNECTION_TIMEOUT') {
      $dom.initiateBoxx.style.display = 'flex';
    }
    if (!data.initiate) {
      $dom.initiateBox.style.display = 'flex';
    } else {
      $dom.initiateBox.style.display = 'none';
    }
  },
};

$dom.authorizeBtn.on('click', (e) => {
  if ($dom.clientId.value != null && $dom.clientId.value != '') {
    $websocket.openUrl('http://127.0.0.1:26432/authorization?clientId=' + $dom.clientId.value);
  }
});

$dom.open.on('click', () => {
  $websocket.openUrl('https://discord.com/developers/applications');
});
