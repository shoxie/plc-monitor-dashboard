import axios from "axios"
import { useEffect, useState } from "react"

export default function TestPage() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const { data } = await axios.get(`https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=1`, {
                    headers: {
                        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
                        'Access-Control-Allow-Origin': '*',
                        'Cookie': "f5avraaaaaaaaaaaaaaaa_session_=CBLIFLEAGMNCNJCCFKCMDEAHPIIPLNPKDDDBGDIFIKMNEPEJJMBGHLJOAPIOADHLACADGKNMALJHDNDDLCIANLAMHHJGJMIGFIJLMBBELNBPMGJHHLGOGANHPFGPJNHG; TS0135ca68=01059058da236afa806a161d35d2b5429894ec48ff62e10943b2a5c4bde1227e70d5f81e135eb6033ec93922fef46775dd0aff20beb65b781fdafe8c454313b4c9cd7afe78; __cf_bm=W4a7TEHzGUA1J0sDKuKcXOILPFG9uVtdSI6_88LhhlY-1680243643-0-AZdCPZnPAuYV8JkgkrSaQhW7SBWoSGhBocM1fEb8Y5EHggQRSWh1N5d3J7OlAKuME3YU5UM3fk791z4IYYm6hVISkTP1Pwnt37qY6+LPaePT"
                    },
                    withCredentials: true,
                })
                setData(data)
            } catch (error) {
                console.log('error', error)
            }

        }
        getData()
    }, [])

    return (
        <div>{data}</div>
    )
}