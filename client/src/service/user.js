// 서버주소, 토큰 참조
import {server, getBearerToken} from "./header";

/*
    user 요청

    1. createUser - 유저 생성 요청
    2. signIn - 로그인 요청
    3. updateProfile - 프로필 수정 요청
    4. updateAvatar - 프로필 사진 수정 요청
 */

export async function createUser(newUser) {
    /* 
        fetch()
        - 서버 요청 함수
        - 프로미스 리턴

        구조
        - fetch(url, options)
    */

    // 응답 객체
    const res = await fetch(`${server}/users`, {
        method : "POST",
        headeers : {"Content-Type" : "application/json"},   // 현재 리퀘스트 또는 리스폰스의 바디에 들어 있는 데이터가 어떤 타입인지
        body : JSON.stringify(newUser)
    })

    // 요청 처리하지 못한 경우 (200 error)
    if(!res.ok) {
        throw new Error(res.statusText + "Error");
    }

    // 응답 데이터 객체로 변환 후 리턴
    return await res.json();
}


export async function SignIn(email, password) {
    const res = await fetch(`${server}/users/login`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({email, password})
    })

    if(!res.ok) {
        throw new Error(res/statusText + "Error");
    }

    return await res.json();
}