const { GoogleAuth } = require('google-auth-library');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = __dirname + '/serviceAccountKey.json';
const spreadsheetId = '';

let sheet;

exports.init = async () => {
  console.log('--- init google sheet ---');
  const client = new GoogleAuth({keyFilename: TOKEN_PATH, scopes: SCOPES});
  
  let auth = await client.getClient();
  sheet = new google.sheets({version: 'v4', auth});
  console.log('--- FINISH init google sheet ---');
}

exports.get = async (range) => {
  return sheet.spreadsheets.values.get({
    spreadsheetId,
    range,
    });
}

exports.append = (range, values) => {
  return sheet.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {values}
    });
}