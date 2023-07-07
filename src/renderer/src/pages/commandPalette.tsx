import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import API, { PromptDto, getDefaultHeader } from '@renderer/api'
import { Dna } from 'react-loader-spinner'
import Select from 'rc-select'
import 'rc-select/assets/index.less'
import '@renderer/styles/command.less'

const Option = Select.Option;

export const CommandPalette: React.FC<{}> = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<string>('No result yet')
  const inputRef = useRef<HTMLInputElement>(null)
  const [prompts, setPrompts] = useState<PromptDto[]>([])
  const [prompt, setPrompt] = useState<PromptDto & { id: number }>()

  const onSubmit = () => {
    if (loading) return
  
    const promptContent = document.querySelector<HTMLTextAreaElement>('#PromptContent')?.value
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
        },
        {
          headers: getDefaultHeader()
        }
      )
      .then((res: any) => {
        if (res.data) {
          setResult(res.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  const loadPrompts = () => {
    const uid = localStorage.getItem('uid')
    if (uid) {
      API.v1
        .getPrompt(
          {
            userId: Number(uid),
            limit: 100
          },
          {
            headers: getDefaultHeader()
          }
        )
        .then((res) => {
          if (res) {
            setPrompt(res[0])
            setPrompts(res as any)
          }
        })
    }
  }

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    loadPrompts()
  }, [])

  return (
    <div className="commandWin">
      <div className="absolute w-full">
        <div className="searchInput flex h-40px m-5">
          <Select
            autoFocus
            showSearch
            style={{ width: 150 }}
            onSelect={(_, option) => setPrompt(option.data)}
            optionFilterProp="text"
            value={prompt?.id}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {prompts.map((item) => (
              <Option key={item.id} value={item.id} data={{ ...item }} text={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
          <div className="flex-auto">
            <input
              tabIndex={1}
              id="PromptContent"
              className="promptInput w-full"
              ref={inputRef}
              placeholder="Please enter the content"
              required
            />
          </div>
        </div>
        <div className='m-5'>
          <button
            className="Button"
            tabIndex={2}
            type="submit"
            onClick={onSubmit}
            style={{ marginTop: 10 }}
            disabled={loading}
          >
            {loading ? 'Hold on...' : 'Prompt'}
          </button>
        </div>
      </div>
      <div className="m-5 overflow-auto absolute w-full top-125px">
        {/* 支持引用对话上下文，进行Q&A */}
        {loading ? (
          <div className='text-center flex items-center justify-center'>
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="Hold on..."
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <div
            className="promptResultItem shadow-dark-50"
            dangerouslySetInnerHTML={{ __html: result }}
          ></div>
        )}
      </div>
    </div>
  )
}
