# DNS 설정 가이드

## 📋 필요한 DNS 레코드

alldatabox.com 도메인의 DNS 관리 페이지에서 다음 레코드를 추가하세요.

Cloudflare Tunnel을 사용하는 경우 Cloudflare에서 자동으로 DNS 레코드가 생성됩니다.

## 🔍 DNS 설정 확인 방법

DNS 설정 후 10분~1시간 정도 지나면 반영됩니다.

### 터미널에서 확인:
```bash
# 각 서브도메인 확인
nslookup yourlife.alldatabox.com
nslookup lottery.alldatabox.com
nslookup index.alldatabox.com

# 또는 dig 명령어
dig yourlife.alldatabox.com +short
dig lottery.alldatabox.com +short
dig index.alldatabox.com +short
```

## 🏠 로컬 테스트 (DNS 설정 전)

DNS 반영 전에 로컬에서 테스트하려면 `/etc/hosts` 파일에 추가:

```bash
sudo nano /etc/hosts
```

다음 라인 추가:
```
172.30.1.85 yourlife.alldatabox.com
172.30.1.85 lottery.alldatabox.com
172.30.1.85 index.alldatabox.com
172.30.1.85 alldatabox.com
```

저장 후 브라우저에서 접속 테스트 가능!

## 📱 DNS 제공업체별 설정 방법

### Cloudflare (권장 - Tunnel 사용 시)
1. Cloudflare 대시보드 로그인
2. alldatabox.com 선택
3. Zero Trust > Access > Tunnels 에서 설정
4. Tunnel 생성 시 자동으로 DNS 레코드가 생성됨

### 가비아 (Gabia)
1. 도메인 관리 페이지 접속
2. DNS 관리 또는 네임서버 관리
3. Cloudflare 네임서버로 변경:
   - Cloudflare에서 제공하는 네임서버 2개 입력
   - 예: alice.ns.cloudflare.com, bob.ns.cloudflare.com

### GoDaddy
1. GoDaddy 로그인
2. My Products > Domains > alldatabox.com 관리
3. DNS > Nameservers 탭
4. Cloudflare 네임서버로 변경

## ✅ 최종 확인

DNS 반영 후 브라우저에서 접속:
- https://yourlife.alldatabox.com
- https://lottery.alldatabox.com
- https://index.alldatabox.com
- https://alldatabox.com

모두 정상 작동하면 설정 완료!

## 🔒 HTTPS 설정

Cloudflare Tunnel을 사용하면 HTTPS가 자동으로 설정됩니다.
별도의 SSL 인증서 발급이 필요하지 않습니다.
