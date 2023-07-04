<h1 align="center">
   <b>
      ease-note
    </b>
</h1>

<p align="center">一个独立于设备，易于操作的智能便签</p>

## 开始

### 安装
```bash
$ npm install ease-note
```

### 使用

1. 默认开启本地存储
```bash
import EaseNote from 'ease-note'
import 'ease-note/lib/ease-note.css'

function Main() {
  return (
    <EaseNote />
  )
}
```

2. 使用自己的远程服务，跨设备同步数据

配置中设置'Remote Storage'为你自己的api。规范 <api>/notes

**`/notes` 接口规范:**

`/list` 相关
1. 获取便签:
```
Methods: GET
Params: none
Response: 
  - code: 200 success; 400 failed
  - data: String[Note] | []
```

2. 创建&更新便签:
```
Methods: POST
Body: {
  notes: String[Note]
}
Response: 
  - code: 200 success; 400 failed
  - data: []
```

`/config` 相关
1. 获取配置:
```
Methods: GET
Params: none
Response: 
  - code: 200 success; 400 failed
  - data: String{Config}
```

2. 更新配置:
```
Methods: POST
Body: {
  notes: String{Config}
}
Response: 
  - code: 200 success; 400 failed
  - data: {}
```

ts类型说明
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
  title: string
  content: string | HTMLDivElement
  theme: THEME
  zIndex: number
  visibility: boolean
  active: boolean
  createTime?: string
  updateTime?: string
}
```

## Feature

- 便签可创建、删除、隐藏
- 便签面板支持自由拖拽，改变大小
- 便签支持鼠标框选创建（需要大于一定尺寸）
- 便签支持修改标题、换肤等功能
- 便签操作支持标题、粗体、文字颜色、列表、待办、表格、代码块等
- 便签列表支持查询（标题&内容），创建、显示、删除便签功能
- 便签列表自动根据更新时间排序
- 配置支持创建便签默认主题配置、远程服务配置

### todo

- 配置完善
- 接入ai书写提示
- 跨设备


