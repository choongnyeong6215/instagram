import {useState, useContext, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import {signIn} from "../service/user";                     // 로그인 요청
import {isEmail, isPassword} from "../utils/valitaor";      // 폼데이터 유효성 검사 처리

function Login() {
    const {setUser} = useContext(AuthContext);                                  // user 업데이트 메서드
    const navigate = useNavigate();                                             // 페이지 이동 처리
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");    // 자동로그인 처리
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const disabled = !isEmail(email) || !isPassword(password);                  // 로그인 버튼 비활성화 처리


    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            setError(null);

            const {user} = await signIn(email, password);   // 로그인 요청 (user : 응답 데이터 - 로그인 성공 유저 데이터)

            setUser(user);  // 응답데이터로 유저 업데이트

            localStorage.setItem("email", email);

            setTimeout(() => {  // 피드로 이동하기 위한 시차 벌기
                navigate("/");
            }, 500);
        } catch (error) {
            setError(error);
        } 
    };

    // 제목 업데이트
    useEffect(() => {
        document.title = "로그인 - Instagram"
    }, []);

    // 비밀번호 보기 버튼
    const passwordToggleButton = (
        <button
            type="button"
            className="absolute right-0 h-full px-4 py-2 text-sm font-semibold"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
        </button>
    )

    return (
        <form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
            {/* 로고 이미지 */}
            <div className="mt-4 mb-4 flex justify-center">
                <img src="/images/logo.png" className="w-36" />
            </div>

            {/* 이메일 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        className="border px-2 py-1 w-full rounded"
                        value={email}
                        placeholder="이메일"
                        onChange={({target}) => setEmail(target.value)}
                    />
                </label>
            </div>

            {/* 비밀번호 입력란 */}
            <div className="mb-2">
                <label className="block relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="border px-2 py-1 w-full rounded"
                        value={password}
                        placeholder="비밀번호"
                        autoComplete="new-password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                    {password.trim().length > 0 && passwordToggleButton}
                </label>
            </div>

            {/* 제출버튼 */}
            <button
                type="submit"
                className="bg-blue-500 text-sm text-white font-semibold rounded-lg px-4 py-2 w-full disabled:opacity-[0.5]"
                disabled={disabled}
            >
                로그인
            </button>

            {/* 에러 메시지 */}
            {error && <p className="my-4 text-center text-red-500">{error.message}</p>}

            {/* 가입 링크 */}
            <p className="text-center my-4">
                계정이 없으신가요 ? {" "}
                <Link to="/accounts/signup" className="text-blue-500 font-semibold">
                    가입하기
                </Link>
            </p>
        </form>
    )
}

export default Login;