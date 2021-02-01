const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')

const BASE_URL = 'https://api.test.virtaglobal.com/stations'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Station {
    station_ID: Int!
    name: String!
    status: String,
    available: Int
  }
 
  type Query {
    getAllStations: [Station]
    getStationById(station_ID: Int!): Station
  }
`)

async function getAllStations() {
  const allStations = await fetch(BASE_URL).then((response) => response.json())
  return allStations
}

async function getStationById(station_ID) {
  const stationData = await fetch(`${BASE_URL}/${station_ID}`).then((response) => response.json())
  return stationData
}

// top-level API endpoints
const root = {
  getAllStations: () => getAllStations(),
  getStationById: ({ station_ID }) => getStationById(station_ID),
}

const app = express()
app.use(cors())

app.use(
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
)

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000')
