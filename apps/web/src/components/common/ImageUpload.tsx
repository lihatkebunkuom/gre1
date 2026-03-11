import React, { useRef, useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  accept?: string;
  placeholder?: string;
  description?: string;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  className, 
  accept = "image/*", 
  placeholder = "Klik untuk upload foto", 
  description = "PNG, JPG atau WEBP (Maksimal 2MB)" 
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const isPDF = preview?.startsWith("data:application/pdf") || preview?.endsWith(".pdf");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
        
        setPreview(base64String);
        onChange(base64String);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {preview ? (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted shadow-inner group flex items-center justify-center">
          {isPDF ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-16 w-16 text-primary opacity-50" />
              <span className="text-xs font-medium text-muted-foreground uppercase">Dokumen PDF Terpilih</span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                // If it's not a valid image, don't show broken image icon
                if (!isPDF) setPreview(undefined);
              }}
            />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Ganti File
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center min-h-[160px] w-full rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all duration-200 p-6"
        >
          <div className="bg-background p-4 rounded-full shadow-sm mb-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground text-center">
            {placeholder}
          </p>
          <p className="text-xs text-muted-foreground/75 mt-1 text-center">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
