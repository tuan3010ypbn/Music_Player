const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const cd = $(".cd");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const playlist = $(".playlist");
console.log(localStorage.getItem(PLAYER_STORAGE_KEY));

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
  

  songs: [
    {
      name: "Ngon ngang rmk",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/baihat1.mp3",
      image: "./assets/img/anh1.jpg",
    },
    {
      name: "Chìm sâu",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/chimsau2.mp3",
      image: "./assets/img/anh2.png",
    },
    {
      name: "Suit & Tie",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/suittie3.mp3",
      image: "./assets/img/anh3.png",
    },
    {
      name: "Va vào giai điệu này",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/vavaogiaidieunay4.mp3",
      image: "./assets/img/anh4.png",
    },
    {
      name: "Tối nay ta đi đâu nhờ",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/toinaytadidau5.mp3",
      image: "./assets/img/anh5.png",
    },
    {
      name: "Chỉ 1 đêm nữa thôi",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/chi1demnuathoi6.mp3",
      image: "./assets/img/anh6.png",
    },
    {
      name: "Thôi iem đừng đi",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/thoiiemdungdi7.mp3",
      image: "./assets/img/anh7.png",
    },
    {
      name: "Cuấn cho anh 1 điếu",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/cuanchoanh1dieu8.mp3",
      image: "./assets/img/anh8.png",
    },
    {
      name: "Show me love",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/showmelove9.mp3",
      image: "./assets/img/anh9.png",
    },
    {
      name: "Tại vì sao",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/taivisao10.mp3",
      image: "./assets/img/anh10.png",
    },
    {
      name: "Thờ er",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/thoer11.mp3",
      image: "./assets/img/anh11.png",
    },
    {
      name: "Ai mới là kẻ xấu xa",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/aimoilakexauxa12.mp3",
      image: "./assets/img/anh12.png",
    },
    {
      name: "Anh đã ổn hơn",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/anhdaonhon13.mp3",
      image: "./assets/img/anh13.png",
    },
    {
      name: "Bad trip",
      singer: "RPT MCK aka Nger",
      path: "./assets/music/badtrip14.mp3",
      image: "./assets/img/anh14.png",
    },
  ],

  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem('PLAYER_STORAGE_KEY', JSON.stringify(this.config))
  },
  
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
          `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý  đĩa CD quay và dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10 giây
        iterations: Infinity,
      }
    );

    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi bài hát được Play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi bài hát bị Pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua bài hát
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
      console.log(seekTime);
    };

    // Khi Next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      // _this.render();
    };

    // Khi Prev bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };

    // Xử lý Random bật / tắt bài hát
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom)

      randomBtn.classList.toggle("active", _this.isRandom);
      _this.playRandomSong();
      audio.play();
    };

    // Xử lý phát lại một bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý Next bài hát khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi Click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".song:not(.option)")) {
        
        // Xử lý khi Click vào bài hát
        if(songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // Xử lý khi Click vào song option
        if(e.target.closest(".song:not(.option)")) {

        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  getCurrentSong: function () {
    return this.songs[this.currentIndex];
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong: function () {
    this.currentIndex++;
    console.log(this.currentIndex, this.songs.length);
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    console.log(this.currentIndex, this.songs.length);
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Gán cấu hình từ Config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperty();

    //  Lắng nghe / xử lý các sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI (User Interface) khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render()

    // Hiển thị trạng thái ban đầu của button Repeat & Random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);

  },
};

app.start()
