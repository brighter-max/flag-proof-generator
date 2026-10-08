'use client';

import React, { useState } from 'react';
import { runPreflight, PreflightResult } from '@/lib/preflight';
import ProofCanvas from '@/components/ProofCanvas';
import { CheckCircle2, AlertTriangle, FileUp, RefreshCw } from 'lucide-react';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preflight, setPreflight] = useState<PreflightResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [widthInches, setWidthInches] = useState<number>(60);
  const [heightInches, setHeightInches] = useState<number>(36);
  const [hasHeading, setHasHeading] = useState<boolean>(true);
  const [grommetCount, setGrommetCount] = useState<number>(2);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setPreflight(runPreflight(uploadedFile));
    setPreviewUrl(URL.createObjectURL(uploadedFile));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Flag Preflight & Digital Proof Generator</h1>
          <p className="text-sm text-slate-500">Upload artwork, check formats, apply finishing, and generate proofs.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-lg border-b border-slate-100 pb-2">1. Upload Artwork</h2>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 relative cursor-pointer">
              <input
                type="file"
                accept=".svg,.pdf,.ai,.eps,.jpg,.jpeg,.png,.tiff,.tif"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileUp className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Drop file here or click to upload</p>
              <p className="text-xs text-slate-400 mt-1">Vector: SVG, PDF, AI, EPS | Raster: JPG, PNG, TIFF</p>
            </div>

            {preflight && (
              <div className={`p-4 rounded-lg flex items-start gap-3 border ${
                preflight.isVector ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                {preflight.isVector ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
                <div className="text-xs space-y-1">
                  <p className="font-semibold">Format: {preflight.format} — {preflight.isVector ? 'Vector Verified' : 'Raster Warning'}</p>
                  {preflight.warning && <p>{preflight.warning}</p>}
                </div>
              </div>
            )}

            <h2 className="font-semibold text-lg border-b border-slate-100 pb-2 pt-2">2. Finishing Specs</h2>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Width (Inches)</label>
                  <input type="number" value={widthInches} onChange={(e) => setWidthInches(Number(e.target.value))} className="w-full border border-slate-300 rounded px-3 py-1.5" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Height (Inches)</label>
                  <input type="number" value={heightInches} onChange={(e) => setHeightInches(Number(e.target.value))} className="w-full border border-slate-300 rounded px-3 py-1.5" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="heading" checked={hasHeading} onChange={(e) => setHasHeading(e.target.checked)} className="rounded text-blue-600" />
                <label htmlFor="heading" className="text-slate-700 font-medium">Left Hoist Heading Band</label>
              </div>

              {hasHeading && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Grommet Count (Left Side)</label>
                  <input type="number" min="1" max="10" value={grommetCount} onChange={(e) => setGrommetCount(Number(e.target.value))} className="w-full border border-slate-300 rounded px-3 py-1.5" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-full border-b border-slate-100 pb-3 mb-6 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-slate-900">3. Proof Representation</h2>
              {file && <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded">File: {file.name}</span>}
            </div>

            {previewUrl ? (
              <ProofCanvas imageSrc={previewUrl} widthInches={widthInches} heightInches={heightInches} hasHeading={hasHeading} grommetCount={grommetCount} />
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <RefreshCw className="mx-auto h-8 w-8 text-slate-300" />
                <p className="text-sm">Upload a file on the left to render proof.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
