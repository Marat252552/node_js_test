const { Router } = require("express")
const Controller = require("./Controller")


const GetExcelRouter = () => {
    const router = Router()
    router.get('/', Controller.getExcelFile)
    return router
}

module.exports = GetExcelRouter