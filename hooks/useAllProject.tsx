import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { PROJECT } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'

export default function useProjectData(projectFilter: any) {
    const [loadingProject, setLoading] = useState(true)
    const [errorProject, setError] = useState(false)
    const [getAllProject, setGetAllProject] = useState<any>([])
    const [hasMoreProject, setHasMore] = useState(false)


    const getProjectData = async () => {
        const token = Storage.get(TOKEN)
        if ((token == null || token == undefined)) {
            return
        }
        if (projectFilter.page == 0) {
            return
        }
        const search = (projectFilter.profession == "all" ? { page: projectFilter.page } : projectFilter)
        await ApiMemberGet(`${PROJECT}`, search)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetAllProject((project: any) => {
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
        getProjectData();
    }, [projectFilter])

    return { loadingProject, errorProject, getAllProject, hasMoreProject }
}