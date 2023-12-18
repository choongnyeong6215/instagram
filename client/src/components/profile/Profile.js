import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import ProfileInfo from "./ProfileInfo";
import PostItem from "./PostItem";
import PostForm from "../PostForm";
import { getProfile, getTimeline, follow, unfollow } from "../../service/profile";  // 서버 요청
import Spinner from "../Spinner";

function Profile() {
    const {username} = useParams();
    const {user, setUser} = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);             // 타임라인
    const [modalOpen, setModalOpen] = useState(false);  // 모달 관리
    const navigate = useNavigate();

    // 키 스테이트 추적
    console.log(profile, posts);

    // 프로필 데이터 요청
    useEffect(() => {
        fetchData()
    }, [username]);

    async function fetchData() {
        try {
            setProfile(null);   // 프로필 초기화

            // 프로필 데이터, 타임라인 요청
            const profileData = await getProfile(username);
            const timelineData = await getTimeline(username);

            setProfile(profileData.profile);
            setPosts(timelineData.posts);

        } catch {
            navigate("/notfound", {replace : true});
        }
    };

    // 팔로우 처리
    async function handleFollow() {};

    // 언팔로우 처리
    async function handleUnFollow() {};

    // 로그아웃 처리
    async function handleSignOut() {};

    // 제목 업데이트
    useEffect(() => {
        document.title = `${username} - Instagram`
    }, []);

    // 타임라인
    const timeline = posts.map((post) => (
        <PostItem 
            key={post.id}
            id={post.id}
            thumbnailUrl={post.photoUrls[0]}
            likesCount={post.likesCount}
            commentCount={post.commentCount}
        />
    ))

    // 모달
    const modal = (
        <div
          className="fixed inset-0 bg-black/[0.2] z-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false)
            }
          }}
        >
          <PostForm />
        </div>
    )

    // 대기 상태
    if(!profile) {
        return <Spinner />
    }

    return (
        <>
            {/* 프로필 정보 */}
            <ProfileInfo
                username={profile.username}
                name={profile.name}
                avatarUrl={profile.avatarUrl}
                bio={profile.bio}
                postCount={profile.postCount}
                followerCount={profile.followerCount}
                followingCount={profile.followingCount}
                isFollowing={profile.isFollowing}
                handleSignOut={handleSignOut}
                handleUnFollow={handleUnFollow}
                isMaster={user.username === username}   // 본인 프로필 방문인지 확인
            />

            <div className="border-t my-4">
                {/* 타임라인 */}
                {timeline.length > 0 ? (
                    <ul className="grid grid-cols-3 gap-2 mb-2">
                        {timeline}
                    </ul>
                ) : (
                    <p className="text-center mt-4">게시물이 없습니다.</p>
                )}
            </div>

            {/* Modal open button */}
            <svg
                className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                onClick={() => setModalOpen(true)}
            >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>

            {/* Create form */}
            {modalOpen && modal}
        </>
    )
}

export default Profile;