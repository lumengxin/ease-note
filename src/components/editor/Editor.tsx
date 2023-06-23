import React, { useState, useEffect } from 'react'
import { Editor as WEditor, Toolbar as WToolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig, DomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import styles from './index.module.styl'

let flag = false

function Editor({content, onChange}) {
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState('')

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
      toolbarKeys: [
        "headerSelect",
        "bold",
        "color",
        "bulletedList",
        "todo",
        "insertTable",
        "codeBlock",
      ]
    } 

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = { 
      placeholder: 'write your story...',
    }

    const handleChange = (editor: IDomEditor) => {
      // 处理挂载时onChange被触发
      if (flag) {
        console.log('editor---111', editor)
        const contents = editor.getHtml()
        setHtml(contents)
        onChange && onChange(contents, editor)
      }
      flag = true
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
      // 获取toolbar配置
      if (!editor) return
      const toolbar = DomEditor.getToolbar(editor)
      const curToolbarConfig = toolbar.getConfig()
      console.log("toolbar ----- config", curToolbarConfig.toolbarKeys )

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