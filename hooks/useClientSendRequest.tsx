import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT, SEARCH_SENT_REQUESTS } from '../constants/api'
import { useDispatch } from 'react-redux'

export default function useClientSentRequest(sendFilter: any) {
    const [loadingSent, setLoadingSent] = useState(true)
    const [errorSent, setErrorSent] = useState(false)
    const [clientSentRequest, setClientSentRequest] = useState<any>([])
    const [hasMoreSent, setHasMoreSent] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        setClientSentRequest([])
    }, [sendFilter.is_refresh])

    const getClientData = async () => {
        if (sendFilter.page == 0) {
            return
        }
        // const search = sendFilter.profession == "all" ? { page: sendFilter.page, is_company: sendFilter.is_company } : sendFilter
        // console.log(sendFilter, "--", search)
        await ApiMemberGet(`${SEARCH_SENT_REQUESTS}`, sendFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setClientSentRequest((client: any) => {
                        if (sendFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...client, ...response.data.rows]
                        )
                    })
                    setHasMoreSent(response.data.rows.length > 0)
                    setLoadingSent(false)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(errorSent => {
                if (axios.isCancel(errorSent)) return
                console.log("ErrorSent", errorSent)
            })
    }

    useEffect(() => {
        setLoadingSent(true)
        setErrorSent(false)
        getClientData();
    }, [sendFilter])

    return { loadingSent, errorSent, clientSentRequest, hasMoreSent }
}