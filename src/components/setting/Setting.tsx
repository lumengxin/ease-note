import React, { FC } from "react";
import { generateCenterShape, generateUUID } from "../../utils/tool";
import Panel from "../panel";

import styles from './index.module.styl'

// const AtomComponent = {
//   "Input": Input,
//   "switch": switch,
// }

export interface SettingProps {
  config: any
  isShow: boolean
  onClose: () => void
}

function ItemComponent(props) {
  const { name, component, defaultValue, options, extras = [] } = props.item
    const type = component === 'Input' ? 'text' : component === 'Switch' ? "checkbox" : "radio"

    return (
      <>
        <div className={styles.item}>
          <div className={styles.title}>
            <label for={name}>{name}: </label>
          </div>
          <div className={styles.component}>
            <input id={name} type={type} value={defaultValue} />
          </div>
        </div>
        {extras.length > 0 && (
          <div className={styles.extras}>
            {extras.map(e => <ItemComponent key={e.name} item={e[Object.keys(e)[0]]} />)}
          </div>
        )}
      </>
      
    )
}

const Setting: FC<SettingProps> = ({
  config,
  isShow,
  onClose
}) => {

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        username
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className={styles["setting-container"]}>
        {config.map(c => {
          const key = Object.keys(c)[0]
          const values = c[key]
          return (
            <div key={key} className={styles.part}>
              <div className={styles.subject}>{key}</div>
              <div className={styles.detail}>
                {values.map(v => {
                  const title = Object.keys(v)[0]
                  const item = v[title]
                  return <ItemComponent key={v.title} item={item} />
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {isShow && (
        <div className={styles.setting}>
          <Panel 
            id={generateUUID("setting")}
            shape={generateCenterShape('SETTING', 40)}
            zIndex={1000}
            resizable={false}
            renderHeader={renderHeader}
            onClose={onClose}
            className={styles.panel}
          >
            { renderContent() }
          </Panel>
        </div>
      )}
    </>
  )
}

export default Setting