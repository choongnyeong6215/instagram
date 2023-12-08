import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import { createUser } from "../service/user";       // 유저 생성 요청 처리
import { isEmail, isUsername, isPassword } from "../utils/valitaor";

function SignUp() {
    const navigate = useNavigate();                 // 페이지 이동 처리
    const [error, setError] = useState(null);       // 가입 에러 처리
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const disabled = !isEmail(email) || !isUsername(username) || !isPassword(password);

    
    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            const newUser = {email, name, username, password};  // 서버에 전송할 데이터

            await createUser(newUser);      // 유저 생성 요청

            alert(`안녕하세요 ${name}님!`);

            navigate("/");  // 가입 성공 시 로그인 페이지로 이동

        } catch(error) {
            setError(error);
        }
    }

    // 제목 업데이트
    useEffect(() => {
        document.title = "가입 - Instagram"
    }, []);

    return (
        <form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 mt-16">
            {/* 로고 */}
            <div className="mt-4 mb-4 flex justify-center">
                <img src="/images/logo.png" className="w-36" />
            </div>

            {/* 이메일 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        name="email"
                        className="border px-2 py-1 rounded w-full"
                        onChange={({target}) => setEmail(target.value)}
                        placeholder="이메일"
                    />
                </label>
            </div>

            {/* 이름 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        name="name"
                        className="border rounded px-2 py-1 w-full"
                        onChange={({target}) => setName(target.value)}
                        placeholder="이름"
                    />
                </label>
            </div>

            {/* 아이디 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="text"
                        name="username"
                        className="border rounded px-2 py-1 w-full"
                        onChange={({target}) => setUsername(target.value)}
                        placeholder="아이디"
                    />
                </label>
            </div>
            
            {/* 비밀번호 입력란 */}
            <div className="mb-2">
                <label className="block">
                    <input
                        type="password"
                        name="password"
                        className="border rounded px-2 py-1 w-full"
                        onChange={({target}) => setPassword(target.value)}
                        placeholder="비밀번호"
                        autoComplete="new-password"
                    />
                </label>
            </div>

            {/* 제출버튼 */}
            <button
                type="submit"
                className="bg-blue-500 rounded-lg text-sm font-semibold px-4 py-2 text-white w-full disabled:opacity-[0.5]"
                disabled={disabled}
            >
                가입하기
            </button>

            {/* 에러 메시지 */}
            {error && <p className="my-4 text-red-500 text-ceter">{error.message}</p>}

            {/* 로그인 링크 */}
            <p className="text-center mt-4">
                이미 계정이 있으신가요 ? {" "}
                <Link to="/accounts/login" className="text-blue-500 font-semibold">
                    로그인
                </Link>
            </p>
        </form>
    ) 
}

export default SignUp;