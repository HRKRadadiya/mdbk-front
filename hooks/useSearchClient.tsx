import { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiMemberGet } from '../service/api'
import { SEARCH_CLIENT } from '../constants/api'
import { searchFilterForm } from '../redux/actions/memberAction'
import { useDispatch } from 'react-redux'

export default function useSearchClient(searchFilter: any) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchClient, setSearchClient] = useState<any>([])
    const [hasMore, setHasMore] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        setSearchClient([])
    }, [searchFilter.profession, searchFilter.locations, searchFilter.fields, searchFilter.is_company, searchFilter.is_refresh])

    const getClientData = async () => {
        if (searchFilter.page == 0) {
            return
        }
        const search = searchFilter.profession == "all" ? { page: searchFilter.page, is_company: searchFilter.is_company } : searchFilter
        console.log(searchFilter, "--", search)
        await ApiMemberGet(`${SEARCH_CLIENT}`, search)
            .then((response: any) => {
                if (response.data && response.success) {
                    setSearchClient((client: any) => {
                        if (search.page == 1) {
                            return (
                                [...response.data.rows]
                            )
                        }
                        return (
                            [...client, ...response.data.rows]
                        )
                    })
                    const searchFilter = {
                        client__side_character: response.data.search_option.client__side_character,
                        side_character__client: response.data.search_option.side_character__client
                    }
                    dispatch(searchFilterForm(searchFilter))
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
        getClientData();
    }, [searchFilter])

    return { loading, error, searchClient, hasMore }
}