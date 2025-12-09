"use client";

import { useState } from "react";

interface PredictionResult {
  label: string;
  confidence: number;
  image: string;
}

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          Pet Classifier
        </h1>
        <p className="text-gray-500 mb-8">
          Upload a photo to detect if it's a Cat or Dog
        </p>

        <div className="relative group">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              loading
                ? "border-gray-300 bg-gray-50"
                : "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 group-hover:scale-[1.02]"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-3 text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold text-blue-600">
                      Click to upload
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={upload}
              accept="image/*"
              disabled={loading}
            />
          </label>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-center animate-fade-in">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 pt-6 border-t border-gray-100 animate-slide-up">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Result
            </h3>
            <div className="relative rounded-lg overflow-hidden shadow-lg mb-4 ring-4 ring-offset-2 ring-indigo-50">
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Uploaded"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-2xl font-bold capitalize flex items-center justify-center gap-2">
                  {result.label}
                  <span className="text-sm font-normal opacity-90 px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              We are <strong>{(result.confidence * 100).toFixed(1)}%</strong>{" "}
              confident that this is a {result.label}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
