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
  const [sort, setSort] = useState('publishedAt');
  const [order, setOrder] = useState('desc');
  const [channel, setChannel] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = searchTerm && searchTerm.trim()
      ? `/videos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}&source=db`
      : `/videos?page=${page}&limit=${limit}`;
    if (sort) url += `&sort=${sort}`;
    if (order) url += `&order=${order}`;
    if (channel) url += `&channel=${encodeURIComponent(channel)}`;
    axios.get(url)
      .then(async res => {
        // If no results from DB, try YouTube API
        if (searchTerm && searchTerm.trim() && res.data.videos.length === 0) {
          let apiUrl = `/videos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}&source=api`;
          if (sort) apiUrl += `&sort=${sort}`;
          if (order) apiUrl += `&order=${order}`;
          if (channel) apiUrl += `&channel=${encodeURIComponent(channel)}`;
          try {
            const apiRes = await axios.get(apiUrl);
            setVideos(apiRes.data.videos);
            setTotal(apiRes.data.total);
            setError(null);
            setLoading(false);
            return;
          } catch (apiErr) {
            setError(apiErr.response?.data?.message || apiErr.message || 'Unknown error');
            setVideos([]);
            setTotal(0);
            setLoading(false);
            return;
          }
        }
        setVideos(res.data.videos);
        setTotal(res.data.total);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || 'Unknown error');
        setVideos([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, page, limit, sort, order, channel]);

  const totalPages = Math.ceil(total / limit);


  // Always trigger a search when clicking the search button
  const handleSearch = () => {
    setPage(1);
    setSearchTerm(q);
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
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="publishedAt">Published Date</option>
          <option value="title">Title</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <input
          type="text"
          placeholder="Filter by channel..."
          value={channel}
          onChange={e => setChannel(e.target.value)}
          style={{ width: 180 }}
        />
      </div>
      {loading ? <p>Loading...</p> : error ? (
        <div style={{ color: 'red', margin: '1em 0' }}>Error: {error}</div>
      ) : (
        <>
          {searchTerm && searchTerm.trim() && (
            <div style={{ margin: '1em 0', color: '#333', fontWeight: 500 }}>
              Showing results for: <span style={{ color: '#0077cc' }}>{searchTerm}</span>
            </div>
          )}
          {videos.length === 0 ? (
            <div style={{ margin: '2em 0', color: '#888' }}>No videos found.</div>
          ) : (
            videos.map(v => <VideoCard key={v.videoId} video={v} />)
          )}
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
