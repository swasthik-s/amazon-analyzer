"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ASINAnalyzer() {
  const [asin, setAsin] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!asin) return;

    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch(`/api/analyze/${asin}`);
      const data = await res.json();
      if (data.error) {
        setAnalysis(data.error);
      } else {
        setAnalysis(data.result);
      }
    } catch {
      setAnalysis("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Amazon ASIN Analyzer</h2>

      <Input
        value={asin}
        onChange={(e) => setAsin(e.target.value)}
        placeholder="Enter ASIN (e.g. B07XJ8C8F5)"
      />

      <Button onClick={handleAnalyze} disabled={loading || !asin} type="button">
        {loading ? "Analyzing..." : "Analyze"}
      </Button>

      {analysis && <Textarea readOnly className="mt-4 h-64" value={analysis} />}
    </div>
  );
}
