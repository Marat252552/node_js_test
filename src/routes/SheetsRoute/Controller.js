const { default: axios } = require('axios');
const { google } = require("googleapis")

const sheet_columns = [
    { header: 'API', key: 'API', width: 15 },
    { header: 'Description', key: 'Description', width: 15 },
    { header: 'Auth', key: 'Auth', width: 15 },
    { header: 'HTTPS', key: 'HTTPS', width: 15 },
    { header: 'Cors', key: 'Cors', width: 15 },
    { header: 'Category', key: 'Category', width: 15 },
    { header: 'Link', key: 'Link', width: 15 },
]

const sortByLetters = (entry1, entry2) => {
    const name1 = entry1.API.toUpperCase()
    const name2 = entry2.API.toUpperCase()
    if (name1 < name2) return -1
    if (name1 > name2) return 1
    return 0
}

class Controller {
    async getSheets(req, res) {
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
            // get metadata
            // const metaData = await googleSheets.spreadsheets.get({
            //     auth,
            //     spreadsheetId,
            // })

            // write
            const formed_entries = entries.map(entry => {
                const { API, Description, Auth, HTTPS, Cors, Category, Link } = entry
                return [API, Description, Auth, HTTPS, Cors, Category, Link]
            })

            const range = "Sheet1"

            const appendValue = ['API', 'Description', 'Auth', 'HTTPS', 'Cors', 'Category', 'Link']
            const backgroundColor = { red: 1, green: 1, blue: 0 }; // This is a sample background color. In this case, the red color is used.

            const values = appendValue.map((e) => ({ userEnteredValue: { stringValue: e }, userEnteredFormat: { backgroundColor } }));
            const requests = [{ appendCells: { rows: [{ values }], sheetId: 0, fields: "userEnteredValue,userEnteredFormat" } }];
            await googleSheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } });

            // creating body
            await googleSheets.spreadsheets.values.append({
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