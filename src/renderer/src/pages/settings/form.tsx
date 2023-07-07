import React, { useEffect } from 'react'
import * as Form from '@radix-ui/react-form'
import { PromptDto } from '@renderer/api'

export type PromptFormProps = {
  prompt?: PromptDto
  isCreate?: boolean
  onSubmit?: (data: PromptDto) => void
}

const PromptForm: React.FC<PromptFormProps> = (props) => {
  const { prompt, onSubmit, isCreate = false } = props

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

  return (
    <div className="w-full">
      <Form.Root id="promptForm" onSubmit={onHandleEvent} method="POST">
        <Form.Field className="FormField" name="name">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Name</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your prompt name
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid prompt name
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="text" defaultValue={prompt?.name} required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="keybindings">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Keybindings</Form.Label>
          </div>
          <Form.Control asChild>
            <input className="Input" defaultValue={prompt?.keybindings} type="text" />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="prompt">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Prompt Template</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your prompt template
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid prompt template
            </Form.Message>
          </div>
          <Form.Control asChild>
            <textarea className="Textarea" placeholder={
              `Please enter your Prompt template`
            } defaultValue={prompt?.prompt} rows={10} required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="description">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Description</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your prompt name
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid prompt name
            </Form.Message>
          </div>
          <Form.Control asChild>
            <textarea className="Textarea" defaultValue={prompt?.description} rows={5} />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }} disabled={prompt?.isBuiltIn === 1}>
            {isCreate ? 'Create' : 'Save'}
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  )
}

export default PromptForm
