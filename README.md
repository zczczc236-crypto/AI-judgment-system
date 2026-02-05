# RealOrAI

Cloudflare Pages + Workers 기반 AI 이미지 판별 웹 서비스

## 배포
1. GitHub 저장소 업로드
2. Cloudflare Pages 연결 → frontend 폴더 선택
3. Cloudflare Worker 배포 → worker 폴더
4. D1 DB 생성 및 schema.sql 실행
5. R2 버킷 생성

## 기능
- 회원가입 / 로그인
- 이미지 업로드 → R2 저장
- AI 판별(Mock)
- 히스토리 저장
- KO/EN 다국어
