# 서버 구조

1. models
 1. User.js
 2. Post.js
 3. Comment.js
 4. Likes.js
 5. Following.js

2. middleware
 1. auth.js
 2. loginValidator.js
 3. signUpValidator.js
 4. upload.js

3. controller (로직 처리)
 1. userController - 유저 데이터 처리
 2. postController - 게시물 데이터 처리
 3. commentController - 댓글 데이터 처리
 4. profileController - 프로필 데이터 처리

4. routes
 1. index (메인 라우터)
 2. user
 3. post
 4. comment
 5. profile

5. app.js (최상위 모듈)

6. seed.js (테스트 하기 위한 seed data 생성)

7. 서버 실행 명령어 작성 (package.json)


# MERN 스택(조합) 활용
m : mongodb - db
e : expressjs - 서버 프레임워크 (node.js 프레임워크)
r : react - 클라이언트 프레임워크
n : nodejs - 서버 개발 언어 

mongodb compass : mongodb 클라이언트 프로그램

URI : mogodb 서버 주소


# 환경설정
1. mongodb 설치
2. postman 설치 (api 서버 테스트 주소) 아이디 : 구글계정
3. express 설치

○ express 생성기 설치 명령어
npm install -g express-generator

○ express 프로젝트 생성 명령어
express --no--view server (view가 없는 server 생성)

○ server 프로젝트에서 설치할 패키지 (아래 패키지 모두 npm install)
 - 여러 패키지 한번에 설치 : 띄어쓰기로 구분 (npm install express debug cookie-parser...)

1 express - 프레임워크
2 debug - 디버깅 관리 기능
3 cookie-parser - 쿠키 수집 기능
4 http-errors - 에러 처리
5 morgan - 에러 로그 출력 및 저장, 통신 기록
6 helmet - 요청 헤더에 보안 기능 적용
7 compression - 압축 기능
8 mongoose - 몽고DB용 ODM(Object Document Mapping)
9 multer - 파일 처리 기능
10 passport - 인증 기능
11 passport-jwt - 인증 기능
12 jsonwebtoken - JWT 관련 패키지
13 express-validator - 유효성 검사
14 luxon - 날짜 데이터 가공 기능
15 dotenv - 환경변수 사용할 수 있는 기능 제공
16 cors - CORS(Cross Origin Resource Sharing) 기능 제공

○ nodemon 설치
nodemon : 파일의 변경사항이 있을 때 재컴파일 시도
npm 글로벌 설치 파일 확인 : npm list -g

npm i nodemon -g

○ 프로젝트 구조(mvc 패턴)
bin - 서버 실행관련 파일
node_modules - 패키지 저장 경로
public - 정적 경로(파일 경로)
routes - 라우터 관련 파일
.env - 환경변수 저장 파일 (생성해야함)
models(User.js, Post.js, Likes.js, Following.js, Comment.js) - 모델 (폴더 생성해야함)
----------------------------------- server

app.js - 시작점
package.json - 프로젝트 정보
----------------------------------- src


○ mvc 패턴(model-view-controller)
소프트웨어 디자인 패턴
model : 데이터베이스
controller : 앱의 로직 처리 부분(api 서버)
view : 화면 부분


231110


require : import 개념

ODM(Object Document Mapping) - NoSQL (JSON 형식으로 데이터 저장)
ORM(Object Relational Mapping) - RDB
 - 데이터베이스를 객체 관점에서 접근할 수 있다.
 -> 프로그래밍 언어의 방식으로 DB를 조작할 수 있다.

RDB - 테이블 기반의 데이터 구조
NoSQL - 문서 기반의 데이터 구조


○ 로그인 인증 처리 절차
1. 유저가 로그인 시도
2. 서버는 로그인에 성공한 경우 토큰 발급
3. 클라이언트는 매 요청시에 토큰을 요청헤더에 담아 요청

○ JWT 구조 (복호화 가능)
header : algorith & token type
payload : data
signature : verification


231113

○ middleware
- 클라이언트의 요청과 서버의 응답 사이에서 여러가지 일 처리

middleware 종류

1. auth.js
- 인증 처리 미들웨어

2. loginValidator.js
- 로그인 데이터 유효성 검사 미들웨어

3. signUpValidator.js
- 회원가입 데이터 유효성 검사 미들웨어

4. upload.js
- 클라이언트가 업로드한 파일 처리 미들웨어

○ 서버의 응답 코드(상태 코드)
- 서버는 요청을 처리한 결과를 나타내는 응답코드를 가짐

1. 1XX (Informational Response)
- 서버가 요청을 처리중인 상태
- 클라이언트에게 전송되어서는 안됨

2. 2XX (Successful)
- 200 OK : 요청을 성공적으로 처리

3. 3XX (Redirection)
- 304 (NotModified) : 클라이언트의 마지막 요청으로부터 리소스가 수정되지 않은 경우 클라이언트는 캐시에 저장된 리소스를 사용할  수 있음

4. 4XX (Client Error)
- 400 (BadRequest) : 요청 문법이 잘못되었거나 기타 잘못된 요청을 한 경우
- 401 (Unauthorized) : 인증 실패
- 404 (NotFound) : 서버에 존재하지 않는 리소스를 요청한 경우

5. 5XX (Server Error)
- 500 (Internal Server Error) : 내부 서버 오류


231115

○ 컨트롤러 (로직 처리 부분)

컨트롤러 구조
1. userController - 유저 데이터 처리
2. postController - 게시물 데이터 처리
3. commentController - 댓글 데이터 처리
4. profileController - 프로필 데이터 처리


○ 라우터
- 요청 URL과 적절한 리소스 연결

라우터 구조
1. index (메인 라우터)
2. user
3. post
4. comment
5. profile

○ HTTP 요청 메서드 (Request Method)

1. GET - 데이터 읽기 요청
2. POST - 데이터 생성 요청
3. PUT - 데이터 수정 요청
4. DELETE - 데이터 삭제 요청


231120

○ 씨드데이터 생성

- 씨드데이터 생성 명령어

node seed run mongodb://127.0.0.1:27017/instagram

node - node 호출
seed - seed 파일
run - seed 파일 생성 (revert : 초기화)
mongodb - DB 주소

○ 서버 실행 명령어 (개발환경)
npm run start:watch


231124

○ Following schema
- user와 following으로 구성

1. 유저가 팔로우하는 유저리스트
 1. Following 컬렉션에서 user 찾기
 2. 유저 - 팔로우한 유저 도큐먼트
 3. 도큐먼트에서 following 필드 추출

2 특정 유저를 팔로우하는 유저리스트
 1. Following 커넥션에서 특정 유저 찾기
 2. 검색결과에서 user 필드 추출

3. 유저가 특정 유저를 팔로우하는지 여부
user에 유저가 있고, following에 특정 유저 도큐먼트가 있으면 팔로우 중


231127

○ Following schema

로그인 유저가 팔로우 하는 프로필 리스트 - 팔로우 하는 유저 프로필 (도큐먼트)

following 필드 추출 -> 팔로우 하는 유저 필드

where 객체에  user : 로그인 유저, 팔로우 하는 유저 조건 추가