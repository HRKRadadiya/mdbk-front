import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { FORUM_RESPONSE_LIST } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useForumResoponseData(responseFilter: any) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [getResponse, setGetResponse] = useState<any>([])
    const [getQuestion, setGetQuestion] = useState<any>([])
    const [hasMore, setHasMore] = useState(false)


    useEffect(() => {
        setGetResponse([])
    }, [responseFilter.is_refresh])


    const getResoponseData = async () => {
        // const token = Storage.get(TOKEN)
        // if ((token == null || token == undefined)) {
        //     return
        // }
        if (responseFilter.page == 0) {
            return
        }
        // const search = (responseFilter.profession == "all" ? { page: responseFilter.page } : responseFilter)
        await ApiMemberGet(`${FORUM_RESPONSE_LIST}`, responseFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetQuestion(response.data)
                    setGetResponse((project: any) => {
                        if (responseFilter.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...project, ...response.data.rows]
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
        getResoponseData();
    }, [responseFilter])

    return { loading, error, getResponse, hasMore, setGetResponse, getQuestion }
}