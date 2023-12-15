export function baseUrl(base) {
  // extension code here

  base = base.trim().replace(/\/+$/, '/'); // if multiple '/' at the end, just keep one
  const reIsAbsolute = /^[\w+]+:\/\//;
  const isBaseAbsolute = reIsAbsolute.test(base);
  const dummyUrl = 'http://__dummy__';
  const dummyBaseUrl = new URL(base, dummyUrl);
  const dummyUrlLength = dummyUrl.length + (base.startsWith('/') ? 0 : 1);

  return {
    walkTokens(token) {
    //   console.log(token.type)
      
      if (!['link', 'image', 'html'].includes(token.type)) {
        // console.log(token.type)
        return;
      }

      console.log(token)
      if (isBaseAbsolute) {
        try {
          token.src = new URL(token.src, base).href;
        } catch (e) {
          // ignore
        }
      } else {
        try {
          const temp = new URL(token.src, dummyBaseUrl).href;
          token.src = temp.slice(dummyUrlLength);
        } catch (e) {
          // ignore
        }
      }
    }
  };
}

