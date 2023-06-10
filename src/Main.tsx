import React, { useEffect, useState } from 'react'
import EaseNote from './components/ease-note'
import List from './components/list'
import { DEFAULT_EDITOR, Note } from './utils/const'
import { generateUUID, getMax } from './utils/tool'
import localDriver from './utils/local'
import localforage from "localforage";
import Setting from './components/setting'

const config = {
  background: '#fff', // 背景
  cache: true,  // 是否开启缓存
  localStorage: true, // 是否开起本地存储
  remote: {
    url: 'ccc', // 远程存储
  },
}

function Main() {
  const [ notes, setNotes] = useState<Note[]>([DEFAULT_EDITOR])
  const [ isShowList, setIsShowList ] = useState<boolean>(true)
  const [ isShowSetting, setIsShowSetting ] = useState<boolean>(false)

  const generateEditor = () => {
    let newEditor = JSON.parse(JSON.stringify(DEFAULT_EDITOR))
    const maxZIndex = getMax(notes, "zIndex")
    newEditor.id = generateUUID('note')
    newEditor.zIndex = maxZIndex + 1
    newEditor.shape.x = newEditor.shape.x + 20
    newEditor.shape.y = newEditor.shape.y + 20
    
    const newEditors = [...notes, newEditor]
    setNotes(newEditors)
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

  const handleEditorChange = (id, html, editor) => {
    // 插槽嵌入的Editor, 此作用域的notes不对
    // console.log("notes---", notes)
    // debugger
    // const curNotes = notes.map(n => n.id === id ? { ...n, content: html } : n)
    // console.log("ns----", curNotes)
    // setNotes(curNotes)
  }

  useEffect(() => {
    localforage.setItem("_notes_", notes, async () => {
      console.log("setItem---", await localforage.getItem("_notes_"))
    })
  }, [ notes ])

  const displayNotes = notes.filter(n => n.visibility)
  return (
    <>
      {displayNotes.map(e => 
        <EaseNote
          key={e.id}
          {...e} 
          onAdd={handleAdd} 
          onClose={() => handleVisible(e.id, false)} 
          onList={() => handleList(true)} 
          onEditorChange={(html, editor) => handleEditorChange(e.id, html, editor)} 
        />
      )}

      <List 
        isShow={isShowList} 
        notes={notes} 
        onAdd={handleAdd} 
        onClose={() => handleList(false)} 
        onShow={(id) => handleVisible(id, true)} 
        onSetting={() => setIsShowSetting(true)}
      />

      <Setting 
        isShow={isShowSetting} 
        onClose={() => setIsShowSetting(false)}
      />
    </>
  )
  
}

export default Main