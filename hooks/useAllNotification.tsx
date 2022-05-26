import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { MEMBER_NOTIFICATIONS, SEARCH_PROJECT } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useProjectClientData(searchFilter: any) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [getAllNotify, setGetAllNotify] = useState<any>([])
    const [hasMore, setHasMore] = useState(false)


    const getAllNotification = async () => {
        const token = Storage.get(TOKEN)
        if ((token == null || token == undefined)) {
            return
        }
        if (searchFilter.page == 0) {
            return
        }
        // const search = (searchFilter.profession == "all" ? { page: searchFilter.page } : searchFilter)
        await ApiMemberGet(`${MEMBER_NOTIFICATIONS}`, searchFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetAllNotify((notification: any) => {
                        if (searchFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...notification, ...response.data.rows]
                        )
                    })
                    setHasMore(response.data.rows.length > 0)
                    setLoading(false)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    useEffect(() => {
        setLoading(true)
        setError(false)
        getAllNotification();
    }, [searchFilter])

    return { loading, error, getAllNotify, hasMore }
}