"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Minus, Copy, Check, Download } from "lucide-react";
import { BasicSettings } from "../components/BasicSettings";
import { Channels } from "../components/Channels";
import { PriorityBlocks } from "../components/PriorityBlocks";
import { TimePreferences } from "../components/TimePreference";
import { generateSchedule } from "../lib/generate";

const configSchema = z.object({
  opening_time: z.number().min(0).max(1440),
  closing_time: z.number().min(0).max(1440),
  min_duration: z.number().min(1),
  max_duration: z.number().min(1),
  min_score: z.number().min(0),
  max_score: z.number().min(0),
  max_consecutive_genre: z.number().min(1),
  channels_count: z.number().min(1),
  switch_penalty: z.number().min(0),
  termination_penalty: z.number().min(0),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigData extends ConfigFormData {
  time_preferences: any[];
  priority_blocks: any[];
  channels: any[];
}

export default function Page() {
  const [timePreferences, setTimePreferences] = useState<any[]>([]);
  const [priorityBlocks, setPriorityBlocks] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      opening_time: 0,
      closing_time: 630,
      min_duration: 30,
      max_duration: 120,
      min_score: 10,
      max_score: 100,
      max_consecutive_genre: 2,
      channels_count: 24,
      switch_penalty: 5,
      termination_penalty: 10,
    },
  });

  const formValues = watch();

  const getFullConfig = (): ConfigData => ({
    ...formValues,
    time_preferences: timePreferences,
    priority_blocks: priorityBlocks,
    channels: channels,
  });

  const configJson = JSON.stringify(getFullConfig(), null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const fullConfig = getFullConfig();
    // Transform time_preferences and priority_blocks to remove 'id' field
    const transformedConfig = {
      ...fullConfig,
      time_preferences: timePreferences.map(({ id, ...rest }) => rest),
      priority_blocks: priorityBlocks.map(({ id, name, ...rest }) => rest),
    };
    const data = generateSchedule(transformedConfig);
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kosovo_tv_input_generated.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Instance Generator for TV Channel Scheduling Optimization
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Generate instances for TV channel scheduling problem in public spaces
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <BasicSettings
              register={register}
              watch={watch}
              errors={errors}
              timePreferences={timePreferences}
              priorityBlocks={priorityBlocks}
              channels={channels}
              onGenerate={setGeneratedData}
            />
            <TimePreferences
              items={timePreferences}
              onChange={setTimePreferences}
            />
            <PriorityBlocks
              items={priorityBlocks}
              onChange={setPriorityBlocks}
            />
            <Channels items={channels} onChange={setChannels} />
          </div>

          {/* Right Panel - JSON Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
            {/* Configuration Preview Box */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Configuration Preview
                  </h2>
                  <p className="text-xs text-slate-600">
                    Real-time JSON output
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-600 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy JSON
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
                  >
                    <Download size={16} />
                    Download JSON file
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-6">
                <pre className="max-h-[500px] overflow-auto rounded-xl bg-slate-900 p-4 text-sm font-mono text-slate-100 leading-relaxed">
                  <code>{configJson}</code>
                </pre>
              </div>
            </div>

            {/* Generated Data Box */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Generated Data
                  </h2>
                  <p className="text-xs text-slate-600">
                    Parsed configuration structure
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-6">
                <pre className="max-h-[500px] overflow-auto rounded-xl bg-slate-900 p-4 text-sm font-mono text-slate-100 leading-relaxed">
                  <code>{JSON.stringify(generatedData, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
