import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'


export function setCookie(name, value, days, domain = window.location.host) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + `; Domain=${domain}; path=/`
}

export function getCookie(name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export function getUrlParam(name: string, url?: string): string | null {
  if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

export async function transformMdToHTML(md: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(md)
  return String(file)
}


export function downloadMarkdown(title: string, content: string) {
  const date = new Date().toLocaleDateString();
  // Create element with <a> tag
  const link = document.createElement('a')

  // Create a blog object with the file content which you want to add to the file
  const file = new Blob([content], { type: 'text/plain' })

  // Add file content in the object URL
  link.href = URL.createObjectURL(file)

  // Add file name
  link.download = `${title}-${date}.md`

  // Add click event to <a> tag to save file.
  link.click()
  URL.revokeObjectURL(link.href)
}