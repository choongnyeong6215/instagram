import { useContext } from "react";
import {Navigate} from "react-router-dom";
import AuthContext from "./AuthContext";

function AuthRequired({children}) {
    const {user} = useContext(AuthContext);

    // 로그아웃 상태인 경우 현재 페이지를 로그인 페이지로 대체
    if(!user) {
        return <Navigate to="/accounts/login" replace={true} />
    }

    // 인증 성공
    return children;
}

export default AuthRequired;