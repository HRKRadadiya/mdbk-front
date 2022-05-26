import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT, SEARCH_SENT_REQUESTS } from '../constants/api'
import { useDispatch } from 'react-redux'

export default function useSideCharSendRequest(sendFilter: any) {
    const [loadingSideCharSent, setLoadingSideCharSent] = useState(true)
    const [errorSideCharSent, setErrorSideCharSent] = useState(false)
    const [sideCharSentRequest, setSideCharSentRequest] = useState<any>([])
    const [hasMoreSideCharSent, setHasMoreSideCharSent] = useState(false)
    const dispatch = useDispatch();

    const getClientData = async () => {
        if (sendFilter.page == 0) {
            return
        }
        // const search = sendFilter.profession == "all" ? { page: sendFilter.page, is_company: sendFilter.is_company } : sendFilter
        // console.log(sendFilter, "--", search)
        await ApiMemberGet(`${SEARCH_SENT_REQUESTS}`, sendFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setSideCharSentRequest((sideChar: any) => {
                        if (sendFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...sideChar, ...response.data.rows]
                        )
                    })
                    setHasMoreSideCharSent(response.data.rows.length > 0)
                    setLoadingSideCharSent(false)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(errorSideCharSent => {
                if (axios.isCancel(errorSideCharSent)) return
                console.log("ErrorSideCharSent", errorSideCharSent)
            })
    }

    useEffect(() => {
        setLoadingSideCharSent(true)
        setErrorSideCharSent(false)
        getClientData();
    }, [sendFilter])

    return { loadingSideCharSent, errorSideCharSent, sideCharSentRequest, hasMoreSideCharSent }
}