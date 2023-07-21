import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useState } from 'react'
import API, { PromptDto, getDefaultHeader } from '@renderer/api'
import { Link, Route, Routes } from 'react-router-dom'
import * as Tooltip from '@radix-ui/react-tooltip'
import { PlusIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import PromptForm from './form'
import style from './style.module.scss'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'
import { IAppProps } from '@renderer/app'


const Prompt: React.FC<{} & IAppProps> = (props) => {
  const { t } = useTranslation()
  const { prompts, loadPrompts } = props;

  const [prompt, setPrompt] = useState<PromptDto | undefined>(prompts.length > 0 ? prompts[0] : undefined)
  const uid = localStorage.getItem('uid')

  const createPrompt = (data: PromptDto) => {
    if (uid) {
      API.v1
        .createPrompt({ ...data, userId: Number(uid) })
        .then((res) => {
          if (res) {
            toast.success('Create Success')
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
            toast.success('Update Success')
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
        .deletePrompt({ userId: Number(uid), id: prompt.id })
        .then((res) => {
          if (res) {
            toast.success('Delete Success')
            loadPrompts()
          }
        })
    }
  }

  return (
    <>
    <div className="flex h-full">
      <div className={classNames('flex flex-col w-80', style.promptItems)}>
        <div className="list h-full relative">
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              <div>
                {prompts.map((item, index) => {
                  return (
                    <Link to="edit" key={index} onClick={() => selectPrompt(item)}>
                      <div
                        className={classNames(
                          'promptItem cursor-pointer p-5 flex items-center',
                          style.promptItem
                        )}
                      >
                        <span className="ml-4" title={item.description}>
                          {item.name}
                        </span>
                        {item.isBuiltIn ? (
                          <small className="ml-2 color-gray-4">{t('builtin.label')}</small>
                        ) : null}
                        {!item.isBuiltIn ? (
                          <div
                            title="Delete the Prompt"
                            className={classNames('absolute right-5 p-2', style.btnDeletePrompt)}
                          >
                            <Tooltip.Provider>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <CrossCircledIcon
                                    className="color-gray-4"
                                    onClick={deletePrompt}
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className="TooltipContent" sideOffset={5}>
                                    Delete the Prompt
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
        <div className="text-center absolute left-0 right-0 bottom-30px cursor-pointer">
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
                  {t('createPrompt.tooltip')}
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
      <div className="promptDetail flex-auto p-10 pt-0">
        <Routes>
          <Route
            path="edit"
            index={true}
            element={<PromptForm prompt={prompt} key={prompt?.id} onSubmit={updatePrompt} />}
          />
          <Route path="create" index element={<PromptForm onSubmit={createPrompt} isCreate />} />
        </Routes>
      </div>
    </div>
    <Toaster />
    </>
  )
}

export default Prompt
