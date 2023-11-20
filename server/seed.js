const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const { mongo } = require("mongoose");
const userArgs = process.argv.slice(2);         // 씨드 파일 호출할 때 전달한 인자
// directive : 명령어 (run or revert) -> 씨드 생성 or 초기화
// MONGODB_URI : 몽고DB 주소
const [directive, MONGODB_URI] = userArgs;


// 잘못된 몽고DB 주소를 전달한 경우
// startsWith : 문자열 검사, 매개변수로 시작하는지 확인
if(!MONGODB_URI.startsWith("mongodb")) {
    console.log("ERROR : You need to specify a valid monogodb URL.");
    return;
}


// 개발자의 명령어 분석
if(directive === "run") {                           // 씨드 데이터 생성
    seedDatabase();
}
else if (directive === 'revert') {                  // 씨드 데이터 초기화
    dropDatabase();
}
else {
    return console.log("ERROR : Invalid command")   // 잘못된 명령어 입력한 경우
}


// 씨드 데이터 생성 함수
async function seedDatabase() {
    try {
        // 데이터베이스 연결
        await mongoose.connect(MONGODB_URI);

        // 생성할 유저 목록
        const users = [
            {
                username : "michelangelo",
                name : "Michelangelo",
                avatar : "michelangelo.jpg",
                bio : "나는 대리석 안에서 천사를 보았고 그를 자유롭게 해줄 때까지 조각했다."
            },
            {
                username : "jons",
                name : "Steve jobs",
                avatar : "jobs.jpeg",
                bio : "이야 아이폰 많이 좋아졌다."
            },
            {
                username : "dog",
                name : "Mr.Loyal",
                avatar : "dog.jpeg",
                bio : "왈왈."
            }
        ]

        // 유저 생성
        for(let i = 0; i < users.length; i++) {
            const user = new User();            // User 모델의 인스턴스 생성

            // 필드값 할당
            user.username = users[i].username;
            user.name = users[i].name;
            user.avatar = users[i].avatar;
            user.bio = users[i].bio;

            await user.save();                  // 도큐먼트 저장 (save() 메서드)

            console.log(user);
        }

        // 생성할 게시물 목록 (미켈란젤로의 게시물)
        const posts = [
            {
                photos : ["david.jpg"],
                caption : "David, Galleria dell'Accademia, Florenece"
            },
            {
                photos : ["pieta_1.jpg", "pieta_2.jpg"],
                caption : "Pieta, St. Peter's Basilica, Rome"
            },
            {
                photos : ["bacchus.png"],
                caption : "Bacchus, Museo Nazionale del Bargello, Florence"
            },
            {
                photos : ["angel.jpg"],
                caption : "Angel, Basilica of San Domenico, Bologna"
            }
        ]

        // 게시물 생성
        const user = await User.findOne({username : "michelangelo"});

        for(let i = 0; i < posts.length; i++) {
            const post = new Post();            // Post 모델의 인스턴스 생성

            post.photos = posts[i].photos;      // 필드값 할당
            post.caption = posts[i].caption;
            post.user = user._id;               // 미켈란젤로의 id 저장

            await post.save();                  // 도큐먼트 저장

            console.log(post);
        }

        // 성공 메시지
        console.log("seed database has been completed!");

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();            // db 연결 종료
    }
};


// 씨드 데이터 초기화 함수
async function dropDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);

        await mongoose.connection.dropDatabase();       // dropDatabase() : DB 삭제

        console.log("drop database has been completed!");

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};