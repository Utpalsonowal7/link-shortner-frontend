export const timeAgo = (timestamp) => {
     if (!timestamp) return "";

     const now = new Date();
     const past = new Date(timestamp);

     const diffMs = now - past;
     if (diffMs < 0) return "just now";

     const sec = Math.floor(diffMs / 1000);
     const min = Math.floor(sec / 60);
     const hr = Math.floor(min / 60);
     const day = Math.floor(hr / 24);

     if (sec < 10) return "just now";
     if (sec < 60) return `${sec} sec ago`;
     if (min < 60) return `${min} min ago`;
     if (hr < 24) return `${hr} hr ago`;
     return `${day} day${day > 1 ? "s" : ""} ago`;
};
