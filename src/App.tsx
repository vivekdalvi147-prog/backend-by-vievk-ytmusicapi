/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Backend Generated</h1>
          <p className="text-neutral-600">
            The Python FastAPI backend for <strong>VMusic</strong> has been fully generated and saved to the workspace in the <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm">backend/</code> directory.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm text-left">
          <p className="font-medium mb-1">Next steps:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Click the <strong>Export</strong> icon in the top right</li>
            <li>Select <strong>Export to ZIP</strong> or <strong>Export to GitHub</strong></li>
            <li>Extract the ZIP and navigate to the <code>backend</code> folder</li>
            <li>Follow the instructions in the <code>README.md</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
