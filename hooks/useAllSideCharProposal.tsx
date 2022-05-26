import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { PROJECT_SIDE_CHARACTER_PROPOSALS, SEARCH_PROJECT } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useAllSideCharProposal(projectFilter: any) {
    const [loadingSideCharPropasal, setLoading] = useState(true)
    const [errorSideCharPropasal, setError] = useState(false)
    const [getAllSideCharPropasal, setGetAllSideCharPropasal] = useState<any>([])
    const [hasMoreSideCharPropasal, setHasMore] = useState(false)


    const getClientAllProject = async () => {
        const token = Storage.get(TOKEN)
        if ((token == null || token == undefined)) {
            return
        }
        if (projectFilter.page == 0) {
            return
        }
        const search = (projectFilter.profession == "all" ? { page: projectFilter.page } : projectFilter)
        await ApiMemberGet(`${PROJECT_SIDE_CHARACTER_PROPOSALS}`, search)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetAllSideCharPropasal((project: any) => {
                        if (projectFilter.page == 1) {
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
        getClientAllProject();
    }, [projectFilter])

    return { loadingSideCharPropasal, errorSideCharPropasal, getAllSideCharPropasal, hasMoreSideCharPropasal }
}