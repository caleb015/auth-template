import { OAuth2Server, Events } from 'oauth2-mock-server';

const server = new OAuth2Server();

async function main() {
  await server.issuer.keys.generate('RS256');

  server.service.on(Events.BeforeAuthorizeRedirect, (_authorizeRedirectUri, req) => {
    console.log(`[mock-oauth] authorize  ${req.url}`);
  });

  server.service.on(Events.BeforeTokenSigning, (_token, req) => {
    console.log(`[mock-oauth] token      ${req.method} ${req.url}`);
  });

  server.service.on(Events.BeforeUserinfo, (_userInfoResponse, req) => {
    console.log(`[mock-oauth] userinfo   ${req.method} ${req.url}`);
  });

  await server.start(8080, 'localhost');
  console.log('Mock OAuth server running at http://localhost:8080');
  console.log('Authorization: http://localhost:8080/authorize');
  console.log('Token:         http://localhost:8080/token');
  console.log('Userinfo:      http://localhost:8080/userinfo');
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
