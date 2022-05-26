import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT, SEARCH_SENT_REQUESTS } from '../constants/api'
import { useDispatch } from 'react-redux'

export default function useSideCharRecieveRequest(recieveFilter: any) {
    const [loadingSideCharRecieve, setLoadingSideCharRecieve] = useState(true)
    const [errorSideCharRecieve, setErrorSideCharRecieve] = useState(false)
    const [sideCharRecieveRequest, setSideCharRecieveRequest] = useState<any>([])
    const [hasMoreSideCharRecieve, setHasMoreSideCharRecieve] = useState(false)
    const dispatch = useDispatch();

    const getClientData = async () => {
        if (recieveFilter.page == 0) {
            return
        }
        // const search = recieveFilter.profession == "all" ? { page: recieveFilter.page, is_company: recieveFilter.is_company } : recieveFilter
        // console.log(recieveFilter, "--", search)
        await ApiMemberGet(`${SEARCH_SENT_REQUESTS}`, recieveFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setSideCharRecieveRequest((sideChar: any) => {
                        if (recieveFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...sideChar, ...response.data.rows]
                        )
                    })
                    setHasMoreSideCharRecieve(response.data.rows.length > 0)
                    setLoadingSideCharRecieve(false)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(errorSideCharRecieve => {
                if (axios.isCancel(errorSideCharRecieve)) return
                console.log("ErrorSideCharRecieve", errorSideCharRecieve)
            })
    }

    useEffect(() => {
        setLoadingSideCharRecieve(true)
        setErrorSideCharRecieve(false)
        getClientData();
    }, [recieveFilter])

    return { loadingSideCharRecieve, errorSideCharRecieve, sideCharRecieveRequest, hasMoreSideCharRecieve }
}