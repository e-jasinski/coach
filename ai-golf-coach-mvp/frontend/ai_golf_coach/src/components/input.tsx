import { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-md border border-gray-300 px-3 py-2 ' +
        'focus:border-indigo-500 focus:outline-none focus:ring-0 ' +
        (props.className || '')
      }
    />
  );
}
