export const addFolder = async (name: string, pathArray: string[] | undefined) => {
    try {
      let path: string = '';
      if (pathArray !== undefined) {
        for (const folder of pathArray) {
          console.log(folder);
          path += folder;
          path += '/';
        }
      }
  
      await fetch('http://localhost:5000/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': name, 'path': path })
      });
    } catch (error) {
      console.error('An error occurred while adding the prompt:', error);
    }
  }
  