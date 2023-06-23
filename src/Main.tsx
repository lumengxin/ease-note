import React, { useEffect, useState } from 'react'
import EaseNote from './components/ease-note'
import List from './components/list'
import { DEFAULT_EDITOR, Note, Shape, THEME, DEFAULT_CONFIG } from './utils/const'
import { generateUUID, getMax, getRandomTheme } from './utils/tool'
import localDriver from './utils/local'
import localforage from "localforage";
import Setting from './components/setting'

import './global.css'
import './iconfont.css'

function Main() {
  const [ notes, setNotes] = useState<Note[]>([{ ...DEFAULT_EDITOR, theme: THEME.PURPLE }])
  const [ config, setConfig] = useState<any>(DEFAULT_CONFIG)
  const [ isShowList, setIsShowList ] = useState<boolean>(false)
  const [ isShowSetting, setIsShowSetting ] = useState<boolean>(false)
  const [ mouseShape, setMouseShape ] = useState<Shape>({ x: 0, y: 0, w: 0, h: 0 })

  const generateEditor = (shape?: Shape) => {
    const maxZIndex = getMax(notes, "zIndex")

    const newNote = {
      ...DEFAULT_EDITOR,
      id: generateUUID('note'),
      zIndex: maxZIndex + 1,
      shape: shape ? { ...shape } : {
        ...DEFAULT_EDITOR.shape,
        x: DEFAULT_EDITOR.shape.x + 20 * (notes.length - 1),
        y: DEFAULT_EDITOR.shape.y + 20 * (notes.length - 1),
      },
      theme: DEFAULT_EDITOR.theme === THEME.RANDOM ? getRandomTheme() : DEFAULT_EDITOR.theme
    }
    const newNotes = [...notes, newNote]
    setNotes(newNotes)
  }

  const handleAdd = () => {
    generateEditor()
  }

  const handleList = (isShow: boolean) => {
    setIsShowList(isShow)
  }

  const handleVisible = (id: string, visible: boolean) => {
    const ns = notes.map(n => n.id === id ? { ...n, visibility: visible } : n)
    setNotes(ns)
  }

  const handleDelete = (id: string) => {
    const ns = notes.filter(n => n.id !== id)
    setNotes(ns)
  }

  const handleTheme = (id: string, theme: THEME) => {
    const ns = notes.map(n => n.id === id ? { ...n, theme } : n)
    setNotes(ns)
  }

  const handleEditorChange = async (id, html, editor) => {
    // 插槽嵌入的Editor, 此作用域的notes不对 -> todo
    // console.log("notes---", notes)
    // debugger
    const realNotes = await _getItem("_notes_")
    const curNotes = realNotes.map(n => n.id === id ? { ...n, content: html, updateTime: new Date().toLocaleString() } : n)
    console.log("ns----", curNotes)
    setNotes(curNotes)
  }

  const handleShapeEnd = (id, ps) => {
    console.log('handleDragEnd---', ps, notes)
    const ns = notes.map(n => n.id === id ? { ...n, shape: { ...n.shape, ...ps } } : n)
    setNotes(ns)
  }

  const onMouseDown = (e) => {
    console.log('onMouseDown----', e)
    const { clientX, clientY } = e
    setMouseShape({
      ...mouseShape,
      x: clientX,
      y: clientY
    })
  }

  const onMouseUp = (e) => {
    console.log('onMouseUp----', e)
    const { clientX, clientY } = e
    const newShape = {
      ...mouseShape,
      w: clientX - mouseShape.x,
      h: clientY - mouseShape.y
    }
    setMouseShape(newShape)

    // 正确做法应该阻止Drag中拖拽事件冒泡 ->
    if (e.target.id === "main" && isValidShape(newShape)) {
      generateEditor(newShape)
    }
  }

  const isValidShape = (shape: Shape) => {
    const { w, h } = shape
    return w > 220 && h > 140
  }

  const initData = async () => {
    const localNotes = await _getItem("_notes_")
    if (!!localNotes?.length) {
      setNotes(localNotes)
    }
  }

  const updateData = (notes) => {
    // 不保存没有编辑的note -> 初始content为空
    // 定时保存 -> 节流
    localforage.setItem("_notes_", notes, async () => {
      console.log("setItem---", await _getItem("_notes_"))
    })
  }

  useEffect(() => {
    updateData(notes)
  }, [ notes ])

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    localforage.setItem("_config_", config, async () => {
      console.log("setItem---config", await _getItem("_config_"))
    })
  }, [ config ])

  const _getItem = async (key: string) => {
    return await localforage.getItem(key)
  }

  const displayNotes = notes.filter(n => n.visibility)

  return (
    <div 
      id='main' 
      style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0"}}
      onMouseDown={onMouseDown} 
      onMouseUp={onMouseUp}
    >
      {displayNotes.map(n => 
        <EaseNote
          key={n.id}
          {...n} 
          onAdd={handleAdd} 
          onClose={() => handleVisible(n.id, false)} 
          onDelete={() => handleDelete(n.id)}
          onTheme={(theme) => handleTheme(n.id, theme)}
          onList={() => handleList(true)} 
          onEditorChange={(html, editor) => handleEditorChange(n.id, html, editor)} 
          onDragEnd={(ps) => handleShapeEnd(n.id, ps)}
          onResizeEnd={(ps) => handleShapeEnd(n.id, ps)}
        />
      )}

      <List 
        isShow={isShowList} 
        notes={notes} 
        onAdd={handleAdd} 
        onClose={() => handleList(false)} 
        onShow={(id) => handleVisible(id, true)} 
        onSetting={() => setIsShowSetting(true)}
        onDelete={handleDelete}
      />

      <Setting 
        isShow={isShowSetting} 
        onClose={() => setIsShowSetting(false)}
        config={config}
      />
    </div>
  )
  
}

export default Main
