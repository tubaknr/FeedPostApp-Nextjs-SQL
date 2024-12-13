"use server";
import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// SERVER FORM ACTION
export async function createPost(prevState, formData) { 
    //formData buraya otomatik atılır; user ın girdiklerini verir.
    // useFormState kullanınca prevState geldi action'a İLK PARAMETER olarak.
    // "use server"; //bu satır olmazsa->CLIENT SIDE. NORMAL FORM ACTION olurdu. 
    // Bu satır ile birlikte: SERVER SIDE - SERVER ACTION.
    // SERVER ACTION --> MUST BE ASYNC FCN.
    // ONLY EXECUTE ON THE SERVER. DOES NOT WORK ON CLIENT SIDE.

    const title = formData.get("title"); // form un içindeki name="title" sayesinde alındı
    const image = formData.get("image"); // form un içindeki name="image" sayesinde alındı
    const content = formData.get("content"); // form un içindeki name="content" sayesinde alındı

    // Security
    let errors = [];
    if(!title || title.trim().length === 0){
        errors.push("Title is required.");
    }
    if(!content || content.trim().length === 0){
        errors.push("Content is required.");
    }
    if(!image || image.size === 0){
        errors.push("Image is required.");
    }

    // eğer kullanıcı düzgün doldurmadıysa hata döndür
    if(errors.length > 0){ 
        return { errors };
    }

    // ERROR YOKSA DEVAM ET:

    let imageUrl;
    try{
        imageUrl = await uploadImage(image);
    }catch(error){
        console.log(error);
    }

    // Send data to backend
    storePost({
        imageUrl: imageUrl,
        title,
        content,
        userId: 1 //for this demo, user 1 is the always post creator.
    });
    redirect('/feed');
};



export async function togglePostLikeStatus(postId) {
    await updatePostLikeStatus(postId, 2);
    
    // update the like heart automatically
    revalidatePath("/feed");
}