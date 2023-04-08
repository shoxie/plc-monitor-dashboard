import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
    let params = req.query.query ? JSON.parse(req.query.query) : {}
    console.log('params', params)
    if (params.orderBy && typeof params.orderBy === "string") {
        params.orderBy = JSON.parse(params.orderBy)
    }
    if (params.take) {
        params.take = parseInt(params.take)
    }
    if (params.where && typeof params.where === "string") {
        params.where = JSON.parse(params.where)
    }
    const data = await prisma.stat.findMany({
        ...params,
    })
    res.status(200).json(data)
}
