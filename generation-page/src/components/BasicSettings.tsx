'use client'

interface BasicSettingsProps {
  register: any
  watch: any
  errors: any
}

export function BasicSettings({ register, watch, errors }: BasicSettingsProps) {
  const formValues = watch()

  const sliderSettings = [
    {
      key: 'min_duration',
      label: 'Min Duration',
      min: 1,
      max: 120,
      unit: 'min',
      description: 'Minimum segment duration'
    },
    {
      key: 'max_consecutive_genre',
      label: 'Max Consecutive Genre',
      min: 1,
      max: 10,
      unit: 'genre',
      description: 'Maximum same genre repetitions'
    },
    {
      key: 'channels_count',
      label: 'Channels Count',
      min: 1,
      max: 50,
      unit: 'channels',
      description: 'Total broadcast channels'
    },
    {
      key: 'switch_penalty',
      label: 'Switch Penalty',
      min: 0,
      max: 20,
      unit: 'pts',
      description: 'Penalty for channel switches'
    },
    {
      key: 'termination_penalty',
      label: 'Termination Penalty',
      min: 0,
      max: 20,
      unit: 'pts',
      description: 'Penalty for early termination'
    },
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Basic Settings</h2>
        <p className="text-xs text-slate-600 mt-0.5">Configure core scheduling parameters</p>
      </div>
      
      <div className="space-y-6 p-6">
        {/* Time Inputs */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Opening Time
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('opening_time', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">min</span>
              </div>
              {errors.opening_time && (
                <p className="mt-1 text-xs text-red-600">{errors.opening_time.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Closing Time
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('closing_time', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">min</span>
              </div>
              {errors.closing_time && (
                <p className="mt-1 text-xs text-red-600">{errors.closing_time.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6 border-t border-slate-200 pt-6">
          {sliderSettings.map((setting) => (
            <div key={setting.key}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    {setting.label}
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">{setting.description}</p>
                </div>
                <div className="flex items-baseline gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                  <span className="text-xl font-bold text-blue-600">
                    {formValues[setting.key as keyof typeof formValues]}
                  </span>
                  <span className="text-xs font-medium text-slate-600">{setting.unit}</span>
                </div>
              </div>
              
              <input
                type="range"
                {...register(setting.key as any, { valueAsNumber: true })}
                min={setting.min}
                max={setting.max}
                step={1}
                defaultValue={formValues[setting.key as keyof typeof formValues]}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
