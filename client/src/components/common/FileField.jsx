import { forwardRef, useState } from 'react';
import FieldShell from './FieldShell.jsx';
import { compressImage } from '../../utils/compressImage.js';

const FileField = forwardRef(function FileField(
  {
    label,
    required,
    error,
    hint,
    id,
    accept,
    onChange,
    className = '',
    uploadText = 'Tap to upload image',
    changeText = 'Change image',
    processingText = 'Preparing…',
    ...rest
  },
  ref
) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [compressing, setCompressing] = useState(false);

  async function handleChange(event) {
    const input = event.target;
    const original = input.files?.[0];

    if (!original) {
      setFileName('');
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      onChange?.(event);
      return;
    }

    // Shrink the photo now, while the candidate carries on filling the form,
    // rather than making them wait for a multi-megabyte upload at submit.
    setCompressing(true);
    const file = await compressImage(original);
    setCompressing(false);

    // Write the smaller file back onto the input so react-hook-form and the
    // eventual FormData both pick up the compressed version, not the original.
    if (file !== original) {
      try {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
      } catch {
        // Older browser without DataTransfer — fall back to the original file.
      }
    }

    const selected = input.files?.[0] || file;
    setFileName(selected.name);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
    onChange?.(event);
  }

  return (
    <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <label
        htmlFor={id}
        className={`group relative flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed
          bg-slate-50 text-center transition-colors hover:border-gold-400 hover:bg-gold-50/40
          ${error ? 'border-red-300' : 'border-slate-300'} ${className}`}
      >
        {compressing ? (
          <span className="flex flex-col items-center gap-2 text-xs font-medium text-slate-500">
            <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-gold-500" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
            </svg>
            {processingText}
          </span>
        ) : previewUrl ? (
          <>
            <img src={previewUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy-900/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-semibold text-white">{changeText}</span>
            </div>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span className="px-2 text-xs font-medium text-slate-500">{uploadText}</span>
          </>
        )}
        <input
          ref={ref}
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          {...rest}
        />
      </label>
      {fileName && <p className="truncate text-xs text-slate-500">{fileName}</p>}
    </FieldShell>
  );
});

export default FileField;
