import React from 'react';
import { AudioEntry } from '../types';
import { Download, Play, RefreshCw, Trash2 } from 'lucide-react';

interface HistoryItemProps {
  item: AudioEntry;
  onDelete: (id: string) => void;
  onPlay: (url: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete, onPlay }) => {
  const date = new Date(item.timestamp).toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 hover:border-gray-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-gray-300 text-sm font-medium line-clamp-2 max-w-[200px] sm:max-w-md">
            "{item.text}"
          </p>
          <div className="flex gap-2 mt-1 text-xs text-gray-500">
            <span>{date}</span>
            <span className="text-gray-600">•</span>
            <span>{item.settings.voice}</span>
            <span className="text-gray-600">•</span>
            <span>{item.settings.style}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onPlay(item.blobUrl)}
            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition"
            title="Reproducir"
          >
            <Play size={18} />
          </button>
          <a 
            href={item.blobUrl} 
            download={`audio-ia-${item.id}.wav`}
            className="p-2 text-green-400 hover:bg-green-500/10 rounded-full transition"
            title="Descargar"
          >
            <Download size={18} />
          </a>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
