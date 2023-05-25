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
        const { data } = await axios.get(`/api/getData?query=${JSON.stringify({ ...params })}`)
        console.log('lib data', data)
        cb(data)
        return data
    }
}

export const reader = async (url, params, willSave, isAndroid, cb) => {
    if (isAndroid) {
        const { data } = await axios.get(`${url}/api`, {
            params: {
                ...params
            }
        })
        cb(data);
        return data
    } else {
        const { data } = await axios.get(`/api/reader?addr=${JSON.stringify({ ...params })}&url=${url}&noSaving=${!willSave}`)
        cb(data)
        return data
    }
}

export const getWeatherData = async (location) => {
    try {
        const weatherData = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=10.82&longitude=106.63&hourly=relativehumidity_2m,rain,weathercode&models=gfs_seamless&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum&current_weather=true&timezone=Asia%2FBangkok")

        return weatherData.data
    } catch (err) {
        return err
    }
}