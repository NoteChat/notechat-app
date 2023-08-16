import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

export async function fetchProxy(
  event: Electron.IpcMainEvent,
  fetchParams: Parameters<typeof fetch>
) {
  try {
    const res = await fetch(...fetchParams).then((r) => r.json())
    event.reply('fetch-response', res)
  } catch (err) {
    event.reply('fetch-response', { error: JSON.stringify(err) })
  }
}
