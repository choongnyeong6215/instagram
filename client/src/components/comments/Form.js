import { useState } from "react";

function Form({handleAddComment}) {
    const [content, setContent] = useState("");

    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            // 댓글 내용 전달
            await handleAddComment(content);

            setContent("");

        } catch(error) {
            alert(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                rows="2"
                className="border w-full px-2 py-1 rounded resize-none"
                value={content}
                onChange={({target}) => setContent(target.value)}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-[0.2]"
                // 댓글 내용 없을 떄 비활성화 처리
                disabled={!content.trim()}
            >
                댓글 달기
            </button>
        </form>
    )
}

export default Form;