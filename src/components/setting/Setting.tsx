import React, { FC } from "react";
import { generateCenterShape, generateUUID } from "../../utils/tool";
import Panel from "../panel";

import styles from './index.module.styl'

export interface SettingProps {
  isShow: boolean
  onClose: () => void
}

const Setting: FC<SettingProps> = ({
  isShow,
  onClose
}) => {

  const renderHeader = () => {
    return (
      <div>
        xin
      </div>
    )
  }

  return (
    <>
      {isShow && (
        <div className={styles.setting}>
          <Panel 
            id={generateUUID("setting")}
            shape={generateCenterShape('SETTING')}
            zIndex={1000}
            resizable={false}
            renderHeader={renderHeader}
            onClose={onClose}
          >
            <div className={styles["setting-container"]}>
              <div className="part">
                <div className="subject">Appearance</div>
                theme: blue | red
              </div>
              <div className="part">
                <div className="subject">General</div>
                theme: blue | red
              </div>
            </div>
          </Panel>
        </div>
      )}
    </>
  )
}

export default Setting