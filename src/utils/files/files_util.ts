import fs from 'fs'
import path from 'path';
export class FilesUtil {
  static  deleteFolderContents = (folderPath: string) => {
        fs.readdir(folderPath, (err, files) => {
          if (err) throw err;
      
          for (const file of files) {
            const filePath = path.join(folderPath, file);
      
            fs.stat(filePath, (err, stat) => {
              if (err) throw err;
      
              if (stat.isDirectory()) {
                // Recursivamente eliminar el contenido del subdirectorio
                this.deleteFolderContents(filePath);
              } else {
                // Eliminar archivo
                fs.unlink(filePath, (err) => {
                  if (err) throw err;
                //   console.log(`Archivo eliminado: ${filePath}`);
                });
              }
            });
          }
        });
      };
}