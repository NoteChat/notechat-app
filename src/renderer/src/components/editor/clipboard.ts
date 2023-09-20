import Clipboard from 'quill/modules/clipboard'
export class MyClipboard extends Clipboard {
    [x: string]: any;

    constructor(quill, options) {
        super(quill, options);
    }

    // onPaste(e) {
    //     if (e.defaultPrevented || !this.quill.isEnabled()) return;

    //     let range = this.quill.getSelection();
    //     let delta = new Delta().retain(range.index);
    //     let scrollTop = this.quill.scrollingContainer.scrollTop;
    //     this.container.focus();
    //     this.quill.selection.update(Quill.sources.SILENT);

    //     setTimeout(async () => {
    //         const text = await navigator.clipboard.readText();
    //         const htmlRaw = await transformMdToHTML(text);
    //         const paste = htmlRaw//this.convert(htmlRaw);
    //         console.log('paste', paste)
    //         delta = delta.concat(paste).delete(range.length);
    //         this.quill.updateContents(delta, Quill.sources.USER);
    //         // range.length contributes to delta.length()
    //         this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
    //         this.quill.scrollingContainer.scrollTop = scrollTop;
    //         this.quill.focus();
    //     }, 1);
    // }
}