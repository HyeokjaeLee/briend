import { NextResponse } from 'next/server';

// 세션 체크를 생략하고 즉시 앱스킴 리다이렉트 페이지를 반환
export async function GET(request: Request) {
  try {
    // HTML 페이지를 생성하여 앱스킴으로 연결
    // 앱에서는 로그인 쿠키를 사용하여 인증 토큰을 가져옴
    const redirectHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>로그인 완료</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script>
            // 앱스킴 URL로 리다이렉트
            function redirectToApp() {
              // 기본 앱 스킴 URL
              const appSchemeURL = "briend://auth";
              
              window.location.href = appSchemeURL;
              
              // 5초 후 앱이 실행되지 않으면 웹앱으로 이동
              setTimeout(function() {
                window.location.href = "/";
              }, 5000);
            }
            
            // 페이지 로드 시 자동 실행
            window.onload = redirectToApp;
          </script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              text-align: center;
              background-color: #f8f9fa;
            }
            h1 { 
              margin-bottom: 10px;
              color: #333;
            }
            p { 
              margin-bottom: 20px;
              color: #666;
            }
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #09f;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <h1>로그인 완료</h1>
          <p>앱으로 이동 중입니다...</p>
        </body>
      </html>
    `;

    // HTML 페이지 반환
    return new NextResponse(redirectHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('리다이렉트 오류:', error);

    return NextResponse.redirect(new URL('/', request.url));
  }
}
