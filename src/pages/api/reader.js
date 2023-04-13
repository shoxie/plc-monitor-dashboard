// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/prisma';
import { omit } from '@/lib/utils';

export default async function handler(req, res) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
  const willSave = req.query.noSaving ? false : true
  try {
    const _req = await axios.get(`${req.query.url}/api`, {
      params: {
        ...JSON.parse(req.query.addr)
      }
    })

    const states = ["closed", "tripped", "interrupt"]
    res.status(200).json(_req.data)
    // res.status(200).send(data)

    const a = omit({
      time: _req.data.time,
      ..._req.data.values
    }, ["closed", "tripped"])

    if (willSave) {
      await prisma.stat.create({
        data: { ...a, device: JSON.parse(req.query.addr).device }
      })
    }
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
