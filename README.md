<h1 align="center">
   <b>
      ease-note
    </b>
</h1>

<p align="center">A device-independent, comfortable smart notebook</p>

## Installing

```bash
$ npm install ease-note
```

## Example

1. minimize use. Use local storage by default

```bash
import EaseNote from 'ease-note'

import 'ease-note/lib/ease-note.css'


function Main() {
  return (
    <EaseNote />
  )
}
```


2. Use your own service.
```bash
import EaseNote from 'ease-note'

import 'ease-note/lib/ease-note.css'


function Main() {
  return (
    <EaseNote remote="https://xxx.xx.x/note" />
  )
}
```

**`/note` interface specification:**

1. get notes:
```
Methods: GET
Params: none
Response: 
  - code: 200 success; 400 failed
  - data: String[Note] | []
```

2. create or update notes:
```
Methods: POST
Body: {
  notes: String[Note]
}
Response: 
  - code: 200 success; 400 failed
  - data: []
```

enum THEME {
  GRAY = 'rgb(235, 235, 235)',
  PURPLE = 'rgb(186, 180, 255)',
  PINK = 'rgb(244, 193, 192)',
  BLUE = 'rgb(184, 238, 255)',
  YELLOW = 'rgb(243, 255, 143)',
  GREEN = 'rgb(175, 255, 146)',
  RANDOM = "random"
}

interface Shape {
  x: number
  y: number
  w: number
  h: number
}

interface Note {
  id: string
  shape: Shape
  content: string | HTMLDivElement
  theme: THEME
  zIndex: number
  visibility: boolean
  active: boolean
  createTime?: string
  updateTime?: string
}

## Feature


