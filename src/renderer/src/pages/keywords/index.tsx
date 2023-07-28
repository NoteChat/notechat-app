import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Button, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import Table from 'rc-table'
import './table.less'
import { CircleBackslashIcon, MinusIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { VSCodeIcon } from '@renderer/components/icon'
import { DialogWindow } from '@renderer/components/dialog'
import { ResponseText } from '@renderer/components/responseText'
import { PromptInput } from '@renderer/components/promptInput'
import { Import } from '@renderer/components/import'

const mockData = [
  {
    id: 1,
    keywords: 'test',
    reference: 'test',
    style: 'test',
    progress: 'test',
    result: 'test'
  },
  {
    id: 2,
    keywords: 'test',
    reference: 'test',
    style: 'test',
    progress: 'test',
    result: 'test'
  }
]

export const Keywords: React.FC<{}> = (props) => {
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<any[]>(mockData)

  const onSubmit = () => {
    setLoading(true)
  }

  const onCreate = () => {}

  const loadKeywords = () => {}

  const onPrompt = (value) => {
    console.log(value)
  }

  useEffect(() => {
    loadKeywords()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'text-center'
    },
    {
      title: t('keywords.label').toUpperCase(),
      dataIndex: 'keywords',
      key: 'keywords',
      render: function (value: string) {
        return <Textarea className="w-full" defaultValue={value} />
      }
    },
    {
      title: t('reference.label'),
      dataIndex: 'reference',
      key: 'reference',
      render: function (value: string) {
        return (
          <div className="flex items-baseline">
            <Textarea defaultValue={value} className="w-90%" />
            <Import />
          </div>
        )
      }
    },
    {
      title: t('style.label'),
      dataIndex: 'style',
      key: 'style',
      render: function (value: string) {
        return <Textarea className="w-full" defaultValue={value} />
      }
    },
    {
      title: t('progress.label'),
      dataIndex: 'progress',
      key: 'progress',
      className: 'text-center'
    },
    {
      title: t('result.label'),
      dataIndex: 'result',
      key: 'result',
      className: 'text-center',
      render: function (value: string) {
        return (
          <div>
            <DialogWindow
              title={t('result.label')}
              trigger={<a className="ml-2 cursor-pointer color-blue">{t('show.label')}</a>}
              description={
                <ResponseText
                  className="min-h300px"
                  content={value}
                  toolbar={['copy', 'favorite'] as any}
                  quoteTargetId=""
                />
              }
            />
          </div>
        )
      }
    },
    {
      title: t('operation.label'),
      dataIndex: 'operation',
      key: 'operation',
      className: 'text-center',
      render: function () {
        return (
          <div className={style.operation}>
            <button>
              <ReloadIcon />
            </button>
            <button title={t('remove.title')}>
              <MinusIcon />
            </button>
          </div>
        )
      }
    }
  ]

  return (
    <div className={style.keywordsWrapper}>
      <div className={style.header}>
        <h1>{t('keywords.title')}</h1>
      </div>
      <div className={style.main}>
        <div className={style.mainToolbar}>
          <Button onClick={onCreate}>
            <PlusIcon /> 批量添加
          </Button>
          <Button onClick={onCreate}>
            <PlusIcon /> 添加
          </Button>
          <Button onClick={onSubmit}>
            <CircleBackslashIcon />
            清空数据
          </Button>
          <Button>
            <VSCodeIcon icon="export" /> 导出 CSV
          </Button>
        </div>
        <Table rowKey={'id'} columns={columns} data={result} />
      </div>
      <div className={style.footer}>
        <PromptInput
          onSubmitData={onPrompt}
          style={{ height: 100 }}
          textAreaProps={{
            defaultValue: '基本要求：生成内容不少于500个字'
          }}
        />
      </div>
    </div>
  )
}
