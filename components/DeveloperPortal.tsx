
import { BackgroundScene } from '../types';
import { Button } from './Button';
import { ConfirmationModal } from './ConfirmationModal';
import { Lock, Image as ImageIcon, ArrowLeft, Plus, Trash2, Database, RefreshCcw, Settings2 } from 'lucide-react';
import React, { useState } from 'react';

interface DeveloperPortalProps {
  onBack: () => void;
  onUpdateScenes: (scenes: BackgroundScene[]) => void;
  currentScenes: BackgroundScene[];
}

export const DeveloperPortal: React.FC<DeveloperPortalProps> = ({ 
  onBack, 
  onUpdateScenes, 
  currentScenes
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // Background Management State
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'HKBU70') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode. Access denied.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      
      setIsProcessingFile(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920; 
          const scale = Math.min(1, MAX_WIDTH / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            setPreview(compressed);
          }
          setIsProcessingFile(false);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && preview) {
      const newScene: BackgroundScene = {
        id: `custom-${Date.now()}`,
        name,
        description: 'Custom developer background',
        url: preview,
        prompt: prompt || undefined
      };

      const newScenesList = [...currentScenes, newScene];

      onUpdateScenes(newScenesList);
      setName('');
      setPrompt('');
      setPreview(null);
      alert('Background saved!');
    }
  };

  const handleRemoveScene = (id: string) => {
    setSceneToDelete(id);
  };

  const confirmDelete = () => {
    if (sceneToDelete) {
      const newScenesList = currentScenes.filter(s => s.id !== sceneToDelete);
      onUpdateScenes(newScenesList);
      setSceneToDelete(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-hkbu-cream rounded-[3rem] border-4 border-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-in">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-hkbu-gold/10 text-hkbu-gold shadow-inner">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-[1.2rem] md:text-[1.5rem] font-poppins font-bold text-[#10223d]">Developer Access</h2>
          <p className="text-hkbu-navy/50 text-center text-[14px] font-medium">
            Enter the secure passcode to manage the platform.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Passcode"
              className="w-full px-6 py-4 bg-white/50 border-2 border-hkbu-gold/20 rounded-2xl text-hkbu-navy focus:ring-4 focus:ring-hkbu-gold/20 focus:border-hkbu-gold outline-none transition-all placeholder:text-hkbu-navy/20"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-[14px] text-center font-bold animate-shake">{error}</p>}
          <div className="flex gap-4">
             <button type="button" onClick={onBack} className="flex-1 px-6 py-4 bg-white/50 hover:bg-white text-hkbu-navy/60 rounded-2xl font-bold transition-all border border-hkbu-navy/5 text-[14px]">Back</button>
             <Button type="submit" className="flex-1 py-4 rounded-2xl shadow-xl">Unlock</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#215097] transition-colors font-medium text-[14px]">
          <ArrowLeft className="w-5 h-5" /> Back to App
        </button>
        <div className="text-right">
          <h2 className="text-[1.2rem] md:text-[1.5rem] font-poppins font-bold text-[#10223d]">Developer Dashboard</h2>
          <p className="text-[14px] text-gray-400">HKBU 70th Anniversary Admin Console</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
            <h3 className="text-[1.2rem] md:text-[1.5rem] font-poppins font-bold text-[#10223d] mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-[#10223d]" />
              Add New Scene
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-[14px] font-medium text-gray-500">Scene Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Campus Courtyard"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#215097] outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[14px] font-medium text-gray-500">AI Generation Prompt (Optional)</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Match the lighting, apply vintage filter, etc."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#215097] outline-none h-24 resize-none"
                        />
                        <p className="text-[11px] text-gray-400 italic">Specific instructions for the AI to follow when blending people into this background.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[14px] font-medium text-gray-500">Scene Image (4:3 Recommended)</label>
                        <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden group">
                            {preview ? (
                                <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-medium text-[14px]">Click to change</p>
                                </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                {isProcessingFile ? <RefreshCcw className="w-10 h-10 mb-2 animate-spin" /> : <ImageIcon className="w-10 h-10 mb-2" />}
                                <p className="text-[14px]">{isProcessingFile ? 'Processing...' : 'Upload Image'}</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isProcessingFile} />
                        </div>
                    </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={!preview || !name || isProcessingFile} variant="primary">
                    Save to Booth
                </Button>
            </form>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
            <h3 className="text-[1.2rem] md:text-[1.5rem] font-poppins font-bold text-[#10223d] mb-6 flex items-center gap-2"><Database className="w-5 h-5" /> Active Scenes</h3>
            <div className="space-y-4">
                {currentScenes.map((scene) => (
                    <div key={scene.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200 transition-colors hover:bg-white group">
                        <img src={scene.url} alt={scene.name} className="h-16 w-16 object-cover rounded-lg bg-gray-200 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 truncate text-sm">{scene.name}</h4>
                            <div className="mt-1 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#215097]/10 text-[#215097] font-bold uppercase w-fit">Active</div>
                        </div>
                        <button 
                          onClick={() => handleRemoveScene(scene.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove Scene"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={!!sceneToDelete}
        message="Are you sure you want to remove this background scene?"
        onConfirm={confirmDelete}
        onCancel={() => setSceneToDelete(null)}
      />
    </div>
  );
};
