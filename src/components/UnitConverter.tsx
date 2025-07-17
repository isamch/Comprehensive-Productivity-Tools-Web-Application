import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Thermometer, Ruler, Weight } from 'lucide-react';

interface ConversionUnit {
  name: string;
  symbol: string;
  factor: number;
}

interface ConversionCategory {
  name: string;
  icon: React.ReactNode;
  units: ConversionUnit[];
}

const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const categories: Record<string, ConversionCategory> = {
    length: {
      name: 'Length',
      icon: <Ruler size={20} />,
      units: [
        { name: 'Meter', symbol: 'm', factor: 1 },
        { name: 'Kilometer', symbol: 'km', factor: 1000 },
        { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
        { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
        { name: 'Inch', symbol: 'in', factor: 0.0254 },
        { name: 'Foot', symbol: 'ft', factor: 0.3048 },
        { name: 'Yard', symbol: 'yd', factor: 0.9144 },
        { name: 'Mile', symbol: 'mi', factor: 1609.344 },
      ]
    },
    weight: {
      name: 'Weight',
      icon: <Weight size={20} />,
      units: [
        { name: 'Kilogram', symbol: 'kg', factor: 1 },
        { name: 'Gram', symbol: 'g', factor: 0.001 },
        { name: 'Pound', symbol: 'lb', factor: 0.453592 },
        { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
        { name: 'Ton', symbol: 't', factor: 1000 },
        { name: 'Stone', symbol: 'st', factor: 6.35029 },
      ]
    },
    temperature: {
      name: 'Temperature',
      icon: <Thermometer size={20} />,
      units: [
        { name: 'Celsius', symbol: '°C', factor: 1 },
        { name: 'Fahrenheit', symbol: '°F', factor: 1 },
        { name: 'Kelvin', symbol: 'K', factor: 1 },
      ]
    }
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius = value;
    if (from === 'Fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'Kelvin') {
      celsius = value - 273.15;
    }

    // Convert from Celsius to target
    if (to === 'Fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'Kelvin') {
      return celsius + 273.15;
    }
    return celsius;
  };

  const convertValue = (value: number, fromUnit: string, toUnit: string, category: string): number => {
    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit);
    }

    const categoryData = categories[category];
    const fromFactor = categoryData.units.find(u => u.name === fromUnit)?.factor || 1;
    const toFactor = categoryData.units.find(u => u.name === toUnit)?.factor || 1;
    
    return (value * fromFactor) / toFactor;
  };

  useEffect(() => {
    const categoryData = categories[selectedCategory];
    if (categoryData.units.length > 0) {
      setFromUnit(categoryData.units[0].name);
      setToUnit(categoryData.units[1]?.name || categoryData.units[0].name);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      const numValue = parseFloat(fromValue);
      if (!isNaN(numValue)) {
        const result = convertValue(numValue, fromUnit, toUnit, selectedCategory);
        setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
      }
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit, selectedCategory]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const currentCategory = categories[selectedCategory];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category Selection */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                selectedCategory === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentCategory.name} Converter
          </h2>
          <p className="text-gray-600">Convert between different {currentCategory.name.toLowerCase()} units</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* From Unit */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {currentCategory.units.map(unit => (
                <option key={unit.name} value={unit.name}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <ArrowLeftRight size={24} />
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {currentCategory.units.map(unit => (
                <option key={unit.name} value={unit.name}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={toValue}
              readOnly
              placeholder="Result"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-lg font-semibold text-gray-800"
            />
          </div>
        </div>

        {/* Common Conversions */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCategory.units.slice(0, 6).map((unit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">1 {unit.name}</div>
                <div className="text-lg font-semibold text-gray-800">
                  {unit.symbol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;