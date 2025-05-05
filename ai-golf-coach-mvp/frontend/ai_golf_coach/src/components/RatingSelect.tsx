import React from 'react';

interface RatingSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const RatingSelect = ({ label, name, value, onChange, ...props }: RatingSelectProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} (1=Low, 5=High)
    </label>
    <select
      id={name}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
    >
      <option value="">Not Rated</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  </div>
);

export default RatingSelect; 