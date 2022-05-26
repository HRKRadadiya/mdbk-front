import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT, SEARCH_SENT_REQUESTS } from '../constants/api'
import { useDispatch } from 'react-redux'

export default function useClientRecieveRequest(recieveFilter: any) {
    const [loadingRecieve, setLoadingRecieve] = useState(true)
    const [errorRecieve, setErrorRecieve] = useState(false)
    const [clientRecieveRequest, setClientRecieveRequest] = useState<any>([])
    const [hasMoreRecieve, setHasMoreRecieve] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        setClientRecieveRequest([])
    }, [recieveFilter.is_refresh])

    const getClientData = async () => {
        if (recieveFilter.page == 0) {
            return
        }
        // const search = recieveFilter.profession == "all" ? { page: recieveFilter.page, is_company: recieveFilter.is_company } : recieveFilter
        // console.log(recieveFilter, "--", search)
        await ApiMemberGet(`${SEARCH_SENT_REQUESTS}`, recieveFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setClientRecieveRequest((client: any) => {
                        if (recieveFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...client, ...response.data.rows]
                        )
                    })
                    setHasMoreRecieve(response.data.rows.length > 0)
                    setLoadingRecieve(false)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(errorRecieve => {
                if (axios.isCancel(errorRecieve)) return
                console.log("ErrorRecieve", errorRecieve)
            })
    }

    useEffect(() => {
        setLoadingRecieve(true)
        setErrorRecieve(false)
        getClientData();
    }, [recieveFilter])

    return { loadingRecieve, errorRecieve, clientRecieveRequest, hasMoreRecieve }
}