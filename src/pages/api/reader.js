// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/prisma';

const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key]
    }
    return memo
  }, {})
}

const omit = (obj, items) => transform(obj, (value, key) => !items.includes(key))


export default async function handler(req, res) {
  try {
    console.log(`${req.query.url}/api`)
    const _req = await axios.get(`${req.query.url}/api`, {
      params: {
        ...JSON.parse(req.query.addr)
      }
    })
    console.log("_req.data", _req.data)

    const states = ["closed", "tripped", "interrupt"]

    const data = {
      values: {
        voltage: faker.datatype.number({
          min: 0,
          max: 230
        }),
        freq: faker.datatype.number({
          min: 0,
          max: 60
        }),
        ampere: faker.datatype.number({
          min: -20,
          max: 20
        }),
        power: faker.datatype.number({
          min: 0,
          max: 1000
        })
      },
      time: Date.now(),
      state: Math.floor(Math.random() * states.length)
    }
    res.status(200).json(_req.data)
    // res.status(200).send(data)

    const a = omit({
      time: _req.data.time,
      ..._req.data.values
    }, ["closed", "tripped"])
console.log('{ ...a, device: JSON.parse(req.query.addr).device }', { ...a, device: JSON.parse(req.query.addr).device })
    await prisma.stat.create({
      data: { ...a, device: JSON.parse(req.query.addr).device }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
