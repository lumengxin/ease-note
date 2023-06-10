// import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor as WEditor, Toolbar as WToolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import styles from './index.module.styl'

function Editor({content, onChange}) {
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState('')

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
      toolbarKeys: [
        "headerSelect",
        "|",
        "bold",
        "italic"
      ]
    } 

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = { 
      placeholder: '请输入内容...',
    }

    const handleChange = (editor: IDomEditor) => {
      console.log('editor---', editor)
      const contents = editor.getHtml()
      setHtml(contents)
      onChange && onChange(contents, editor)
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
      return () => {
        if (editor == null) return
        editor.destroy()
        setEditor(null)
      }
    }, [editor])

    useEffect(() => {
      setHtml(content)
    }, [content])

    return (
      <div className={styles.editor}>
        <WEditor
          className={styles['w-editor']}
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={handleChange}
          mode="default"
        />
        <WToolbar
          className={styles['w-toolbar']}
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
        />
      </div>
    )
}

export default Editor