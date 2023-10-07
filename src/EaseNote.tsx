import React, { useEffect, useState, FC } from 'react'
import Note from './components/note'
import List from './components/list'
import { DEFAULT_EDITOR, Note as INote, Shape, THEME, DEFAULT_CONFIG } from './utils/const'
import { generateUUID, getMax, getRandomTheme, hasDataChanged, debounce } from './utils/tool'
import localDriver from './utils/local'
import localforage from 'localforage'
import Setting from './components/setting'
import { isMobile } from './utils/tool'

import './global.css'
import './iconfont.css'

let x, y
// 第一次挂载必然会变更notes, 加标志位不同步后端notes(第一次不更新，只拿notes，后续判断是否和缓存一样再决定是否二次刷新)
let isMounted = true

let timer

const isPhone = isMobile()

interface EaseNoteProps {
	container?: HTMLDivElement | HTMLElement | string
	// remote?: string
}

const defaultRemote = DEFAULT_CONFIG[2].storage[1].remote?.defaultValue as string

const EaseNote: FC<EaseNoteProps> = ({
	container = document.body,
}) => {
	const [notes, setNotes] = useState<INote[]>([])
	const [configs, setConfigs] = useState<any>({})
	const [isShowList, setIsShowList] = useState<boolean>(false)
	const [isShowSetting, setIsShowSetting] = useState<boolean>(false)
	const [mouseShape, setMouseShape] = useState<Shape>({ x: 0, y: 0, w: 0, h: 0 })
	const [remote, setRemote] = useState<string>(defaultRemote)
	const [phoneNote, setPhoneNote] = useState<INote[]>([])
	const [isChanged, setIsChanged] = useState(false)
	const [saving, setSaving] = useState(false)

	const generateEditor = async (shape?: Shape) => {
		const realNotes = await _getItem('_notes_')
		const maxZIndex = getMax(realNotes, 'zIndex')

		const defaultTheme = configs['Note Theme'] ?? DEFAULT_EDITOR.theme

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
			theme: defaultTheme === THEME.RANDOM ? getRandomTheme() : defaultTheme,
		}
		
		return newNote
	}

	const handleList = (isShow: boolean) => {
		setIsShowList(isShow)
	}

	const handleAdd = async (type = 'list') => {
		// e.stopPropagation()
    // e.nativeEvent?.stopImmediatePropagation()
		const note = await generateEditor()
		createData(note, type)
	}

	const handleDelete = (id: string, type = 'list') => {
		deleteData(id, type)
	}

	const handleVisible = (id: string, visible: boolean) => {
		updateNotes(id, 'visibility', visible)
	}

	const handleTheme = (id: string, theme: THEME) => {
		updateNotes(id, 'theme', theme)
	}

	const handleTitle = (id: string, title: string) => {
		updateNotes(id, 'title', title)
	}

	const handleEditorChange = async (id, html) => {
		// 插槽嵌入的Editor, 此作用域的notes不对 -> TODO
		// 首次挂载时也会触发, fouce会触发
		// console.log('handleEditorChange----', id, html, editor.getText())
		// const isInit = !editor.getText().length
		// 此作用域中state维护的notes状态不对
		const realNotes = await _getItem('_notes_')
		// const curNotes = realNotes.map((n) =>
		// 	n.id === id ? { ...n, content: isInit ? n.content : html, updateTime: new Date().toLocaleString() } : n,
		// )
		updateNotes(id, 'content', html, realNotes)
	}

	const handleShapeEnd = (id, ps) => {
		console.log('handleDragEnd---', ps, notes)
		const ns = notes.filter(f => f.id === id).map((n) => (n.id === id ? { ...n, shape: { ...n.shape, ...ps } } : n))
		updateData(ns)
	}

	const updateNotes = (id: string, attr: string, value: any, realNotes) => {
		const curNotes = realNotes ?? notes
		let newNotes = curNotes.filter(f => f.id === id).map((n) =>
			n.id === id ? { ...n, [attr]: value } : n,
		)

		// 激活态需要更新两条，之前激活的重置
		if (attr === 'active') {
			const lastActiveNote = curNotes.filter(f => f.active).map(n => {
				return {  ...n, active: false  }
			})
			newNotes = [...newNotes, ...lastActiveNote]
		}
		// 笔记内容变更时，自动保存
		if (attr === 'title' || attr === 'content') {
			localforage.setItem('_notes_', newNotes, async () => {
				console.warn('updateData---setItem---contentChange', newNotes)
			})
			// setNotes(newNotes)
			setIsChanged(true)
		} else {
			updateData(newNotes, attr, value)

		}
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

	const onMouseUp = async (e) => {
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
			const note = await generateEditor(newShape)
			console.log('onMouseUp----', note)
			createData(note, 'note')
		}
	}

	const isValidShape = (shape: Shape) => {
		const { w, h } = shape
		return w > 240 && h > 240
	}

	const getData = async (useCache = false) => {
		console.log('getData--remote', remote)
		// 主动更新的不需要判断本地储存，主要是第一次进来判断有储存时使用缓存
		let localNotes = []
		if (useCache) {
			// 先从本地取一次，渲染出页面来；然后从远程拿，比较是否有变化，有则更新
			localNotes = await _getItem('_notes_') as any || []
			const initNotes = !!localNotes?.length ? localNotes : [{ ...DEFAULT_EDITOR, theme: THEME.PURPLE }]
			if (localNotes?.length > 0) {
				// 首次使用时，初始化一个没有入库，库里根据id更新会有问题
				setNotes(initNotes)
			}
		}

		// 是否配置了远程 TODO
		if (!!remote?.length) {
			const res = await fetchData(`${remote}/list`)
			if (res?.code === 200) {
				const dbNotes = !!res.data?.length ? res.data.map(d => {
					return {
						...d,
						zIndex: d.z_index
					}
				}) : []

				if (useCache) {
					const isChanged = hasDataChanged(localNotes, dbNotes)
					if (isChanged) {
						setNotes(dbNotes)
					}
				} else {
					setNotes(dbNotes)
				}
				localforage.setItem('_notes_', dbNotes, async () => {
					console.warn('updateData---setItem---', await _getItem('_notes_'))
				})
			}
			
		}
	}

	const createData = async (note, type) => {
		if (!!remote?.length) {
			const res = await fetchData(`${remote}/list`, 'POST', { note })
			if (res.code === 200) {
				if (isPhone && type === 'note') {
					const curNotes = [...notes, note]
					updateNotes(note.id, 'active', true, curNotes)
				} else {
					getData()
				}
			}
		}
	}

	const updateData = async (notes, attr = '', value) => {
		// 不保存没有编辑的note -> 初始content为空
		// 定时保存 -> 节流
		// localforage.setItem('_notes_', notes, async () => {
		// 	console.warn('updateData---setItem---', await _getItem('_notes_'))
		// })

		// if (isMounted) {
		// 	return
		// }
		if (!!remote?.length) {
			const res = await fetchData(`${remote}/list`, 'PUT', { notes })
			if (res.code === 200) {
				const ns = res.data.map(d => {
					return {
						...d,
						zIndex: d.z_index
					}
				})
				console.log('updateData---', ns)
				setNotes(ns)
				localforage.setItem('_notes_', ns, async () => {
					console.warn('updateData---setItem---', await _getItem('_notes_'))
				})

				if (isPhone) {
					let curNote = []
					if (attr === 'active') {
						curNote = notes.filter(n => n.active)
					} else if (attr === 'theme' || attr === 'content' || attr === 'title') {
						curNote = phoneNote.map(n => {
							return {
								...n,
								[attr]: value
							}
						})
					}
					handleList(false)
					setPhoneNote(curNote)
				}
			}
		}
		isMounted = false
	}

	const deleteData = async (id, type) => {
		if (!!remote?.length) {
			const res = await fetchData(`${remote}/list`, 'DELETE', { id })
			if (res.code === 200) {
				getData()

			  if (isPhone && type === 'note') {
					// setPhoneNote([])
					handleList(true)
				}
			}
		}
	}

	const fetchData = async (url = '', method = 'GET', data = {} ) => {
		try {
			const params = {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include' // 携带cookie校验权限
			}
			if (method !== 'GET') {
				params['body'] = JSON.stringify(data)
			}
			const response = await fetch(url, params)
			return response.json()
		} catch (error) {
			console.log('error---', error)
		}
	}

	// useEffect(() => {
	// 	console.log('useEffect--notes---', notes)
	// 	if (!!notes.length) {
	// 		updateData(remote, notes)
	// 	}
	// }, [notes, remote])

	const getConfigs = async () => {
		const res = await fetchData(`${remote}/config`)
		console.log(res, '----')
		if (res.code === 200 && !!res.data.length) {
			const tempConfigs = JSON.parse(res.data)
			setConfigs(tempConfigs)

			const rs = tempConfigs['Remote Storage']
			if (!!rs?.length) {
				setRemote(rs)
			}
		} else {
			getData(true)
		}
	}

	const updateConfigs = async (c) => {
		const res = await fetchData(`${remote}/config`, 'POST', {configs: JSON.stringify(c)})
		console.log(res, '----')
		if (res.code === 200 && !!res.data.length) {
			const tempConfigs = JSON.parse(res.data)
			setConfigs(tempConfigs)
			setRemote(tempConfigs['Remote Storage'])
		}
	}

	const handleConfigChange = (c) => {
		updateConfigs(c)
	}

	const handleDoubleClick = (id) => {
		if (isPhone) return

		handleVisible(id, true)
	}

	const handleNoteClose = (id) => {
		if (isPhone) {
			handleList(true)
		} else {
			handleVisible(id, false)
		}
	}

	// 移动端交互区分开。始终只显示一个note,和pc不干扰
	const handlePhoneClick = (id) => {
		if (!isPhone) return
		updateNotes(id, 'active', true)
	}

	const updateLocalPhoneNote = (note) => {
		localforage.setItem('_phoneNote_', note, async () => {
			console.warn('updateLocalPhoneNote---_phoneNote_---', await _getItem('_phoneNote_'))
		})
	}

	const autoSaveNotes = async (id) => {
		setSaving(true)
		// 应该是单独维护一份需要更新的note -> todo
		const realNotes = await _getItem('_notes_')
		const curNotes = id ? notes.filter(n => n.id === id) : realNotes
		console.log('autoSaveNotes----', id, curNotes)

		const res = await fetchData(`${remote}/list`, 'PUT', { notes: curNotes })
		if (res.code === 200) {
			setIsChanged(false)
			// 应为是编辑中的内容，此时更新后没必要getData刷新（可能又是之前死循环），list中刷新既可
		}
		// handleList(false)
		setSaving(false)
	}

	const handleNoteSave = (id) => {
		autoSaveNotes(id)
	}

	const handleShowList = () => {
		getData()
		handleList(true)
	}

	useEffect(() => {
		getData()
	}, [remote])

	useEffect(() => {
		if (isChanged) {
			timer = setInterval(autoSaveNotes, 2 * 1000)
		} else {
			clearInterval(timer)
		}
	}, [isChanged])

	useEffect(() => {
		getConfigs()

		localforage.getItem('_notes_').then(function(data) {
			if (isPhone) {
				const value = data.filter((n) => n.active) 
				if (value?.length > 0) {
					setPhoneNote(value)
				} else {
					handleList(true)
				}
			} else {
				if (!data?.length) {
					handleList(true)
				}
			}
		}).catch(function(err) {
				// 当出错时，此处代码运行
				console.log(err);
		});

		return () => {
			clearInterval(timer)
		}
		
	}, [])

	useEffect(() => {
		document.body.addEventListener('mousedown', onMouseDown)
		document.body.addEventListener('mouseup', onMouseUp)
		return () => {
			document.body.removeEventListener('mousedown', onMouseDown)
			document.body.removeEventListener('mouseup', onMouseUp)
		}
	}, [])

	// useEffect(() => {
	// 	if (notes.length > 0) {
	// 		const activeNote = notes.filter((n) => n.active)
	// 		setPhoneNote(activeNote)
	// 	}
	// }, [notes])

	const _getItem = async (key: string) => {
		return await localforage.getItem(key)
	}

	const displayNotes = isPhone ? phoneNote : notes.filter((n) => n.visibility)
	console.log('dddddd', displayNotes)

	return (
		<div
			id="ease-note"
			// style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0"}}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
		>
			{!!displayNotes?.length && displayNotes[0] && displayNotes.map((n) => (
				<Note
					key={n.id}
					{...n}
					onAdd={() => handleAdd('note')}
					onClose={() => handleNoteClose(n.id)}
					onDelete={() => handleDelete(n.id, 'note')}
					onTheme={(theme) => handleTheme(n.id, theme)}
					onList={handleShowList}
					onEditorChange={(html) => handleEditorChange(n.id, html)}
					onDragEnd={(ps) => handleShapeEnd(n.id, ps)}
					onResizeEnd={(ps) => handleShapeEnd(n.id, ps)}
					onTitleChange={(title) => handleTitle(n.id, title)}
					container={container}
					saving={saving}
					onSave={() => handleNoteSave(n.id)}
				/>
			))}

			<List
				isShow={isShowList}
				notes={notes}
				onAdd={handleAdd}
				onClose={() => handleList(false)}
				onDoubleClick={handleDoubleClick}
				onSetting={() => setIsShowSetting(true)}
				onDelete={handleDelete}
				onClick={handlePhoneClick}
				activeId={phoneNote?.id}
			/>

			<Setting isShow={isShowSetting} onClose={() => setIsShowSetting(false)} configs={configs} onChange={handleConfigChange} />
		</div>
	)
}

export default EaseNote