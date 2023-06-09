const express = require('express')
var cors = require('cors')
const morgan = require('morgan')
const mysql = require('mysql2')

const app = express()

app.use(cors())
app.use(express.json());

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

// https://gist.githubusercontent.com/meech-ward/1723b2df87eae8bb6382828fba649d64/raw/ee52637cc953df669d95bb4ab68ac2ad1a96cd9f/lotr.sql
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

function getRandomInt(max) {
  return 1 + Math.floor(Math.random() * (max-1))
}

async function getCharacter(id) {
  const [characters] = await pool.promise().query("SELECT * FROM characters WHERE id = ?", [
    id,
  ])
  return characters[0]
}
async function randomId() {
  const [rows] = await pool.promise().query(
    "SELECT COUNT(*) as totalCharacters FROM characters"
  )
  const { totalCharacters } = rows[0]
  const randomId = getRandomInt(totalCharacters)
  return randomId
}

async function getAllStudents() {
  const [rows] = await pool.promise().query(
    "SELECT * FROM characters"
  )
  return rows
}

app.get("/test", (req, res) => {
  res.send("<h1>It's working 🤗</h1>")
})

app.get("/", async (req, res) => {
  try {
    // const id = await randomId()
    const character = await getAllStudents()
    res.send(character)
  } catch (error) {
    res.send(error)
  }
})

app.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id) || await randomId()
    const character = await getCharacter(id)
    res.send(character)
  } catch (error) {
    res.send(error)
  }
})

app.post("/:add", async (req, res) => {
  try {
    console.log(req.body.stdName);
    let name = req.body.stdName;
    let stdDivion = req.body.stdDivion
    const [rows] = await pool.promise().query(
      "INSERT INTO characters VALUES (?, ?, ?)", [
        getRandomInt(20), name, stdDivion
      ])

    res.statusCode(200)

  } catch (error) {
    res.send(error)
  }
})


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}`))