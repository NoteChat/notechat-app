import { Editor } from '@renderer/components/editor'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API, { FavoriteDto } from '@renderer/api'

export const FavoriteEdit: React.FC<{}> = () => {

    const { id } = useParams()
    const [data, setData] = useState<FavoriteDto | undefined>(undefined)

    const loadData = async (id) => {
        const res = await API.v1.getFavorite(id)
        if (res.ok) {
            setData(res.data);
        }
    }

    useEffect(() => {
        loadData(id)
    }, [])
    
    return (
        <div className="w-full h-full">
            <div></div>
            <div className="w-full h-full">
                <Editor value={data}/>
            </div>
        </div>
    )
}