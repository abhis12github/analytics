(function () {
    ("use strict")
    var location = window.location // current url from which the script tage is invoked
    var document = window.document
    var scriptElement = document.currentScript // script tag that points to this script
    var dataDomain = scriptElement.getAttribute("data-domain");
    var endpoint = "https://analytics-xi-five.vercel.app/api/track";

    let queryString=location.search;
    const params=new URLSearchParams(queryString);
    var source=params.get("utm");

    function generateSessionId() {
        return "session-" + Math.random().toString(36).substring(2, 9);
    }

    function initializeSession() {
        var sessionId = localStorage.getItem("session_id");
        var expirationTimeStamp = localStorage.getItem("session_expiration_timestamp");

        if (!sessionId || !expirationTimeStamp) {
            sessionId = generateSessionId();
            expirationTimeStamp = Date.now() + 10 * 60 * 1000;
            localStorage.setItem("session_id", sessionId);
            localStorage.setItem("session_expiration_timestamp", expirationTimeStamp);
            trackSessionStart();
        }

        return {
            sessionId: sessionId,
            expirationTimeStamp: parseInt(expirationTimeStamp)
        }
    }

    function isSessionExpired(expirationTimeStamp) {
        return Date.now() >= expirationTimeStamp
    }

    function checkSessionStatus() {
        var session = initializeSession();
        if (isSessionExpired(session.expirationTimeStamp)) {
            localStorage.removeItem("session_id");
            localStorage.removeItem("session_expiration_timestamp");
            trackSessionEnd();
            initializeSession();
        }
  
    }

    checkSessionStatus();

    function trigger(eventName, options) {
        var payload = {
            event: eventName,
            url: location.href,
            domain: dataDomain,
            source,
        }

        sendRequest(payload, options);
    }

    function sendRequest(payload, options) {
        var request = new XMLHttpRequest();
        request.open("POST", endpoint, true);
        request.setRequestHeader("Content-Type", "application/json")
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                options && options.callback && options.callback();
            }
        }

        request.send(JSON.stringify(payload));
    }

    var queue = (window.your_tracking && window.your_tracking.q) || [];
    window.your_tracking = trigger;
    for (var i = 0; i < queue.length; i++) {
        trigger.apply(this, queue[i]);
    }

    function trackPageView() {
        trigger("pageview");
    }

    function trackSessionStart() {
        trigger("session_start");
    }

    function trackSessionEnd() {
        trigger("session_end");
    }

    trackPageView();
    var initialPathname=window.location.pathname;
    window.addEventListener("popstate",trackPageView);
    window.addEventListener("hashchange",trackPageView);
    document.addEventListener("click",function(event){
        setTimeout(() => {
            if(window.location.pathname !== initialPathname){
                trackPageView();
                initialPathname=window.location.pathname
            }
        },3000);
    })
})();