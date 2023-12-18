import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostTemplate from "./post-template/PostTemplate";
import { getPost, deletePost, likePost, unlikePost } from "../service/post";    // 서버 요청 처리
import Spinner from "./Spinner";
import AuthContext from "./auth/AuthContext";

function PostView() {
    const {id} = useParams();   // 게시물 id
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    // 키 스테이트 추적
    console.log(post);

    // 게시물 가져오기 요청
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            const data = await getPost(id);

            setPost(data.post);
        } catch(error) {
            navigate("/notfound", {replace : true});
        }
    }

    // 좋아요 처리
    async function handleLike(id) {
        try {
            await likePost(id)      // 서버 요청

            const updatePost = {
                ...post,
                liked : true,
                likesCount : post.likesCount + 1
            };

            setPost(updatePost);

        } catch(error) {
            alert(error);
        }
    };

    // 좋아요 취소 처리
    async function handleUnlike(id) {
        try {
            await unlikePost(id);

            const updatePost = {
                ...post,
                liked : false,
                likesCount : post.likesCount - 1
            };

            setPost(updatePost);

        } catch(error) {
            alert(error);
        }
    };

    // 게시물 삭제 처리
    async function handleDelete(id) {
        try {
            await deletePost(id);
            
            // 게시물 삭제 후 피드로 이동
            navigate("/", {replace : true});

        } catch(error) {
            alert(error);
        }
    };

    // 대기 상태
    if(!post) {
        return <Spinner />
    }

    return (
        // 보여질 부분
        <PostTemplate
            id={post.id}
            username={post.user.username}
            avatarUrl={post.user.avatarUrl}
            photoUrls={post.photoUrls}
            caption={post.caption}
            likesCount={post.likesCount}
            commentCount={post.commentCount}
            displayDate={post.displayDate}
            liked={post.liked}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleDelete={handleDelete}
            isMaster={user.username === post.user.username}     // 본인 게시물인지 확인
        />
    )
}

export default PostView;