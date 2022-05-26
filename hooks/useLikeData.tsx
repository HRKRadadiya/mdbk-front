import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT, SEARCH_MY_LIKE } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useLikeData(likeFilter: any) {
    const [loadingLike, setLoading] = useState(true)
    const [errorLike, setError] = useState(false)
    const [memberLikeData, setMemberLikeData] = useState<any>([])
    const [hasMoreLike, setHasMore] = useState(false)

    useEffect(() => {
        setMemberLikeData([])
    }, [likeFilter.is_refresh])

    const getLikeData = async () => {
        const token = Storage.get(TOKEN)
        if ((token == null || token == undefined)) {
            return
        }
        if (likeFilter.page == 0) {
            return
        }
        await ApiMemberGet(`${SEARCH_MY_LIKE}`, likeFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setMemberLikeData((like: any) => {
                        if (likeFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...like, ...response.data.rows]
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
        getLikeData();
    }, [likeFilter])

    return { loadingLike, errorLike, memberLikeData, hasMoreLike }
}