 import { createClient } from "@supabase/supabase-js"

 const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbGd6Z2llZ3lqZ2pnaHF1ZW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTQxNTksImV4cCI6MjA1NjczMDE1OX0.3GrO7jsIyu-9Q3Ft0rdyh9SPNqXrickUUuK8NEh3Vqc"
 const supabase_url ="https://ualgzgiegyjgjghquenc.supabase.co"

 const supabase = createClient (supabase_url,anon_key)

 export default function mediaUpload(file){

    return new Promise((resolve,reject)=>{
        if(file==null){
            reject("No file selected")
        }

        const timestamp = new Date().getTime();
    const fileName = timestamp+file.name

     supabase.storage.from("image").upload(fileName,file,{
        cacheControl: `3600`,
        upsert: false,
     }).then(()=>{
         const publicUrl = supabase.storage.from("image").getPublicUrl(fileName).data.publicUrl;
         resolve(publicUrl)
     }).catch(()=>{
        reject("Error uploading file")
     })

    })

    
 }