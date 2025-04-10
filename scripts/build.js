import Database from "better-sqlite3"
import {featureCollection, lineString} from '@turf/helpers'
import path from 'node:path'
import * as fs from "node:fs"
import Distance from '@simoko/geo-distance'

// query all idxId
const db = new Database("database/svid_lng_lat.sqlite3.db")
const idxIdStatement = db.prepare('select DISTINCT substring(key, 1, 4) idxId from keyValueTable')
const idxIdArr = idxIdStatement.all()

// query svid, lng, lat for each idxId
const statement = db.prepare('select key svid, lng, lat from keyValueTable where key like ? order by key')
const distance = new Distance()
for (const item of idxIdArr) {
    let {idxId} = item
    let collection = featureCollection([], {id: idxId * 1})

    // add line
    let all = statement.all(idxId + "%")

    let currentLinePoints
    let previousPointLngLat
    let previousPointTimestamp

    for (let element of all) {
        let {svid, lng, lat} = element

        // let lngLat = [lng.toFixed(6) * 1, lat.toFixed(6) * 1]
        let lngLat = [Math.floor(lng * 1e6) / 1e6, Math.floor(lat * 1e6) / 1e6]
        let timestamp = getTimestamp(svid)

        // first point
        if (!currentLinePoints) {
            currentLinePoints = [lngLat]
        } else {
            //
            let abs = Math.abs(timestamp - previousPointTimestamp)
            let distanceNumber = distance.between({lng: lngLat[0], lat: lngLat[1]}, {
                lng: previousPointLngLat[0], lat: previousPointLngLat[1]
            })

            // < 2 min and < 200m
            if (abs < 1000 * 60 * 2 && distanceNumber < 0.2) {
                currentLinePoints.push(lngLat)
            } else {
                // add line, ignore if only 1 point
                if (currentLinePoints.length > 1) {
                    collection.features.push(lineString(currentLinePoints, {ft: 2}))
                }

                //new line
                currentLinePoints = [lngLat]
            }
        }

        //
        previousPointLngLat = lngLat
        previousPointTimestamp = timestamp
    }

    // add last line
    if (currentLinePoints && currentLinePoints.length > 1) {
        collection.features.push(lineString(currentLinePoints, {ft: 2}))
    }

    // write
    let filePath = path.join("geoJSON", `${idxId}.json`)
    console.log('writing', filePath)
    fs.writeFileSync(filePath, JSON.stringify(collection))
}

function getTimestamp(svid) {
    return new Date(2000 + Number(svid.slice(8, 10)), Number(svid.slice(10, 12)) - 1, Number(svid.slice(12, 14)), Number(svid.slice(14, 16)), Number(svid.slice(16, 18)), Number(svid.slice(18, 20))).getTime()
}

