import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ apps, handleEditorChange }: any) => {
    return (
        <Editor
            apiKey="n212ulx8ltmzy5gkpquyp9dx6gf2ui0xvzzuod2h2r6iwygg"
            initialValue={apps}
            init={{
                mode: "textareas",
                height: 200,
                menubar: false,
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleEditorChange}
        />
    );
};
export default TextEditor;
