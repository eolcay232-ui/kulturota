const fetch = require('node-fetch');
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTFybZkkYn2RsnmFSaNME3WbyJkXoWU54o4hiGKUbMQ6Ijd8m_wO2nK5sRQQnd93XtQS0poQBGBXgGX/pub?output=csv')
  .then(res => res.text())
  .then(text => console.log(text.split('\n')[0]))
