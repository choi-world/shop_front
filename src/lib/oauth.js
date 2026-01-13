function getEnv(name) {
  const v = import.meta.env[name];
  if (!v) throw new Error(`환경변수 누락: ${name}`);
  return v;
}

export function makeState() {
  // CSRF 방지용 state (실서비스에서는 더 엄격히 관리 권장)
  const state = crypto.randomUUID();
  sessionStorage.setItem("OAUTH_STATE", state);
  return state;
}

export function verifyState(receivedState) {
  const saved = sessionStorage.getItem("OAUTH_STATE");
  return !!saved && saved === receivedState;
}

export function getKakaoAuthUrl() {
  const clientId = getEnv("VITE_KAKAO_REST_API_KEY");
  const redirectUri = getEnv("VITE_KAKAO_REDIRECT_URI");
  const state = makeState();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    // scope는 필요한 경우에만 추가하세요. (예: account_email profile_nickname)
    // scope: "account_email profile_nickname",
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

export function getNaverAuthUrl() {
  const clientId = getEnv("VITE_NAVER_CLIENT_ID");
  const redirectUri = getEnv("VITE_NAVER_REDIRECT_URI");
  const state = makeState();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });

  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}
