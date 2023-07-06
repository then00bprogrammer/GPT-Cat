export const addFolder = async (name: string, pathArray: string[] | undefined, email: string | null |undefined) => {
    try {
      let path: string = '';
      if (pathArray !== undefined) {
        for (const folder of pathArray) {
          console.log(folder);
          path += folder;
          path += '/';
        }
      }
  
      const resp=await fetch('https://gpt-cat.onrender.com/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': name, 'path': path, 'email':email })
      });
      const newFolder = await resp.json();
      return newFolder;
    } catch (error) {
      console.error('An error occurred while adding the prompt:', error);
    }
  }
  