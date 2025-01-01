"use client";

import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, QrCode, File, Briefcase, Eye, EyeOff, Github, Download, Share2, Check, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import Link from 'next/link';
import { handleDeleteResume } from "@/lib/utils";
import { generateSecureRandomString } from '@/lib/utils';
import QRCode from 'qrcode.react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../icon.png';
import { useRef } from 'react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}


const QRModal = ({ isOpen, onClose, url }: QRModalProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopying(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try copying manually",
      });
    }
  };

  const convertToImage = async (callback: (imageBlob: Blob) => void) => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      // First, load the logo
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = typeof logo === 'string' ? logo : logo.src; // Ensure src is a string
      });

      // Create canvas and set dimensions
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Convert SVG to string and create URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Load SVG into image
      const img = new Image();
      img.onload = () => {
        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code
        ctx.drawImage(img, 0, 0);
        
        // Draw logo in center
        const logoSize = 48;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

        // Convert to blob and execute callback
        canvas.toBlob((blob) => {
          if (blob) {
            callback(blob);
          }
          URL.revokeObjectURL(svgUrl);
        }, 'image/png');
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error converting to image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the QR code image.",
      });
    }
  };

  const downloadQRCode = () => {
    convertToImage((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const shareQRCode = async () => {
    try {
      if (navigator.share) {
        convertToImage(async (blob) => {
          try {
            // Create a new File object using the global Window.File constructor
            const file = new window.File([blob], 'resume-qr-code.png', { type: 'image/png' });
            await navigator.share({
              title: 'Resume QR Code',
              text: 'Check out my resume!',
              files: [file],
            });
            toast({
              title: "Shared successfully!",
              description: "Your QR code has been shared.",
            });
          } catch (error) {
            console.error('Share failed:', error);
            toast({
              variant: "destructive",
              title: "Share failed",
              description: "Unable to share the QR code.",
            });
          }
        });
      } else {
        // Fallback to download if share is not supported
        downloadQRCode();
        toast({
          title: "Share not supported",
          description: "Downloaded the QR code instead.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        variant: "destructive",
        title: "Share failed",
        description: "Unable to share the QR code.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-100">
        <DialogHeader className="bg-slate-100">
          <DialogTitle>Resume QR Code</DialogTitle>
          <DialogDescription>
            Save and Share a QR code for your resume
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 bg-slate-100 p-4">
          <div 
            ref={qrRef}
            className="relative w-64 h-64 p-4 rounded-lg shadow-sm border bg-slate-300 border-gray-100"
          >
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              includeMargin
              imageSettings={{
                src: typeof logo === 'string' ? logo : logo.src, // Ensure src is a string
                x: undefined,
                y: undefined,
                height: 48,
                width: 48,
                excavate: true,
              }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
              {copying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copying ? "Copied!" : "Copy Link"}
            </Button>
            <Button onClick={downloadQRCode} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={shareQRCode} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [deletionCode, setDeletionCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
        });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const randomStr = Math.random().toString(36).substring(2, 7);
      const hash = `${randomStr}`;
      const newDeletionCode = generateSecureRandomString(16);
      setResumeId(hash);
      setDeletionCode(newDeletionCode);
      
      const storageRef = ref(storage, `resumes/${hash}.pdf`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'resumes'), {
        hash,
        url,
        fileName: file.name,
        createdAt: new Date().toISOString(),
        fileSize: file.size,
        isDiscoverable,
        deletionCode: newDeletionCode,
      });

      const shareableLink = `${window.location.origin}/${hash}`;
      setGeneratedLink(shareableLink);
      
      toast({
        title: "Upload successful!",
        description: "Your resume has been uploaded and is ready to share.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (resumeId && deletionCode) {
      const userProvidedCode = prompt("Please enter your deletion code to confirm:");
      if (!userProvidedCode) return;
  
      try {
        await handleDeleteResume(resumeId, userProvidedCode);
        setGeneratedLink(null);
        setResumeId(null);
        setFile(null);
        setDeletionCode(null);
        
        toast({
          title: "Success",
          description: "Your resume has been deleted successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete the resume. Please try again.",
        });
      }
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "The shareable link has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please copy the link manually.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      {/* Social Links */}
      <div className="absolute top-4 left-4 flex gap-4">
        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
            <img className='w-7' src='https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png' />

          </Button>
        </Link>
        <Link href="https://discord.gg/KXY2cRsR4m" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
            <img className='w-7' src='https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg' />
          </Button>
        </Link>
      </div>

      {/* Search Button */}
      <div className="absolute top-4 right-4">
        <Link href="/search">
          <button className="bg-blue-200 text-black py-2 px-4 rounded-md hover:bg-blue-300 transition">
            Search Resumes
          </button>
        </Link>
      </div>

      {/* QR Code Modal */}
      {generatedLink && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          url={generatedLink}
        />
      )}

      {/* Main Card */}
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-500" />
            </div>
            <div className='text-gray-600 font-bold ml-2'>Hireme.pls</div>
          </div>
          <CardTitle className="text-xl font-semibold text-center text-slate-800">
            Share Your Resume
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Upload it and get a persuasive link and QR code instandly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 border border-gray-200 p-2 rounded-lg bg-gray-100">
            <Label htmlFor="discoverable" className="text-sm font-bold leading-none text-gray-600">
              Searchable
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="discoverable"
                checked={isDiscoverable}
                onCheckedChange={setIsDiscoverable}
                className="[&>span]:data-[state=checked]:bg-blue-500 
                [&>span]:data-[state=unchecked]:bg-gray-400 
                data-[state=unchecked]:bg-white data-[state=checked]:bg-white
                border border-gray-200"
              />
              {isDiscoverable ? (
                <Eye className="h-4 w-4 text-slate-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-slate-500" />
              )}
            </div>
          </div>

          <div className="space-y-3">
            {file ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-slate-700"
                    onClick={() => setFile(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-slate-700">
                  Select your resume
                </Label>
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer px-2 p-1 w-full rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 text-slate-600"
                />
              </div>
            )}
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Resume</span>
              </div>
            )}
          </Button>

          {generatedLink && deletionCode && (
            // <Alert className="border-2 border-green-300 rounded-xl p-4">
            <Alert className="border-2 border-green-300 bg-slate-50 p-4">
              <AlertDescription className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-600">Your resume is ready to share!</p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-grey-200">
                  <span className="text-sm truncate flex-1">
                    <Link href={generatedLink} target='_blank' rel='noopener noreferrer' className="inline-flex items-center gap-2 transition-colors">
                      <div className='text-blue-500'>{generatedLink}</div>
                    </Link>
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="shrink-0 border-none rounded-xl bg-gray-400 text-white hover:text-white hover:bg-gray-300 flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQRModal(true)}
                      className="shrink-0 border-none rounded-xl bg-gray-400 text-white hover:text-white hover:bg-gray-300"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium">Deletion Code</p>
                  <p className="text-sm text-yellow-700 font-mono mt-1">{deletionCode}</p>
                  <p className="text-xs text-yellow-600 mt-1">Save this code - you will need it to delete your resume later.</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="mt-3 border border-red-600 text-red-600 hover:bg-slate-100"
                >
                  Delete Resume
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;