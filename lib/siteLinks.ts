// v2 は5ページ構成。旧 /about /guide /mix /compose /log /links は
// archive/v1-redesign-20260907 タグに凍結してある。
// MIX依頼・作曲依頼は /order に統合した。
export const siteLinks = {
  home: "/top",
  works: "/works",
  instrumentals: "/instrumentals",
  audioCheck: "/audio-check",
  order: "/order",

  // 外部リンクは Claude Design 側の値に合わせてある（2026-09-07 に本人確認済み）。
  // v1 は niconico が user/47793022、フォームが forms.gle/srAnkjJyZLJVigmw8 だった。
  googleForm: "https://forms.gle/p2vqEqumUJex8VUH9",
  youtubeChannel: "https://www.youtube.com/@iekaradenai_rin",
  youtubePlaylist: "https://www.youtube.com/playlist?list=PL9xTJo4NgKecdcBhJaL3MCZu9JBFjKG0h",
  niconico: "https://www.nicovideo.jp/user/137132696",
  piapro: "https://piapro.jp/iekaradenairin",
  driveInstrumentals:
    "https://drive.google.com/drive/folders/1o7e-HfHbhrSaW1Vw5xBb8Ehb0T2jSAzo?usp=drive_link",
  x: "https://x.com/iekaradenai_Rin",
  domain: "https://iekaradenai.work",
} as const;

/** 作品データの出所。Works ページとトップの「最新作」はここから引く */
export const WORKS_PLAYLIST_ID = "PL9xTJo4NgKecdcBhJaL3MCZu9JBFjKG0h";
