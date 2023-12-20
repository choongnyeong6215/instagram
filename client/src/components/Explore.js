import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {getProfiles} from "../service/profile";
import Spinner from "./Spinner";

function Explore() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [profiles, setProfiles] = useState([]);   // 프로필 검색 결과

    // 키 스테이트
    console.log(profiles);

    // 실시간 검색 처리
    async function search(username) {
        try {
            // 검색어 없을 경우
            if(!username) {
                return setProfiles([]);
            }

            // 새 요청 위해 에러, 대기상태 초기화
            setError(null);
            setIsLoaded(false);

            const {profiles} = await getProfiles(username);

            setProfiles(profiles);

        }catch(error) {
            setError(error);
        }finally {
            setIsLoaded(true);
        }
    };

    // 프로필 목록 렌더링
    const profileList = profiles.map((profile) => (
        <li key = {profile.id} className="flex items-center justify-between my-2">
            <Link
                to={`/profiles/${profile.username}`}
                className="flex items-center"
            >
                <img
                    src={profile.avatarUrl}
                    alt="profile avatarUrl"
                    className="w-10 h-10 object-cover rounded-full"
                />
                <div className="ml-2">
                    <h3 className="block font-semibold">
                        {profile.username}
                    </h3>
                    <span className="block text-gray-400 text-sm">
                        {profile.name}
                    </span>
                </div>
            </Link>

            {profile.isFollowing && (
                <div className="ml-2 text-sm text-blue-500 font-semibold">
                    팔로잉
                </div>
            )}
        </li>
    ))

    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">검색</h3>

            {/* 검색창 */}
            <div className="mb-4">
                <input
                    type="text"
                    className="border px-2 py-1 rounded w-full outline-none"
                    onChange={({target}) => search(target.value)}
                    placeholder="아이디"    
                />
            </div>

            {/* 프로필 리스트 */}
            {isLoaded ? (
                <ul>
                    {profileList}
                </ul>
            ) : (
                <Spinner />
            )}

            {/* 에러메시지 */}
            {error && (
                <p className="text-red-500">{error.message}</p>
            )}
        </div>
    )
}

export default Explore;