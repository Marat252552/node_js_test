const { Router } = require("express")
const Controller = require("./Controller")


const GetSheetsRouter = () => {
    const router = Router()
    router.get('/', Controller.getSheets)
    return router
}

module.exports = GetSheetsRouter