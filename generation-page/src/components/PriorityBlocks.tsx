'use client'

import { Plus, Trash2 } from 'lucide-react'

interface PriorityBlock {
  id: string
  name: string
  genre: string
  time_slot: string
  weight: number
}

export function PriorityBlocks({
  items = [],
  onChange,
}: {
  items: PriorityBlock[]
  onChange: (items: PriorityBlock[]) => void
}) {
  const addItem = () => {
    const newItem: PriorityBlock = {
      id: Date.now().toString(),
      name: 'Block 1',
      genre: 'News',
      time_slot: 'Morning',
      weight: 1,
    }
    onChange([...items, newItem])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<PriorityBlock>) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Priority Blocks</h3>
            <p className="text-xs text-slate-600 mt-0.5">Define content priority zones</p>
          </div>
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            No priority blocks added yet. Click "Add" to create one.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-slate-100/50"
            >
              <div className="flex-1 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Genre</label>
                  <input
                    type="text"
                    value={item.genre}
                    onChange={(e) => updateItem(item.id, { genre: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={item.time_slot}
                    onChange={(e) => updateItem(item.id, { time_slot: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Weight</label>
                  <input
                    type="number"
                    min="1"
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, { weight: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="self-center rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
