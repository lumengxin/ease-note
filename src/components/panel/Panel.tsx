import React, { FC, useRef } from "react";
import Header from '../header';
import Editor from '../editor';
import Drag from '../drag';
import cn from "classnames"
import { isMobile } from '../../utils/tool'

import styles from './index.module.styl'

export interface PanelProps {
  
}

const isPhone = isMobile()

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
        className={cn(styles["panel-container"], className, "panel-container", { [styles.isPhone]: isPhone })} 
      >
        <Header className={cn(styles["header"], 'note-header')}  onAdd={onAdd} onClose={onClose}>
          {renderHeader && renderHeader()}
        </Header>
        <div className={styles["content"]}>
          {children}
        </div>

        {/* drag点击就会触发，和editor事件冲突，会引起bug; 使用footer作为拖拽点，将其分离；draggable控制拖拽区域，target控制整个面板一起 */}
        {draggable && !isPhone && <div className={cn(styles["footer"], `${id}_footer`)}></div> }
      </div>

      {!isPhone && (
        <Drag 
          target={`#${id}`} 
          draggable={draggable} 
          dragTarget={document.querySelector(`.${id}_footer`)} 
          resizable={resizable} 
          onDragEnd={onDragEnd} 
          onResizeEnd={onResizeEnd}
          container={container} 
        />
      )}
    </div>
  )
}

export default Panel