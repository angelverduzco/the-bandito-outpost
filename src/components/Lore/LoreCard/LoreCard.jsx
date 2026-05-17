import "./LoreCard.css";

export function LoreCard({ item, type }) {
  return (
    <div className={`lore-card lore-card-${type}`}>
      {item.img && (
        <img src={item.img} alt={item.name} className="lore-card-img" />
      )}
      <div className="lore-card-content">
        <h3 className="lore-card-title">{item.name}</h3>
        <p className="lore-card-desc">{item.description}</p>
      </div>
    </div>
  );
}
