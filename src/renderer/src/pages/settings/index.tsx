import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useEffect, useState } from 'react'
import API, { PromptDto, getDefaultHeader } from '@renderer/api'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import * as Tooltip from '@radix-ui/react-tooltip'
import { PlusIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import PromptForm from './form'

const Settings: React.FC = () => {
  const navigate = useNavigate()

  const [prompts, setPrompts] = useState<PromptDto[]>([])
  const [prompt, setPrompt] = useState<PromptDto>()
  const uid = localStorage.getItem('uid')

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
    } else {
      navigate('/login')
    }
  }

  const createPrompt = (data: PromptDto) => {
    if (uid) {
      API.v1
        .createPrompt({ ...data, userId: Number(uid) }, { headers: getDefaultHeader() })
        .then((res) => {
          if (res) {
            alert('Create Success')
            loadPrompts()
          }
        })
    }
  }

  const updatePrompt = (data: PromptDto) => {
    if (uid && prompt) {
      API.v1
        .updatePrompt(
          { ...data, userId: Number(uid), id: prompt.id },
          { headers: getDefaultHeader() }
        )
        .then((res) => {
          if (res) {
            alert('Update Success')
            loadPrompts()
          }
        })
    }
  }

  const selectPrompt = (prompt: PromptDto) => {
    setPrompt(prompt)
  }

  const deletePrompt = () => {
    if (uid && prompt) {
      API.v1
        .deletePrompt({ userId: Number(uid), id: prompt.id }, { headers: getDefaultHeader() })
        .then((res) => {
          if (res) {
            alert('Delete Success')
            loadPrompts()
          }
        })
    }
  }

  useEffect(() => {
    loadPrompts();
  }, [])

  return (
    <div className="flex h-full">
      <div className="promptItems flex flex-col w-80">
        <div className="list h-full">
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              <div>
                {prompts.map((item, index) => {
                  return (
                    <Link to="edit" key={index} onClick={() => selectPrompt(item)}>
                      <div className="promptItem cursor-pointer p-5 flex items-center">
                        <span className="ml-4 color-blue" title={item.description}>{item.name}</span>
                        {
                          item.isBuiltIn ? (<small className="ml-2 color-gray-4">Builtin</small> ) : null
                        }
                        {!item.isBuiltIn ? (
                          <div title="Delete the Prompt" className="btnDeletePrompt absolute right-5 p-2">
                            <Tooltip.Provider>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <CrossCircledIcon className="color-gray-4" onClick={deletePrompt}/>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className="TooltipContent" sideOffset={5}>
                                    Create a new Prompt
                                    <Tooltip.Arrow className="TooltipArrow" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
              <ScrollArea.Thumb className="ScrollAreaThumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner" />
          </ScrollArea.Root>
        </div>
        <div className="text-center p-10 cursor-pointer">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link to="create">
                  <button className="IconButton">
                    <PlusIcon />
                  </button>
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  Create a new Prompt
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
      <div className="promptDetail flex-auto p-10">
        <Routes>
          <Route
            path="edit"
            index
            element={<PromptForm prompt={prompt} key={prompt?.id} onSubmit={updatePrompt} />}
          />
          <Route path="create" index element={<PromptForm onSubmit={createPrompt} isCreate />} />
        </Routes>
      </div>
    </div>
  )
}

export default Settings
