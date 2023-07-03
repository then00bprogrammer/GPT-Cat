export const addPrompt = async (name: string, pathArray: string[] | undefined, content: string, email: string | null |undefined) => {
    try {
      let path: string = '';
      if (pathArray !== undefined) {
        for (const folder of pathArray) {
          console.log(folder);
          path += folder;
          path += '/';
        }
      }
  
      const resp = await fetch('http://localhost:5000/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': name, 'path': path, 'content': content, 'email':email })
      });
      const newFile = await resp.json();
      return newFile;
    } catch (error) {
      console.error('An error occurred while adding the prompt:', error);
    }
  }
  