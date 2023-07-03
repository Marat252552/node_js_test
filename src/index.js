const express = require('express')
const GetExcelRouter = require('./routes/ExcelRoute/GetExcelRouter.')
const GetSheetsRouter = require('./routes/SheetsRoute/GetSheetsRouter')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const ExcelRouter = GetExcelRouter()
const SheetsRouter = GetSheetsRouter()

app.use('/excel', ExcelRouter)
app.use('/sheets', SheetsRouter)

const PORT = 3000

app.listen(3000, () => {
    console.log('server is running on port ' + PORT)
})