// components/ai/AISuggestionCard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, X, Wand2 } from 'lucide-react';
import { motion} from 'framer-motion';
import { Badge } from '../ui/badge';
interface AISuggestion {
  styleName: string;
  description: string;
  colors: { upper: string; accent: string; sole: string };
  material: string;
  textSuggestion: string;
  textColor: string;
  reasoning: string;
}

interface AISuggestionCardProps {
  suggestion: AISuggestion | null;
  onApply: () => void;
  onClose: () => void;
}

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onApply,
  onClose,
}) => {
  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
    >
      <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Check className="h-5 w-5" />
              AI Suggestion: {suggestion.styleName}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Description */}
          <p className="text-gray-600 italic">{suggestion.description}</p>

          {/* Color Swatches */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(suggestion.colors).map(([key, color]) => (
              <div key={key} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 shadow-md border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs font-medium text-gray-700 capitalize">{key}</p>
              </div>
            ))}
          </div>

          {/* Material & Text */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Material</p>
              <Badge variant="secondary" className="mt-1 capitalize">{suggestion.material}</Badge>
            </div>
            {suggestion.textSuggestion && (
              <div>
                <p className="text-sm font-medium text-gray-700">Text Suggestion</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: suggestion.textColor }}>
                    {suggestion.textSuggestion}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: suggestion.textColor }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reasoning */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">Why this works:</span> {suggestion.reasoning}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onApply} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              Apply Design
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              <Wand2 className="mr-2 h-4 w-4" />
              New Idea
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};