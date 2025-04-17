import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // ShadCN Dialog components
import { useState, useEffect } from "react";
import Image from "next/image";

type AnalysisModalProps = {
  asin: string;
  isOpen: boolean;
  analysisData: string;
  onClose: () => void;
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  asin,
  isOpen,
  onClose,
}) => {
  type AnalysisData = {
    summary?: string;
    suggestions?: string[];
    result?: string;
  };

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState<string | null>(null);

  useEffect(() => {
    if (asin && isOpen) {
      const fetchAnalysis = async () => {
        try {
          const res = await fetch(`/api/analyze/${asin}`);
          const data = await res.json();

          if (data.error) {
            setAnalysis({ result: "Error: Could not fetch analysis." });
            setProductTitle(null);
            setProductImage(null);
          } else {
            setAnalysis(data.result); // Assuming this will be the detailed analysis from the API
            setProductTitle(data.productTitle); // Assuming the API returns product title
            setProductImage(
              `https://m.media-amazon.com/images/I/${asin}._SL1500_.jpg`
            ); // Updated image URL format
          }
        } catch {
          setAnalysis({ result: "Error: Something went wrong." });
          setProductTitle(null);
          setProductImage(null);
        }
      };

      fetchAnalysis();
    }
  }, [asin, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        <DialogTitle className="text-2xl font-semibold text-center mb-4">
          Detailed Analysis for ASIN: {asin}
        </DialogTitle>

        {productImage && (
          <div className="flex justify-center mb-6">
            <Image
              src={productImage}
              alt={productTitle || "Product Image"}
              width={150}
              height={150}
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Product Title</h3>
          <p className="text-lg text-gray-800 mb-4">
            {productTitle || "Loading product title..."}
          </p>

          <h3 className="text-xl font-semibold text-gray-700">
            Analysis Summary
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner text-gray-800">
            {/* Dynamic Analysis Content */}
            <p>{analysis?.summary || "Loading analysis..."}</p>
          </div>

          {/* Dynamic Suggestions to Improve the Listing */}
          {analysis?.suggestions && (
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold">
                Suggestions to Improve the Listing
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {analysis.suggestions.map((suggestion: string) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
