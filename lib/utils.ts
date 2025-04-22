export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    return formatter.format(date);
}

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages]
    } if (currentPage >= totalPages - 2) {
        return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages]
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ]


}


// export const uploadImage = async (formData: FormData) => { console.log(formData) }

// const UploadSchema = z.object({
//     image: z
//         .instanceof(File)
//         .refine((file) = file.size > 0, { message: "Image is required" })
//         .refine((file) => file.type.startsWith("image/"), {
//             message: "Only images are allowed"
//         })
//         .refine((file) => file.size < 4000000, {
//             message: "Image must less than 4mb",
//         })

// })

// export const uploadImage = async (prevState: unknown, formData: FormData) => {
//     const validatedFields = UploadSchema.safeParse(
//         Object.fromEntries(formData.entries())
//     )

//     if (!validatedFields.success) {
//         return {
//             error: validatedFields.error.flatten().fieldErrors
//         }
//     }
// }