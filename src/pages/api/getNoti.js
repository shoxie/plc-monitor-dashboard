import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
    const data = await prisma.notification.findMany({
        orderBy: {
            created_at: "desc"
        },
        take: 5
    })
    res.status(200).json(data)
}
