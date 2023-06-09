import React, { FC, ReactElement, useRef, useState } from "react";
import Header from '../header';
import Editor from '../editor';
import Drag from '../drag';
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

  return (
    <div 
      className={styles.note}
    >
      <div 
        id={id}
        style={{position: 'absolute', left: shape.x + 'px', top: shape.y + 'px', width: shape.w + 'px', height: shape.h + 'px', zIndex}}
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseOver}
        className={styles["note-container"]} 
      >
        <Header onAdd={onAdd} onClose={onClose}>
          <div className={styles.options}>
            <span><i className="iconfont icon-theme"></i></span>
            <span><i className="iconfont icon-delete"></i></span>
            <span><i className="iconfont icon-list"></i></span>
          </div>
        </Header>
        <Editor content={content} />
      </div>

      <Drag target={`#${id}`} draggable resizable={resizable} />
    </div>
    
  )
}

EaseNote.defaultProps = {
  mode: 'browser'
}

export default EaseNote