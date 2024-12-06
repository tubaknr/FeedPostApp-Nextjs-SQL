"use client";

export default function NewPostError({ error }){
    return(
        <>
        <h2>An error occured!</h2>
        <p>Unfortunately, something went wrong.</p>
        <p>{error.message}</p>
        </>
    )
}