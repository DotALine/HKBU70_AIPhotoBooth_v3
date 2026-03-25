
import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[1.2rem] md:text-[1.5rem] font-bold text-[#10223d]">Terms and Conditions</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto font-poppins text-hkbu-navy/80 space-y-4">
          <p className="font-bold">HKBU 70th Anniversary AI Photo Booth Terms of Use</p>
          <p>By using this AI Photo Booth, you agree to the following terms and conditions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Photo Upload:</strong> You consent to uploading photos containing human subjects for AI processing. You confirm that you have the right to use and process the images you upload.</li>
            <li><strong>AI Processing:</strong> The AI will automatically remove the background and any existing watermarks from your uploaded photo to create a composite scene.</li>
            <li><strong>Data Privacy:</strong> Your images are processed in real-time. We do not store your original or generated images permanently on our servers after your session ends.</li>
            <li><strong>Watermarking:</strong> A transparent commemorative watermark will be added to the final generated image.</li>
            <li><strong>Usage Rights:</strong> The generated images are for personal, non-commercial use to celebrate the HKBU 70th Anniversary.</li>
            <li><strong>Liability:</strong> HKBU is not responsible for any misuse of the generated images or any issues arising from the content of uploaded photos.</li>
          </ul>
          <p className="pt-4">Please ensure you have read and understood these terms before proceeding.</p>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} variant="primary" className="px-8 rounded-full">Close</Button>
        </div>
      </div>
    </div>
  );
};
