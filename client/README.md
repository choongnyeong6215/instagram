# 클라이언트 컴포넌트 구조

1. Auth (인증처리)
 - AuthContext : 프로바이더 컴포넌트
 - AuthProvider : user 관리
 - AuthRequired : 인증 검사


2. Layout (레이아웃)


3. Feed (피드 페이지)


4. Explore : 유저 검색 페이지


5. PostTemplate (템플릿 - 게시물의 보여지는 부분, 피드, PostView에서 재사용)
 - PostTemplate
 - Carousel (게시물의 사진 부분)


7. PostForm (게시물 업로드 모달)


8. Comments - 댓글 페이지
 - Comments : 메인 페이지
 - Comment : 각각의 댓글
 - Form : 댓글 생성 폼


9. profile (프로필 상세보기 페이지)
 - Profile : 메인 페이지
 - ProfileInfo : 프로필 정보
 - PostItem : 타임라인 썸네일


10. ProfileEdit (프로필 수정 페이지)


11. Follorw (팔로우 관련 페이지)
 - Followers : 팔로워 페이지
 - Following : 팔로잉 페이지
 - ProfileItem : 각 프로필 렌더링

12. Login (로그인 페이지)


13. SignUp (가입 페이지)


14. NotFound (404)


15. Spinner (로딩화면)



# 트리구조 라우트
- 상위 라우트의 path에 하위 라우트의 path 연결
- 하위 라우트의 path가 index인 경우 : 상위 라우트와 같은 path