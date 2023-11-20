// 클라이언트가 업로드한 파일 처리

const multer = require("multer");               // 파일 처리 기능 제공
const path = require("path");                   // 경로 관련 기능 제공
const createError = require("http-errors");     // 에러 처리 기능
const opts = {};                                // multer option 저장


// 1. Storage 옵션 (파일의 이름, 저장 경로 관련)
opts.storage = multer.diskStorage({
    destination : (req, file, cb) => {                                              // 파일의 저장 위치

        // files 경로에 저장
        cb(null, `${__dirname}/../files/${file.fieldname}`);
    },

    // 파일의 이름 처리
    filename : (req, file, cb) => {     
        const extname = path.extname(file.originalname);                            // 파일의 확장자 (파일의 원래 이름 추출) ex) apple.png -> png만 추출
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);    // 랜덤이름 생성

        cb(null, uniqueSuffix + extname);                                           // 완성된 파일 이름
    }
})


// 2. filter 옵션
opts.fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);                                // 파일의 확장자
    let isError = false;

    // 이미지 파일인지 검사 -> jpg, jpeg, png 이미지 파일만 가능
    switch(extname) {
        case ".jpg":
        case ".jpeg":
        case ".png":
            break;
        default:
            isError = true;
    }

    // 잘못된 타입의 파일인 경우
    if(isError) {
        const err = new createError.BadRequest("Unacceptable type of file");        // 400 BadRequest
        return cb(err);
    }

    cb(null, true);
}


// 3. 파일 사이즈 제한 옵션
opts.limits = {fileSize : 1e7}                                                      // 파일사이즈는 10MB 까지 가능


// 옵션 적용 및 모듈 exports
module.exports = multer(opts);