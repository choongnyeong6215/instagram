import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {getComments, createComment, deleteComment} from "../../service/comment";    // 서버 요청 처리 함수
import Form from "./Form";
import Comment from "./Comment";
import Spinner from "../Spinner";

function Comments() {
    const {id} = useParams();                           // 게시물 id
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [comments, setComments] = useState([]);

    // 키 스테이트 추적
    console.log(comments);

    // 댓글 가져오기 요청
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // 서버 요청
            const data = await getComments(id);

            // 댓글 업데이트 (기존 댓글, 새로 작성한 댓글)
            setComments([...comments, ...data.comments]);

        } catch(error) {
            setError(error);
        } finally {
            setIsLoaded(true);
        }
    };

    // 댓글 추가 처리
    async function handleAddComment(content) {
        try {
            // 댓글 생성 요청
            const data = await createComment(id, content);
            
            const updatedComments = [data.comment, ...comments];
            setComments(updatedComments);

        } catch(error) {
            alert(error);
        }
    };

    // 댓글 삭제 처리
    async function handleDelete(id) {
        try {
            await deleteComment(id);

            const remainingComments = comments.filter((comment) => comment.id !== id);

            setComments(remainingComments);
            
        } catch(error) {
            alert(error);
        }
    };

    // 댓글 목록 렌더링
    const commentList = comments.map((comment) => (
        <Comment
            key={comment.id}
            id={comment.id}
            username={comment.user.username}
            avatarUrl={comment.user.avatarUrl}
            content={comment.content}
            displayDate={comment.displayDate}
            handleDelete={handleDelete}
        />
    ))

    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">댓글</h3>

            {/* 댓글 폼 */}
            <Form handleAddComment={handleAddComment} />

            {/* 댓글 리스트 */}
            {commentList.length > 0 ? (
                <ul>
                    {commentList}
                </ul>
            ) : (
                <p className="text-center">댓글이 없습니다.</p>
            )}

            {/* 대기 상테 표시 */}
            {!isLoaded && <Spinner />}

            {/* 에러메시지 */}
            {error && (
                <p className="text-red-500">{error.message}</p>
            )}
        </div>
    )
}

export default Comments;