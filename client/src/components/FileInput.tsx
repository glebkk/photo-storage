import { ForwardedRef, forwardRef, useContext } from 'react';
import { FileContext } from '../context/FileContext';

type Props = {}

export const FileInput = forwardRef((props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { files, addFile } = useContext(FileContext);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files;
        if (newFiles) {
            for (let i = 0; i < newFiles.length; i++) {
                addFile(newFiles[i]);
            }
        }
        console.log(files);
        
    };

    return (
        <input className='hidden' ref={ref} type="file" multiple onChange={handleFileChange} />
    );
});