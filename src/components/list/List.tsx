import React, { FC } from "react";
import Panel from "../panel";
import { generateUUID, generateCenterShape } from '../../utils/tool'
import { Note } from '../../utils/const'
import cn from 'classnames'

import styles from './index.module.styl'

export interface ListProps {
  isShow: boolean
  notes: Note[]
  onAdd: () => void
  onClose: () => void
  onSetting: () => void
  onShow: (id: string) => void
  onDelete: (id: string) => void
}

const List: FC<ListProps> = ({
  isShow,
  notes,
  onAdd,
  onClose,
  onSetting,
  onShow,
  onDelete
}) => {

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.title}>EaseNote</div>
        <div className={styles.setting} onClick={onSetting}>
          <i className="iconfont icon-setting"></i>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.list} style={{display: isShow ? "block" : "none", background: "blue"}}>
      <Panel 
        id={generateUUID("list")}
        shape={generateCenterShape('LIST')}
        zIndex={999}
        resizable={false}
        renderHeader={renderHeader}
        onAdd={onAdd}
        onClose={onClose}
        className={styles.panel}
      >
        <div className={styles["list-container"]}>
          <div className={styles.search}>
            <input placeholder="请输入内容.." />
            <button><i className="iconfont icon-close-copy"></i></button>
            <button><i className="iconfont icon-search"></i></button>
          </div>
          <div className={styles.content}>
            {notes.map(n => (
              <div className={cn(styles.item, { [styles.hide]: !n.visibility })} onDoubleClick={() => onShow(n.id)}>
                <div className={styles.top}>
                  <div className={styles.time}>{n.updateTime ?? n.createTime}</div>
                  <div className={styles.option}>
                    <span onClick={() => onDelete(n.id)}><i className="iconfont icon-delete"></i></span>
                  </div>
                </div>
                <div className={styles.detail}>
                  <div dangerouslySetInnerHTML={{__html: n.content}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default List