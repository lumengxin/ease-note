import React, { FC } from "react";

export interface EaseNoteProps {
  mode: 'browser' | 'desktop'
}

const EaseNote: FC<EaseNoteProps> = (props) => {

  return <h1>eee</h1>
}

EaseNote.defaultProps = {
  mode: 'browser'
}

export default EaseNote