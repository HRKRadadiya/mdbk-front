import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_SIDE_CHARACTER, SEARCH_WITHOUT_AUTH_PROJECT } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'
import { searchFilterForm } from '../redux/actions/memberAction'
import { useDispatch } from 'react-redux'

export default function useProjectSearch(searchFilter: any) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchProject, setSearchProject] = useState<any>([])
    const [hasMore, setHasMore] = useState(false)
    const dispatch = useDispatch();
    useEffect(() => {
        setSearchProject([])
    }, [searchFilter.profession])


    const getSideCharecterData = async () => {
        if (searchFilter.page == 0) {
            return
        }
        const search = searchFilter.profession == "all" ? { page: searchFilter.page } : searchFilter
        await ApiMemberGet(`${SEARCH_WITHOUT_AUTH_PROJECT}`, search)
            .then((response: any) => {
                if (response.data && response.success) {
                    setSearchProject((project: any) => {
                        if (search.page == 1) {
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
                if (axios.isCancel(error)) return
                console.log("Error", error)
            })

    }

    useEffect(() => {
        setLoading(true)
        setError(false)
        getSideCharecterData();
    }, [searchFilter])

    return { loading, error, searchProject, hasMore }
}