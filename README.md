# ForP 뽀삐 
## 😺 프로젝트 개요
반려동물 보호자를 위한 커뮤니티 사이트입니다.<br>
게시판을 통한 정보 공유, 사용자 주변 동물병원 위치 제공, 이벤트 페이지를 통한 다양한 서비스를 제공합니다.
<br>
<br>
## 🙌 멤버 소개
| 권소령 <br/> [@SoRrrrrrr](https://github.com/SoRrrrrrr) | 김세영 <br/> [@Sezero99](https://github.com/Sezero99) | 허수현 <br/> [@suhyeon1032](https://github.com/suhyeon1032) | 김대영 <br/> [@dae0kim](https://github.com/dae0kim) |
|:--:|:--:|:--:|:--:|

## 🐶 프로젝트 주요 기능
1. 메신저(Kakao) 연동 로그인
2. 자유게시판 및 댓글
3. 사용자 위치 기반 동물병원 위치 지도
4. 심리테스트 등 각종 이벤트
5. 반려동물 정보 관리

## 📌 사용 기술 스택
### Frontend
- React 19.2.0
- React-Router 7.11.0
- React-Quill-New 3.7.0
- Tanstack Query 5.90.16
- Material UI 7.3.6
- Axios 1.13.2
- DayJs 1.11.19

### Backend
- Java 17
- Spring boot 4.0.1
- JPA
- JWT
- Spring Security
- Oracle DB 21c XE

# ⚙️프로젝트 구조

```
ForP
├── 📦 frontend/
│   ├── 📁 node_modules/                         ← 패키지 의존성 관리
│   ├── 📁 public/                               ← 정적 파일 관리
│   ├── 📁 src/
│   │   ├── 📁 api/                              ← api 설정 관리
│  	│   ├── 📁 app/                              ← 라우팅 관리
│  	│   ├── 📁 assets/                           ← 아이콘 이미지 저장
│  	│   ├── 📁 components/                       ← 컴포넌트
│  	│   │   ├── 📁 comment/                      ← 댓글 컴포넌트
│  	│   │   ├── 📁 common/                       ← 공통 컴포넌트
│  	│   │   ├── 📁 event/                        ← 이벤트 컴포넌트
│  	│   │   ├── 📁 map/                          ← 지도 컴포넌트
│  	│   │   └── 📁 post/                         ← 게시판 컴포넌트
│  	│   ├── 📁 hooks/                            ← Hook 저장
│  	│   ├── 📁 layouts/                          ← 서비스 레이아웃 설정
│  	│   ├── 📁 pages/                            ← 사용자 화면
│  	│   │   ├── 📁 auth/                         ← 로그인 관련 화면
│  	│   │   ├── 📁 event/                        ← 이벤트 관련 화면
│  	│   │   ├── 📁 post/                         ← 게시판 관련 화면
│  	│   │   ├── 📄 Main.jsx/                     ← 홈 화면
│  	│   │   ├── 📄 Map.jsx/                      ← 지도 화면
│  	│   │   ├── 📄 MyPage.jsx/                   ← 마이페이지 화면
│  	│   │   └── 📄 NotFoundPage.jsx/             ← 예외처리 화면
│  	├── 📄 .env.development                      ← 개발 환경변수 설정
│  	├── 📄 package.json                          ← 추가 설치 패키지 확인
│  	└── 📄 README.md                             ← 프로젝트 소개 문서
├──	📦 backend/
│  	├── 📁 src/
│		│   ├── 📁 main/
│		│   │   ├── 📁 java/com/example/backend/
│		│   │   │   ├── 📁 config/                   ← 외부 라이브러리 설정 및 동작 방식 제어
│		│   │   │   ├── 📁 controller/               ← 웹 요청 처리
│		│   │   │   ├── 📁 service/                  ← 비즈니스 로직 처리
│		│   │   │   │   └── 📁 impl/                 ← 서비스 클래스 구현
│		│   │   │   ├── 📁 repository/               ← DB 액세스 계층 (JPA)
│		│   │   │   ├── 📁 domain/                   ← Entity 및 VO
│		│   │   │   ├── 📁 dto/                      ← 요청/응답 데이터 객체
│		│   │   │   │   ├── 📁 request/              ← 요청
│		│   │   │   │   └── 📁 response/             ← 응답
│		│   │   │   └── 📄 BackendApplication.java   ← 메인 클래스
│		│   │   ├── 📁 resources/
│		│   │   │   ├── 📁 static/                    ← 정적 리소스 (css, js, images 등)
│		│   │   │   │   └── 📄 application.properties/← 설정 파일
│		│   └── 📁 test/
│		│       └── java/...                    ← 테스트 코드
		├── 📄 build.gradle                     ← Gradle 빌드 설정
		├── 📄 settings.gradle                  ← 프로젝트 설정
		└── 📄 README.md                        ← 프로젝트 소개 문서
```
<br>

## 🎋브랜치 전략
- main : 서비스 배포가 가능한 브랜치
- develop : 개인 작업 내역 모이는 브랜치
- feature/... : 개인 작업을 위한 브랜치

`Pull Request & merge 과정 중 main 브랜치에 실수하지 않도록 Branch protection rule을 설정하고 진행했습니다.`

## ▶️실행

### Frontend
#### ⚠️cmd창 폴더 위치가 프로젝트 폴더인지 확인 후 아래 구문을 차례대로 실행
```
npm i
npm run dev
```

### Backend
#### BackendApplication.java 파일 Run

