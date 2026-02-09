"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const uploadImage = async () => {
    if (!file) return alert("Image select karo");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dz8neber9/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setImageUrl(data.secure_url);
      alert("Upload successful!");
    } else {
      console.error(data);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={uploadImage}>Upload</button>

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} width={200} />
        </div>
      )}
    </div>
  );
}
