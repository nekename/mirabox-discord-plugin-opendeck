/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

// {
//     "Icon": "static/icon/1僾儔僌僀儞儕僗僩.png",
//     "Name": "Push To Mute",
//     "States": [
//       {
//         "Image": "static/icon/1"
//       },
//       {
//         "Image": "static/icon/1僾儔僌僀儞儕僗僩"
//       }
//     ],
//     "UserTitleEnabled": false,
//     "SupportedInMultiActions": false,
//     "Tooltip": "discord operation",
//     "UUID": "com.hotspot.streamdock.discord.pushtotalk",
//     "PropertyInspectorPath": "propertyInspector/pushtotalk/index.html"
//   },
//   {
//     "Icon": "static/icon/1僾儔僌僀儞儕僗僩.png",
//     "Name": "Push To Talk",
//     "States": [
//       {
//         "Image": "static/icon/1僾儔僌僀儞儕僗僩"
//       },
//       {
//         "Image": "static/icon/1"
//       }
//     ],
//     "UserTitleEnabled": false,
//     "SupportedInMultiActions": false,
//     "Tooltip": "discord operation",
//     "UUID": "com.hotspot.streamdock.discord.pushtomute",
//     "PropertyInspectorPath": "propertyInspector/pushtomute/index.html"
//   },

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
    initiateBoxx: $('#initiateBoxx'),
    clientId: $('#clientId'),
    open: $('#open'),
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
