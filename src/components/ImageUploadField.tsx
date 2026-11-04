"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { AlertCircle, Check, ImagePlus, LoaderCircle, Upload } from "lucide-react";

type ImageFolder = "products" | "projects" | "news";

interface ImageUploadFieldProps {
  folder: ImageFolder;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export function ImageUploadField({
  folder,
  value,
  onChange,
  className = "",
  required = false
}: ImageUploadFieldProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploaded, setUploaded] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setErrorMessage("");
    setUploaded(false);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Choose a JPEG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Image must be 10 MB or smaller.");
      return;
    }

    setProgress(0);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "image";
      const imageRef = ref(storage, `site-images/${folder}/${crypto.randomUUID()}-${safeName}`);
      const task = uploadBytesResumable(imageRef, file, { contentType: file.type });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          snapshot => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
          reject,
          resolve
        );
      });

      onChange(await getDownloadURL(task.snapshot.ref));
      setUploaded(true);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === "storage/unauthorized") {
        setErrorMessage("Firebase Storage rejected this upload. Deploy the Storage rules and sign in with an authorized admin account.");
      } else if (code === "storage/quota-exceeded") {
        setErrorMessage("Firebase Storage quota has been exceeded.");
      } else {
        setErrorMessage("Image upload failed. Check your connection and try again.");
      }
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={`image-source-${folder}`} className="text-xs font-bold text-slate-700">
        Image Source Path
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          id={`image-source-${folder}`}
          type="text"
          required={required}
          value={value}
          onChange={event => {
            onChange(event.target.value);
            setUploaded(false);
          }}
          placeholder="/steel.jpeg or paste an image URL"
          className="min-w-0 w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-xs focus:border-sky-500 focus:outline-none sm:text-sm"
        />
        <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-100 ${progress !== null ? "pointer-events-none opacity-60" : ""}`}>
          {progress !== null ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
          <span>{progress !== null ? `Uploading ${progress}%` : "Upload image"}</span>
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={progress !== null}
            className="sr-only"
          />
        </label>
      </div>

      {errorMessage && (
        <p role="alert" className="flex items-start gap-1.5 text-[11px] text-red-600">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {errorMessage}
        </p>
      )}
      {uploaded && (
        <p role="status" className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
          <Check size={14} /> Uploaded to Firebase Storage. Save this record to publish the image.
        </p>
      )}
      {progress === null && value && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-slate-200">
            <Image src={value} alt="Selected image preview" fill unoptimized sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <ImagePlus size={14} /> Image preview
            </p>
            <p className="mt-1 truncate font-mono text-[10px] text-slate-400">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}