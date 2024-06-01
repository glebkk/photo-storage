import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type FileContextValue = {
    files: File[];
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
    setFiles: (files: File[]) => void
};

export const FileContext = createContext<FileContextValue>({
    files: [] as File[],
    addFile: (file: File) => { },
    removeFile: (index: number) => { },
    setFiles: (files: File[]) => {}

});

type FileProviderProps = {
    children: ReactNode;
};

export const FileProvider = ({ children }: FileProviderProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const addFile = (file: File) => {
        setFiles([...files, file]);
    };

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <FileContext.Provider value={{ files, addFile, removeFile, setFiles}}>
            {children}
        </FileContext.Provider>
    );
};