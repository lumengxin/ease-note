import React, { useEffect, useState, FC } from 'react'
import Note from './components/note'
import List from './components/list'
import { DEFAULT_EDITOR, Note as INote, Shape, THEME, DEFAULT_CONFIG } from './utils/const'
import { generateUUID, getMax, getRandomTheme, hasDataChanged, debounce } from './utils/tool'
import localDriver from './utils/local'
import localforage from 'localforage'
import Setting from './components/setting'

import './global.css'
import './iconfont.css'

let x, y
// 第一次挂载必然会变更notes, 加标志位不同步后端notes(第一次不更新，只拿notes，后续判断是否和缓存一样再决定是否二次刷新)
let isMounted = true

interface EaseNoteProps {
	container?: HTMLDivElement | HTMLElement | string
	remote?: string
}

const EaseNote: FC<EaseNoteProps> = ({
	container = document.body,
	remote = ''
}) => {
	const [notes, setNotes] = useState<INote[]>([])
	const [config, setConfig] = useState<any>(DEFAULT_CONFIG)
	const [isShowList, setIsShowList] = useState<boolean>(false)
	const [isShowSetting, setIsShowSetting] = useState<boolean>(false)
	const [mouseShape, setMouseShape] = useState<Shape>({ x: 0, y: 0, w: 0, h: 0 })

	const generateEditor = async (shape?: Shape) => {
		const realNotes = await _getItem('_notes_')
		const maxZIndex = getMax(realNotes, 'zIndex')

		const newNote = {
			...DEFAULT_EDITOR,
			id: generateUUID('note'),
			zIndex: maxZIndex + 1,
			shape: shape
				? { ...shape }
				: {
						...DEFAULT_EDITOR.shape,
						x: DEFAULT_EDITOR.shape.x + 20 * (realNotes.length - 1),
						y: DEFAULT_EDITOR.shape.y + 20 * (realNotes.length - 1),
				  },
			theme: DEFAULT_EDITOR.theme === THEME.RANDOM ? getRandomTheme() : DEFAULT_EDITOR.theme,
		}
		const newNotes = [...realNotes, newNote]
		setNotes(newNotes)
	}

	const handleAdd = () => {
		generateEditor()
	}

	const handleList = (isShow: boolean) => {
		setIsShowList(isShow)
	}

	const handleVisible = (id: string, visible: boolean) => {
		const ns = notes.map((n) => (n.id === id ? { ...n, visibility: visible } : n))
		setNotes(ns)
	}

	const handleDelete = (id: string) => {
		const ns = notes.filter((n) => n.id !== id)
		setNotes(ns)
	}

	const handleTheme = (id: string, theme: THEME) => {
		const ns = notes.map((n) => (n.id === id ? { ...n, theme } : n))
		setNotes(ns)
	}

	const handleEditorChange = async (id, html, editor) => {
		// 插槽嵌入的Editor, 此作用域的notes不对 -> TODO
		// 首次挂载时也会触发
		// console.log("notes---", notes)
		console.log('handleEditorChange----', html, editor.getText())
		const isInit = !editor.getText().length
		const realNotes = await _getItem('_notes_')
		const curNotes = realNotes.map((n) =>
			n.id === id ? { ...n, content: isInit ? n.content : html, updateTime: new Date().toLocaleString() } : n,
		)
		setNotes(curNotes)
	}

	const handleShapeEnd = (id, ps) => {
		console.log('handleDragEnd---', ps, notes)
		const ns = notes.map((n) => (n.id === id ? { ...n, shape: { ...n.shape, ...ps } } : n))
		setNotes(ns)
	}

	const onMouseDown = (e) => {
		const { clientX, clientY } = e

		setMouseShape({
			...mouseShape,
			x: clientX,
			y: clientY,
		})
		x = clientX
		y = clientY
	}

	const onMouseUp = (e) => {
		const { clientX, clientY } = e

		const newShape = {
			...mouseShape,
			x,
			y,
			w: clientX - x,
			h: clientY - y,
		}

		setMouseShape(newShape)

		// 正确做法应该阻止Drag中拖拽事件冒泡 TODO
		if (e.target.id === 'note-container' && isValidShape(newShape)) {
			generateEditor(newShape)
		}
	}

	const isValidShape = (shape: Shape) => {
		const { w, h } = shape
		return w > 320 && h > 320
	}

	const initData = async () => {
		// 先从本地取一次，渲染出页面来；然后从远程拿，比较是否有变化，有则更新
		const localNotes = await _getItem('_notes_') as any
		const initNotes = !!localNotes?.length ? localNotes : [{ ...DEFAULT_EDITOR, theme: THEME.PURPLE }]
		setNotes(initNotes)

		// 是否配置了远程 TODO
		if (!!remote?.length) {
			const res = await fetchData()
			if (res?.code === 200) {
				const dbNotes = JSON.parse(res.data)
				const isChanged = hasDataChanged(localNotes, dbNotes)
				if (isChanged) {
					setNotes(dbNotes)
				}
			}
			
		}
	}

	const updateData = (notes) => {
		// 不保存没有编辑的note -> 初始content为空
		// 定时保存 -> 节流
		localforage.setItem('_notes_', notes, async () => {
			console.warn('updateData---setItem---', await _getItem('_notes_'))
		})

		if (!isMounted) {
			if (!!remote?.length) {
				fetchData({notes: JSON.stringify(notes)}, 'POST')
			}
		}
		isMounted = false
	}

	const fetchData = async (data = {}, method = 'GET', url = remote) => {
		try {
			const configs = {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include' // 携带cookie校验权限
			}
			if (method === 'POST') {
				configs['body'] = JSON.stringify(data)
			}
			const response = await fetch(url, configs)
			return response.json()
		} catch (error) {
			console.log('error---', error)
		}
	}

	useEffect(() => {
		console.log('useEffect--notes---', notes)
		if (!!notes.length) {
			updateData(notes)
			// debounce(function() {
			// 	updateData(notes)
			// 	console.log('aaa')
			// }, 300)
		}
	}, [notes])

	useEffect(() => {
		initData()
	}, [])

	// useEffect(() => {
	// 	localforage.setItem('_config_', config, async () => {
	// 		console.warn('setItem---config', await _getItem('_config_'))
	// 	})
	// }, [config])

	useEffect(() => {
		document.body.addEventListener('mousedown', onMouseDown)
		document.body.addEventListener('mouseup', onMouseUp)
		return () => {
			document.body.removeEventListener('mousedown', onMouseDown)
			document.body.removeEventListener('mouseup', onMouseUp)
		}
	}, [])

	const _getItem = async (key: string) => {
		return await localforage.getItem(key)
	}

	const displayNotes = notes.filter((n) => n.visibility)

	return (
		<div
			id="ease-note"
			// style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0"}}
			// onMouseDown={onMouseDown}
			// onMouseUp={onMouseUp}
		>
			{displayNotes.map((n) => (
				<Note
					key={n.id}
					{...n}
					onAdd={handleAdd}
					onClose={() => handleVisible(n.id, false)}
					onDelete={() => handleDelete(n.id)}
					onTheme={(theme) => handleTheme(n.id, theme)}
					onList={() => handleList(true)}
					onEditorChange={(html, editor) => handleEditorChange(n.id, html, editor)}
					onDragEnd={(ps) => handleShapeEnd(n.id, ps)}
					onResizeEnd={(ps) => handleShapeEnd(n.id, ps)}
					container={container}
				/>
			))}

			<List
				isShow={isShowList}
				notes={notes}
				onAdd={handleAdd}
				onClose={() => handleList(false)}
				onShow={(id) => handleVisible(id, true)}
				onSetting={() => setIsShowSetting(true)}
				onDelete={handleDelete}
			/>

			<Setting isShow={isShowSetting} onClose={() => setIsShowSetting(false)} config={config} />
		</div>
	)
}

export default EaseNote