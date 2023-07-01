export const addPrompt = async(name:string,pathArray:string[] | undefined,content:string)=>{
    let path:string = ''
    if(pathArray!=undefined){
        for (const folder of pathArray){
            console.log(folder);
            path+=folder;
            path+='/';
        }
    }
    
    await fetch('http://localhost:5000/files',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {'name': name,'path': path, 'content':content }
        )
    });
}