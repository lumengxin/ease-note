import React from 'react'
import ReactDOM from 'react-dom'
import Main from './EaseNote'

ReactDOM.render(<Main remote="http://127.0.0.1:3041/note" />, document.getElementById('root'))