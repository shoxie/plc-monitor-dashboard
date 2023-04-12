import { prisma } from "@/lib/prisma"

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
    const { username, password } = req.body
    console.log('req.body', req.body)
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    })
    console.log(user)
    if (!user) {
        return res.status(401).json({ error: "User not found" })
    }
    if (user.password !== password) {
        return res.status(401).json({ error: "Password incorrect" })
    }
    res.status(200).json(omit(user, ["password"]))
}
