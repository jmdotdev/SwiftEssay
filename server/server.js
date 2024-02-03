const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})