const channelState = {
  mode: "normal",

  currentSource: {
    type: "youtube",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&showinfo=0&rel=0",
    title: "Fabulosa Play",
  },

  radio: {
    enabled: true,
    url: "https://a5.asurahosting.com/listen/fabulosa_play/radio.mp3",
  },

  overlay: {
    logo: "/icon-512x512.png",
    clock: true,
    date: true,
  },

  ticker: {
    enabled: false,
    text: "",
    color: "#ff0055",
  },

  breakingNews: {
    active: false,
    introVideo: "/videos/breaking-news.mp4",
    liveUrl: "",
    headline: "",
  },

  commercials: [
    {
      type: "image",
      url: "/ads/ad1.jpg",
      duration: 15000,
    },
    {
      type: "video",
      url: "/ads/ad2.mp4",
      duration: 30000,
    },
  ],

  schedule: [
    {
      type: "event",
      start: "20:00",
      end: "22:00",
      title: "Partido En Vivo",
      source:
        "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1",
    },
  ],
};

export default channelState;