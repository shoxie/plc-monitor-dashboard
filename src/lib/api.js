import axios from 'axios'

export const getData = async (url, params, isAndroid, cb) => {
    if (isAndroid) {
        const { data } = await axios
            .get(`${url}/getData`, {
                params: {
                    where: {
                        device: params.device,
                    },
                    orderBy: {
                        time: "desc",
                    },
                    take: 10,
                },
            })
        cb(data)
        return data
    } else {
        const { data } = await axios.get(`http://localhost:3000/api/getData?query=${JSON.stringify({ ...params })}`)
        console.log('lib data', data)
        cb(data)
        return data
    }
}

export const reader = async (url, params, isAndroid, cb) => {
    if (isAndroid) {
        const { data } = await axios.get(`${url}/api`, {
            params: {
                ...params
            }
        })
        cb(data);
        return data
    } else {
        const { data } = await axios.get(`http://localhost:3000/api/reader?addr=${JSON.stringify({ ...params })}&url=${url}`)
        cb(data)
        return data
    }
}