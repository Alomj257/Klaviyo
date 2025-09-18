import { useEffect } from "react";

const KlaviyoScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.klaviyo.com/onsite/js/U3nma2/klaviyo.js?company_id=U3nma2";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
  try {
    (function() {
      if (!window.klaviyo) {
        window._klOnsite = window._klOnsite || [];
        try {
          window.klaviyo = new Proxy({}, {
            get(target, prop) {
              if (prop === "push") {
                return function() {
                  window._klOnsite.push.apply(window._klOnsite, arguments);
                }
              } else {
                return function() {
                  const args = Array.from(arguments);
                  const callback = typeof args[args.length - 1] === "function" ? args.pop() : undefined;
                  return new Promise((resolve) => {
                    window._klOnsite.push([prop].concat(args, [function(res) {
                      if (callback) callback(res);
                      resolve(res);
                    }]));
                  });
                }
              }
            }
          });
        } catch(e) {
          window.klaviyo = window.klaviyo || [];
          window.klaviyo.push = function() {
            window._klOnsite.push.apply(window._klOnsite, arguments);
          }
        }
      }
    })();
  } catch(e) {
    console.error("Klaviyo init error:", e);
  }
};


    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return null;
};

export default KlaviyoScript;
