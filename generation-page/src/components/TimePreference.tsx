'use client'

import { Plus, Trash2 } from 'lucide-react'

interface TimePreference {
  id: string
  day: string
  start_time: number
  end_time: number
  priority: number
}

export function TimePreferences({
  items = [],
  onChange,
}: {
  items: TimePreference[]
  onChange: (items: TimePreference[]) => void
}) {
  const addItem = () => {
    const newItem: TimePreference = {
      id: Date.now().toString(),
      day: 'Monday',
      start_time: 8,
      end_time: 17,
      priority: 1,
    }
    onChange([...items, newItem])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<TimePreference>) => {
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
            <h3 className="text-lg font-semibold text-slate-900">Time Preferences</h3>
            <p className="text-xs text-slate-600 mt-0.5">Schedule time slots and priorities</p>
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
            No time preferences added yet. Click "Add" to create one.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-slate-100/50"
            >
              <div className="flex-1 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Day</label>
                  <select
                    value={item.day}
                    onChange={(e) => updateItem(item.id, { day: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start (hr)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={item.start_time}
                    onChange={(e) => updateItem(item.id, { start_time: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End (hr)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={item.end_time}
                    onChange={(e) => updateItem(item.id, { end_time: parseInt(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    value={item.priority}
                    onChange={(e) => updateItem(item.id, { priority: parseInt(e.target.value) })}
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
