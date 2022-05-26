import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_SIDE_CHARACTER } from '../constants/api'
import Storage from '../service/storage'
import { TOKEN } from '../constants/storagekey'
import { searchFilterForm } from '../redux/actions/memberAction'
import { useDispatch } from 'react-redux'

export default function useSearchSideCharecter(searchFilter: any) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchSideCharecter, setSearchSideCharecter] = useState<any>([])
    const [hasMore, setHasMore] = useState(false)
    const token = Storage.get(TOKEN)
    const dispatch = useDispatch();
    useEffect(() => {
        setSearchSideCharecter([])
    }, [searchFilter.profession, searchFilter.locations, searchFilter.fields, searchFilter.is_refresh])


    const getSideCharecterData = async () => {
        if (searchFilter.page == 0) {
            return
        }
        const search = (token == null || token == undefined) ? (searchFilter.profession == "all" ? { page: searchFilter.page } : searchFilter) : searchFilter
        await ApiMemberGet(`${SEARCH_SIDE_CHARACTER}`, search)
            .then((response: any) => {
                if (response.data && response.success) {
                    const searchFilter = {
                        client__side_character: response.data.search_option.client__side_character,
                        side_character__client: response.data.search_option.side_character__client
                    }
                    dispatch(searchFilterForm(searchFilter))
                    setSearchSideCharecter((sideChar: any) => {
                        if (search.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...sideChar, ...response.data.rows]
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

    return { loading, error, searchSideCharecter, hasMore }
}