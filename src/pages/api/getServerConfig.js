import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
    const serverConfig = await prisma.serverConfig.findFirst({
        orderBy: {
          created_at: "desc",
        }
      });
    res.status(200).json(serverConfig)
}
