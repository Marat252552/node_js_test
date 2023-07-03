const { default: axios } = require('axios');
const { google } = require("googleapis");
const sortByLetters = require('../../shared/SortByLetters');

class Controller {
    async getSheets(_, res) {
        try {

            let { data: { entries } } = await axios.get('https://api.publicapis.org/entries')
            entries = entries.filter(entry => entry.HTTPS)
            entries.sort(sortByLetters)

            const auth = new google.auth.GoogleAuth({
                keyFile: "credentials.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            })
            const client = await auth.getClient()
            const googleSheets = google.sheets({ version: 'v4', auth: client })

            const spreadsheetId = process.env.SPREADSHEET_ID
            const formed_entries = entries.map(entry => {
                const { API, Description, Auth, HTTPS, Cors, Category, Link } = entry
                return [API, Description, Auth, HTTPS, Cors, Category, Link]
            })

            const range = "Sheet1"

            const appendValue = ['API', 'Description', 'Auth', 'HTTPS', 'Cors', 'Category', 'Link']
            const backgroundColor = { red: 1, green: 1, blue: 0 }; // This is a sample background color. In this case, the red color is used.

            const values = appendValue.map((e) => ({ userEnteredValue: { stringValue: e }, userEnteredFormat: { backgroundColor } }));
            const requests = [{ appendCells: { rows: [{ values }], sheetId: 0, fields: "userEnteredValue,userEnteredFormat" } }];
            googleSheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } });

            googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: formed_entries
                }
            })

            res.sendStatus(201)

        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}

module.exports = new Controller()