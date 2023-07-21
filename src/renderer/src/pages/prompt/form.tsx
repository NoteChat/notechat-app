import React, { useEffect } from 'react'
import * as Form from '@radix-ui/react-form'
import { PromptDto } from '@renderer/api'
import { Button, Input, Textarea } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'

export type PromptFormProps = {
  prompt?: PromptDto
  isCreate?: boolean
  onSubmit?: (data: PromptDto) => void
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const { prompt, onSubmit, isCreate = false } = props
  const  { t } = useTranslation()

  const onHandleEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as unknown
    onSubmit?.(data as PromptDto)
  }

  useEffect(() => {
    if (isCreate) {
      const form = document.getElementById('promptForm') as HTMLFormElement;
      if (form) {
        form.reset()
      }
    }
  });

  const title = isCreate ? t('create.button') : t('update.button')

  return (
    <div className="w-full">
      <h1>{title + t('prompt.label')}</h1>
      <Form.Root id="promptForm" onSubmit={onHandleEvent} method="POST">
        <Form.Field className="FormField" name="name">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{t('name.label')}</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              {t('name.check.required')}
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              {t('name.check.valid')}
            </Form.Message>
          </div>
          <Form.Control asChild>
            <Input type="text" defaultValue={prompt?.name} required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="keybindings">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{t('keybinding.label')}</Form.Label>
          </div>
          <Form.Control asChild>
            <Input defaultValue={prompt?.keybindings} type="text" />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="prompt">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{t('promptTemplate.label')}</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              {t('promptTemplate.check.required')}
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              {t('promptTemplate.check.valid')}
            </Form.Message>
          </div>
          <Form.Control asChild>
            <Textarea placeholder={t('promptTemplate.placeholder')} defaultValue={prompt?.prompt} rows={10} required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="description">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{t('description.label')}</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              {t('description.check.required')}
            </Form.Message>
          </div>
          <Form.Control asChild>
            <Textarea defaultValue={prompt?.description} rows={5} required/>
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <Button style={{ marginTop: 10 }}>
            {isCreate ? t('create.button') : t('update.button') } 
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  )
}

export default PromptForm
