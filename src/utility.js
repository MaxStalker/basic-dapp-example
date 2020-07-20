export const nodeWithId = (name) => document.getElementById(name);

const urlParams = {
  url: "",
  params: {},
};
export const getUrlParam = (name) => {
  const currentUrl = window.location.href || "";
  if (urlParams.url !== currentUrl) {
    urlParams.url = currentUrl;
    const params = currentUrl.split("?")[1];
    urlParams.params = params
      ? params.split("&").reduce((acc, item) => {
          const [key, value] = item.split("=");
          acc[key] = value;
          return acc;
        }, {})
      : {};
  }
  return urlParams.params[name];
};

export const generateCode = async (url, match) => {
  const codeFile = await fetch(url);
  const rawCode = await codeFile.text();
  if (!match) {
    return rawCode;
  }

  const { query } = match;
  return rawCode.replace(query, (item) => {
    return match[item];
  });
};

export const getAddress = (user, nullPrefix = true) => {
  return nullPrefix ? `0x${user.addr}` : user.addr;
};

export const validateAddress = (address) => {
  const validStart = address.slice(0, 2) === "0x";
  if (!validStart) {
    return {
      error: "Address should start with 0x",
    };
  }
  const validLength = address.length === 18;
  if (!validLength) {
    return {
      error: "Address is not long enough",
    };
  }
  return {};
};
