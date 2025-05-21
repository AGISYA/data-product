export async function uploadImageToS3(file: File): Promise<string> {
    const res = await fetch("/api/upload");
    const { uploadUrl, publicUrl } = await res.json();

    await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    return publicUrl; // Kirim ini ke backend saat submit form
}
