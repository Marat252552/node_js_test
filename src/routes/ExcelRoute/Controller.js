const { default: axios } = require('axios');
const ExcelJS = require('exceljs');
const sortByLetters = require('../../shared/SortByLetters');

const sheet_columns = [
    { header: 'API', key: 'API', width: 15 },
    { header: 'Description', key: 'Description', width: 15 },
    { header: 'Auth', key: 'Auth', width: 15 },
    { header: 'HTTPS', key: 'HTTPS', width: 15 },
    { header: 'Cors', key: 'Cors', width: 15 },
    { header: 'Category', key: 'Category', width: 15 },
    { header: 'Link', key: 'Link', width: 15 },
]



class Controller {
    async getExcelFile(req, res) {
        try {

            let { data: { entries } } = await axios.get('https://api.publicapis.org/entries')

            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('New Sheet')

            worksheet.columns = sheet_columns

            entries = entries.filter(entry => entry.HTTPS)
            entries.sort(sortByLetters)
            entries.forEach((entry) => {
                const { API, Description, Auth, HTTPS, Cors, Category, Link } = entry
                worksheet.addRow({ API, Description, Auth, HTTPS, Cors, Category, Link: { text: Link, hyperlink: Link } },)
            })
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'lightUp',
                fgColor: { argb: 'FFFF00' },
                bgColor: { argb: 'FFFF00' }
            }

            // save under export.xlsx
            await workbook.xlsx.writeFile('export.xlsx');

            console.log("File is written");

            res.sendStatus(201)

        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}

module.exports = new Controller()