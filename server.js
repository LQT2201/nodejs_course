const app = require("./src/app")

const PORT = 3035

const server = app.listen(3050, () => {
    console.log("Project start with PORT " + PORT)
})

process.on("SIGINT", () => {
    server.close(() => console.log("EXIT Server"))
})
