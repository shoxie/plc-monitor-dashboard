import axios from "axios"

export default async function handler(req, res) {
    const {url} = req.query
    // console.log(req.query)
    // console.log("req.query", req.query)
    const data = await axios.get(url)
    res.status(200).json(data)
    // res.status(200).json({ msg: "lmao"})
}
