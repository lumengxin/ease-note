import React, { FC, ReactElement, forwardRef } from "react";
import cn from "classnames"

import styles from './index.module.styl'

export interface HeaderProps {
  mode?: 'browser' | 'desktop'
  children?: ReactElement
  onAdd: () => void
  onClose: () => void
  className: string
}
const Header: FC<HeaderProps> = ({
  onAdd,
  onClose,
  className,
  children
}) => {

  return (
    <div id="header" className={cn(styles.header, className)}>
      <div className={styles.add} onClick={onAdd}>
        <i className="iconfont icon-add"></i>
      </div>
      <div className={styles.center}>
        {children}
      </div>
      <div className={styles.close} onClick={onClose}>
        <i className="iconfont icon-close-copy"></i>
      </div>
    </div>
  )
}

export default Header