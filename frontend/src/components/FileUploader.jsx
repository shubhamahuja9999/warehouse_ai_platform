import { useDropzone } from 'react-dropzone'
import { UploadCloud, CheckCircle } from 'lucide-react'

export default function FileUploader({ onFile, label, icon: Icon, accepted = true, fileName }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: (files) => files[0] && onFile(files[0]),
  })

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed p-6 cursor-pointer group glass-card hover:glow
        ${isDragActive
          ? '!border-indigo-400 bg-indigo-500/10 scale-[1.02]'
          : fileName
            ? '!border-emerald-500/50'
            : '!border-indigo-500/30 hover:!border-indigo-400'
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
          ${fileName ? 'bg-emerald-500/20' : 'bg-indigo-500/10 group-hover:bg-indigo-500/20'}`}>
          {fileName
            ? <CheckCircle size={22} className="text-emerald-400" />
            : <UploadCloud size={22} className="text-indigo-400" />
          }
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          {fileName
            ? <p className="text-xs text-emerald-400 mt-1 font-medium">{fileName}</p>
            : <p className="text-xs text-slate-500 mt-1">Drop CSV here or click to browse</p>
          }
        </div>
      </div>
    </div>
  )
}
