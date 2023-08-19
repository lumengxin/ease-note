import React, { FC, useRef } from "react";
import Header from '../header';
import Editor from '../editor';
import Drag from '../drag';
import cn from "classnames"
import { isMobile } from '../../utils/tool'

import styles from './index.module.styl'

export interface PanelProps {
  
}

const isPC = !isMobile()

const Panel: FC<PanelProps> = ({
  isShow,
  renderHeader,
  id,
  shape,
  zIndex,
  resizable,
  onMouseEnter,
  onMouseOut,
  onAdd,
  onClose,
  onDragEnd,
  onResizeEnd,
  className,
  container,
  draggable = false,
  children
}) => {

  return (
    <div className={styles.panel}>
      <div 
        id={id}
        style={{position: 'absolute', left: shape.x + 'px', top: shape.y + 'px', width: shape.w + 'px', height: shape.h + 'px', zIndex}}
        onMouseEnter={onMouseEnter}
        onMouseOut={onMouseOut}
        className={cn(styles["panel-container"], className, "panel-container")} 
      >
        <Header className={cn(styles["header"], 'note-header')}  onAdd={onAdd} onClose={onClose}>
          {renderHeader && renderHeader()}
        </Header>
        <div className={cn(styles["content"], `${id}_content`)}>
          {children}
        </div>
      </div>

      {isPC && <Drag target={`#${id}`} draggable={draggable} dragTarget={document.querySelector(`.${id}_content`)} resizable={resizable} onDragEnd={onDragEnd} onResizeEnd={onResizeEnd} container={container} />}
    </div>
  )
}

export default Panel