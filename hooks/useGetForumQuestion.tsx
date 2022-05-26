import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { FORUM_QUESTION_LIST } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useForumQuestionData(questionFilter: any) {
    const [loadingQuesion, setLoading] = useState(true)
    const [errorQuesion, setError] = useState(false)
    const [getQuesion, setGetQuesion] = useState<any>([])
    const [hasMoreQuesion, setHasMore] = useState(false)


    useEffect(() => {
        setGetQuesion([])
    }, [questionFilter.category, questionFilter.is_waiting_response, questionFilter.is_refresh])

    const getQuestionData = async () => {
        // const token = Storage.get(TOKEN)
        // if ((token == null || token == undefined)) {
        //     return
        // }
        if (questionFilter.page == 0) {
            return
        }
        // const search = (questionFilter.profession == "all" ? { page: questionFilter.page } : questionFilter)
        await ApiMemberGet(`${FORUM_QUESTION_LIST}`, questionFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetQuesion((project: any) => {
                        if (questionFilter.page == 1) {
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
        getQuestionData();
    }, [questionFilter])

    return { loadingQuesion, errorQuesion, getQuesion, hasMoreQuesion, setGetQuesion }
}