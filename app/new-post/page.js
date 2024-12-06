import FormSubmit from "@/components/form-submit";
import { storePosts } from "@/lib/posts";
import { redirect } from "next/navigation";

export default function NewPostPage(){

    // SERVER FORM ACTION
    async function createPost(formData) { //formData buraya otomatik atılır; user ın girdiklerini verir.
        "use server"; //bu satır olmazsa->CLINET SIDE. NORMA FORM ACTION olurdu. Bu satır ile birlikte: SERVER SIDE - SERVER ACTION.
        // SERVER ACTION --> MUST BE ASYNC FCN.
        // ONLY EXECUTE ON THE SERVER. DOES NTO WORK ON CLIENT SIDE.

        const title = formData.get("title"); // form un içindeki name="title" sayesinde alındı
        const image = formData.get("image"); // form un içindeki name="image" sayesinde alındı
        const content = formData.get("content"); // form un içindeki name="content" sayesinde alındı

        // console.log(title, image, content);
        // Send data to backend
        storePosts({
            imageUrl: '',
            title,
            content,
            userId: 1 //for this demo, user 1 is the always post creator.
        });
        redirect('/feed');
    }

    return(
        <>
        <h1>Create a new post</h1>
        <form action={createPost}>

            <p className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title"/>
            </p>
            
            <p className="form-control">
                <label htmlFor="image">Image URL</label>
                <input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    id="image"
                    name="image"/>
            </p>
            
            <p className="form-control">
                <label htmlFor="content">Content</label>
                <textarea id="content" name="content" rows="5" />
            </p>

            <p className="form-actions">
                <FormSubmit />
            </p>

        </form>
        </>
    );
}

