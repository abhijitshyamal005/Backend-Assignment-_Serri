import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <div className="video-thumb-container">
        <img className="video-thumb" src={video.thumbnails?.medium?.url || video.thumbnails?.default?.url} alt={video.title} />
      </div>
      <div className="video-info">
        <h3>{video.title}</h3>
        <p>{video.channelTitle}</p>
        <p>{video.description}</p>
        <p style={{ fontSize: 12, color: '#888' }}>Published: {new Date(video.publishedAt).toLocaleString()}</p>
        <a className="yt-link" href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
      </div>
    </div>
  );
}


function App() {
  const [videos, setVideos] = useState([]);
  const [q, setQ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = searchTerm
      ? `/videos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`
      : `/videos?page=${page}&limit=${limit}`;
    axios.get(url)
      .then(res => {
        setVideos(res.data.videos);
        setTotal(res.data.total);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'Unknown error');
        setVideos([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, page, limit]);

  const totalPages = Math.ceil(total / limit);


  // Always trigger a search when clicking the search button
  const handleSearch = () => {
    setSearchTerm(q + ' ' + Date.now()); 
    setPage(1);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container">
      <h1>YouTube Videos Dashboard</h1>
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search title or description..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleInputKeyDown}
          style={{ flex: 1 }}
        />
        <button
          onClick={handleSearch}
          style={{ background: 'none', border: 'none', cursor: loading || !q.trim() ? 'not-allowed' : 'pointer', padding: 0, opacity: loading || !q.trim() ? 0.5 : 1 }}
          aria-label="Search"
          disabled={loading || !q.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {loading ? <p>Loading...</p> : error ? (
        <div style={{ color: 'red', margin: '1em 0' }}>Error: {error}</div>
      ) : (
        <>
          {videos.map(v => <VideoCard key={v.videoId} video={v} />)}
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
