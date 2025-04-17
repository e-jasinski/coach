import { TextareaHTMLAttributes } from 'react';

export default function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={
        'w-full rounded-md border border-gray-300 p-3 text-sm ' +
        'focus:border-indigo-500 focus:outline-none ' +
        (props.className || '')
      }
    />
  );
}
