import React, { useEffect, useState } from 'react'
import API, { PromptDto } from '@renderer/api'
import style from './style.module.scss'
import { Button, Select, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import { InputCursor } from '@renderer/components/cursor'
import { IAppProps } from '@renderer/app'

export const Text: React.FC<{} & IAppProps> = (props) => {
  const { t } = useTranslation()
  const { prompts } = props;

  const [loading, setLoading] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<string>('')
  const [prompt, setPrompt] = useState<PromptDto | undefined>(prompts.length > 0 ? prompts[0] : undefined)

  const onSubmit = () => {

    const promptDom = document.querySelector<HTMLTextAreaElement>('#PromptContent');
    if (!promptDom || loading) return
    
    const promptContent = promptDom.value;
    const uid = localStorage.getItem('uid')
    
    if (!prompt || !promptContent) {
      return
    }

    setLoading(true)
    API.v1
      .autocomplete(
        {
          promptId: prompt.id,
          prompt: prompt.prompt,
          content: promptContent,
          userId: Number(uid)
        })
      .then((res: any) => {
        if (res.data) {
          setResult(res.data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    document.getElementById('PromptContent')?.focus();
    if (prompts.length > 0) {
      setPrompt(prompts[0])
    }
  }, [])

  return (
    <div className={style['textPane']}>
      <div className={style['textPane-input']}>
          <Textarea className={style.promptArea} id="PromptContent" tabIndex={1} placeholder={t('enterContent.placeholder')}></Textarea>
      </div>
      <div className={style['textPane-result']}>
        <div className={style['textPane-result--container']}>
          <div className={style.resultContent}>
            {
              loading ? <InputCursor /> : <div dangerouslySetInnerHTML={{ __html: result.replaceAll('\n', '<br/>') }} />
            }
          </div>
        </div>
      </div>
      <div className={style['textPane-bottom']}>
        <Button
          tabIndex={2}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? t('holdOn.button') : t('generate.button') }
        </Button>
        <Button
          tabIndex={3}
          onClick={onSubmit}
          disabled={loading}
        >
          {t('copy.button')}
        </Button>
        <Select tabIndex={4} defaultValue={prompt?.id}>
           {prompts.map((item) => (
            <option key={item.id} value={item.id} data-i={{ ...item }} title={item.description} label={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
