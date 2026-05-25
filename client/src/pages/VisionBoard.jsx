import { useState, useEffect, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Handle, 
  NodeResizer
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Toast from '../components/Toast'

const NODE_COLORS = {
  root: { bg: '#7c3aed', text: '#ffffff', border: '#6d28d9' },
  locked: { bg: '#ede9fe', text: '#4c1d95', border: '#c4b5fd' },
  editable: { bg: '#f5f3ff', text: '#3b0764', border: '#ddd6fe' },
  child: { bg: '#ffffff', text: '#1f2937', border: '#e9d5ff' }
}

function VisionNode({ data, selected }){
    const [editing, setEditing] = useState(false); 
    const textareaRef = useRef(null); 
    const [fontSize, setFontSize] = useState(data.fontSize || 14)
    const [bold, setBold] = useState(data.bold || false)
    const [textAlign, setTextAlign] = useState(data.textAlign || 'center')

    // focus when user is trying to edit 
    useEffect(() => {
        if (editing && textareaRef.current){
            textareaRef.current.focus(); 
        }
    }, [editing]); 


    const colors = data.isRoot
        ? NODE_COLORS.root
        : data.locked
        ? NODE_COLORS.locked
        : NODE_COLORS.editable
    

    // draw a node 
    return (
        <div
            className="relative group rounded-lg shadow-sm"
            style={{
                backgroundColor: colors.bg,
                border: `2px solid ${colors.border}`,
                padding: '12px 16px',
                width: '100%',
                height: '100%'
            }}
        >
            {/* Resizer */}
            <NodeResizer
                minWidth={150}
                minHeight={80}
                isVisible={selected}
                lineStyle={{ border: '1px dashed #c4b5fd' }}
                handleStyle={{ backgroundColor: '#7c3aed', width: '8px', height: '8px', borderRadius: '50%' }}
                onResize={(event, params) => {
                    data.onResize(data.id, params)
                }}
                onResizeEnd={(event, params) => {
                    data.onResizeEnd(data.id, params)
                }}
            />

            {/* Formatting Toolbar - shows on selection */}
            {selected && (
                <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-lg shadow-lg z-50"
                    style={{ backgroundColor: '#1f2937', whiteSpace: 'nowrap' }}
                    onMouseDown={e => e.stopPropagation()}
                >
                    {/* Font size */}
                    <select
                    value={fontSize}
                    onChange={e => {
                        const size = parseInt(e.target.value)
                        setFontSize(size)
                        data.onStyleChange(data.id, { fontSize: size, bold, textAlign })
                    }}
                    className="text-white text-xs rounded px-1 py-0.5"
                    style={{ backgroundColor: '#374151', border: 'none' }}
                    >
                    {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(s => (
                        <option key={s} value={s}>{s}px</option>
                    ))}
                    </select>

                    {/* Bold */}
                    <button
                    onClick={() => {
                        const newBold = !bold
                        setBold(newBold)
                        data.onStyleChange(data.id, { fontSize, bold: newBold, textAlign })
                    }}
                    className="text-white text-xs px-2 py-0.5 rounded hover:bg-gray-600 transition-colors font-bold"
                    style={{ backgroundColor: bold ? '#6d28d9' : 'transparent' }}
                    >
                    B
                    </button>

                    {/* Align left */}
                    <button
                    onClick={() => {
                        setTextAlign('left')
                        data.onStyleChange(data.id, { fontSize, bold, textAlign: 'left' })
                    }}
                    className="material-symbols-outlined text-white hover:bg-gray-600 rounded px-1"
                    style={{ fontSize: '16px', backgroundColor: textAlign === 'left' ? '#6d28d9' : 'transparent' }}
                    >
                    format_align_left
                    </button>

                    {/* Align center */}
                    <button
                    onClick={() => {
                        setTextAlign('center')
                        data.onStyleChange(data.id, { fontSize, bold, textAlign: 'center' })
                    }}
                    className="material-symbols-outlined text-white hover:bg-gray-600 rounded px-1"
                    style={{ fontSize: '16px', backgroundColor: textAlign === 'center' ? '#6d28d9' : 'transparent' }}
                    >
                    format_align_center
                    </button>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#4b5563' }} />

                    {/* Delete */}
                    {!data.locked && !data.isRoot && (
                    <button
                        onClick={() => data.onDelete(data.id)}
                        className="material-symbols-outlined text-red-400 hover:text-red-300 px-1"
                        style={{ fontSize: '16px' }}
                    >
                        delete
                    </button>
                    )}
                </div>
            )}

            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

            {/* Label */}
            <div
                className="font-bold text-sm mb-1 text-center"
                style={{ color: colors.text }}
            >
                {data.label}
            </div>

            {/* Fields - for nodes with multiple inputs */}
            {data.fields && data.fields.length > 0 && (
                <div className="space-y-2 mt-2">
                    {data.fields.map((field) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold mb-0.5 text-center" style={{ color: colors.text }}>
                                {field}
                            </label>
                            <textarea
                                value={(data.content?.[field]) || ''}
                                onChange={e => data.onContentChange(data.id, { ...data.content, [field]: e.target.value })}
                                placeholder={`Add ${field}...`}
                                rows={2}
                                className="w-full text-sm resize-none focus:outline-none rounded p-1 text-center"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    color: colors.text,
                                    border: '1px solid ' + colors.border
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Content - only for non-locked nodes */}
            {!data.locked && !data.fields && (
                <div onClick={() => setEditing(true)}>
                {editing ? (
                    <textarea
                        ref={textareaRef}
                        value={data.content || ''}
                        onChange={e => data.onContentChange(data.id, e.target.value)}
                        onBlur={() => setEditing(false)}
                        placeholder="Click to add notes..."
                        rows={3}
                        className="w-full focus:outline-none rounded p-1"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            color: colors.text,
                            border: '1px solid ' + colors.border,
                            resize: 'none',
                            minHeight: '60px',
                            fontSize: `${data.fontSize || 14}px`,
                            fontWeight: data.bold ? '700' : '400',
                            textAlign: data.textAlign || 'center'
                        }}
                    />
                ) : (
                    <p
                        className="cursor-text"
                        style={{
                            color: data.content ? colors.text : '#a78bfa',
                            minHeight: '60px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: `${data.fontSize || 14}px`,
                            fontWeight: data.bold ? '700' : '400',
                            textAlign: data.textAlign || 'center'
                        }}
                    >
                    {data.content || 'Click to add notes...'}
                    </p>
                )}
                </div>
            )}

            {/* Action buttons */}
            {!data.isRoot && (
                <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                {!data.locked && (
                    <button
                    onClick={() => data.onDelete(data.id)}
                    className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Delete node"
                    >
                    ×
                    </button>
                )}
                </div>
            )}

            {/* Add child button */}
            <button
                onClick={() => data.onAddChild(data.id)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 hidden group-hover:flex w-5 h-5 bg-purple-500 text-white rounded-full text-xs items-center justify-center hover:bg-purple-600 transition-colors"
                title="Add child node"
            >
                +
            </button>

            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        </div>
    ); 
}

const nodeTypes = { visionNode: VisionNode };

// function to initialize each node and edge based on data
function boardToFlow(boardData, handlers){
    const nodes = []; 
    const edges = []; 
    const positions = calculatePositions(boardData.nodes, 'root'); 

    Object.values(boardData.nodes).forEach(node => {
        const pos = positions[node.id] || { x: 0, y: 0 }; 
        nodes.push({
            id: node.id, 
            type: 'visionNode', 
            position: node.position || pos,
            selected: false,
            style: {
                width: node.size?.width || (node.id === 'root' ? 200 : 180),
                height: node.size?.height || 'auto'
            },
            data: {
                ...node,
                isRoot: node.id === 'root',
                onContentChange: handlers.onContentChange,
                onDelete: handlers.onDelete,
                onAddChild: handlers.onAddChild, 
                onStyleChange: handlers.onStyleChange, 
                onResize: handlers.onResize,
                onResizeEnd: handlers.onResizeEnd
            }
        }); 
        node.children?.forEach(childId => {
            edges.push({
                id: `${node.id}-${childId}`,
                source: node.id,
                target: childId,
                style: { stroke: '#c4b5fd', strokeWidth: 1.5 }
            })
        }); 
    }); 

    return { nodes, edges }; 
}

// function to calculate positions of each node and edge
function calculatePositions(nodeMap, rootId, x = 600, y = 50, level = 0){
    const positions = {}; 
    const node = nodeMap[rootId]; 
    if (!node){
        return positions; 
    }

    positions[rootId] = { x, y }; 
    const children = node.children || [];
    if (children.length === 0) {
        return positions; 
    }

    const spacing = Math.max(180, 800 / Math.pow(2, level)); 
    const totalWidth = spacing * (children.length - 1); 
    const startX = x - totalWidth / 2; 

    // calculate the position of the child node 
    children.forEach((childId, i) => {
        const childX = startX + i * spacing
        const childY = y + 120
        Object.assign(positions, calculatePositions(nodeMap, childId, childX, childY, level + 1))
    }); 

    return positions; 
}

export default function VisionBoard(){
    const navigate = useNavigate()
    const { token } = useAuth()
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [boardData, setBoardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const saveTimer = useRef(null)

    useEffect(() => {
        fetchBoard(); 
    }, []); 

    // function to fetch the board
    const fetchBoard = async () => {
        try {
            // fetch the board data
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
                headers: { Authorization: `Bearer ${token}` }
            }); 
            const data = await res.json(); 
            if (res.ok){
                setBoardData(data.data); 
            }
        } catch (error){
            console.error('Failed to fecth the board data', error);
        } finally{
            setLoading(false); 
        }
    }

    // use callback () to cache saveBoard to prevent child components to rerender 
    const saveBoard = useCallback(async (data) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ data })
            }); 
            setToast({ message: 'Board saved', type: 'success' }); 
        } catch (error){
            console.error('Failed to save board', error); 
        }
    }, [token]); 

    // function to auto-save user input
    const autoSave = useCallback((data) => {
        if (saveTimer.current) clearTimeout(saveTimer.current); 
        saveTimer.current = setTimeout(() => saveBoard(data), 1500); 
    }, [saveBoard]); 

    // function to save node size when resized
    const onNodeResizeEnd = useCallback((event, node, params) => {
    setBoardData(prev => {
        const updated = {
        ...prev,
        nodes: {
            ...prev.nodes,
            [node.id]: {
            ...prev.nodes[node.id],
            size: { width: params.width, height: params.height }
            }
        }
        }
        autoSave(updated)
        return updated
    })
    }, [autoSave])

    const handlers = useCallback(() => ({
        onContentChange: (id, value) => {
            setBoardData(prev => {
                const updated = {
                    ...prev,
                    nodes: {
                        ...prev.nodes,
                        [id]: { ...prev.nodes[id], content: value }
                    }
                }
                autoSave(updated)
                return updated
            })
        }, 
        onStyleChange: (id, style) => {
            setBoardData(prev => {
                const updated = {
                ...prev,
                nodes: {
                    ...prev.nodes,
                    [id]: { ...prev.nodes[id], ...style }
                }
                }
                autoSave(updated)
                return updated
            })
        },
        onDelete: (id) => {
            if (!confirm('Delete this node?')) return
            setBoardData(prev => {
                const updated = { ...prev, nodes: { ...prev.nodes } }
                delete updated.nodes[id]
                Object.values(updated.nodes).forEach(node => {
                    node.children = (node.children || []).filter(c => c !== id)
                })
                autoSave(updated)
                return updated
            })
        },
        onAddChild: (parentId) => {
            const newId = `node_${Date.now()}`
            setBoardData(prev => {
                const updated = {
                    ...prev,
                    nodes: {
                        ...prev.nodes,
                        [newId]: { id: newId, label: 'New Node', content: '', locked: false, children: [] },
                        [parentId]: {
                            ...prev.nodes[parentId],
                            children: [...(prev.nodes[parentId].children || []), newId]
                        }
                    }
                }
                autoSave(updated)
                return updated
            })
        }, 
        onResize: (id, params) => {
            setNodes(nds => nds.map(n => {
                if (n.id !== id) return n
                return {
                    ...n,
                    position: { x: params.x, y: params.y },
                    style: { ...n.style, width: params.width, height: params.height }
                }
            }))
        },
        onResizeEnd: (id, params) => {
            setBoardData(prev => {
                const updated = {
                    ...prev,
                    nodes: {
                        ...prev.nodes,
                        [id]: {
                        ...prev.nodes[id],
                        position: { x: params.x, y: params.y },
                        size: { width: params.width, height: params.height }
                        }
                    }
                }
                autoSave(updated)
                return updated
            })
        }
    }), [autoSave])

    useEffect(() => {
        if (!boardData) return
        const h = handlers()
        const { nodes: flowNodes, edges: flowEdges } = boardToFlow(boardData, h)
        setNodes(flowNodes)
        setEdges(flowEdges)
    }, [boardData])

    const onNodeDragStop = useCallback((event, node) => {
        setBoardData(prev => {
            const updated = {
                ...prev,
                nodes: {
                    ...prev.nodes,
                    [node.id]: { ...prev.nodes[node.id], position: node.position }
                }
            }
            autoSave(updated)
            return updated
        })
    }, [autoSave])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f9fb' }}>
                <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#7c3aed' }}>progress_activity</span>
            </div>
        )
    }

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f9fb' }}>
            {/* Top Nav */}
            <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
                <div className="flex justify-between items-center h-16 px-10 w-full max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-8">
                        <span className="text-lg font-black text-black">ScriptFlow</span>
                        <nav className="flex gap-4">
                            <span className="text-sm font-semibold text-black border-b-2 border-black pb-1">Creator Vision</span>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-sm font-medium hover:text-black transition-colors"
                                style={{ color: '#45464d' }}
                            >
                                Back to Dashboard
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs" style={{ color: '#45464d' }}>Auto-saves as you type</span>
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    </div>
                </div>
            </header>

            {/* Canvas */}
            <div style={{ width: '100%', flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeDragStop={onNodeDragStop}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    snapToGrid={true}
                    snapGrid={[20, 20]}
                >
                <Background color="#e9d5ff" gap={24} size={1} />
                <Controls />
                </ReactFlow>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}
