import React, { FC } from "react";
import Header from '../header';
import Editor from '../editor';
import Drag from '../drag';
import cn from "classnames"

import styles from './index.module.styl'

export interface PanelProps {
  
}

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
  children
}) => {

  return (
    <div className={styles.panel}>
      <div 
        id={id}
        style={{position: 'absolute', left: shape.x + 'px', top: shape.y + 'px', width: shape.w + 'px', height: shape.h + 'px', zIndex}}
        onMouseEnter={onMouseEnter}
        onMouseOut={onMouseOut}
        className={cn(styles["panel-container"], className)} 
      >
        <Header className={styles["header"]}  onAdd={onAdd} onClose={onClose}>
          {renderHeader && renderHeader()}
        </Header>
        <div className={styles["content"]}>
          {children}
        </div>
      </div>

      <Drag target={`#${id}`} draggable resizable={resizable} onDragEnd={onDragEnd} onResizeEnd={onResizeEnd} container={container} />
    </div>
  )
}

export default Panel