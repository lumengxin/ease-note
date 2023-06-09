import React, { useState } from 'react'
import EaseNote from './components/ease-note'
import { DEFAULT_EDITOR } from './utils/const'
import { generateUUID } from './utils/tool'


const config = {
  background: '#fff', // 背景
  cache: true,  // 是否开启缓存
  localStorage: true, // 是否开起本地存储
  remote: {
    url: 'ccc', // 远程存储
  },
}

function Main() {
  const [ editors, setEditors] = useState([DEFAULT_EDITOR])

  const generateEditor = () => {
    // let newEditor = Object.assign({}, DEFAULT_EDITOR)
    let newEditor = JSON.parse(JSON.stringify(DEFAULT_EDITOR))
    const maxZIndex = Math.max.apply(Math, editors.map((e) => e.zIndex))
    newEditor.id = generateUUID('note')
    newEditor.zIndex = maxZIndex + 1
    newEditor.shape.x = newEditor.shape.x + 20
    newEditor.shape.y = newEditor.shape.y + 20
    
    const newEditors = [...editors, newEditor]
    console.log('newEditor----', newEditors)
    setEditors(newEditors)
  }

  const handleAdd = () => {
    generateEditor()
  }

  const handleClose = (id: string) => {
    console.log('id----', id)
    const newEditors = editors.filter(e => e.id !== id)
    setEditors(newEditors)
  }

  return (
    <>
      {editors.map(e => <EaseNote key={e.id} {...e} onAdd={handleAdd} onClose={() => handleClose(e.id) } />)}
    </>
  )
  
}

export default Main