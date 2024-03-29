import React, { useEffect, useState } from 'react'
import API, { FavoriteDto } from '@renderer/api'
import style from './style.module.scss'
import { Input } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import { Cross2Icon, DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ResponseText } from '@renderer/components/responseText'
import { ConfirmDialog } from '@renderer/components/dialog'
import { toast } from 'react-hot-toast'
import { debounce } from 'lodash'
import { downloadMarkdown } from '@renderer/utils'

export const Favorite: React.FC<{}> = (props) => {
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = useState<FavoriteDto[] | undefined>([])

  const userId = Number(localStorage.getItem('uid'));

  const onSearch = () => {
    const inputDom = document.querySelector<HTMLTextAreaElement>('#queryInput')
    if (!inputDom || loading) return
    const value = inputDom.value

    setLoading(true)
    loadData(value)
  }

  const onKeySearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const loadData = async (title?: string) => {
    const res = await API.v1.getUserFavoriteByTitle({
      userId: userId,
      title: title,
      skip: undefined,
      limit: title ? 100 : 10,
    } as any)
    if (res.data) {
      setData(res.data)
    }
    setLoading(false)
  }

  const lazyLoadData = async () => {
    setLoading(true)
    const params: any = {
      userId: userId,
      title: undefined,
      skip: data?.length,
      limit: 10,
    }
    const res = await API.v1.getUserFavoriteByTitle(params)
    if (res.data && res.data.length > 0) {
      setData((prev = []) => {
        return [...prev, ...res.data]
      })
    }
    setLoading(false)
  }

  const onScrollToBottom = debounce((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement
    const top = Math.round(target.scrollTop + target.clientHeight);
    if (top >= target.scrollHeight) {
      lazyLoadData()
    }
  }, 500)

  const onDeleteItem = async (id: number) => {
    const res = await API.v1.deleteFavorite({ id })
    if (res.ok) {
      toast.success('Delete Success')
      loadData()
    }
  }

  const onDownload = (item) => {
    if (item) {
      downloadMarkdown(item.title, item.content)
    }
  }

  useEffect(() => {
    document.getElementById('queryInput')?.focus()
    loadData()
  }, [])

  return (
    <div className={style.favoriteWrapper}>
      <div className={style.favoriteHeader}>
        <Input
          className={style.favoriteInput}
          id="queryInput"
          placeholder={t('search.label')}
          onKeyDown={onKeySearch}
        />
        <div className={style.favoriteHeaderRight}>
          <button onClick={onSearch} disabled={loading}>
            <MagnifyingGlassIcon />
          </button>
        </div>
      </div>
      <div className={style.favoriteContent} onScroll={onScrollToBottom}>
        {data?.map((item) => {
          return (
            <div className={style.favoriteContentItem} key={item.id}>
              <h1>{item.title}</h1>
              <div className={style.favoriteContentItemTags}>
                {item.tags?.map((tag) => (
                  <span key={tag} title={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <ResponseText
                className={style.favoriteContentItemDetail}
                content={item.content || ''}
                toolbar={['copy', 'notion'] as any}
                quoteTargetId=""
                title={item.title}
                extraToolbar={
                  <div className={style.favoriteContentItemDetailExtra}>
                    <button title={t('download.label')}>
                      <DownloadIcon onClick={() => onDownload(item)}/>
                    </button>
                  </div>
                }
              />
              <ConfirmDialog
                title={t('remove.title')}
                trigger={
                  <button className={style.favoriteContentItemDelete} title={t('remove.title')}>
                    <Cross2Icon />
                  </button>
                }
                description={t('remove.alert')}
                onConfirm={() => onDeleteItem(item.id!)}
              />
            </div>
          )
        })}
        {data?.length === 0 && <div className={style.favoriteContentEmpty}>暂无收藏</div>}
      </div>
    </div>
  )
}
