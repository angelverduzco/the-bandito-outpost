import "./StoryTimeline.css";

export function StoryTimeline({ timeline }) {
  return (
    <div className="story-timeline">
      {timeline.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3 className="timeline-era">{item.era}</h3>
            <p className="timeline-desc">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
