import React, { useEffect, useState } from 'react'
import API, { PromptDto } from '@renderer/api'
import style from './style.module.scss'
import { Button, Select, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import { IAppProps } from '@renderer/app'
import { ResponseText } from '@renderer/components/responseText'

export const Text: React.FC<{} & IAppProps> = (props) => {
  const { t } = useTranslation()
  const { prompts } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<string>(t('nullResult.placeholder'))
  const [prompt, setPrompt] = useState<PromptDto | undefined>(undefined)

  const onSubmit = () => {
    const promptDom = document.querySelector<HTMLTextAreaElement>('#PromptContent')
    if (!promptDom || loading) return

    const promptContent = promptDom.value
    const uid = localStorage.getItem('uid')

    if (!prompt || !promptContent) {
      return
    }

    setLoading(true)
    API.v1
      .autocomplete({
        prompt: prompt.prompt,
        content: promptContent,
        userId: uid || undefined
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
    document.getElementById('PromptContent')?.focus()
  })

  useEffect(() => {
    if (prompts.length > 0) {
      setPrompt(prompts[0])
    }
  }, [prompts])

  return (
    <div className={style['textPane']}>
      <div className={style['textPane-input']}>
        <Textarea
          className={style.promptArea}
          id="PromptContent"
          tabIndex={1}
          placeholder={t('enterContent.placeholder')}
        ></Textarea>
      </div>
      <div className={style['textPane-result']}>
        <div className={style['textPane-result--container']}>
          <div className={style.resultContent}>
            <ResponseText
              content={loading ? '' : result}
              loading={loading}
              quoteTargetId="#PromptContent"
            />
          </div>
        </div>
      </div>
      <div className={style['textPane-bottom']}>
        <Button tabIndex={2} onClick={onSubmit} disabled={loading}>
          {loading ? t('holdOn.button') : t('generate.button')}
        </Button>
        <Button tabIndex={3} onClick={onSubmit} disabled={loading}>
          {t('copy.button')}
        </Button>
        <Select tabIndex={4} defaultValue={prompt?.id}>
          {prompts.map((item) => (
            <option
              key={item.id}
              value={item.id}
              data-i={{ ...item }}
              title={item.description}
              label={item.name}
            >
              {item.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
