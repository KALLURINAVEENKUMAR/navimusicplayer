// Music service with your downloaded songs
class MusicAPIService {
  constructor() {
    // Your actual songs from public/songs folder
    this.songs = [
      {
        id: 1,
        title: "Adiga",
        artist: "Hi Nanna",
        album: "Hi Nanna",
        duration: 280,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Adiga - Hi Nanna.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Adiga"
      },
      {
        id: 2,
        title: "Alanati",
        artist: "Murari", 
        album: "Murari",
        duration: 250,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Alanati - Murari.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Alanati"
      },
      {
        id: 3,
        title: "Athiloka Sundari",
        artist: "Sarrainodu",
        album: "Sarrainodu",
        duration: 290,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Athiloka Sundari - Sarrainodu.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Athiloka+Sundari"
      },
      {
        id: 4,
        title: "Bhama Bhama",
        artist: "Murari",
        album: "Murari", 
        duration: 270,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Bhama Bhama - Murari.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Bhama+Bhama"
      },
      {
        id: 5,
        title: "Boom Boom",
        artist: "DUDE",
        album: "DUDE",
        duration: 240,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Boom Boom - DUDE.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Boom+Boom"
      },
      {
        id: 6,
        title: "Chinnadana Nikosam",
        artist: "Chinnadana Nikosam",
        album: "Chinnadana Nikosam",
        duration: 260,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Chinnadana Nikosam - Chinnadana Nikosam.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Chinnadana+Nikosam"
      },
      {
        id: 7,
        title: "Ee Dhooramey",
        artist: "Single",
        album: "Single",
        duration: 275,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Ee Dhooramey.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Ee+Dhooramey"
      },
      {
        id: 8,
        title: "Godari Gattu",
        artist: "Sankrantiki Vastunnam",
        album: "Sankrantiki Vastunnam",
        duration: 285,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Godari Gattu - Sankrantiki Vastunnam.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Godari+Gattu"
      },
      {
        id: 9,
        title: "Golden Sparrow",
        artist: "Single",
        album: "Single",
        duration: 195,
        audioUrl: `${process.env.PUBLIC_URL}/songs/GoldenSparrow.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Golden+Sparrow"
      },
      {
        id: 10,
        title: "Guruvaram",
        artist: "Dookudu",
        album: "Dookudu",
        duration: 265,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Guruvaram - Dookudu.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Guruvaram"
      },
      {
        id: 11,
        title: "Halamathi",
        artist: "Beast",
        album: "Beast",
        duration: 280,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Halamathi - Beast.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Halamathi"
      },
      {
        id: 12,
        title: "Hello Ani",
        artist: "Single",
        album: "Single",
        duration: 220,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Hello Ani.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Hello+Ani"
      },
      {
        id: 13,
        title: "Hey Rangule",
        artist: "Amaran",
        album: "Amaran",
        duration: 255,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Hey Rangule - Amaran.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Hey+Rangule"
      },
      {
        id: 14,
        title: "I Hate You",
        artist: "Happy",
        album: "Happy",
        duration: 230,
        audioUrl: `${process.env.PUBLIC_URL}/songs/I hate You - Happy.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=I+Hate+You"
      },
      {
        id: 15,
        title: "Lahe Lahe",
        artist: "Acharya",
        album: "Acharya",
        duration: 270,
        audioUrl: `${process.env.PUBLIC_URL}/songs/LaheLahe - Acharya.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Lahe+Lahe"
      },
      {
        id: 16,
        title: "Mallika Ganda",
        artist: "Telsu Kadha",
        album: "Telsu Kadha",
        duration: 245,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Mallika Ganda - Telsu Kadha.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Mallika+Ganda"
      },
      {
        id: 17,
        title: "Mi Iniki Mundho Gate",
        artist: "Julayi",
        album: "Julayi",
        duration: 275,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Mi iniki mundho Gate - Julayi.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Mi+Iniki+Mundho"
      },
      {
        id: 18,
        title: "Mottamodatisari",
        artist: "BBM",
        album: "BBM",
        duration: 265,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Mottamodatisari - BBM.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Mottamodatisari"
      },
      {
        id: 19,
        title: "Nuvvunte Chaley",
        artist: "Single",
        album: "Single",
        duration: 285,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Nuvvunte chaley .mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Nuvvunte+Chaley"
      },
      {
        id: 20,
        title: "Pakka Local",
        artist: "Janatha Garage",
        album: "Janatha Garage",
        duration: 250,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Pakka Local - Janatha Garage.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Pakka+Local"
      },
      {
        id: 21,
        title: "Peelings",
        artist: "Pushpa 2",
        album: "Pushpa 2",
        duration: 290,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Peelings - Pushpa 2.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Peelings"
      },
      {
        id: 22,
        title: "Sundari",
        artist: "Khaidhi No150",
        album: "Khaidhi No150",
        duration: 275,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Sundari - Khaidhi No150.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Sundari"
      },
      {
        id: 23,
        title: "Tappa Tappa",
        artist: "Pataas",
        album: "Pataas",
        duration: 240,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Tappa Tappa - Pataas.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Tappa+Tappa"
      },
      {
        id: 24,
        title: "Temper Title Song",
        artist: "Temper",
        album: "Temper",
        duration: 255,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Temper Title song.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Temper+Title"
      },
      {
        id: 25,
        title: "Violen Song",
        artist: "Iddaramailatho",
        album: "Iddaramailatho",
        duration: 280,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Violen song - Iddaramailatho.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Violen+Song"
      },
      {
        id: 26,
        title: "Yahoo Yahoo",
        artist: "Mirchi",
        album: "Mirchi",
        duration: 260,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Yahoo Yahoo - Mirchi.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Yahoo+Yahoo"
      },
      {
        id: 27,
        title: "Youngu Yama",
        artist: "Yamadonga",
        album: "Yamadonga",
        duration: 270,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Youngu Yama - Yamadonga.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Youngu+Yama"
      },
      {
        id: 28,
        title: "Kadalalle",
        artist: "Dear Comrade",
        album: "Dear Comrade",
        duration: 280,
        audioUrl: `${process.env.PUBLIC_URL}/songs/Kadalalle - Dear Comrade.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Kadalalle"
      },
      {
        id: 29,
        title: "O Manmadhuda",
        artist: "KING",
        album: "KING",
        duration: 290,
        audioUrl: `${process.env.PUBLIC_URL}/songs/O Manmadhuda - KING.mp3`,
        coverImage: "https://via.placeholder.com/300x300/ff0000/ffffff?text=O+Manmadhuda"
      }
    ];
  }

  // Get all songs
  async getAllSongs() {
    return this.songs;
  }

  // Search songs
  async searchSongs(query) {
    if (!query) return this.songs;
    
    const searchTerm = query.toLowerCase();
    return this.songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.album.toLowerCase().includes(searchTerm)
    );
  }

  // Get song by ID
  async getSongById(id) {
    return this.songs.find(song => song.id === parseInt(id));
  }
}

const musicAPIService = new MusicAPIService();
export default musicAPIService;
