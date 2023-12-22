import { server, getBearerToken } from "./header";

/*
    프로필 요청

    1. getProfiles - 프로필 리스트 가져오기
    2. getProfile - 프로필 상세 보기
    3. getTimeLine - 타임라인 가져오기
    4. getFollwers - 팔로워 리스트 가져오기
    5. getFollowingUsers - 팔로잉 리스트 가져오기
    6. follow - 팔로우 요청
    7. unfollow - 언팔로우 요청
*/

export async function getProfiles(username) {
    const res = await fetch(`${server}/profiles/?username=${username}`, {       // username 요청 쿼리 -> 유저 검색페이지에서 활용
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function getProfile(username) {
    const res = await fetch(`${server}/profiles/${username}`, {
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function getTimeline(username) {
    const res = await fetch(`${server}/posts/?username=${username}`, {
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function getFollowers(username) {
    const res = await fetch(`${server}/profiles/?followers=${username}`, {
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function getFollowingUsers(username) {
    const res = await fetch(`${server}/profiles/?following=${username}`, {
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function follow(username) {
    const res = await fetch(`${server}/profiles/${username}//follow`, {
        method : "POST",
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}

export async function unfollow(username) {
    const res = await fetch(`${server}/profiles/${username}/unfollow`, {
        method : "DELETE",
        headers : {
            "Authorization" : getBearerToken()
        }
    });

    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    return await res.json();
}