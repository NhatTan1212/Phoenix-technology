import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const DescriptionManagement = ({ placeholder }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');

    return (
        <JoditEditor
            placeholder='Nhập thông tin chi tiết về sản phẩm...'
            ref={editor}
            value={content}
            tabIndex={1} // tabIndex of textarea
            // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={newContent => { console.log(newContent); }}
        />
    );
};
export default DescriptionManagement
