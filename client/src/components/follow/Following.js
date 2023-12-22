import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFollowingUsers, follow, unfollow } from "../../service/profile";
import ProfileItem from "./ProfileItem";
import Spinner from "../Spinner";

function Following() {
    const {username} = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profiles, setProfiles] = useState([]);

    // 키 스테이트 추적
    console.log(profiles);

    // 팔로잉 리스트 요청
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            const data = await getFollowingUsers(username);

            setProfiles([...profiles, ...data.profiles]);
            
        } catch(error) {
            setError(error);
        } finally {
            setIsLoaded(true);
        }
    };

    // 팔로우 처리
    async function handleFollow(username) {
        try {
            // 팔로우 요청
            await follow(username);

            const updatedProfiles = profiles.map((profile) => {
                if(profile.username === username) {
                    return {...profile, isFollowing : true}
                }

                return profile;
            })

            setProfiles(updatedProfiles);

        } catch(error) {
            alert(error);
        }
    };

    // 언팔로우 처리
    async function handleUnfollow(username) {
        try {
            await unfollow(username);

            const updatedProfiles = profiles.map((profile) => {
                if(profile.username === username) {
                    return {...profile, isFollowing : false}
                }

                return profile;
            })

            setProfiles(updatedProfiles);

        } catch(error) {
            alert(error);
        }
    };

    // 팔로잉 리스트 렌더링
    const followingList = profiles.map((profile) => (
        <ProfileItem
            key={profile.id}
            username={profile.username}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            isFollowing={profile.isFollowing}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
        />
    ))

    return (
        <div className="px-2">
            <h3 className="text-lg my-4 font-semibold">{username}의 팔로잉</h3>

            {followingList.length > 0 ? (
                <ul>
                    {followingList}
                </ul>
            ) : (
                <p>팔로우 하는 유저가 없습니다.</p>
            )}

            {!isLoaded && <Spinner />}

            {error && (
                <p className="text-red-500">{error.message}</p>
            )}
        </div>
    )
}

export default Following;