using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<File>>> Get()
        {
            await Task.Delay(10);

            return new File[]
            {
                new File
                {
                    FileName = "OceanMan.mp3",
                    SongTitle = "Ocean Man",
                    ArtistName = "Ween",
                    AlbumName = "Mollusk",
                    TrackNumber = 13,
                    Year = 1997,
                },
                new File
                {
                    FileName = "BuckinghamGreen.mp3",
                    SongTitle = "Buckingham Green",
                    ArtistName = "Ween",
                    AlbumName = "Mollusk",
                    TrackNumber = 12,
                    Year = 1997,
                },
                new File
                {
                    FileName = "TheBlarneyStone.mp3",
                    SongTitle = "The Blarney Stone",
                    ArtistName = "Ween",
                    AlbumName = "Mollusk",
                    TrackNumber = 7,
                    Year = 1997,
                },
            };
        }
    }

    public class File
    {
        public string FileName { get; set; }
        public string SongTitle { get; set; }
        public string ArtistName { get; set; }
        public string AlbumName { get; set; }
        public int TrackNumber { get; set; }
        public int Year { get; set; }
    }
}
