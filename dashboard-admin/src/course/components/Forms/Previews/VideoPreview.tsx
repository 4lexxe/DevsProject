
export default function VideoPreview({watchContentVideo}: {watchContentVideo:string}) {
  const isYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0]; // Extrae el ID del video
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  return (
    <div>
      {watchContentVideo ? (
        isYoutubeUrl(watchContentVideo) ? (
          // 🔹 Si es un video de YouTube, usa iframe
          <iframe
            width="100%"
            height="315"
            src={getYoutubeEmbedUrl(watchContentVideo)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          // 🔹 Si es un archivo .mp4, usa <video>
          <video controls className="w-full max-w-md mx-auto">
            <source src={watchContentVideo} type="video/mp4" />
            Tu navegador no soporta el tag de video.
          </video>
        )
      ) : (
        <p className="text-center text-gray-500">No hay un video disponible.</p>
      )}
    </div>
  );
}
