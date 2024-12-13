import { createPost } from "@/actions/posts";
import PostForm from "@/components/post-form";


export default function NewPostPage(){

    // ACTIONS/ A TAŞINDI
    // // SERVER FORM ACTION
    // async function createPost(prevState, formData) { 
    //     //formData buraya otomatik atılır; user ın girdiklerini verir.
    //     // useFormState kullanınca prevState geldi action'a İLK PARAMETER olarak.
    //     "use server"; //bu satır olmazsa->CLIENT SIDE. NORMAL FORM ACTION olurdu. Bu satır ile birlikte: SERVER SIDE - SERVER ACTION.
    //     // SERVER ACTION --> MUST BE ASYNC FCN.
    //     // ONLY EXECUTE ON THE SERVER. DOES NOT WORK ON CLIENT SIDE.

    //     const title = formData.get("title"); // form un içindeki name="title" sayesinde alındı
    //     const image = formData.get("image"); // form un içindeki name="image" sayesinde alındı
    //     const content = formData.get("content"); // form un içindeki name="content" sayesinde alındı

    //     let errors = [];
    //     if(!title || title.trim().length === 0){
    //         errors.push("Title is required.");
    //     }
    //     if(!content || content.trim().length === 0){
    //         errors.push("Content is required.");
    //     }
    //     if(!image || image.size === 0){
    //         errors.push("Image is required.");
    //     }

    //     // eğer kullanıcı düzgün doldurmadıysa hata döndür
    //     if(errors.length > 0){ 
    //         return { errors };
    //     }

    //     // ERROR YOKSA DEVAM ET:
    //     // Send data to backend
    //     storePosts({
    //         imageUrl: '',
    //         title,
    //         content,
    //         userId: 1 //for this demo, user 1 is the always post creator.
    //     });
    //     redirect('/feed');
    // };

    // BURASI HALA SERVER-SIDE KALSIN DİYE HOOK KULLANIMI GEREKTİREN KISIMLAR POSTFORM'A TAŞINDI.
    return(

        <PostForm action={createPost} />
    );
}

