import multer from "multer"

export const storage = multer.diskStorage({
    destinatio: (req, file, cb)=>{
        let destinationFolder;
        switch(file.fieldname) {
            case "profile":
                destinationFolder = ".src/uploads/profiles";
                break;
            case "profile":
                destinationFolder = ".src/uploads/products";
                break;
            case "profile":
                destinationFolder = ".src/uploads/documents";
                break;
        }
        cb(null, destinationFolder);
    },
    filenaame:(req, file, cb)=>{
        cb(null, file.origialname);
    }
})
export const upload = multer ({storage:storage})

