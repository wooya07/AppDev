// PWA를 로컬에서 테스트하기 위한 간단한 HTTPS 서버
const https = require("https")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

// 자체 서명된 인증서 생성 (처음 한 번만 실행)
if (!fs.existsSync("./cert/server.key") || !fs.existsSync("./cert/server.cert")) {
  console.log("자체 서명 인증서를 생성합니다...")

  // 인증서 저장 디렉토리 생성
  if (!fs.existsSync("./cert")) {
    fs.mkdirSync("./cert")
  }

  // OpenSSL을 사용하여 인증서 생성
  exec(
    'openssl req -nodes -new -x509 -keyout ./cert/server.key -out ./cert/server.cert -subj "/CN=localhost"',
    (error) => {
      if (error) {
        console.error("인증서 생성 오류:", error)
        return
      }
      startServer()
    },
  )
} else {
  startServer()
}

function startServer() {
  // Next.js 빌드 결과물 경로
  const distDir = path.join(__dirname, "../.next")
  const publicDir = path.join(__dirname, "../public")

  // HTTPS 서버 옵션
  const options = {
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.cert"),
  }

  // 간단한 파일 서버
  const server = https.createServer(options, (req, res) => {
    let filePath

    if (req.url === "/") {
      filePath = path.join(distDir, "server/pages/index.html")
    } else if (req.url.startsWith("/_next/")) {
      filePath = path.join(distDir, req.url.replace("/_next/", ""))
    } else {
      filePath = path.join(publicDir, req.url)
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end(JSON.stringify(err))
        return
      }

      // 파일 타입에 따른 Content-Type 설정
      let contentType = "text/html"
      if (filePath.endsWith(".js")) contentType = "text/javascript"
      if (filePath.endsWith(".css")) contentType = "text/css"
      if (filePath.endsWith(".json")) contentType = "application/json"
      if (filePath.endsWith(".png")) contentType = "image/png"
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) contentType = "image/jpeg"
      if (filePath.endsWith(".svg")) contentType = "image/svg+xml"

      res.writeHead(200, { "Content-Type": contentType })
      res.end(data)
    })
  })

  server.listen(3443, () => {
    console.log("PWA 테스트 서버가 https://localhost:3443 에서 실행 중입니다")
    console.log("브라우저에서 이 URL을 열고 인증서 경고를 무시하세요 (개발 목적으로만 사용)")
  })
}

