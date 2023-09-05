import Api, { MySocket } from '@renderer/api'
import { debounce } from 'lodash'

export default class AIComplete {
  quill: any
  options: any
  container: any
  plusCount = 0
  socket

  constructor(quill, options) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container)
    quill.on('text-change', debounce(this.update.bind(this)), 500)
    this.socket = MySocket.getSocket()
    this.socket.on('chat', this.listenRes.bind(this))
  }

  listenRes(res) {
    if (res.code === 1000) {
      const chatRes = JSON.parse(res.data)
      if (chatRes.success) {
        if (chatRes.code !== 'finish') {
          let range = this.quill.getSelection()
          if (range) {
            this.quill.insertText(range.index, chatRes.message, 'api')
          }
        }
      }
    }
  }

  update(delta, oldDelta, source) {
    if (delta.ops.length !== 2) return

    const input = delta.ops[1].insert
    if (input === '+' && this.plusCount < 2) {
      this.plusCount++
    }
    if (this.plusCount >= 2) {
      let range = this.quill.getSelection(true)
      const rangeStart = range.index - 2
      const contextText = this.quill.getText(0, rangeStart)
      const uid = Number(localStorage.getItem('uid'))
      this.socket.emit('chat', {
        user: uid,
        messages: [
          {
            role: 'user',
            content: contextText
          }
        ]
      })

      this.quill.deleteText(rangeStart, 2)
      this.plusCount = 0
    }
  }
}
