import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Button, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import Table from 'rc-table'
import './table.less'
import {
  CircleBackslashIcon,
  Cross1Icon,
  MagicWandIcon,
  PlusIcon,
  ReloadIcon
} from '@radix-ui/react-icons'
import { ConfirmDialog, DialogWindow } from '@renderer/components/dialog'
import { ResponseText } from '@renderer/components/responseText'
import { PromptInput } from '@renderer/components/promptInput'
import { Import } from '@renderer/components/import'
import API, { CreateGeneratorDto, MySocket } from '@renderer/api'
import { Checkbox } from '@renderer/components/checkbox'
import { toast } from 'react-hot-toast'
import cursorStyle from '@renderer/components/cursor/style.module.scss'
import classNames from 'classnames'
import { debounce } from 'lodash'

export const Keywords: React.FC<{}> = () => {
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = React.useState<CreateGeneratorDto[]>([])
  const batchEditorRef = React.useRef<HTMLTextAreaElement>(null)
  const [checkedMap] = React.useState<Map<number, boolean>>(new Map())

  const uid = localStorage.getItem('uid')

  const onCreate = async () => {
    const res = await API.v1.createGenerator({
      userId: Number(uid),
      keywords: '',
      reference: '',
      style: '',
      result: ''
    })
    if (res.ok) {
      setData([...data, res.data])
      loadKeywords()
    }
  }

  const onRemove = async (id: string) => {
    const res = await API.v1.removeGenerator({ id })
    if (res.ok) {
      setData(data.filter((item) => item.id !== +id))
      loadKeywords()
    }
  }

  const onRemoveAll = async () => {
    const res = await API.v1.removeAllGenerator({ userId: Number(uid) })
    if (res.ok) {
      setData([])
    }
  }

  const onChange = debounce((index: number, field: string, value) => {
    const item = data[index]
    if (item) {
      item[field] = value
      API.v1.updateGenerator(item.id + '', item)
      setData([...data])
    }
  }, 600)

  const onSelectAll = () => {
    const size = data.length
    if (checkedMap.size === size) {
      checkedMap.clear()
    } else {
      for (let i = 0; i < size; i++) {
        checkedMap.set(i, true)
      }
    }
    setData([...data])
  }

  const reGenerate = async (index: number) => {
    const item = data[index];
    generate(item, index);
  }

  const onGenerate = async () => {
    const size = checkedMap.size
    if (size > 10) {
      toast.error(t('keywordsGenerateLimit.error'))
      return
    } else {
      for (let [key,] of checkedMap) {
        if (data[key]) {
          generate(data[key], key)
        }
      }
    }
  }

  const generate = async (record: CreateGeneratorDto, index: number) => {
    if (!record.title && !record.keywords) {
      toast.error(t('titleKeywordsEmpty.error'))
      return
    }
    const socket = MySocket.getSocket();
    if (socket) {
      data[index].status = 'running';
      setData([...data]);
      record.prompt = document.querySelector<HTMLTextAreaElement>('#promptInput')?.value;
      const language = localStorage.getItem('lang');
      socket.emit('generate', { data: record, language: language, index: index })
    }
  }

  const onGenerated = () => {
    MySocket.getSocket()?.once('generate', (res) => {
      if (res.ok) {
        const next = [...data];
        loadKeywords();
        setData(next);
      }
    })
  }

  const onBatchCreate = async () => {
    const content = batchEditorRef.current?.value;
    const forKeywords = document.querySelector<HTMLButtonElement>('#forKeywords')?.dataset.state === 'checked';
    if (content) {
      const wordsArr = content.split('\n').filter((item) => item.trim() !== '')
      const addData: CreateGeneratorDto[] = wordsArr.map((item) => {
        return {
          userId: Number(uid),
          title: forKeywords ? '' : item,
          keywords: forKeywords ? item : '',
          reference: '',
          style: '',
          result: ''
        }
      })
      const res = await API.v1.batchCreateGenerator({
        data: addData
      })
      if (res.ok) {
        loadKeywords()
        document.getElementById('ID_batchAddBtn')?.click()
      }
    }
  }

  const loadKeywords = () => {
    setLoading(true)
    API.v1.findAllGenerators({ userId: uid! }).then((res) => {
      if (res.data) {
        setData(res.data)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadKeywords()
  }, [])

  useEffect(() => {
    onGenerated()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      className: 'text-center',
      render: function (_, item, index) {
        return (
          <Checkbox
            key={item.id}
            checked={checkedMap.get(index)}
            id={item.id}
            onChange={() => {
              const checked = checkedMap.get(index)
              if (checked === undefined) {
                checkedMap.set(index, true)
              } else {
                checkedMap.delete(index)
              }
            }}
          />
        )
      }
    },
    {
      title: t('title.label'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: function (_, item, index) {
        return (
          <Textarea
            className="w-full"
            placeholder={t('title.label')}
            defaultValue={item.title}
            onChange={(e) => onChange(index, 'title', e.target.value)}
          />
        )
      }
    },
    {
      title: t('keywords.label'),
      dataIndex: 'keywords',
      key: 'keywords',
      width: 150,
      render: function (_, item, index) {
        return (
          <Textarea
            className="w-full"
            placeholder={t('keywords.label')}
            defaultValue={item.keywords}
            onChange={(e) => onChange(index, 'keywords', e.target.value)}
          />
        )
      }
    },
    {
      title: t('reference.label'),
      dataIndex: 'reference',
      key: 'reference',
      render: (_, item, index) => {
        return (
          <div className="flex items-baseline">
            <Textarea
              defaultValue={item.reference}
              className="w-90% resize"
              placeholder={t('reference.label')}
              onChange={(e) => onChange(index, 'reference', e.target.value)}
            />
            <Import onExtracted={(value) => {onChange(index, 'reference', value)}}/>
          </div>
        )
      }
    },
    {
      title: t('style.label'),
      dataIndex: 'style',
      key: 'style',
      width: 150,
      render: function (_, item, index) {
        return (
          <Textarea
            className="w-full"
            placeholder={t('style.label')}
            defaultValue={item.style}
            onChange={(e) => onChange(index, 'style', e.target.value)}
          />
        )
      }
    },
    {
      title: t('progress.label'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      className: 'text-center',
      render: function (_, item) {
          return  <span className={ item.status === 'running' ? 
            classNames(cursorStyle.inputCursorAnimation, 'color-blue') : ''}>
            {item.status}
          </span>;
      }
    },
    {
      title: t('result.label'),
      dataIndex: 'result',
      key: 'result',
      width: 100,
      className: 'text-center',
      render: function (_, item) {
        return (
          <div>
            <DialogWindow
              title={t('result.label')}
              trigger={<a className="ml-2 cursor-pointer color-blue">{t('show.label')}</a>}
              description={
                <ResponseText
                  className="min-w400px min-h300px max-h600px overflow-y-auto"
                  content={item.result}
                  key={item.id}
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
      width: 100,
      className: 'text-center',
      render: function (_, item, index) {
        return (
          <div className={style.operation}>
            <button onClick={() => reGenerate(index)}>
              <ReloadIcon />
            </button>
            <button title={t('remove.title')} onClick={() => onRemove(item.id)}>
              <Cross1Icon />
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
          <Checkbox id="selectAll" label={t('selectAll.label')} onChange={onSelectAll} />
          <Button onClick={onCreate}>
            <PlusIcon /> {t('add.label')}
          </Button>
          <DialogWindow
            title={t('batchAddTitleOrKeyWords.label')}
            trigger={
              <Button id="ID_batchAddBtn" style={{ width: 200 }}>
                <PlusIcon /> {t('batchAddTitleOrKeyWords.label')}
              </Button>
            }
            description={
              <div>
                <Textarea
                  className="w-full h300px"
                  ref={batchEditorRef}
                  placeholder={t('batchAddTitleOrKeyWords.placeholder')}
                />
                <div className="mt-3 flex justify-end gap-5">
                  <Checkbox id="forKeywords" label="添加关键词" />
                  <Button className="float-right" onClick={onBatchCreate}>
                    {t('confirm.label')}
                  </Button>
                </div>
              </div>
            }
          />
          <ConfirmDialog
            title={t('removeAll.label')}
            description={t('removeAll.description')}
            trigger={
              <Button>
                <CircleBackslashIcon />
                清空数据
              </Button>
            }
            onConfirm={onRemoveAll}
          />
          <Button onClick={loadKeywords}>
            <ReloadIcon />
          </Button>
          {/* <Button onClick={onCsvExport}>
            <VSCodeIcon icon="export" /> 导出 CSV
          </Button> */}
        </div>
        <Table rowKey={'id'} columns={columns} data={data} scroll={{ y: 450 }} />
      </div>
      <div className={style.footer}>
        <PromptInput
          style={{ height: 100, width: '100%' }}
          textAreaProps={{
            id:"promptInput",
            defaultValue: t('basicGeneratePrompt.placeholder'),
          }}
        />
        <div className="w-full">
          <Button className="float-left" onClick={onGenerate} disabled={loading}>
            <MagicWandIcon /> {t('generate.button')}
          </Button>
        </div>
      </div>
    </div>
  )
}
