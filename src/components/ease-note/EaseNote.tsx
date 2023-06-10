import React, { FC, ReactElement, useRef, useState } from "react";
import Header from '../header';
import Editor from '../editor';
import Drag from '../drag';
import Panel from '../panel';
import cn from 'classnames'

import styles from './index.module.styl'

export interface EaseNoteProps {
  mode?: 'browser' | 'desktop'
  id: string
  shape: Shape
  zIndex: number
  content: string
  onAdd: () => void
  onClose: () => void
  onList: () => void
  onDelete: () => void
  onTheme: () => void
  onEditorChange: () => void
}

interface Shape {
  x: number
  y: number
  w: number
  h: number
}

const EaseNote: FC<EaseNoteProps> = ({
  onAdd,
  onClose,
  onList,
  onDelete,
  onTheme,
  onEditorChange,
  id,
  shape,
  zIndex,
  content,
  ...rest
}) => {
  const [ resizable, setResizable ] = useState<boolean>(true)
  const targetRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<ReactElement>(null)

  const handleMouseEnter = () => {
    console.log('enter----')
    setResizable(true)
  }

  const handleMouseOver = () => {
    console.log('over----')
    // setResizable(false)
  }

  const renderHeader = () => {
    return (
      <div className={styles.options}>
        <span onClick={onTheme}><i className="iconfont icon-theme"></i></span>
        <span onClick={onDelete}><i className="iconfont icon-delete"></i></span>
        <span onClick={onList}><i className="iconfont icon-list"></i></span>
      </div>
    )
  }

  return (
    <div 
      className={styles.note}
    >
      <Panel 
        id={id}
        shape={shape}
        zIndex={zIndex}
        resizable={resizable}
        renderHeader={renderHeader}
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseOver}
        onAdd={onAdd}
        onClose={onClose}
      >
        <Editor content={content} onChange={onEditorChange} />
      </Panel>
    </div>
    
  )
}

EaseNote.defaultProps = {
  mode: 'browser'
}

export default EaseNote