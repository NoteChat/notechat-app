import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Button, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import Table from 'rc-table'
import './table.less'
import { CircleBackslashIcon, Cross1Icon, MagicWandIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { VSCodeIcon } from '@renderer/components/icon'
import { ConfirmDialog, DialogWindow } from '@renderer/components/dialog'
import { ResponseText } from '@renderer/components/responseText'
import { PromptInput } from '@renderer/components/promptInput'
import { Import } from '@renderer/components/import'
import API, { CreateGeneratorDto } from '@renderer/api'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@renderer/components/checkbox'
import { toast } from 'react-hot-toast'

export const Keywords: React.FC<{}> = (props) => {
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = React.useState<CreateGeneratorDto[]>([])
  const batchEditorRef = React.useRef<HTMLTextAreaElement>(null)
  const [checkedMap,] = React.useState<Map<number, boolean>>(new Map())
  const navigate = useNavigate()

  const uid = localStorage.getItem('uid')
  if (!uid) {
    navigate('/login')
  }

  const onSubmit = () => {
    setLoading(true)
  }

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
      loadKeywords();
    }
  }

  const onRemove = async (id: string) => {
    const res = await API.v1.removeGenerator({ id })
    if (res.ok) {
      setData(data.filter((item) => item.id !== +id))
      loadKeywords();
    }
  }

  const onRemoveAll = async () => {
    const res = await API.v1.removeAllGenerator({ userId: Number(uid) })
    if (res.ok) {
      setData([])
    }
  }

  const onChange = (index: number, field: string, value) => {
    const item = data[index]
    if (item) {
      item[field] = value
      setData([...data])
    }
  }

  const onSelectAll = () => {
    const size = data.length;
    if (checkedMap.size === size) {
      checkedMap.clear();
    } else {
      for (let i = 0; i < size; i++) {
        checkedMap.set(i, true);
      }
    }
  }

  const onGenerate = async () => {
    const size = checkedMap.size;
    if (size > 10) {
      toast.error(t('keywordsGenerateLimit.error'))
      return;
    } else {
      const targets: CreateGeneratorDto[] = [];
      for (let [key, value] of checkedMap) {
        if (data[key]) {
          targets.push(data[key])
        }
      }
      generate(targets);
    }
  }

  const generate = async (record: CreateGeneratorDto[]) => {

  }

  const onBatchCreate = async () => {
    const keywords = batchEditorRef.current?.value
    if (keywords) {
      const keywordsArr = keywords.split(',');
      const addData: CreateGeneratorDto[] = keywordsArr.map((item) => {
        return {
          userId: Number(uid), keywords: item, reference: '', style: '', result: ''
        }
      })
      const res = await API.v1.batchCreateGenerator({
        data: addData
      });
      if (res.ok) {
        loadKeywords();
        document.getElementById('ID_batchAddBtn')?.click();
      }
    }
  }

  const loadKeywords = () => {
    API.v1.findAllGenerators({ userId: uid! }).then((res) => {
      if (res.data) {
        setData(res.data)
      }
    })
  }

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
      width: 100,
      className: 'text-center',
      render: function (_, item, index) {
        return (
          <Checkbox
            checked={checkedMap.get(item.id)}
            id={item.id} onChange={
              () => {
                const checked = checkedMap.get(item.id);
                if (checked === undefined) {
                  checkedMap.set(index, true);
                } else {
                  checkedMap.delete(index);
                }
              }
            }
          />
        )
      }
    },
    {
      title: t('keywords.label'),
      dataIndex: 'keywords',
      key: 'keywords',
      render: function (_, item, index) {
        return <Textarea className="w-full" defaultValue={item.keywords} onChange={
          (e) => onChange(index, 'keywords', e.target.value)
        } />
      }
    },
    {
      title: t('reference.label'),
      dataIndex: 'reference',
      key: 'reference',
      render: (_, item, index) => {
        return (
          <div className="flex items-baseline">
            <Textarea defaultValue={item.reference} className="w-90%"
              onChange={
                (e) => onChange(index, 'keywords', e.target.value)
              } />
            <Import />
          </div>
        )
      }
    },
    {
      title: t('style.label'),
      dataIndex: 'style',
      key: 'style',
      render: function (_, item, index) {
        return <Textarea className="w-full"
          defaultValue={item.style}
          onChange={
            (e) => onChange(index, 'keywords', e.target.value)
          }
        />
      }
    },
    {
      title: t('progress.label'),
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      className: 'text-center'
    },
    {
      title: t('result.label'),
      dataIndex: 'result',
      key: 'result',
      width: 100,
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
      width: 100,
      className: 'text-center',
      render: function (_, item) {
        console.log(item)
        return (
          <div className={style.operation}>
            <button>
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
            title={t('batchAddKeyWords.label')}
            trigger={
              <Button id="ID_batchAddBtn">
                <PlusIcon /> {t('batchAddKeyWords.label')}
              </Button>
            }
            description={
              <div>
                <Textarea className="w-full" ref={batchEditorRef} placeholder={t('batchAddKeyWords.placeholder')} />
                <div className='mt-3'>
                  <Button className='float-right' onClick={onBatchCreate}>{t('confirm.label')}</Button>
                </div>
              </div>
            }
          />
          <ConfirmDialog
            title={t('removeAll.label')}
            description={t('removeAll.description')}
            trigger={
              <Button onClick={onSubmit}>
                <CircleBackslashIcon />
                清空数据
              </Button>
            }
            onConfirm={onRemoveAll}

          />
          <Button>
            <VSCodeIcon icon="export" /> 导出 CSV
          </Button>
        </div>
        <Table rowKey={'id'} columns={columns} data={data} scroll={{ y: 450 }}
/>
      </div>
      <div className={style.footer}>
        <PromptInput
          onSubmitData={onPrompt}
          style={{ height: 100, width: '100%' }}
          textAreaProps={{
            defaultValue: '基本要求：生成内容不少于500个字'
          }}
        />
        <div className="w-full">
          <Button className="float-left" onClick={onGenerate}>
            <MagicWandIcon /> {t('generate.button')}
          </Button>
        </div>
      </div>
    </div>
  )
}
