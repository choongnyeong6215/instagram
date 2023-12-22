import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

function ProfileItem({
    username,
    avatarUrl,
    name,
    isFollowing,
    handleFollow,
    handleUnfollow
}) {
    const {user} = useContext(AuthContext);

    // 본인 프로필인지 확인
    const isMaster = username === user.username;

    // 팔로우 버튼
    const followButton = (
        <button
            className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleFollow(username)}
        >
            팔로우
        </button>
    )

    // 언팔로우 버튼
    const unfollowButton = (
        <button
            className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
            onClick={() => handleUnfollow(username)}
        >
            팔로잉
        </button>
    )

    return (
        <li className="flex justify-between items-center mb-2">
            <Link
                to={`/profiles/${username}`}
                className="inline-flex items-center"
            >
                <img
                    src={avatarUrl}
                    alt="avatarUrl"
                    className="w-12 h-12 object-cover rounded-full border"
                />
                <div className="ml-2">
                    <h3 className="block font-semibold">
                        {username}
                    </h3>
                    <span className="block text-gray-400 text-sm">
                        {name}
                    </span>
                </div>
            </Link>

            {!isMaster && (
                isFollowing ? unfollowButton : followButton
            )}
        </li>
    )
}

export default ProfileItem;   