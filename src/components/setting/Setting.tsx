import React, { FC, useState } from "react";
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

// TODO: 优化为递归组件
function ItemComponent(props) {
  const { name, component, defaultValue, options = [], extras = []  } = props.item
  // const [ configs, setConfigs ] = useState({})
  
  // const onChange = (key, value, e) => {
  //   const tempC = {
  //     ...configs,
  //     [key]: value
  //   }
  //   console.log('key, value, e', tempC)

  //   setConfigs(tempC)
  // }

  const type = component === 'Input' ? 'text' : component === 'Switch' ? "checkbox" : "radio"
  let attrs = {}
  if (type === "checkbox") {
    attrs.checked = props.configs[name] ?? defaultValue
  } else {
    attrs.value = props.configs[name] ?? defaultValue
  }
  return (
    <>
      <div className={styles.item}>
        <div className={styles.title}>
          <label for={name}>{name}: </label>
        </div>
        <div className={styles.component}>
          {options?.length > 0 ? options.map(o => {
            return (
              <>
                <label for={o.label}>{o.label.slice(0, 3)}</label>
                <input 
                  id={o.label} 
                  type={type} 
                  value={o.value} 
                  checked={props.configs[name] ? props.configs[name] === o.value : o.defaultValue} 
                  onChange={(e) => props.onChange(name, e.target.value, e)} 
                />
              </>
            )
          }) : (
            <input id={name} type={type} {...attrs} onChange={(e) => props.onChange(name, attrs.hasOwnProperty('value') ? e.target.value : e.target.checked, e)} />
          )}
        </div>
      </div>
      {extras.length > 0 && (
        <div className={styles.extras}>
          {extras.map(e => <ItemComponent key={e.name} item={e[Object.keys(e)[0]]} onChange={props.onChange} configs={props.configs} />)}
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
  // config前端视图配置，configs简洁配置对外暴露（后端）
  const [ configs, setConfigs ] = useState({})
  
  const handleChange = (key, value, e) => {
    const tempC = {
      ...configs,
      [key]: value
    }
    console.log('key, value, e', tempC)

    setConfigs(tempC)
  }

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        user
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
                  return <ItemComponent key={v.title} item={item} onChange={handleChange} configs={configs} />
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