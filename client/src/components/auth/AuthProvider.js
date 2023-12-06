import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({children}) {
    const initialUser = JSON.parse(localStorage.getItem("user"));       // 로그인 상태 유지하기 위해 로컬스토리지의 유저 초기값 가져오기
    const [user, setUser] = useState(initialUser);

    // 로컬스토리지 동기화(user 변경시)
    useEffect(() => {
        if(user) {      // 로그인 성공 시
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user])


    // 하위 컴포넌트에 데이터 전달
    const value = {user, setUser};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;