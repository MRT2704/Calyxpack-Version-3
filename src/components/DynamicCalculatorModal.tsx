/**
 * DynamicCalculatorModal.tsx
 * A modal that renders a dynamic form based on the selected packaging tool
 * from PACKAGING_TOOLS and performs the calculation client‑side.
 */
import React, { useState, useEffect } from 'react';
import { sanitizeInput } from '../utils/sanitize';
import { PACKAGING_TOOLS, PackagingTool, ToolInput } from '../utils/packagingCalculators';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialToolId?: string;
}

export default function DynamicCalculatorModal({ isOpen, onClose, initialToolId }: Props) {
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<null | ReturnType<PackagingTool['calculate']>>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedToolId('');
      setInputs({});
      setResult(null);
    } else if (initialToolId) {
      setSelectedToolId(initialToolId);
    }
  }, [isOpen, initialToolId]);

  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toolId = e.target.value;
    setSelectedToolId(toolId);
    setInputs({});
    setResult(null);
  };

  const handleInputChange = (name: string, value: any) => {
    const safeValue = typeof value === 'string' ? sanitizeInput(value) : value;
    setInputs(prev => ({ ...prev, [name]: safeValue }));
  };

  const runCalculation = () => {
    if (!selectedToolId) return;
    const tool = PACKAGING_TOOLS[selectedToolId] as PackagingTool;
    const calcResult = tool.calculate(inputs);
    setResult(calcResult);
  };

  const renderInput = (input: ToolInput) => {
    const { name, label, type, defaultValue, min, max, step, options, helpText } = input;
    const value = inputs[name] ?? defaultValue;
    const commonProps = {
      id: name,
      name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleInputChange(name, type === 'number' ? parseFloat(e.target.value) : e.target.value),
      className: 'w-full text-xs p-1.5 border border-[#D9DDD5] rounded bg-white font-mono',
    } as any;

    if (type === 'select' && options) {
      return (
        <select {...commonProps}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // number or text input
    return (
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        placeholder={helpText}
        {...commonProps}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-full w-full sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-brand-graphite hover:text-brand-deep transition"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold font-display text-brand-deep mb-4">
          Packaging Solver
        </h2>
        {/* Tool selector */}
        <div className="mb-4">
          <label className="block text-xs font-mono text-brand-graphite/70 mb-1">
            Choose Solver
          </label>
          <select
            value={selectedToolId}
            onChange={handleToolChange}
            className="w-full text-xs p-1.5 border border-[#D9DDD5] rounded bg-white font-mono"
          >
            <option value="" disabled>
              -- Select a tool --
            </option>
            {Object.entries(PACKAGING_TOOLS).map(([key, tool]) => (
              <option key={key} value={key}>
                {tool.title}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic inputs */}
        {selectedToolId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {PACKAGING_TOOLS[selectedToolId].inputs.map(inp => (
                <div key={inp.name}>
                  <label className="block text-xs font-mono text-brand-graphite/70 mb-1">
                    {inp.label}
                  </label>
                  {renderInput(inp)}
                </div>
              ))}
            </div>
            <button
              onClick={runCalculation}
              className="w-full py-2 bg-[#7BA05B] text-white rounded text-xs font-bold hover:bg-opacity-95 transition"
            >
              Calculate
            </button>
          </>
        )}

        {/* Result display */}
        {result && (
          <div className="mt-6 p-4 border border-[#D9DDD5] rounded bg-[#F0F2ED]">
            <h3 className="text-sm font-bold text-brand-deep mb-2">Result</h3>
            <p className="text-xs font-mono">
              <strong>Value:</strong> {result.value} {result.unit}
            </p>
            <p className="text-xs mt-1">{result.formula}</p>
            <p className="text-xs mt-1 whitespace-pre-wrap">{result.working}</p>
            <p className="text-xs mt-1 italic text-brand-graphite/60">
              {result.references}
            </p>
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-4 text-center text-xs text-brand-graphite/50">
          <CheckCircle className="inline w-3 h-3 mr-1" />
          All calculations are performed client‑side; no data leaves your browser.
        </div>
      </div>
    </div>
  );
}
