import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import PostTemplate from "./post-template/PostTemplate";        // 렌더링 처리
import {getFeed, deletePost, likePost, unlikePost} from "../service/post";
import Spinner from "./Spinner";
import AuthContext from "./auth/AuthContext";

function Feed() {
    const {user} = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);

    // 더보기 기능 관련 state
    const [postCount, setPostCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const limit = 5;

    // 키 스테이트 추적
    console.log(posts);

    // 피드 가져오기
    useEffect(() => {
        fetchData();
    }, [skip]);

    async function fetchData() {
        try {

            // 새 요청 전 에러, 대기상태 초기화
            setError(null);
            setIsLoaded(false);

            const data = await getFeed(limit, skip);

            // 현재 갖고 있는 게시물에 새로운 게시물 추가
            const updatedPosts = [...posts, ...data.posts];

            setPosts(updatedPosts);
            setPostCount(data.postCount);       // 로그인 유저와 관련된 게시물 갯수

        } catch(error) {
            setError(error);
        } finally {
            setIsLoaded(true);
        }
    };

    // 좋아요 처리
    async function handleLike(id) {

    };

    // 좋아요 취소 처리
    async function handleUnlike(id) {

    };

    // 게시물 삭제 처리
    async function handleDelete(id) {

    };

    // 피드 목록 렌더링
    const postList = posts.map((post) => (
        <PostTemplate
            key={post.id}
            id={post.id}
            username={post.user.username}
            avatarUrl={post.user.avatarUrl}
            photoUrls={post.photoUrls}
            caption={post.caption}
            liked={post.liked}
            likesCount={post.likesCount}
            commentCount={post.commentCount}
            displayDate={post.displayDate}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleDelete={handleDelete}
            isMaster={user.username === post.user.username}
        />
    ))

    // 더 가져올 게시물이 있는지 체크 (데이터베이스 저장된 로그인 유저와 관련 있는 게시물, 클라이언트 측에서 갖고 있는 게시물)
    const doesMoreExists = postCount > posts.length;

    // 더보기 버튼
    const  showMoreBtn = (
        <div className="flex justify-center my-2">
            <button
                className="p-1 text-blue-500 font-semibold"
                onClick={() => setSkip(skip + limit)}
            >
                더보기
            </button>
        </div>
    )

    return (
        <>
            {postList.length > 0 ? (
                <ul>
                    {postList}
                </ul>
            ) : (
                <div className="p-8 text-center">
                    <Link
                        to="/explore"
                        className="text-blue-500"
                    >
                        인스타그램 둘러보기
                    </Link>
                </div>
            )}

            {/* 더 가져올 게시물 있을 떄 더보기 버튼 렌더링 */}
            {doesMoreExists && showMoreBtn}

            {!isLoaded && <Spinner />}

            {error && <p className="text-red-500">{error.message}</p>}
        </>
    )
}

export default Feed;