import { useEffect, useState } from 'react'
import { ApiMemberGet } from '../service/api'
import { PROJECT, PROJECT_ID_APPLICATION } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'
import router from 'next/router'

export default function useProjectApplicationData(projectApplicationFilter: any) {
    const [loadingProjectApplication, setLoading] = useState(true)
    const [errorProjectApplication, setError] = useState(false)
    const [getAllProjectApplication, setGetAllProjectApplication] = useState<any>([])
    const [getProjectData, setGetProjectData] = useState<any>([])
    const [hasMoreProjectApplication, setHasMore] = useState(false)
    const { id } = router.query

    const getProjectApplicationData = async () => {
        const token = Storage.get(TOKEN)
        if ((token == null || token == undefined)) {
            return
        }
        if (projectApplicationFilter.page == 0) {
            return
        }
        await ApiMemberGet(PROJECT_ID_APPLICATION.replace("%id%", id + ""), projectApplicationFilter)
            .then((response: any) => {
                if (response.data && response.success) {
                    setGetProjectData(response.data?.project)
                    setGetAllProjectApplication((project: any) => {
                        if (projectApplicationFilter.page == 1) {
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
        getProjectApplicationData();
    }, [projectApplicationFilter])

    return { loadingProjectApplication, errorProjectApplication, getAllProjectApplication, hasMoreProjectApplication, getProjectData }
}