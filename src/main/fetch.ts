import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

export async function fetchProxy(
  event: Electron.IpcMainEvent,
  fetchParams: {
    id: string,
    reqParams: Parameters<typeof fetch>
  }
) {
  try {
    const { id, reqParams } = fetchParams;
    const res = await fetch(...reqParams).then((r) => r.json())
    event.reply(id, res)
  } catch (err) {
    event.reply(fetchParams.id, { error: JSON.stringify(err) })
  }
}
