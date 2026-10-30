const videoBase='https://raw.githubusercontent.com/jatjun/codex-ext1/4b45ea07a7ac6c119aff019996e28b2d376d34d1/educational-videos/videos/';
const videos=[
  {file:'views-top-view.mp4',title:'从上面看，为什么只看到上面？',description:'换个观察方向，看看哪些面朝向我们。'},
  {file:'cube-opposite-face.mp4',title:'数字正方体：1的对面为什么是6？',description:'追踪同一个面，认识相对面，再算7－1。'},
  {file:'yogurt-word-problem.mp4',title:'酸奶应用题：先分清每组和额外数量',description:'每组6盒，共3组，再加另外4盒。'},
];
export function TeachingVideos(){return <section id="teaching-videos" aria-labelledby="teaching-videos-title">
  <div className="section-heading"><h2 id="teaching-videos-title">数学动画小课堂</h2><span>每条72秒</span></div>
  <p>点开即可观看。完整中文文字与动画，无旁白；可以暂停，先想一想再看答案。</p>
  <div className="lesson-grid">{videos.map((v,i)=><article className="lesson-card" key={v.file}>
    <small>动画 0{i+1} · 三年级数学</small><h3>{v.title}</h3><p>{v.description}</p>
    <a href={'#video-'+v.file.replace('.mp4','')} target="_blank" rel="noopener noreferrer">打开视频 ↗</a>
  </article>)}</div>
  <p className="soft">看懂之后，试着自己做一道题，再向家人说说理由。</p>
</section>}

export function TeachingVideoPlayer(){
 const video=videos.find(v=>location.hash==='#video-'+v.file.replace('.mp4',''));
 if(!video)return <main><h1>没有找到这条视频</h1><a href="./">返回数学课堂</a></main>;
 return <main className="teaching-video-player"><a href="./">← 返回数学课堂</a><h1>{video.title}</h1><p>72秒 · 中文文字与动画 · 无旁白</p><video controls playsInline preload="metadata" aria-label={video.title} src={videoBase+video.file}>浏览器不支持播放，请使用下方下载链接。</video><p><a href={videoBase+video.file}>下载 MP4</a></p><p>可以随时暂停，先想一想再看答案。</p></main>;
}
