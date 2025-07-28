# 베이스 이미지
FROM node:18

# 작업 디렉토리 생성
WORKDIR /app

# package.json과 lock 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3001

# 실행 명령어
CMD ["npm", "run", "dev"]
