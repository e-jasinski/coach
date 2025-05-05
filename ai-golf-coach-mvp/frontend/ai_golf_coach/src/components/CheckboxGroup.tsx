import React from 'react';
import { Profile } from '../types/profile';

interface CheckboxGroupProps {
  label: string;
  field: keyof Profile;
  options: string[];
  selected: string[];
  onChange: (field: keyof Profile, value: string) => void;
}

const CheckboxGroup = ({ label, field, options, selected, onChange }: CheckboxGroupProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="space-y-2">
      {options.map(option => (
        <div key={option} className="flex items-center">
          <input
            id={`${field}-${option}`}
            name={`${field}-${option}`}
            type="checkbox"
            value={option}
            checked={selected.includes(option)}
            onChange={() => onChange(field, option)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor={`${field}-${option}`} className="ml-2 block text-sm text-gray-900">
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default CheckboxGroup; 