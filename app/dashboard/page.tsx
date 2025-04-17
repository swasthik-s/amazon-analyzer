"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnalysisModal from "@/components/AnalysisModal";

type Listing = {
  asin: string;
  title: string;
  image: string;
  analysis: string;
};

export default function DashboardPage() {
  const [asin, setAsin] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!asin) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/analyze/${asin}`);
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      // Create a listing with the returned data
      const newListing: Listing = {
        asin,
        title: `Product ${asin}`, // Replace with actual title if available
        image: `https://m.media-amazon.com/images/I/${asin}.jpg`,
        analysis: Array.isArray(data.result)
          ? data.result.join(", ")
          : data.result,
      };

      setListings((prev) => [...prev, newListing]);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAsin("");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Amazon Listing Analyzer</h1>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter ASIN"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-900 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">ASIN</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.asin} className="border-t">
                <td className="px-4 py-2">{listing.asin}</td>
                <td className="px-4 py-2">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                </td>
                <td className="px-4 py-2">{listing.title}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedListing(listing)}
                  >
                    View Analysis
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnalysisModal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        analysisData={selectedListing?.analysis || ""}
        asin={selectedListing?.asin || ""}
      />
    </div>
  );
}
