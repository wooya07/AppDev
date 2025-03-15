// pwa-builder-setup.ts
// PWA Builder와 함께 사용할 설정 파일

export const pwaBuilderConfig = {
  // 앱 정보
  name: "야간자율학습 출석 관리 시스템",
  shortName: "출석 관리",
  description: "학교 야간자율학습 출석 관리를 위한 웹 애플리케이션",

  // 테마 색상
  themeColor: "#099c34",
  backgroundColor: "#ffffff",

  // 아이콘 경로 (PWA Builder에서 사용)
  iconPath: "./public/icons/icon-512x512.png",

  // 스크린샷 (앱스토어 등록 시 필요)
  screenshots: [
    {
      src: "./screenshots/login.png",
      sizes: "1280x720",
      type: "image/png",
    },
    {
      src: "./screenshots/dashboard.png",
      sizes: "1280x720",
      type: "image/png",
    },
  ],

  // 앱스토어 정보
  appStoreInfo: {
    // Windows Store
    windows: {
      packageName: "KoreanAttendanceApp",
      publisherName: "YourPublisherName",
    },
    // Google Play
    android: {
      packageName: "com.yourname.attendance",
      versionCode: 1,
      versionName: "1.0.0",
    },
    // iOS App Store
    ios: {
      bundleId: "com.yourname.attendance",
      appStoreId: "",
      versionCode: "1.0.0",
    },
  },
}

